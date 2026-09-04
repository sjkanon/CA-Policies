#!/usr/bin/env node
/**
 * Genereert uit CATemplate/GLOBAL__*.json de twee bestanden die nodig zijn om deze set als
 * CIPP-baseline uit te rollen:
 *
 *   cipp/ca-templates-import.json   de templates in CIPP's CATemplate-tabelvorm, klaar om te
 *                                   importeren. Eén rij per template, GUID ongewijzigd.
 *   cipp/baseline-stages.json       welk template in welke stage hoort, met welke state en
 *                                   welke actie, plus wat die uitrol blokkeert.
 *
 * ===================== HOE DIT ZICH VERHOUDT TOT generate-baseline.js =====================
 *
 * Dezelfde 40 bestanden voeden nu twee dingen die het tegenovergestelde doen:
 *
 *   generate-baseline.js   -> baseline/conditional-access/baseline-v1.0.json   TOETST
 *   export-cipp-baseline.js -> cipp/*.json                                     ROLT UIT
 *
 * Dat verschil is niet cosmetisch. Een toetsing die de randvoorwaarden mist geeft een
 * verkeerde uitslag; een uitrol die ze mist sluit een tenant buiten. Vandaar dat dit script
 * scripts/prerequisites.js aanroept en hard stopt bij een fout, en vandaar dat elk template
 * dat naar een tenant-specifieke of niet-aanmaakbare randvoorwaarde verwijst hier op
 * `action: "Report"` wordt vastgezet — ook met --remediate-stage1.
 *
 * ===================== WAT ER NIET IN ZIT, EN WAAROM =====================
 *
 * Niet de payload die CIPP's Baselines-scherm zelf opslaat. De staged baselines met
 * graduatievoorwaarden zijn een recente CIPP-feature en het exacte schema hangt aan de
 * CIPP-versie; dat hier hardcoderen levert een bestand op dat stilzwijgend niet meer past.
 * cipp/baseline-stages.json is daarom ONS formaat: de indeling en de argumenten erachter,
 * één regel per standard die je in dat scherm toevoegt. Zodra het CIPP-schema vaststaat is
 * de vertaalslag één functie hieronder — zie STAGE_PLAN.
 *
 * Gebruik: node scripts/export-cipp-baseline.js [--remediate-stage1]
 */

const fs = require("fs");
const path = require("path");
const { readPrerequisites, readTemplates, collectReferences, validate } = require("./prerequisites");

const REPO_ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(REPO_ROOT, "cipp");
const GENERATOR_PATH = path.join(__dirname, "generate-baseline.js");

/**
 * De stage-indeling. De criteria staan hier één keer, zodat de vraag "waarom zit dit
 * template in stage 2" een antwoord heeft dat niet per template is opgeschreven.
 */
const STAGE_PLAN = [
  {
    stage: 1,
    name: "Kern",
    criterium: "state 'enabled' in het template en niet optioneel",
    deployState: "enabled",
    toelichting:
      "Wat de set als vanzelfsprekend beschouwt. Dit is de enige stage die met --remediate-stage1 op Remediate mag, en pas nadat New-CaPrerequisites.ps1 groen afsluit.",
  },
  {
    stage: 2,
    name: "Aanscherping",
    criterium: "state 'disabled' of report-only in het template, en niet optioneel",
    deployState: "enabledForReportingButNotEnforced",
    toelichting:
      "Deze staan niet voor niets uit (ANALYSE.md: twaalf templates die per definitie geel opleveren). Ze worden report-only uitgerold — de stap naar 'enabled' is een beslissing per klant, na het lezen van de report-only-resultaten, en geen graduatie die vanzelf gebeurt.",
  },
  {
    stage: 3,
    name: "Klantkeuze en licentie",
    criterium: "staat in OPTIONAL_TEMPLATES van generate-baseline.js",
    deployState: "enabledForReportingButNotEnforced",
    toelichting:
      "Licentiegebonden of een expliciet klantbesluit. Hoort niet automatisch te graduaten: 2130 eist een beheerd apparaat van élke beheerder, bij een MSP dus ook van elke engineer. Actie blijft Report tot iemand er ja op zegt.",
  },
];

/**
 * CHECK_ID_BY_TEMPLATE en OPTIONAL_TEMPLATES uit de broncode lezen in plaats van de module te
 * importeren — generate-baseline.js draait main() bij import en zou dan het baselinebestand
 * herschrijven. Zelfde truc, zelfde reden als leesPins() in generate-baseline.test.js.
 */
function leesGeneratorConstanten() {
  const bron = fs.readFileSync(GENERATOR_PATH, "utf8");

  const pinBlok = bron.match(/const CHECK_ID_BY_TEMPLATE = \{([\s\S]*?)\n\};/);
  if (!pinBlok) throw new Error("CHECK_ID_BY_TEMPLATE niet gevonden in generate-baseline.js");
  const pins = {};
  for (const m of pinBlok[1].matchAll(/^\s{2}(GLOBAL__[A-Za-z0-9_]+):\s*"(\d{3})",/gm)) pins[m[1]] = m[2];

  const optioneelBlok = bron.match(/const OPTIONAL_TEMPLATES = \{([\s\S]*?)\n\};/);
  if (!optioneelBlok) throw new Error("OPTIONAL_TEMPLATES niet gevonden in generate-baseline.js");
  const optioneel = {};
  for (const m of optioneelBlok[1].matchAll(/^\s{2}(GLOBAL__[A-Za-z0-9_]+):\s*\n?\s*"((?:[^"\\]|\\.)*)",/gm)) {
    optioneel[m[1]] = m[2].replace(/\\"/g, '"');
  }

  return { pins, optioneel };
}

/** Welke randvoorwaarden van dit template kan geen enkel script voor de klant invullen. */
function blokkerendeRandvoorwaarden(policy, prereq) {
  const perNaam = new Map(prereq.namedLocations.map((l) => [l.displayName, l]));
  const blokkades = [];
  const locs = policy.conditions?.locations;
  if (!locs) return blokkades;
  for (const veld of ["includeLocations", "excludeLocations"]) {
    for (const naam of locs[veld] || []) {
      const locatie = perNaam.get(naam);
      if (!locatie) continue;
      if (locatie.notCreatable) blokkades.push(`"${naam}" is niet aan te maken: ${locatie.notCreatable}`);
      else if (locatie.requiresIpRanges) blokkades.push(`"${naam}" vereist de IP-ranges van deze klant (-ServiceAccountIpRange in New-CaPrerequisites.ps1)`);
    }
  }
  return blokkades;
}

/**
 * Haalt tenant-specifieke waarden uit LocationInfo. Zonder dit rolt elke klant de
 * trusted-IP van één specifieke tenant uit — en een trusted location van iemand anders is
 * erger dan geen trusted location.
 */
function schoonLocationInfo(policy, prereq) {
  const perNaam = new Map(prereq.namedLocations.map((l) => [l.displayName, l]));
  const verwijderd = [];
  const schoon = (policy.LocationInfo || []).map((li) => {
    const locatie = perNaam.get(li.displayName);
    if (locatie?.requiresIpRanges && (li.ipRanges || []).length > 0) {
      verwijderd.push({ displayName: li.displayName, ipRanges: li.ipRanges.map((r) => r.cidrAddress) });
      return { ...li, ipRanges: [] };
    }
    return li;
  });
  return { schoon, verwijderd };
}

function main() {
  const remediateStage1 = process.argv.includes("--remediate-stage1");

  const prereq = readPrerequisites();
  const templates = readTemplates();
  const refs = collectReferences(templates);

  // Eerst de randvoorwaarden, dan pas exporteren. Een export met een ongedefinieerde
  // verwijzing is precies het bestand dat je niet wilt hebben liggen.
  const { errors, warnings } = validate(prereq, refs);
  for (const w of warnings) console.warn(`waarschuwing: ${w}`);
  if (errors.length > 0) {
    for (const e of errors) console.error(`FOUT: ${e}`);
    console.error("\nExport afgebroken: er zijn verwijzingen zonder definitie in prerequisites/ca-prerequisites.json.");
    process.exit(1);
  }

  const { pins, optioneel } = leesGeneratorConstanten();

  const importRijen = [];
  const stages = STAGE_PLAN.map((s) => ({ ...s, standards: [] }));
  const verwijderdeWaarden = [];

  for (const { file, row, policy } of templates) {
    const checkNummer = pins[file];
    if (!checkNummer) {
      console.error(`FOUT: ${file} heeft geen nummer in CHECK_ID_BY_TEMPLATE. Draai eerst generate-baseline.js — die noemt het eerstvolgende vrije nummer.`);
      process.exit(1);
    }

    const isOptioneel = Boolean(optioneel[file]);
    const stageNummer = isOptioneel ? 3 : policy.state === "enabled" ? 1 : 2;
    const stage = stages.find((s) => s.stage === stageNummer);

    const { schoon, verwijderd } = schoonLocationInfo(policy, prereq);
    if (verwijderd.length > 0) verwijderdeWaarden.push({ file, verwijderd });

    importRijen.push({
      PartitionKey: row.PartitionKey,
      RowKey: row.RowKey,
      GUID: row.GUID,
      JSON: JSON.stringify({ ...policy, LocationInfo: schoon }),
    });

    const blokkades = blokkerendeRandvoorwaarden(policy, prereq);
    const actie = blokkades.length > 0 ? "Report" : stageNummer === 1 && remediateStage1 ? "Remediate" : "Report";

    stage.standards.push({
      standard: "ConditionalAccessTemplate",
      templateGuid: row.GUID,
      templateFile: file,
      displayName: policy.displayName,
      templateState: policy.state,
      deployState: stage.deployState,
      action: actie,
      checkId: `CA-BASE-${checkNummer}`,
      ...(isOptioneel ? { optional: true, optionalReason: optioneel[file] } : {}),
      ...(blokkades.length > 0 ? { blockedUntil: blokkades } : {}),
    });
  }

  for (const stage of stages) stage.standards.sort((a, b) => a.templateFile.localeCompare(b.templateFile));

  const geblokkeerd = stages.flatMap((s) => s.standards.filter((r) => r.blockedUntil));

  const stagesBestand = {
    version: "cipp-baseline-v1.0",
    generatedAt: new Date().toISOString().slice(0, 10),
    generatedBy: "scripts/export-cipp-baseline.js",
    baselineName: "GLOBAL CA Baseline v1.0",
    _comment: [
      "ONS formaat, niet dat van CIPP — zie de kop van export-cipp-baseline.js. Elke regel in",
      "'standards' is één keer de standard 'Conditional Access Template' toevoegen in het",
      "Add Baseline-scherm, met dat template en die state.",
      "",
      "Vóór stage 1 op Remediate gaat: scripts/New-CaPrerequisites.ps1 -RequireSafeToDeploy moet",
      "groen afsluiten in de doeltenant. De groepen 'Excluded from Conditional Access' en",
      "'Licensed Users' moeten leden hebben; zonder de eerste is er geen break-glass, zonder de",
      "tweede blokkeert 1110 elke gebruiker.",
    ],
    prerequisites: {
      script: "scripts/New-CaPrerequisites.ps1",
      definition: "prerequisites/ca-prerequisites.json",
      groups: prereq.groups.map((g) => ({ displayName: g.displayName, danger: g.danger, requiresMembers: Boolean(g.requiresMembers) })),
      namedLocations: prereq.namedLocations.map((l) => ({ displayName: l.displayName, danger: l.danger, tenantSpecific: Boolean(l.tenantSpecific), notCreatable: Boolean(l.notCreatable) })),
    },
    blockedStandards: geblokkeerd.map((r) => ({ templateFile: r.templateFile, checkId: r.checkId, blockedUntil: r.blockedUntil })),
    sanitized: verwijderdeWaarden,
    stages,
  };

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, "ca-templates-import.json"), JSON.stringify(importRijen, null, 2) + "\n");
  fs.writeFileSync(path.join(OUTPUT_DIR, "baseline-stages.json"), JSON.stringify(stagesBestand, null, 2) + "\n");

  for (const stage of stages) {
    console.log(`Stage ${stage.stage} — ${stage.name}: ${stage.standards.length} standards (${stage.deployState})`);
    for (const r of stage.standards) {
      const merk = r.blockedUntil ? " [GEBLOKKEERD]" : r.optional ? " [optional]" : "";
      console.log(`  ${r.action.padEnd(9)} ${r.checkId}  ${r.templateFile}${merk}`);
    }
  }

  if (verwijderdeWaarden.length > 0) {
    console.log("\nTenant-specifieke waarden uit de export gehaald:");
    for (const { file, verwijderd } of verwijderdeWaarden) {
      for (const v of verwijderd) console.log(`  ${file}: ${v.displayName} -> ${v.ipRanges.join(", ")}`);
    }
  }

  if (geblokkeerd.length > 0) {
    console.log(`\n${geblokkeerd.length} standard(s) vastgezet op Report tot de randvoorwaarde in de doeltenant staat:`);
    for (const r of geblokkeerd) console.log(`  ${r.templateFile}: ${r.blockedUntil.join(" | ")}`);
  }

  console.log(`\nGeschreven: cipp/ca-templates-import.json (${importRijen.length} templates) en cipp/baseline-stages.json`);
  if (!remediateStage1) {
    console.log("Alle standards staan op Report. Draai met --remediate-stage1 zodra New-CaPrerequisites.ps1 groen afsluit.");
  }
}

if (require.main === module) main();

module.exports = { STAGE_PLAN, leesGeneratorConstanten };
