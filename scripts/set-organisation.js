#!/usr/bin/env node
/**
 * Puts this clone on a different organisation. Both settings live in CATemplate/_organisation.json:
 *
 *  - prefix: the name prefix of every CA policy, in two forms — "CA - 1010 - BLOCK - …" in the
 *    tenant and CA__1010__BLOCK__….json as the file name; the second follows from the first.
 *  - serviceProviderTenantIds: the organisation's own MSP tenants, or an empty list. With ids,
 *    every policy aimed at users excludes the technicians who come in from those tenants via GDAP
 *    (excludeGuestsOrExternalUsers, type serviceProvider, only those tenants, in this order).
 *
 * Neither is only read by the scripts; both are in the data and the generated output — every
 * displayName and users condition in CATemplate/, the keys in _manifest.json, ca-controls.json and
 * docs/policies.json, cipp/, the docs. So this script does the rewrite in one go:
 *
 *  1. Prefix: replaces the old prefix with the new one in every text file in git, and in the file
 *     names. Only where a policy number, a `<placeholder>` or a `*` follows: "CA - " on its own is
 *     too common a string to replace blindly, and history ("was CXNM__STANDARD__") stays history.
 *  2. Service provider tenant: puts the exclusion on (or takes it off) every template that wants
 *     it — see wantsServiceProviderExclusion() in lib/organisation.js. This step always runs, so a
 *     template added later gets it the next time; prerequisites.js reports a template that is off.
 *  3. Writes _organisation.json.
 *  4. Regenerates cipp/ and the docs.
 *
 * The new prefix must not be in the repo yet: text that already has it cannot be told apart from
 * text that gets it, and the next switch would take it along. The script refuses then and shows
 * where it is.
 *
 * A policy in a tenant is matched on its name. After a prefix switch, CIPP deploys the policies
 * under the new name next to the old ones; clean up the old ones in the tenant.
 *
 * sync-mirror.js runs this in a mirror whose own _organisation.json differs, so the mirror keeps
 * its own organisation while getting the content from here.
 *
 * Usage:
 *   node scripts/set-organisation.js --prefix "Contoso - "
 *   node scripts/set-organisation.js --service-provider-tenant <tenant-id> [--service-provider-tenant <tenant-id> …]
 *   node scripts/set-organisation.js --service-provider-tenant <tenant-id>,<tenant-id>
 *   node scripts/set-organisation.js --no-service-provider-tenant
 *   node scripts/set-organisation.js                 # only step 2: templates in line with _organisation.json
 *   node scripts/set-organisation.js ... --dry-run   # only show what would change
 *   node scripts/set-organisation.js ... --no-generate # skip step 4
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const {
  ORGANISATION_PATH,
  GUID_RE,
  readOrganisation,
  validPrefix,
  filePrefixOf,
  escapeRegExp,
  serviceProviderExclusion,
  serviceProviderTenantsOf,
  wantsServiceProviderExclusion,
} = require("./lib/organisation");

const REPO_ROOT = path.resolve(__dirname, "..");
const ORGANISATION_REL = path.relative(REPO_ROOT, ORGANISATION_PATH).split(path.sep).join("/");

function parseArgs(argv) {
  const opts = { prefix: undefined, tenants: undefined, dryRun: false, generate: true };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--prefix") opts.prefix = argv[++i];
    else if (arg === "--service-provider-tenant") opts.tenants = [...(opts.tenants || []), ...splitTenants(argv[++i])];
    else if (arg === "--no-service-provider-tenant") opts.tenants = [];
    else if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--no-generate") opts.generate = false;
    else {
      console.error(`Onbekende optie: ${arg}`);
      process.exit(2);
    }
  }
  if (opts.prefix !== undefined && !validPrefix(opts.prefix)) {
    console.error(`Ongeldig voorvoegsel ${JSON.stringify(opts.prefix)}: het eindigt op " - " en bevat geen " \\ / : * ? < > | _.`);
    process.exit(2);
  }
  const bad = (opts.tenants || []).filter((id) => !GUID_RE.test(id));
  if (bad.length > 0 || new Set(opts.tenants).size !== (opts.tenants || []).length) {
    console.error(`Ongeldige tenant-id's ${JSON.stringify(opts.tenants)}: verwacht verschillende GUID's.`);
    process.exit(2);
  }
  return opts;
}

/** "a,b" of "a" -> ["a", "b"]: zo kan --service-provider-tenant herhaald én met komma's. */
function splitTenants(value) {
  return (value || "").split(",").map((id) => id.trim().toLowerCase()).filter(Boolean);
}

const sameList = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const git = (args) => execFileSync("git", ["-C", REPO_ROOT, ...args], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

/** Wat in git zit plus wat nieuw is en niet genegeerd wordt — een verse wijziging gaat ook mee. */
function repoFiles() {
  return git(["ls-files", "-z", "--cached", "--others", "--exclude-standard"])
    .split("\0")
    .filter(Boolean)
    .filter((rel, i, all) => all.indexOf(rel) === i && fs.existsSync(path.join(REPO_ROOT, rel)));
}

const isText = (buf) => !buf.includes(0);

/** Beide vormen van een voorvoegsel, alleen waar een nummer, `<placeholder>` of `*` volgt. */
function patterns(prefix) {
  return [
    { re: new RegExp(`${escapeRegExp(prefix)}(?=\\d|<)`, "g"), form: prefix },
    { re: new RegExp(`${escapeRegExp(filePrefixOf(prefix))}(?=\\d|<|\\*)`, "g"), form: filePrefixOf(prefix) },
  ];
}

function replacePrefix(text, from, to) {
  const [name, file] = patterns(from);
  return text.replace(name.re, to).replace(file.re, filePrefixOf(to));
}

const containsPrefix = (text, prefix) => patterns(prefix).some(({ re }) => new RegExp(re.source).test(text));

/**
 * excludeGuestsOrExternalUsers zoals hij in een templatebestand staat: in de JSON-kolom, dus één
 * keer extra ge-escapet. Als tekst vervangen in plaats van opnieuw serialiseren houdt de rest van
 * het template byte voor byte gelijk aan wat CIPP schreef.
 */
const exclusionToken = (value) => JSON.stringify(`"excludeGuestsOrExternalUsers":${JSON.stringify(value)}`).slice(1, -1);

/** Stap 2 op één template: de nieuwe tekst, of null als er niets verandert. */
function reconcileTenants(text, tenants, rel) {
  const policy = JSON.parse(JSON.parse(text).JSON);
  const current = policy.conditions?.users?.excludeGuestsOrExternalUsers ?? null;
  if (current && !serviceProviderTenantsOf(current)) return null; // een eigen gastenuitsluiting (2125): niet van ons
  const wanted = tenants.length > 0 && wantsServiceProviderExclusion(policy) ? serviceProviderExclusion(tenants) : null;
  if (JSON.stringify(current) === JSON.stringify(wanted)) return null;
  const from = exclusionToken(current);
  if (text.split(from).length !== 2) throw new Error(`${rel}: excludeGuestsOrExternalUsers niet precies één keer gevonden als ${from}`);
  return text.replace(from, exclusionToken(wanted));
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const current = readOrganisation();
  const from = current.prefix;
  const to = opts.prefix ?? from;
  const tenants = opts.tenants ?? current.serviceProviderTenantIds;
  const prefixChanges = to !== from;
  // Een _organisation.json in de oude vorm (één serviceProviderTenantId) gaat naar de lijst, ook als de tenants gelijk blijven.
  const oldForm = "serviceProviderTenantId" in JSON.parse(fs.readFileSync(ORGANISATION_PATH, "utf8"));

  const files = repoFiles().filter((rel) => rel !== ORGANISATION_REL);

  if (prefixChanges) {
    // Staat het nieuwe voorvoegsel er al, dan is na de wissel niet meer te zien wat van wie was.
    const clashes = [];
    for (const rel of files) {
      const buf = fs.readFileSync(path.join(REPO_ROOT, rel));
      if (containsPrefix(rel, to) || (isText(buf) && containsPrefix(buf.toString("utf8"), to))) clashes.push(rel);
    }
    if (clashes.length > 0) {
      console.error(`"${to}" staat al in ${clashes.length} bestand(en); haal het daar eerst weg:`);
      for (const rel of clashes.slice(0, 20)) console.error(`  ${rel}`);
      process.exit(1);
    }
  }

  const edits = new Map();
  const moves = [];
  for (const rel of files) {
    const buf = fs.readFileSync(path.join(REPO_ROOT, rel));
    if (!isText(buf)) continue;
    const text = buf.toString("utf8");
    let next = prefixChanges ? replacePrefix(text, from, to) : text;
    if (rel.startsWith(`CATemplate/${filePrefixOf(from)}`) && rel.endsWith(".json")) {
      next = reconcileTenants(next, tenants, rel) ?? next;
    }
    if (next !== text) edits.set(rel, next);
    if (prefixChanges) {
      const renamed = replacePrefix(rel, from, to);
      if (renamed !== rel) moves.push({ from: rel, to: renamed });
    }
  }
  const tenantChanges = !sameList(tenants, current.serviceProviderTenantIds) || oldForm;

  if (!prefixChanges && !tenantChanges && edits.size === 0) {
    console.log("Er verandert niets.");
    return;
  }

  for (const rel of edits.keys()) console.log(`~ ${rel}`);
  for (const m of moves) console.log(`> ${m.from}\n    -> ${m.to}`);
  if (prefixChanges || tenantChanges) console.log(`~ ${ORGANISATION_REL}`);
  console.log("");
  if (prefixChanges) console.log(`Voorvoegsel "${from}" -> "${to}" (${filePrefixOf(from)} -> ${filePrefixOf(to)}), ${moves.length} bestanden hernoemd.`);
  const list = (ids) => (ids.length ? ids.join(", ") : "(geen)");
  if (tenantChanges) console.log(`Service provider-tenants: ${list(current.serviceProviderTenantIds)} -> ${list(tenants)}.`);
  console.log(`${edits.size} bestanden aangepast.`);

  if (opts.dryRun) {
    console.log("Dry run — er is niets geschreven.");
    return;
  }

  // Als bytes schrijven: de templates in CATemplate/ blijven zo byte voor byte gelijk aan CIPP, op wat hier verandert na.
  for (const [rel, text] of edits) fs.writeFileSync(path.join(REPO_ROOT, rel), Buffer.from(text, "utf8"));
  for (const m of moves) {
    const target = path.join(REPO_ROOT, m.to);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.renameSync(path.join(REPO_ROOT, m.from), target);
  }

  const raw = fs.readFileSync(ORGANISATION_PATH, "utf8");
  const { _comment, prefix, serviceProviderTenantId, serviceProviderTenantIds, ...rest } = JSON.parse(raw);
  const org = { _comment, prefix: to, serviceProviderTenantIds: tenants, ...rest };
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  fs.writeFileSync(ORGANISATION_PATH, JSON.stringify(org, null, 2).replace(/\n/g, eol) + eol);

  if (!opts.generate) {
    console.log("\nNiet opnieuw gegenereerd (--no-generate). Draai de pijplijn uit scripts/README.md.");
    return;
  }
  // Een nieuw proces per stap: de scripts lezen _organisation.json bij het laden.
  for (const script of ["export-cipp-baseline.js", "generate-docs.js"]) {
    console.log(`\n> node scripts/${script}`);
    execFileSync(process.execPath, [path.join(__dirname, script)], { cwd: REPO_ROOT, stdio: ["ignore", "ignore", "inherit"] });
  }
  console.log("\nKlaar. Bekijk de diff; in een tenant waar de policies al onder de oude naam staan, ruim je die op.");
}

main();
