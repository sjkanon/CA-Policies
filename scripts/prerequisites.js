#!/usr/bin/env node
/**
 * Bewaakt dat elke groep, named location, custom authentication strength en authentication
 * context waar CATemplate/GLOBAL__*.json naar verwijst een definitie heeft in
 * prerequisites/ca-prerequisites.json — plus de groep waar een passkey profile in
 * authentication-methods/ zich op richt.
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
 * Een custom authentication strength faalt op een eigen manier: Entra kent zijn id pas toe
 * bij aanmaken, dus het template draagt een nul-GUID. Blijft die staan bij de uitrol, dan
 * wijst de grant naar een id dat in die tenant niet bestaat — en dat is geen 'strenger dan
 * bedoeld' maar onvoorspelbaar.
 *
 * Gebruik: node scripts/prerequisites.js   (rapporteert, exit 1 bij fouten)
 * Als module: readPrerequisites(), readMethodTargets(), collectReferences(), validate()
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "CATemplate");
const PREREQ_PATH = path.join(REPO_ROOT, "prerequisites", "ca-prerequisites.json");
const METHODS_PATH = path.join(REPO_ROOT, "authentication-methods", "authentication-methods.json");

/**
 * Een passkey profile richt zich op een groep, niet op directory-rollen. Die groep is dus
 * net zo goed een randvoorwaarde als een uitzonderingsgroep in een CA-template, en hoort in
 * dezelfde lijst — anders ontstaat er een tweede plek waar groepen worden afgesproken.
 */
function readMethodTargets() {
  if (!fs.existsSync(METHODS_PATH)) return [];
  const methods = JSON.parse(fs.readFileSync(METHODS_PATH, "utf8")).methods || [];
  const doelen = [];
  for (const methode of methods) {
    for (const profiel of methode.profiles || []) {
      if (profiel.target && profiel.target !== "AllUsers") {
        doelen.push({ naam: profiel.target, file: `authentication-methods (${methode.id}: ${profiel.displayName})` });
      }
    }
  }
  return doelen;
}

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
  const strengths = new Map();
  const contexts = new Map();

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

    // Een custom authentication strength bestaat pas nadat iemand hem in de tenant aanmaakt,
    // en Entra kent het id dan pas toe. Het template draagt daarom een nul-GUID; die moet bij
    // de uitrol door het echte id vervangen worden, anders wijst de grant naar niets.
    const strength = policy.grantControls?.authenticationStrength;
    if (strength && strength.policyType === "custom" && strength.displayName) {
      strengths.set(strength.displayName, { file, definition: strength });
    }

    // Vandaag vult geen enkel template dit veld. De lus staat er zodat een authentication
    // context die er ooit bij komt niet zonder definitie de baseline in glipt.
    for (const acr of policy.conditions?.applications?.includeAuthenticationContextClassReferences || []) {
      noteer(contexts, acr, { file, veld: "includeAuthenticationContextClassReferences" });
    }
  }

  for (const { naam, file } of readMethodTargets()) {
    noteer(groups, naam, { file, veld: "passkey profile target" });
  }

  return { groups, locations, locationDefinitions, strengths, contexts };
}

/** Vergelijkt twee authentication strengths op wat de grant werkelijk bepaalt. */
function strengthVerschil(uitTemplate, uitPrereq) {
  const genormaliseerd = (d) => ({
    requirementsSatisfied: d.requirementsSatisfied ?? null,
    allowedCombinations: [...(d.allowedCombinations || [])].sort(),
  });
  const a = genormaliseerd(uitTemplate);
  const b = genormaliseerd(uitPrereq);
  return Object.keys(a)
    .filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]))
    .map((k) => `${k}: template ${JSON.stringify(a[k])} vs prerequisites ${JSON.stringify(b[k])}`);
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

  // ------------------------------------------------ authentication strengths ----

  const strengthsOpNaam = new Map((prereq.authenticationStrengths || []).map((s) => [s.displayName, s]));

  for (const [naam, { file, definition }] of refs.strengths) {
    const uitPrereq = strengthsOpNaam.get(naam);
    if (!uitPrereq) {
      errors.push(
        `Custom authentication strength "${naam}" wordt gebruikt door ${file} maar staat niet in prerequisites/ca-prerequisites.json. ` +
          `Zonder definitie maakt New-CaPrerequisites.ps1 hem niet aan, en verwijst de grant bij de klant naar een id dat daar niet bestaat.`
      );
      continue;
    }

    const verschillen = strengthVerschil(definition, uitPrereq.definition);
    if (verschillen.length > 0) {
      errors.push(
        `Custom authentication strength "${naam}" verschilt tussen ${file} en prerequisites: ${verschillen.join("; ")}. ` +
          `Welke combinaties voldoen is de maatregel zelf — die twee mogen niet uit elkaar lopen.`
      );
    }

    // De placeholder hoort er te staan: het template is de bron voor álle tenants en kan dus
    // geen echt id dragen. Een echt id hier betekent dat er een tenant-id is blijven plakken.
    if (uitPrereq.placeholderId && definition.id && definition.id !== uitPrereq.placeholderId) {
      errors.push(
        `Custom authentication strength "${naam}" draagt in ${file} het id ${definition.id} in plaats van de placeholder ${uitPrereq.placeholderId}. ` +
          `Dat is het id uit één tenant; bij elke andere klant wijst de grant daarmee naar niets. Zet de placeholder terug.`
      );
    }
  }

  for (const naam of strengthsOpNaam.keys()) {
    if (!refs.strengths.has(naam)) {
      warnings.push(`Authentication strength "${naam}" staat in prerequisites maar geen enkel template verwijst ernaar.`);
    }
  }

  // ------------------------------------------------- authentication contexts ----

  const contextsOpId = new Map((prereq.authenticationContexts || []).map((c) => [c.id, c]));

  for (const [id, gebruik] of refs.contexts) {
    const uitPrereq = contextsOpId.get(id);
    if (!uitPrereq) {
      errors.push(
        `Authentication context "${id}" wordt gebruikt door ${gebruik.map((g) => g.file).join(", ")} maar staat niet in prerequisites/ca-prerequisites.json.`
      );
      continue;
    }
    // Niet-gepubliceerd is de meest gemaakte fout: de context bestaat, de CA-policy pakt hem,
    // maar geen enkele app kan hem kiezen — dus hij wordt nooit aangeroepen en beschermt niets.
    if (uitPrereq.isAvailable === false) {
      warnings.push(
        `Authentication context "${id}" (${uitPrereq.displayName}) staat op isAvailable false: geen enkele app kan hem kiezen, ` +
          `dus de policy die hem als target heeft wordt nooit aangeroepen.`
      );
    }
  }

  for (const id of contextsOpId.keys()) {
    if (!refs.contexts.has(id)) {
      warnings.push(`Authentication context "${id}" staat in prerequisites maar geen enkel template verwijst ernaar.`);
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
  const delen = [
    `${refs.groups.size} groepen`,
    `${refs.locations.size} locatieverwijzingen`,
    `${refs.strengths.size} custom authentication strength(s)`,
    `${refs.contexts.size} authentication context(s)`,
  ];
  console.log(`OK — ${delen.join(", ")}, alle gedefinieerd${warnings.length ? ` (${warnings.length} waarschuwing(en))` : ""}.`);
}

module.exports = { readPrerequisites, readTemplates, readMethodTargets, collectReferences, strengthVerschil, validate, PREREQ_PATH, TEMPLATE_DIR, METHODS_PATH };

if (require.main === module) main();
