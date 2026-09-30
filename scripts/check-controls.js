#!/usr/bin/env node
/**
 * Guards that every policy in CATemplate/ has a standards mapping in controls/ca-controls.json,
 * and that the mapping names no policies that do not exist (any more).
 *
 * ===================== WHY THIS IS A HARD ERROR =====================
 *
 * ca-controls.json feeds COMPLIANCE.md in the IntuneBackup repo: the accountability a CISO or
 * auditor reads. A policy without a mapping silently disappears there — the policy is in the
 * tenant, does its job, but counts towards no control. The document then claims less coverage
 * than there is, and nobody sees why.
 *
 * The other way round is worse. An entry that refers to a template that was renamed or removed
 * keeps covering a control in COMPLIANCE.md with a policy that does not exist. An auditor who
 * follows that reference and finds nothing no longer trusts the rest of the document either.
 *
 * What is NOT checked here: whether the labels are in the vocabulary. That vocabulary lives in
 * the other repo (IntuneTemplate/_controls.json) and CI does not see it. If that repo is cloned
 * next to this one (../IntuneBackup), this script checks the labels anyway; in CI that is left
 * to `generate-compliance.js --strict` over there, which fails on exactly that.
 *
 * Usage: node scripts/check-controls.js   (reports, exit 1 on errors)
 * As a module: readControls(), validate()
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "CATemplate");
const CONTROLS_PATH = path.join(REPO_ROOT, "controls", "ca-controls.json");

/** De vocabulaire hoort bij de Intune-repo; naast deze repo is hij er meestal, in CI nooit. */
const VOCABULARY_PATH = path.resolve(REPO_ROOT, "..", "IntuneBackup", "IntuneTemplate", "_controls.json");

const FRAMEWORKS = ["iso", "nis2", "cis", "nistcsf"];

function readControls() {
  return JSON.parse(fs.readFileSync(CONTROLS_PATH, "utf8"));
}

/** Alle templatenamen zonder .json, gesorteerd. */
function readTemplateNames() {
  return fs
    .readdirSync(TEMPLATE_DIR)
    .filter((f) => f.startsWith("GLOBAL__") && f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
}

/**
 * De vocabulaire als vier sets van toegestane labels, of null als de Intune-repo er niet naast
 * staat. De vormen komen uit resolveLabel() in generate-compliance.js: ISO en CIS matchen op het
 * hele label, NIS2 op de letter, CSF op het id.
 */
function readVocabulary() {
  if (!fs.existsSync(VOCABULARY_PATH)) return null;
  const voc = JSON.parse(fs.readFileSync(VOCABULARY_PATH, "utf8"));
  return {
    iso: new Set(voc.iso27001.controls.map((c) => c.label)),
    nis2: new Set(voc.nis2.punten.map((p) => p.label)),
    cis: new Set(voc.cis.safeguards.map((s) => s.label)),
    nistcsf: new Set(voc.nistcsf.subcategorieen.map((s) => s.id)),
  };
}

function validate() {
  const errors = [];
  const warnings = [];
  const controls = readControls();
  const templates = readTemplateNames();
  const mapped = Object.keys(controls)
    .filter((k) => !k.startsWith("_"))
    .map((k) => k.replace(/\.json$/, ""));

  for (const name of templates) {
    if (!mapped.includes(name)) {
      errors.push(`${name} heeft geen regel in controls/ca-controls.json — deze policy telt in COMPLIANCE.md bij geen enkele control mee.`);
    }
  }
  for (const name of mapped) {
    if (!templates.includes(name)) {
      errors.push(`controls/ca-controls.json noemt ${name}, maar dat template bestaat niet in CATemplate/ — hernoemd of verwijderd?`);
    }
  }

  for (const [key, value] of Object.entries(controls)) {
    if (key.startsWith("_")) continue;
    const name = key.replace(/\.json$/, "");
    for (const framework of FRAMEWORKS) {
      const labels = value[framework];
      if (!Array.isArray(labels) || labels.length === 0) {
        errors.push(`${name}: geen ${framework}-labels. Elk van de vier kaders moet minstens één label hebben, anders valt de policy in dat kader weg.`);
        continue;
      }
      const seen = new Set();
      for (const label of labels) {
        if (seen.has(label)) warnings.push(`${name}: ${framework}-label "${label}" staat er dubbel in.`);
        seen.add(label);
      }
    }
  }

  const voc = readVocabulary();
  if (!voc) {
    warnings.push(`de vocabulaire (${path.relative(REPO_ROOT, VOCABULARY_PATH)}) staat er niet naast; labels zijn niet gecontroleerd. In CI is dat normaal — generate-compliance.js --strict doet het daar.`);
  } else {
    for (const [key, value] of Object.entries(controls)) {
      if (key.startsWith("_")) continue;
      const name = key.replace(/\.json$/, "");
      for (const framework of FRAMEWORKS) {
        for (const label of value[framework] || []) {
          if (!voc[framework].has(label)) {
            errors.push(`${name}: ${framework}-label "${label}" staat niet letterlijk in de vocabulaire. generate-compliance.js --strict faalt hierop.`);
          }
        }
      }
    }
  }

  return { errors, warnings, aantal: mapped.length };
}

function main() {
  const { errors, warnings, aantal } = validate();
  for (const w of warnings) console.warn(`waarschuwing: ${w}`);
  for (const e of errors) console.error(`FOUT: ${e}`);
  if (errors.length > 0) {
    console.error(`\n${errors.length} probleem(en) in controls/ca-controls.json.`);
    process.exitCode = 1;
    return;
  }
  console.log(`OK — ${aantal} policies met een normenmapping over ${FRAMEWORKS.length} kaders${warnings.length ? ` (${warnings.length} waarschuwing(en))` : ""}.`);
}

module.exports = { readControls, readTemplateNames, readVocabulary, validate, CONTROLS_PATH, TEMPLATE_DIR, FRAMEWORKS };

if (require.main === module) main();
