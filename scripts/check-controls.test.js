#!/usr/bin/env node
/**
 * Guards that controls/ca-controls.json and CATemplate/ do not drift apart.
 *
 * ========================== WHY THIS IS A TEST ==========================
 *
 * check-controls.js only runs when someone runs it, and the consequences of not running it
 * show up not here but in the other repo: a COMPLIANCE.md in which a control is covered by a
 * policy that does not exist, or in which a policy that does exist counts nowhere. That
 * surfaces during an audit — the wrong moment.
 *
 * This test fails the moment the template is added or renamed, the only moment the author
 * still knows which controls he meant.
 *
 * Run: node --test scripts/check-controls.test.js
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
