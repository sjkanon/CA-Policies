#!/usr/bin/env node
/**
 * Bewaakt de afspraak die prerequisites/ca-prerequisites.json maakt: elke groep en named
 * location waar een template naar verwijst heeft een definitie, en niets tenant-specifieks
 * lekt de export in.
 *
 * ========================== WAAROM DIT EEN TEST IS ==========================
 *
 * De validatie zit al in generate-baseline.js en export-cipp-baseline.js, maar allebei die
 * scripts draaien pas als iemand ze draait. Deze test faalt in CI op het moment dat het
 * template wordt toegevoegd — en dat is het enige moment waarop de auteur nog weet welke
 * groep hij bedoelde.
 *
 * Draaien: node --test scripts/prerequisites.test.js
 */
const fs = require("fs");
const path = require("path");
const assert = require("node:assert");
const { test } = require("node:test");

const { readPrerequisites, collectReferences, validate } = require("./prerequisites");

const REPO_ROOT = path.resolve(__dirname, "..");
const IMPORT_PATH = path.join(REPO_ROOT, "cipp", "ca-templates-import.json");

test("elke groep- en locatieverwijzing in CATemplate/ heeft een definitie", () => {
  const { errors } = validate();
  assert.deepStrictEqual(
    errors,
    [],
    `Verwijzingen zonder definitie. Een uitzonderingsgroep die bij de klant niet bestaat sluit niemand uit — de policy wordt dan strenger dan bedoeld:\n${errors.join("\n")}`
  );
});

test("elke definitie legt uit waarvoor hij dient en hoe gevaarlijk hij is", () => {
  const prereq = readPrerequisites();
  for (const item of [...prereq.groups, ...prereq.namedLocations]) {
    assert.ok(item.purpose, `${item.displayName} heeft geen purpose.`);
    assert.ok(item.danger, `${item.displayName} heeft geen danger.`);
  }
});

test("een groep die leden moet hebben legt uit wat er misgaat als hij leeg is", () => {
  const prereq = readPrerequisites();
  for (const groep of prereq.groups.filter((g) => g.requiresMembers)) {
    assert.ok(
      groep.dangerReason,
      `${groep.displayName} is requiresMembers maar zegt niet waarom. New-CaPrerequisites.ps1 drukt die tekst af als de groep leeg blijkt — zonder reden is dat een waarschuwing die niemand opvolgt.`
    );
  }
});

test("de groep waar 1110 op leunt is dynamisch", () => {
  const prereq = readPrerequisites();
  const licensed = prereq.groups.find((g) => g.displayName === "Licensed Users");
  assert.ok(licensed, "'Licensed Users' ontbreekt in prerequisites.");
  assert.strictEqual(
    licensed.membershipType,
    "dynamic",
    "1110 (state: enabled) blokkeert All behalve deze groep. Statisch en leeg aangemaakt blokkeert dat élke gebruiker in de tenant."
  );
  assert.ok(licensed.membershipRule, "'Licensed Users' is dynamisch maar heeft geen membershipRule.");
});

test("elke named location die een template noemt is ofwel aanmaakbaar, ofwel gemarkeerd waarom niet", () => {
  const prereq = readPrerequisites();
  const refs = collectReferences();
  for (const locatie of prereq.namedLocations) {
    if (!refs.locations.has(locatie.displayName)) continue;
    const aanmaakbaar = Boolean(locatie.definition) && !locatie.notCreatable;
    const gemarkeerd = Boolean(locatie.notCreatable) || Boolean(locatie.tenantSpecific);
    assert.ok(
      aanmaakbaar || gemarkeerd,
      `${locatie.displayName} is niet aanmaakbaar en niet gemarkeerd als tenant-specifiek of notCreatable — dan weet New-CaPrerequisites.ps1 niet wat hij ermee moet.`
    );
  }
});

test("de CIPP-export draagt geen tenant-specifieke IP-ranges", () => {
  if (!fs.existsSync(IMPORT_PATH)) return; // niet gegenereerd in deze werkkopie
  const prereq = readPrerequisites();
  const tenantSpecifiek = new Set(prereq.namedLocations.filter((l) => l.requiresIpRanges).map((l) => l.displayName));
  const rijen = JSON.parse(fs.readFileSync(IMPORT_PATH, "utf8"));

  for (const rij of rijen) {
    for (const li of JSON.parse(rij.JSON).LocationInfo || []) {
      if (!tenantSpecifiek.has(li.displayName)) continue;
      assert.deepStrictEqual(
        li.ipRanges || [],
        [],
        `${rij.GUID} draagt IP-ranges voor "${li.displayName}" mee. Dat is het adres van één specifieke tenant; uitrollen bij een andere klant maakt daar een trusted location van iemand anders.`
      );
    }
  }
});
