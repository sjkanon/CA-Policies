#!/usr/bin/env node
/**
 * CATemplate/README*.md and the README per policy are generated. A README that no longer matches
 * the templates reads as if it were correct, so a stale one is a failure here, not a warning.
 */
const fs = require("fs");
const path = require("path");
const assert = require("node:assert");
const { test } = require("node:test");

const { build, isBij, validate } = require("./generate-docs");

const TEMPLATE_DIR = path.join(__dirname, "..", "CATemplate");
const templates = fs.readdirSync(TEMPLATE_DIR).filter((f) => f.startsWith("CXNM__STANDARD__") && f.endsWith(".json"));
const OVERVIEWS = ["README.md", "README.en.md", "README.fr.md"];

test("de README's in CATemplate/ zijn bij (anders: node scripts/generate-docs.js)", () => {
  for (const [pad, verwacht] of Object.entries(build())) {
    assert.ok(isBij(pad, verwacht), `${path.basename(pad)} ontbreekt of is verouderd`);
  }
});

test("elke policy staat in elk overzicht, met een link naar zijn eigen README", () => {
  const files = build();
  for (const readme of OVERVIEWS) {
    const lang = readme.split(".").length === 3 ? `.${readme.split(".")[1]}` : "";
    const inhoud = files[path.join(TEMPLATE_DIR, readme)];
    for (const f of templates) {
      const md = f.replace(/\.json$/, `${lang}.md`);
      assert.ok(inhoud.includes(`(${md})`), `${md} ontbreekt in ${readme}`);
    }
  }
});

test("elke policy heeft een README in drie talen die naar zijn JSON wijst", () => {
  const files = build();
  for (const f of templates) {
    for (const suffix of [".md", ".en.md", ".fr.md"]) {
      const inhoud = files[path.join(TEMPLATE_DIR, f.replace(/\.json$/, suffix))];
      assert.ok(inhoud, `${f.replace(/\.json$/, suffix)} wordt niet gegenereerd`);
      assert.ok(inhoud.includes(`(${f})`), `${f.replace(/\.json$/, suffix)} linkt niet naar ${f}`);
    }
  }
});

test("geen README per policy zonder template (wees)", () => {
  const files = new Set(Object.keys(build()));
  const wezen = fs
    .readdirSync(TEMPLATE_DIR)
    .filter((f) => f.startsWith("CXNM__STANDARD__") && f.endsWith(".md"))
    .filter((f) => !files.has(path.join(TEMPLATE_DIR, f)));
  assert.deepStrictEqual(wezen, []);
});

test("docs/policies.json: een template zonder doel of een koppeling naar een onbekende groep faalt", () => {
  const t = [{ name: "CXNM__STANDARD__9999__BLOCK__Test" }];
  const ok = { nl: "a", en: "b", fr: "c" };
  assert.deepStrictEqual(validate(t, { groepen: {}, policies: { CXNM__STANDARD__9999__BLOCK__Test: { doel: ok } } }), []);
  assert.strictEqual(validate(t, { groepen: {}, policies: {} }).length, 1);
  assert.strictEqual(validate(t, { groepen: {}, policies: { CXNM__STANDARD__9999__BLOCK__Test: { doel: { nl: "a" } } } }).length, 1);
  const metGroep = { doel: ok, intune: [{ targets: ["@bestaatNiet"], waarom: ok }] };
  assert.strictEqual(validate(t, { groepen: {}, policies: { CXNM__STANDARD__9999__BLOCK__Test: metGroep } }).length, 1);
  const wees = { CXNM__STANDARD__9999__BLOCK__Test: { doel: ok }, CXNM__STANDARD__0000__BLOCK__Weg: { doel: ok } };
  assert.strictEqual(validate(t, { groepen: {}, policies: wees }).length, 1);
});
