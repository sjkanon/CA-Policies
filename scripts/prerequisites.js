#!/usr/bin/env node
/**
 * Bewaakt dat elke groep en named location waar CATemplate/GLOBAL__*.json naar verwijst een
 * definitie heeft in prerequisites/ca-prerequisites.json.
 *
 * ===================== WAAROM DIT EEN HARDE FOUT IS =====================
 *
 * Een uitzonderingsgroep die bij de klant niet bestaat sluit niemand uit. De policy wordt
 * daarmee stréngter dan bedoeld, en dat is precies de kant op waar niets alarm slaat: de
 * uitrol slaagt, de check slaagt, en pas de gebruiker die buitengesloten wordt merkt het.
 * Bij `Excluded from Conditional Access` (32 van de 33 templates) is dat de break-glass-
 * uitsluiting; bij `Licensed Users` blokkeert 1110 dan élke gebruiker in de tenant.
 *
 * Zolang deze repo alleen een CHECK-baseline voedde was dat een meetfout. Sinds
 * export-cipp-baseline.js er ook een UITROL uit genereert, is het een lock-out. Vandaar dat
 * generate-baseline.js hier hard op faalt in plaats van te waarschuwen.
 *
 * Gebruik: node scripts/prerequisites.js   (rapporteert, exit 1 bij fouten)
 * Als module: readPrerequisites(), collectReferences(), validate()
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "CATemplate");
const PREREQ_PATH = path.join(REPO_ROOT, "prerequisites", "ca-prerequisites.json");

function readPrerequisites() {
  return JSON.parse(fs.readFileSync(PREREQ_PATH, "utf8"));
}

/** Alle GLOBAL__*.json, geparsed: { file, row, policy }. */
function readTemplates() {
  return fs
    .readdirSync(TEMPLATE_DIR)
    .filter((f) => f.startsWith("GLOBAL__") && f.endsWith(".json"))
    .sort()
    .map((f) => {
      const row = JSON.parse(fs.readFileSync(path.join(TEMPLATE_DIR, f), "utf8"));
      return { file: f.replace(/\.json$/, ""), row, policy: JSON.parse(row.JSON) };
    });
}

/**
 * Welke groep/locatie wordt door welk template gebruikt, en hoe. Bewust hier afgeleid in
 * plaats van in ca-prerequisites.json opgeschreven: een tweede lijst veroudert stil.
 */
function collectReferences(templates = readTemplates()) {
  const groups = new Map();
  const locations = new Map();
  const locationDefinitions = new Map();

  const noteer = (kaart, naam, gebruik) => {
    if (!kaart.has(naam)) kaart.set(naam, []);
    kaart.get(naam).push(gebruik);
  };

  for (const { file, policy } of templates) {
    const users = policy.conditions?.users || {};
    for (const veld of ["includeGroups", "excludeGroups"]) {
      for (const naam of users[veld] || []) noteer(groups, naam, { file, veld });
    }
    const locs = policy.conditions?.locations;
    if (locs) {
      for (const veld of ["includeLocations", "excludeLocations"]) {
        for (const naam of locs[veld] || []) noteer(locations, naam, { file, veld });
      }
    }
    // LocationInfo draagt de volledige definitie van de named locations die het template
    // gebruikt — landcodes of IP-ranges. De platform-engine vergelijkt die inhoud, dus een
    // afwijking tussen template en prerequisites is een echte drift, geen cosmetiek.
    for (const li of policy.LocationInfo || []) {
      if (li?.displayName) locationDefinitions.set(li.displayName, { file, definition: li });
    }
  }

  return { groups, locations, locationDefinitions };
}

/** Vergelijkt twee named-locationdefinities op de velden die er inhoudelijk toe doen. */
function locationVerschil(uitTemplate, uitPrereq) {
  const genormaliseerd = (d) => ({
    type: d["@odata.type"],
    countriesAndRegions: [...(d.countriesAndRegions || [])].sort(),
    includeUnknownCountriesAndRegions: d.includeUnknownCountriesAndRegions ?? null,
    countryLookupMethod: d.countryLookupMethod ?? null,
    isTrusted: d.isTrusted ?? null,
    ipRanges: (d.ipRanges || []).map((r) => r.cidrAddress).sort(),
  });
  const a = genormaliseerd(uitTemplate);
  const b = genormaliseerd(uitPrereq);
  const verschillen = [];
  for (const sleutel of Object.keys(a)) {
    if (JSON.stringify(a[sleutel]) !== JSON.stringify(b[sleutel])) {
      verschillen.push(`${sleutel}: template ${JSON.stringify(a[sleutel])} vs prerequisites ${JSON.stringify(b[sleutel])}`);
    }
  }
  return verschillen;
}

/** @returns {{ errors: string[], warnings: string[] }} */
function validate(prereq = readPrerequisites(), refs = collectReferences()) {
  const errors = [];
  const warnings = [];

  const groepsnamen = new Set(prereq.groups.map((g) => g.displayName));
  const locatiesOpNaam = new Map(prereq.namedLocations.map((l) => [l.displayName, l]));
  const ingebouwd = new Set(Object.keys(prereq.builtInLocationIds).filter((k) => k !== "_comment"));

  for (const [naam, gebruik] of refs.groups) {
    if (!groepsnamen.has(naam)) {
      errors.push(
        `Groep "${naam}" wordt gebruikt door ${gebruik.map((g) => `${g.file} (${g.veld})`).join(", ")} maar staat niet in prerequisites/ca-prerequisites.json. ` +
          `Voeg hem daar toe, met purpose en danger — anders rolt de baseline een policy uit met een uitzondering die bij de klant niet bestaat.`
      );
    }
  }

  for (const [naam, gebruik] of refs.locations) {
    if (ingebouwd.has(naam) || locatiesOpNaam.has(naam)) continue;
    errors.push(
      `Named location "${naam}" wordt gebruikt door ${gebruik.map((g) => `${g.file} (${g.veld})`).join(", ")} maar staat niet in prerequisites/ca-prerequisites.json.`
    );
  }

  // Ongebruikte definities: geen fout (een groep mag vooruitlopen op een template), wel een
  // signaal dat er iets is blijven staan na het verwijderen van een template.
  for (const naam of groepsnamen) {
    if (!refs.groups.has(naam)) warnings.push(`Groep "${naam}" staat in prerequisites maar geen enkel template verwijst ernaar.`);
  }
  for (const naam of locatiesOpNaam.keys()) {
    if (!refs.locations.has(naam)) warnings.push(`Named location "${naam}" staat in prerequisites maar geen enkel template verwijst ernaar.`);
  }

  for (const [naam, { file, definition }] of refs.locationDefinitions) {
    const prereqLocatie = locatiesOpNaam.get(naam);
    if (!prereqLocatie) continue;
    const verschillen = locationVerschil(definition, prereqLocatie.definition);
    if (verschillen.length === 0) continue;
    const regel = `Named location "${naam}" verschilt tussen ${file} en prerequisites: ${verschillen.join("; ")}`;
    if (prereqLocatie.tenantSpecific) {
      warnings.push(
        `${regel}. Verwacht: dit is een tenant-specifieke locatie (${prereqLocatie.tenantSpecific}). ` +
          `De waarde uit het template wordt NIET uitgerold; New-CaPrerequisites.ps1 eist hem per klant als parameter.`
      );
    } else {
      errors.push(
        `${regel}. De platform-engine vergelijkt named locations op volledige inhoud, dus deze twee moeten gelijk zijn — ` +
          `pas het template aan, of prerequisites, maar niet één van de twee alleen.`
      );
    }
  }

  return { errors, warnings };
}

function main() {
  const { errors, warnings } = validate();
  for (const w of warnings) console.warn(`waarschuwing: ${w}`);
  for (const e of errors) console.error(`FOUT: ${e}`);
  if (errors.length > 0) {
    console.error(`\n${errors.length} verwijzing(en) zonder definitie. Zie prerequisites/ca-prerequisites.json.`);
    process.exitCode = 1;
    return;
  }
  const refs = collectReferences();
  console.log(`OK — ${refs.groups.size} groepen en ${refs.locations.size} locatieverwijzingen, alle gedefinieerd${warnings.length ? ` (${warnings.length} waarschuwing(en))` : ""}.`);
}

module.exports = { readPrerequisites, readTemplates, collectReferences, validate, PREREQ_PATH, TEMPLATE_DIR };

if (require.main === module) main();
