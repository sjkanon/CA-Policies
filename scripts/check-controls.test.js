#!/usr/bin/env node
/**
 * Bewaakt dat controls/ca-controls.json en CATemplate/ niet uit elkaar lopen.
 *
 * ========================== WAAROM DIT EEN TEST IS ==========================
 *
 * check-controls.js draait pas als iemand hem draait, en de gevolgen van hem níet draaien zie
 * je niet hier maar in de andere repo: een COMPLIANCE.md waarin een control wordt afgedekt door
 * een policy die niet bestaat, of waarin een policy die wél bestaat nergens meetelt. Dat komt
 * pas boven bij een audit — het verkeerde moment.
 *
 * Deze test faalt op het moment dat het template wordt toegevoegd of hernoemd, en dat is het
 * enige moment waarop de auteur nog weet welke controls hij bedoelde.
 *
 * Draaien: node --test scripts/check-controls.test.js
 */
const assert = require("node:assert");
const { test } = require("node:test");

const { readControls, readTemplateNames, readVocabulary, validate, FRAMEWORKS } = require("./check-controls");

test("elk template in CATemplate/ heeft een normenmapping, en andersom", () => {
  const { errors } = validate();
  assert.deepStrictEqual(
    errors,
    [],
    "controls/ca-controls.json loopt uit de pas met CATemplate/. Draai: node scripts/check-controls.js"
  );
});

test("elke policy vult alle vier de kaders", () => {
  const controls = readControls();
  const leeg = [];
  for (const [key, value] of Object.entries(controls)) {
    if (key.startsWith("_")) continue;
    for (const framework of FRAMEWORKS) {
      if (!Array.isArray(value[framework]) || value[framework].length === 0) leeg.push(`${key}.${framework}`);
    }
  }
  assert.deepStrictEqual(leeg, [], "een leeg kader laat de policy in dat kader stil wegvallen uit COMPLIANCE.md");
});

test("het aantal mappings volgt het aantal templates", () => {
  const templates = readTemplateNames();
  const mapped = Object.keys(readControls()).filter((k) => !k.startsWith("_"));
  assert.strictEqual(mapped.length, templates.length);
});

/**
 * Alleen lokaal: in CI staat de Intune-repo er niet naast en is er niets om tegen te toetsen.
 * Daar doet generate-compliance.js --strict deze controle, met dezelfde vocabulaire.
 */
test("de labels staan letterlijk in de vocabulaire (overgeslagen zonder de Intune-repo ernaast)", (t) => {
  if (!readVocabulary()) return t.skip("IntuneBackup/IntuneTemplate/_controls.json staat er niet naast");
  const { errors } = validate();
  assert.deepStrictEqual(errors, []);
});
