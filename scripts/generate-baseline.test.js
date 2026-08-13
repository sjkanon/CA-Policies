#!/usr/bin/env node
/**
 * Bewaakt de afspraak die `CHECK_ID_BY_TEMPLATE` in generate-baseline.js maakt: een checkId
 * verandert nooit meer.
 *
 * ========================== WAAROM DIT EEN TEST IS ==========================
 *
 * Vóór 2026-08-13 nummerde de generator door over de gesorteerde bestandsnamen. Eén nieuw
 * template met een laag GLOBAL-nummer schoof daarmee alles daarna één op — en het checkId is
 * in TEST Policies Platform de sleutel waarop drift over runs vergeleken wordt en waarop
 * klantuitzonderingen hangen. Een hernummering leest daar als "oude check verdwenen, nieuwe
 * check erbij": een regressie in de tijdlijn die er niet is, en een uitzondering die
 * stilzwijgend op een andere check terechtkomt.
 *
 * De pin lost dat op, maar een pin zonder test is over drie maanden gebroken: wie een
 * template toevoegt merkt niets tot de run bij een klant een andere uitslag geeft. Deze test
 * faalt meteen.
 *
 * Draaien: node scripts/generate-baseline.test.js
 */
const fs = require("fs");
const path = require("path");
const assert = require("node:assert");
const { test } = require("node:test");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "CATemplate");
const BASELINE_PATH = path.join(REPO_ROOT, "baseline", "conditional-access", "baseline-v1.0.json");
const GENERATOR = fs.readFileSync(path.join(__dirname, "generate-baseline.js"), "utf8");

/**
 * De gepinde nummers uit de generator, gelezen uit de broncode in plaats van de module te
 * importeren — het script draait `main()` bij import en zou dan het baselinebestand
 * herschrijven tijdens de test.
 */
function leesPins() {
  const blok = GENERATOR.match(/const CHECK_ID_BY_TEMPLATE = \{([\s\S]*?)\n\};/);
  assert.ok(blok, "CHECK_ID_BY_TEMPLATE niet gevonden in generate-baseline.js");
  const pins = {};
  for (const m of blok[1].matchAll(/^\s{2}(GLOBAL__[A-Za-z0-9_]+):\s*"(\d{3})",/gm)) {
    pins[m[1]] = m[2];
  }
  return pins;
}

const PINS = leesPins();

test("elk template in CATemplate/ heeft een vastgepind checkId-nummer", () => {
  const templates = fs
    .readdirSync(TEMPLATE_DIR)
    .filter((f) => f.startsWith("GLOBAL__") && f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));

  const zonderPin = templates.filter((t) => !PINS[t]);
  assert.deepStrictEqual(
    zonderPin,
    [],
    `Deze templates hebben geen nummer in CHECK_ID_BY_TEMPLATE. Voeg er één toe (nooit een bestaand nummer hergebruiken): ${zonderPin.join(", ")}`
  );
});

test("geen twee templates delen hetzelfde checkId-nummer", () => {
  const gezien = new Map();
  for (const [template, nummer] of Object.entries(PINS)) {
    const eerder = gezien.get(nummer);
    assert.ok(!eerder, `Nummer ${nummer} staat bij zowel ${eerder} als ${template}.`);
    gezien.set(nummer, template);
  }
});

test("geen pin botst met de handgeschreven regels 001-008 en 029", () => {
  const handgeschreven = new Set(["001", "002", "003", "004", "005", "006", "007", "008", "029"]);
  for (const [template, nummer] of Object.entries(PINS)) {
    assert.ok(
      !handgeschreven.has(nummer),
      `${template} claimt ${nummer}, maar dat nummer hoort bij een regel in EXISTING_RULES.`
    );
  }
});

test("elk checkId in de gegenereerde baseline volgt de naamconventie CA-BASE-NNN-Naam", () => {
  // Precies het patroon dat validateBaseline in packages/shared afdwingt: exact drie
  // cijfers. Een vierde cijfer (nummer 1000+) valideert daar niet, en dat merk je anders
  // pas als de hele run op deze baseline vastloopt.
  const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"));
  for (const rule of baseline.rules) {
    assert.match(rule.checkId, /^CA-BASE-\d{3}-[A-Za-z0-9]+$/, `Ongeldig checkId: ${rule.checkId}`);
  }
});

test("het gegenereerde bestand bevat elk gepind nummer precies één keer", () => {
  const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"));
  const nummers = baseline.rules.map((r) => r.checkId.match(/^CA-BASE-(\d{3})-/)[1]);
  const dubbel = nummers.filter((n, i) => nummers.indexOf(n) !== i);
  assert.deepStrictEqual(dubbel, [], `Dubbele checkId-nummers in de gegenereerde baseline: ${dubbel.join(", ")}`);

  for (const nummer of Object.values(PINS)) {
    assert.ok(
      nummers.includes(nummer),
      `Nummer ${nummer} is gepind maar komt niet in de gegenereerde baseline voor — is het template verwijderd? Haal de pin dan NIET weg (het nummer blijft vergeven), maar zet er een comment bij.`
    );
  }
});

test("de generator gebruikt nergens meer het oude CA-ITCE-Baseline-prefix", () => {
  // Het gegenereerde bestand gebruikte CA-BASE-, de generator nog CA-ITCE-Baseline-. Een
  // regeneratie zou dus elk checkId hebben teruggezet naar de oude vorm.
  assert.ok(
    !GENERATOR.includes("CA-ITCE-Baseline-"),
    "generate-baseline.js bevat nog CA-ITCE-Baseline- — dat zet bij een regeneratie elk checkId terug."
  );
});
