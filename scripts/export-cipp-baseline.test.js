#!/usr/bin/env node
/**
 * Guards the brake on --remediate-stage1, and the optional templates in CATemplate/_manifest.json.
 *
 * ========================== WHY THIS IS A TEST ==========================
 *
 * Stage 1 is derived from `state: enabled`. A template added today therefore lands there by
 * itself, and the next --remediate-stage1 would enforce it in every tenant — turning "I added
 * a file" into "this belongs to the core". The comparison with the previous export is what
 * keeps those two apart; if it silently breaks, you only notice when a tenant enforces
 * something nobody chose.
 *
 * The manifest decides stage 3. A key that no longer matches a template (renamed, removed)
 * would silently drop a licence-bound template from stage 3 into stage 1.
 *
 * Run: node --test scripts/export-cipp-baseline.test.js
 */
const fs = require("fs");
const os = require("os");
const path = require("path");
const assert = require("node:assert");
const { test } = require("node:test");

const { vergelijkMetVorigPlan, stapSamenvatting, leesVorigPlan, leesOptioneel } = require("./export-cipp-baseline");
const { readTemplates } = require("./prerequisites");

const REPO_ROOT = path.resolve(__dirname, "..");
const STAGES_PATH = path.join(REPO_ROOT, "cipp", "baseline-stages.json");

/** Minimale stage-structuur: alleen wat de vergelijking leest. */
const plan = (indeling) =>
  Object.entries(indeling).map(([stage, bestanden]) => ({
    stage: Number(stage),
    standards: bestanden.map((templateFile) => ({ templateFile })),
  }));

test("een template dat er nog niet was heet nieuw, met de stage erbij", () => {
  const vorig = { stages: plan({ 1: ["a"], 2: ["b"] }) };
  const nu = plan({ 1: ["a", "c"], 2: ["b"] });

  const { nieuw, verplaatst, verdwenen } = vergelijkMetVorigPlan(vorig, nu);
  assert.deepStrictEqual(nieuw, [{ templateFile: "c", stage: 1 }]);
  assert.deepStrictEqual(verplaatst, []);
  assert.deepStrictEqual(verdwenen, []);
});

test("een template dat van stage wisselt heet verplaatst, niet nieuw", () => {
  const vorig = { stages: plan({ 1: ["a"], 2: [] }) };
  const nu = plan({ 1: [], 2: ["a"] });

  const { nieuw, verplaatst } = vergelijkMetVorigPlan(vorig, nu);
  assert.deepStrictEqual(nieuw, [], "een verplaatsing mag niet als nieuw tellen — dan blokkeert hij --remediate-stage1 zonder reden");
  assert.deepStrictEqual(verplaatst, [{ templateFile: "a", van: 1, naar: 2 }]);
});

test("een verwijderd template heet verdwenen", () => {
  const vorig = { stages: plan({ 1: ["a", "b"] }) };
  const nu = plan({ 1: ["a"] });

  const { verdwenen } = vergelijkMetVorigPlan(vorig, nu);
  assert.deepStrictEqual(verdwenen, [{ templateFile: "b", stage: 1 }]);
});

test("zonder vorige export is alles nieuw, maar gemarkeerd als eerste export", () => {
  const { nieuw, eersteExport } = vergelijkMetVorigPlan(null, plan({ 1: ["a", "b"] }));
  assert.strictEqual(eersteExport, true, "zonder deze markering zou de allereerste export zichzelf blokkeren");
  assert.strictEqual(nieuw.length, 2);
});

test("de runsamenvatting blijft leeg als er niets verschoof", () => {
  const gelijk = vergelijkMetVorigPlan({ stages: plan({ 1: ["a"] }) }, plan({ 1: ["a"] }));
  assert.strictEqual(stapSamenvatting(gelijk), null);
  assert.strictEqual(stapSamenvatting(vergelijkMetVorigPlan(null, plan({ 1: ["a"] }))), null, "een eerste export is geen wijziging om te melden");
});

test("een onleesbare vorige export is een fout, geen stilzwijgend overgeslagen vergelijking", () => {
  const map = fs.mkdtempSync(path.join(os.tmpdir(), "ca-export-test-"));
  const stuk = path.join(map, "baseline-stages.json");
  fs.writeFileSync(stuk, "{ dit is geen json");
  try {
    assert.throws(
      () => leesVorigPlan(stuk),
      /niet te lezen als JSON/,
      "null teruggeven zou de vergelijking overslaan — precies de controle waar --remediate-stage1 op leunt"
    );
    assert.strictEqual(leesVorigPlan(path.join(map, "bestaat-niet.json")), null);
  } finally {
    fs.rmSync(map, { recursive: true, force: true });
  }
});

test("de gecommitte export staat volledig op Report", () => {
  if (!fs.existsSync(STAGES_PATH)) return; // niet gegenereerd in deze werkkopie
  const bestand = JSON.parse(fs.readFileSync(STAGES_PATH, "utf8"));
  const acties = [...new Set(bestand.stages.flatMap((s) => s.standards.map((r) => r.action)))];
  assert.deepStrictEqual(
    acties,
    ["Report"],
    "cipp/baseline-stages.json hoort in de repo op Report te staan. Remediate is een beslissing per tenant, ná New-CaPrerequisites.ps1 — niet iets wat op main meelift."
  );
});

test("elke sleutel in CATemplate/_manifest.json is een bestaand template, en elke optional heeft een reden", () => {
  const namen = readTemplates().map((t) => t.file);
  const optioneel = leesOptioneel(undefined, namen);
  assert.ok(Object.keys(optioneel).length > 0, "geen enkel optioneel template — is _manifest.json leeg geraakt?");
  for (const [naam, reden] of Object.entries(optioneel)) {
    assert.ok(namen.includes(naam), `${naam} bestaat niet in CATemplate/`);
    assert.ok(reden.length > 0, `${naam} heeft geen reden`);
  }
});

test("een manifest met een onbekend template of een optional zonder reden is een fout", () => {
  const map = fs.mkdtempSync(path.join(os.tmpdir(), "ca-manifest-test-"));
  const pad = path.join(map, "_manifest.json");
  try {
    fs.writeFileSync(pad, JSON.stringify({ _comment: ["x"], GLOBAL__9999__BLOCK__Weg: { optional: true, reden: "r" } }));
    assert.throws(() => leesOptioneel(pad, ["GLOBAL__1010__BLOCK__Legacy_Authentication"]), /niet in CATemplate/);

    fs.writeFileSync(pad, JSON.stringify({ GLOBAL__1010__BLOCK__Legacy_Authentication: { optional: true } }));
    assert.throws(() => leesOptioneel(pad, ["GLOBAL__1010__BLOCK__Legacy_Authentication"]), /zonder 'reden'/);

    fs.writeFileSync(pad, JSON.stringify({ "GLOBAL__1010__BLOCK__Legacy_Authentication.json": { optional: false } }));
    assert.deepStrictEqual(leesOptioneel(pad, ["GLOBAL__1010__BLOCK__Legacy_Authentication"]), {}, "optional false telt niet mee, en .json in de sleutel mag");
  } finally {
    fs.rmSync(map, { recursive: true, force: true });
  }
});
