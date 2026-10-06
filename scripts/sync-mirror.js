#!/usr/bin/env node
/**
 * Mirrors this repo to a second clone — the same content, its own history.
 *
 * Intended for a clone that pushes to a *different* remote than `origin` (an internal copy
 * next to the public repo). A mirror via `git push --force` would overwrite the history on
 * that side; this script only brings the *files* in line and makes a regular commit of that.
 * The target clone thus keeps its own log, its own workflow runs and its own branches.
 *
 * What goes along is exactly what is in git here — `git ls-files`, so not what `.gitignore`
 * keeps out. That is the whole point: `local/` contains deployment copies *with* secrets, and
 * a mirror that copies from disk instead of from the index would carry those to a second
 * remote. Files that are *gone* here are removed there too — but only if they are in git on
 * the other side; whatever was created locally there is left alone.
 *
 * The target clone is not pushed without `--push`, and the source working tree does not have
 * to be clean — but a mirror of uncommitted changes is a mirror of something that can still
 * change here, so it warns about that.
 *
 * The target keeps its own organisation: if its CATemplate/_organisation.json has a different
 * prefix or service provider tenant than here, set-organisation.js runs there after copying, so
 * the mirror gets the content from here under its own policy names and exclusion.
 * `--prefix` and `--service-provider-tenant` set (or change) that; after that it is in the
 * target's own _organisation.json. A target without one is refused without
 * `--prefix`: otherwise the first sync would rename everything there to the prefix from here.
 *
 * Usage:
 *   node scripts/sync-mirror.js <target-dir>              # copy and commit
 *   node scripts/sync-mirror.js <target-dir> --dry-run    # only show what would happen
 *   node scripts/sync-mirror.js <target-dir> --push       # and push the target clone
 *   node scripts/sync-mirror.js <target-dir> --message "…"
 *   node scripts/sync-mirror.js <target-dir> --prefix "Contoso - "
 *   node scripts/sync-mirror.js <target-dir> --service-provider-tenant <tenant-id>[,<tenant-id>…]
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { validPrefix, GUID_RE, tenantIdsOf } = require("./lib/organisation");

const REPO_ROOT = path.resolve(__dirname, "..");
const ORGANISATION_REL = "CATemplate/_organisation.json";

function git(cwd, args) {
  return execFileSync("git", ["-C", cwd, ...args], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
}

/** Wat er in git zit, als relatieve paden met `/`. `-z` omdat bestandsnamen spaties hebben. */
function trackedFiles(repo) {
  return git(repo, ["ls-files", "-z"]).split("\0").filter(Boolean);
}

function parseArgs(argv) {
  const opts = { target: null, dryRun: false, push: false, message: null, prefix: undefined, tenants: undefined };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--prefix") opts.prefix = argv[++i];
    else if (arg === "--service-provider-tenant") {
      const ids = (argv[++i] || "").split(",").map((id) => id.trim().toLowerCase()).filter(Boolean);
      opts.tenants = [...(opts.tenants || []), ...ids];
    } else if (arg === "--no-service-provider-tenant") opts.tenants = [];
    else if (arg === "--push") opts.push = true;
    else if (arg === "--message") opts.message = argv[++i];
    else if (arg.startsWith("--")) {
      console.error(`Onbekende optie: ${arg}`);
      process.exit(2);
    } else if (opts.target === null) opts.target = arg;
    else {
      console.error(`Te veel argumenten: ${arg}`);
      process.exit(2);
    }
  }
  if (opts.prefix !== undefined && !validPrefix(opts.prefix)) {
    console.error(`Ongeldig voorvoegsel ${JSON.stringify(opts.prefix)}: het eindigt op " - " en bevat geen " \\ / : * ? < > | _.`);
    process.exit(2);
  }
  const tenants = opts.tenants || [];
  if (tenants.some((id) => !GUID_RE.test(id)) || new Set(tenants).size !== tenants.length) {
    console.error(`Ongeldige tenant-id's ${JSON.stringify(opts.tenants)}: verwacht verschillende GUID's.`);
    process.exit(2);
  }
  return opts;
}

const opts = parseArgs(process.argv.slice(2));

if (!opts.target) {
  console.error("Gebruik: node scripts/sync-mirror.js <doelmap> [--dry-run] [--push] [--message \"…\"] [--prefix \"<tekst> - \"]");
  process.exit(2);
}

const targetRoot = path.resolve(opts.target);

if (!fs.existsSync(path.join(targetRoot, ".git"))) {
  console.error(`Geen git-clone op ${targetRoot}.`);
  process.exit(1);
}
if (path.resolve(targetRoot) === REPO_ROOT) {
  console.error("Doelmap is deze repo zelf.");
  process.exit(1);
}

const dirty = git(REPO_ROOT, ["status", "--porcelain"]).trim();
if (dirty) {
  console.warn("Let op: de werkmap hier is niet schoon. De spiegel krijgt de huidige bestanden,");
  console.warn("ook wat nog niet gecommit is.\n");
}

/** De organisatie van een clone, of null als die nog geen _organisation.json heeft. */
function organisationOf(root) {
  const file = path.join(root, ORGANISATION_REL);
  if (!fs.existsSync(file)) return null;
  const org = JSON.parse(fs.readFileSync(file, "utf8"));
  return { prefix: org.prefix, tenants: tenantIdsOf(org, file), oldForm: "serviceProviderTenantId" in org };
}

// Vóór het kopiëren lezen: daarna staat er de versie van hier.
const sourceOrg = organisationOf(REPO_ROOT);
const targetOrg = organisationOf(targetRoot);
const sourcePrefix = sourceOrg.prefix;
const wantedPrefix = opts.prefix ?? targetOrg?.prefix;
const wantedTenants = opts.tenants ?? (targetOrg ? targetOrg.tenants : sourceOrg.tenants);
if (!wantedPrefix) {
  console.error(`${ORGANISATION_REL} ontbreekt in ${targetRoot}, dus het voorvoegsel daar is onbekend.`);
  console.error(`Geef het de eerste keer mee: --prefix "<tekst> - " (dat van hier is "${sourcePrefix}").`);
  process.exit(1);
}
const convert = wantedPrefix !== sourcePrefix || JSON.stringify(wantedTenants) !== JSON.stringify(sourceOrg.tenants);
if (convert) {
  console.log(`De spiegel houdt voorvoegsel "${wantedPrefix}" en service provider-tenants ${wantedTenants.join(", ") || "(geen)"};`);
  console.log("de lijst hieronder is vóór die omzetting, dus ruimer dan wat er uiteindelijk verandert.\n");
}

const source = trackedFiles(REPO_ROOT);
const sourceSet = new Set(source);
const target = trackedFiles(targetRoot);

const added = [];
const changed = [];
for (const rel of source) {
  const from = path.join(REPO_ROOT, rel);
  const to = path.join(targetRoot, rel);
  if (!fs.existsSync(to)) {
    added.push(rel);
  } else if (!fs.readFileSync(from).equals(fs.readFileSync(to))) {
    changed.push(rel);
  } else {
    continue;
  }
  if (!opts.dryRun) {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
}

const removed = target.filter((rel) => !sourceSet.has(rel));
for (const rel of removed) {
  const victim = path.join(targetRoot, rel);
  if (opts.dryRun || !fs.existsSync(victim)) continue;
  fs.rmSync(victim);
  // Mappen bestaan in git niet los van hun inhoud; een leeggelopen map laten staan is rommel.
  let dir = path.dirname(victim);
  while (dir !== targetRoot && fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
    dir = path.dirname(dir);
  }
}

for (const rel of added) console.log(`+ ${rel}`);
for (const rel of changed) console.log(`~ ${rel}`);
for (const rel of removed) console.log(`- ${rel}`);

const total = added.length + changed.length + removed.length;
console.log(
  `\n${source.length} bestanden in git hier; ${added.length} toegevoegd, ` +
    `${changed.length} gewijzigd, ${removed.length} verwijderd in ${targetRoot}.`
);

if (opts.dryRun) {
  console.log("Dry run — er is niets geschreven.");
  process.exit(0);
}
if (total === 0) {
  console.log("De spiegel liep al gelijk.");
  process.exit(0);
}

if (convert) {
  console.log("\nOmzetten naar de organisatie van de spiegel (set-organisation.js daar):");
  const args = ["--prefix", wantedPrefix, ...(wantedTenants.length ? ["--service-provider-tenant", wantedTenants.join(",")] : ["--no-service-provider-tenant"])];
  execFileSync(process.execPath, [path.join(targetRoot, "scripts", "set-organisation.js"), ...args], {
    cwd: targetRoot,
    stdio: ["ignore", "ignore", "inherit"],
  });
  const left = git(targetRoot, ["status", "--porcelain"]).trim();
  console.log(left ? `${left.split("\n").length} wijziging(en) over na de omzetting.` : "Na de omzetting is er niets meer anders.");
}

const head = git(REPO_ROOT, ["rev-parse", "--short", "HEAD"]).trim();
const subject = git(REPO_ROOT, ["log", "-1", "--format=%s"]).trim();
const message = opts.message || `Spiegel van ${path.basename(REPO_ROOT)} ${head}\n\n${subject}`;

git(targetRoot, ["add", "-A"]);
if (!git(targetRoot, ["status", "--porcelain"]).trim()) {
  // Kan: alleen bestanden die daar toch al genegeerd werden.
  console.log("Niets te committen in de doelclone.");
  process.exit(0);
}
git(targetRoot, ["commit", "-m", message]);
console.log(`Gecommit in ${targetRoot}: ${git(targetRoot, ["log", "-1", "--format=%h %s"]).trim()}`);

if (opts.push) {
  process.stdout.write(git(targetRoot, ["push"]));
  console.log("Gepusht.");
} else {
  console.log("Nog niet gepusht — draai met --push, of push daar zelf.");
}
