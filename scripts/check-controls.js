#!/usr/bin/env node
/**
 * Bewaakt dat elke policy in CATemplate/ een normenmapping heeft in controls/ca-controls.json,
 * en dat die mapping geen policies noemt die niet (meer) bestaan.
 *
 * ===================== WAAROM DIT EEN HARDE FOUT IS =====================
 *
 * ca-controls.json voedt COMPLIANCE.md in de IntuneBackup-repo: de verantwoording die een CISO
 * of auditor leest. Een policy zonder mapping verdwijnt daar stilzwijgend — de policy staat in
 * de tenant, doet zijn werk, maar telt bij geen enkele control mee. Dat is de vervelende kant
 * op: het document beweert minder dekking dan er is, en niemand ziet waaróm.
 *
 * Andersom is erger. Een regel die verwijst naar een template dat is hernoemd of verwijderd,
 * blijft in COMPLIANCE.md een control afdekken met een policy die niet bestaat. Een auditor die
 * die verwijzing volgt en niets vindt, vertrouwt de rest van het document ook niet meer — zelfde
 * redenering als waarom generate-compliance.js het document überhaupt genereert.
 *
 * Wat hier NIET gecontroleerd wordt: of de labels in de vocabulaire staan. Die vocabulaire woont
 * in de andere repo (IntuneTemplate/_controls.json) en CI ziet die niet. Staat die repo er lokaal
 * wél naast, dan controleert dit script de labels alsnog; in CI blijft dat aan
 * `generate-compliance.js --strict`, die precies daarop faalt.
 *
 * Gebruik: node scripts/check-controls.js   (rapporteert, exit 1 bij fouten)
 * Als module: readControls(), validate()
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
