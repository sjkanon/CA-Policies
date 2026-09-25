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
 * Gebruik: node scripts/export-cipp-baseline.js [--remediate-stage1 [--accept-new]]
 *
 * --remediate-stage1  zet stage 1 op Remediate. Weigert zolang er templates nieuw in stage 1
 *                     staan ten opzichte van de vorige export; --accept-new bevestigt die.
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
      else if (locatie.requiresCountries) blokkades.push(`"${naam}" vereist de landenlijst van deze klant (-AllowedCountry in New-CaPrerequisites.ps1)`);
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

/**
 * De vorige stage-indeling, of null als er nog geen is. Een onleesbaar bestand is géén
 * "null": dan zou de vergelijking hieronder stilzwijgend overslaan, en dat is precies de
 * controle waar --remediate-stage1 op leunt.
 */
function leesVorigPlan(pad) {
  if (!fs.existsSync(pad)) return null;
  try {
    return JSON.parse(fs.readFileSync(pad, "utf8"));
  } catch (fout) {
    throw new Error(`${pad} is niet te lezen als JSON (${fout.message}). Herstel of verwijder het bestand — zonder vergelijkbare vorige indeling kan dit script niet zien welke standards er nieuw bij komen.`);
  }
}

/** Wat er verschoven is ten opzichte van de vorige indeling. */
function vergelijkMetVorigPlan(vorig, stages) {
  const nu = new Map();
  for (const s of stages) for (const r of s.standards) nu.set(r.templateFile, s.stage);

  const toen = new Map();
  for (const s of vorig?.stages || []) for (const r of s.standards) toen.set(r.templateFile, s.stage);

  const nieuw = [];
  const verplaatst = [];
  const verdwenen = [];

  for (const [templateFile, stage] of nu) {
    if (!toen.has(templateFile)) nieuw.push({ templateFile, stage });
    else if (toen.get(templateFile) !== stage) verplaatst.push({ templateFile, van: toen.get(templateFile), naar: stage });
  }
  for (const [templateFile, stage] of toen) {
    if (!nu.has(templateFile)) verdwenen.push({ templateFile, stage });
  }

  const opNaam = (a, b) => a.templateFile.localeCompare(b.templateFile);
  return { nieuw: nieuw.sort(opNaam), verplaatst: verplaatst.sort(opNaam), verdwenen: verdwenen.sort(opNaam), eersteExport: vorig === null };
}

/** Regels voor de Actions-samenvatting, zodat een CI-run laat zien wat er verschoof. */
function stapSamenvatting(wijzigingen) {
  if (wijzigingen.eersteExport) return null;
  const regels = [];
  for (const n of wijzigingen.nieuw) regels.push(`- **nieuw** in stage ${n.stage}: \`${n.templateFile}\``);
  for (const v of wijzigingen.verplaatst) regels.push(`- **verplaatst** van stage ${v.van} naar ${v.naar}: \`${v.templateFile}\``);
  for (const w of wijzigingen.verdwenen) regels.push(`- **weg** uit stage ${w.stage}: \`${w.templateFile}\``);
  if (regels.length === 0) return null;
  return ["## CIPP-baseline: wijzigingen in de stage-indeling", "", ...regels, ""].join("\n");
}

function main() {
  const remediateStage1 = process.argv.includes("--remediate-stage1");
  const accepteerNieuw = process.argv.includes("--accept-new");

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

    stage.standards.push({
      standard: "ConditionalAccessTemplate",
      templateGuid: row.GUID,
      templateFile: file,
      displayName: policy.displayName,
      templateState: policy.state,
      deployState: stage.deployState,
      // Iedereen begint op Report. Stage 1 gaat pas om ná de vergelijking met de vorige
      // indeling hieronder — anders zou een template dat vandaag is toegevoegd meteen
      // afgedwongen worden, zonder dat iemand die beslissing genomen heeft.
      action: "Report",
      checkId: `CA-BASE-${checkNummer}`,
      ...(isOptioneel ? { optional: true, optionalReason: optioneel[file] } : {}),
      ...(blokkades.length > 0 ? { blockedUntil: blokkades } : {}),
    });
  }

  for (const stage of stages) stage.standards.sort((a, b) => a.templateFile.localeCompare(b.templateFile));

  // ------------------------------------------------ vergelijking met de vorige export ----
  //
  // Stage 1 wordt afgeleid uit `state: enabled`, en dat betekent dat een nieuw template met
  // die state er vanzelf in valt. Zonder deze rem zou de eerstvolgende --remediate-stage1
  // dat template afdwingen bij elke klant, zonder dat iemand die stap heeft gezet: de
  // beslissing "dit hoort tot de kern" zou samenvallen met "ik heb een bestand toegevoegd".
  const stagesPad = path.join(OUTPUT_DIR, "baseline-stages.json");
  const wijzigingen = vergelijkMetVorigPlan(leesVorigPlan(stagesPad), stages);
  const nieuwInStage1 = wijzigingen.nieuw.filter((n) => n.stage === 1);

  if (!wijzigingen.eersteExport) {
    for (const n of wijzigingen.nieuw) console.log(`nieuw in stage ${n.stage}: ${n.templateFile}`);
    for (const v of wijzigingen.verplaatst) console.log(`verplaatst van stage ${v.van} naar ${v.naar}: ${v.templateFile}`);
    for (const w of wijzigingen.verdwenen) console.log(`weg uit stage ${w.stage}: ${w.templateFile}`);
  }

  if (remediateStage1 && nieuwInStage1.length > 0 && !accepteerNieuw) {
    console.error(`\nFOUT: ${nieuwInStage1.length} template(s) komen nieuw in stage 1:`);
    for (const n of nieuwInStage1) console.error(`  ${n.templateFile}`);
    console.error(
      "\nStage 1 wordt afgedwongen. Deze zijn er sinds de vorige export bij gekomen omdat hun\n" +
        "template op 'enabled' staat, niet omdat iemand besloten heeft dat ze tot de kern horen.\n" +
        "Kijk ernaar, en bevestig dan met --remediate-stage1 --accept-new. Hoort er iets niet in\n" +
        "stage 1, zet het template op 'disabled' (stage 2) of in OPTIONAL_TEMPLATES (stage 3)."
    );
    process.exit(1);
  }

  if (remediateStage1) {
    for (const r of stages.find((s) => s.stage === 1).standards) {
      if (!r.blockedUntil) r.action = "Remediate";
    }
    if (wijzigingen.eersteExport) {
      console.log("Eerste export: geen vorige indeling om mee te vergelijken, dus alles in stage 1 gaat op Remediate.");
    }
  }

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
      "groen afsluiten in de doeltenant. De groepen 'Excluded from Conditional Access',",
      "'SG-U-CA-Exclude-Breakglass' en 'Licensed Users' moeten leden hebben; zonder de eerste",
      "twee — één break-glass-uitsluiting onder twee namen, allebei in dezelfde 35 templates —",
      "is er geen break-glass, zonder de derde blokkeert 1110 elke gebruiker.",
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
  fs.writeFileSync(stagesPad, JSON.stringify(stagesBestand, null, 2) + "\n");

  // De wijzigingen staan bewust NIET in het bestand: dan zou een tweede run zonder
  // templatewijziging alsnog een diff opleveren (hij vergelijkt dan met zichzelf), en is het
  // bestand geen zuivere functie meer van CATemplate/. In CI komen ze in de runsamenvatting.
  const samenvatting = stapSamenvatting(wijzigingen);
  if (samenvatting && process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, samenvatting + "\n");
  }

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

module.exports = { STAGE_PLAN, leesGeneratorConstanten, leesVorigPlan, vergelijkMetVorigPlan, stapSamenvatting };
