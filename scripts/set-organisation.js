#!/usr/bin/env node
/**
 * Puts this clone on a different organisation: a different name prefix for every CA policy. It lives
 * in CATemplate/_organisation.json, in two forms — "CA - 1010 - BLOCK - …" in the tenant and
 * CA__1010__BLOCK__….json as the file name; the second follows from the first.
 *
 * The prefix is not only read by the scripts; it is also in the data and the generated output —
 * every displayName in CATemplate/, the keys in _manifest.json, ca-controls.json and
 * docs/policies.json, cipp/, the docs. So a new prefix is a rewrite of the whole repo, and this
 * script does it in one go:
 *
 *  1. Replaces the old prefix with the new one in every text file in git, and in the file names.
 *     Only where a policy number, a `<placeholder>` or a `*` follows: "CA - " on its own is too
 *     common a string to replace blindly, and history ("was CXNM__STANDARD__") stays history.
 *  2. Writes _organisation.json.
 *  3. Regenerates cipp/ and the docs.
 *
 * The new prefix must not be in the repo yet: text that already has it cannot be told apart from
 * text that gets it, and the next switch would take it along. The script refuses then and shows
 * where it is.
 *
 * A policy in a tenant is matched on its name. After a switch, CIPP deploys the policies under the
 * new name next to the old ones; clean up the old ones in the tenant.
 *
 * sync-mirror.js runs this in a mirror whose own _organisation.json differs, so the mirror keeps
 * its own prefix while getting the content from here.
 *
 * Usage:
 *   node scripts/set-organisation.js --prefix "Contoso - "
 *   node scripts/set-organisation.js --prefix "Contoso - " --dry-run     # only show what would change
 *   node scripts/set-organisation.js --prefix "Contoso - " --no-generate # skip step 3
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { ORGANISATION_PATH, readOrganisation, validPrefix, filePrefixOf, escapeRegExp } = require("./lib/organisation");

const REPO_ROOT = path.resolve(__dirname, "..");
const ORGANISATION_REL = path.relative(REPO_ROOT, ORGANISATION_PATH).split(path.sep).join("/");

function parseArgs(argv) {
  const opts = { prefix: undefined, dryRun: false, generate: true };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--prefix") opts.prefix = argv[++i];
    else if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--no-generate") opts.generate = false;
    else {
      console.error(`Onbekende optie: ${arg}`);
      process.exit(2);
    }
  }
  if (opts.prefix === undefined) {
    console.error('Gebruik: node scripts/set-organisation.js --prefix "<tekst> - " [--dry-run] [--no-generate]');
    process.exit(2);
  }
  if (!validPrefix(opts.prefix)) {
    console.error(`Ongeldig voorvoegsel ${JSON.stringify(opts.prefix)}: het eindigt op " - " en bevat geen " \\ / : * ? < > | _.`);
    process.exit(2);
  }
  return opts;
}

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

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const from = readOrganisation().prefix;
  const to = opts.prefix;
  if (from === to) {
    console.log("Er verandert niets.");
    return;
  }

  const files = repoFiles().filter((rel) => rel !== ORGANISATION_REL);

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

  const edits = [];
  const moves = [];
  for (const rel of files) {
    const buf = fs.readFileSync(path.join(REPO_ROOT, rel));
    if (isText(buf)) {
      const text = buf.toString("utf8");
      const next = replacePrefix(text, from, to);
      if (next !== text) edits.push({ rel, text: next });
    }
    const renamed = replacePrefix(rel, from, to);
    if (renamed !== rel) moves.push({ from: rel, to: renamed });
  }

  for (const e of edits) console.log(`~ ${e.rel}`);
  for (const m of moves) console.log(`> ${m.from}\n    -> ${m.to}`);
  console.log(`~ ${ORGANISATION_REL}`);
  console.log(`\nVoorvoegsel "${from}" -> "${to}" (${filePrefixOf(from)} -> ${filePrefixOf(to)}): ${edits.length} bestanden aangepast, ${moves.length} hernoemd.`);

  if (opts.dryRun) {
    console.log("Dry run — er is niets geschreven.");
    return;
  }

  // Als bytes schrijven: de templates in CATemplate/ blijven zo byte voor byte gelijk aan CIPP, op het voorvoegsel na.
  for (const e of edits) fs.writeFileSync(path.join(REPO_ROOT, e.rel), Buffer.from(e.text, "utf8"));
  for (const m of moves) {
    const target = path.join(REPO_ROOT, m.to);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.renameSync(path.join(REPO_ROOT, m.from), target);
  }

  const raw = fs.readFileSync(ORGANISATION_PATH, "utf8");
  const org = JSON.parse(raw);
  org.prefix = to;
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
