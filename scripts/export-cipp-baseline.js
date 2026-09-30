#!/usr/bin/env node
/**
 * Generates, from CATemplate/CXNM__STANDARD__*.json, the two files needed to deploy this set as a
 * CIPP baseline:
 *
 *   cipp/ca-templates-import.json   the templates in CIPP's CATemplate table shape, ready to
 *                                   import. One row per template, GUID unchanged.
 *   cipp/baseline-stages.json       which template belongs in which stage, with which state and
 *                                   which action, plus what blocks that deployment.
 *
 * The stage split follows metadata the repo already has: `state` in the template, and
 * `optional` in CATemplate/_manifest.json. See STAGE_PLAN below.
 *
 * A deployment that misses its prerequisites locks a tenant out: an exclusion group that does
 * not exist excludes nobody. That is why this script calls scripts/prerequisites.js and stops
 * hard on an error, and why every template that refers to a tenant-specific or non-creatable
 * prerequisite is pinned to `action: "Report"` here — also with --remediate-stage1.
 *
 * ===================== WHAT IS NOT IN IT, AND WHY =====================
 *
 * Not the payload that CIPP's Baselines screen stores itself. Staged baselines with graduation
 * conditions are a recent CIPP feature and the exact schema depends on the CIPP version;
 * hardcoding it here would produce a file that silently stops fitting.
 * cipp/baseline-stages.json is therefore OUR format: the split and the reasoning behind it, one
 * entry per standard you add in that screen. Once the CIPP schema is settled, the translation
 * is one function below — see STAGE_PLAN.
 *
 * Usage: node scripts/export-cipp-baseline.js [--remediate-stage1 [--accept-new]]
 *
 *   --remediate-stage1  set stage 1 to Remediate. Refuses as long as templates are new in
 *                       stage 1 compared with the previous export; --accept-new confirms them.
 */

const fs = require("fs");
const path = require("path");
const { readPrerequisites, readTemplates, collectReferences, validate } = require("./prerequisites");

const REPO_ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(REPO_ROOT, "cipp");
const MANIFEST_PATH = path.join(REPO_ROOT, "CATemplate", "_manifest.json");

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
      "Deze staan niet voor niets uit (docs/ANALYSE.md, 'Wat er stuk is aan de set zelf', punt 2). Ze worden report-only uitgerold — de stap naar 'enabled' is een beslissing per tenant, na het lezen van de report-only-resultaten, en geen graduatie die vanzelf gebeurt.",
  },
  {
    stage: 3,
    name: "Tenantkeuze en licentie",
    criterium: "optional: true in CATemplate/_manifest.json",
    deployState: "enabledForReportingButNotEnforced",
    toelichting:
      "Licentiegebonden of een expliciet besluit per tenant. Hoort niet automatisch te graduaten: 2130 eist een beheerd apparaat van élke beheerder, bij uitbesteed beheer dus ook van elke engineer. Actie blijft Report tot iemand er ja op zegt.",
  },
];

/**
 * De optionele templates uit CATemplate/_manifest.json: { <bestandsnaam zonder .json>: reden }.
 * Faalt op een sleutel zonder template en op optional zonder reden — een hernoemd template zou
 * anders stil uit stage 3 in stage 1 vallen, en een reden is wat iemand in CIPP leest.
 */
function leesOptioneel(manifestPad = MANIFEST_PATH, templateNamen = null) {
  if (!fs.existsSync(manifestPad)) throw new Error(`${manifestPad} ontbreekt.`);
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPad, "utf8"));
  } catch (fout) {
    throw new Error(`${manifestPad} is niet te lezen als JSON (${fout.message}).`);
  }
  const bestaand = templateNamen ? new Set(templateNamen) : null;
  const optioneel = {};
  const fouten = [];
  for (const [sleutel, waarde] of Object.entries(manifest)) {
    if (sleutel.startsWith("_")) continue;
    const naam = sleutel.replace(/\.json$/, "");
    if (bestaand && !bestaand.has(naam)) fouten.push(`${naam} staat in _manifest.json maar niet in CATemplate/ — hernoemd of verwijderd?`);
    if (!waarde || typeof waarde.optional !== "boolean") fouten.push(`${naam}: 'optional' moet true of false zijn.`);
    else if (waarde.optional && !(typeof waarde.reden === "string" && waarde.reden.trim())) fouten.push(`${naam}: optional zonder 'reden'.`);
    else if (waarde.optional) optioneel[naam] = waarde.reden.trim();
  }
  if (fouten.length > 0) throw new Error(`CATemplate/_manifest.json klopt niet:\n  ${fouten.join("\n  ")}`);
  return optioneel;
}

/** Welke randvoorwaarden van dit template kan geen enkel script voor de tenant invullen. */
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
      else if (locatie.requiresIpRanges) blokkades.push(`"${naam}" vereist de IP-ranges van deze tenant (-ServiceAccountIpRange in New-CaPrerequisites.ps1)`);
      else if (locatie.requiresCountries) blokkades.push(`"${naam}" vereist de landenlijst van deze tenant (-AllowedCountry in New-CaPrerequisites.ps1)`);
    }
  }
  return blokkades;
}

/**
 * Haalt tenant-specifieke waarden uit LocationInfo. Zonder dit krijgt elke tenant de
 * trusted-IP van één specifieke tenant — en een trusted location van iemand anders is
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

  const optioneel = leesOptioneel(MANIFEST_PATH, templates.map((t) => t.file));

  const importRijen = [];
  const stages = STAGE_PLAN.map((s) => ({ ...s, standards: [] }));
  const verwijderdeWaarden = [];

  for (const { file, row, policy } of templates) {
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
      ...(isOptioneel ? { optional: true, optionalReason: optioneel[file] } : {}),
      ...(blokkades.length > 0 ? { blockedUntil: blokkades } : {}),
    });
  }

  for (const stage of stages) stage.standards.sort((a, b) => a.templateFile.localeCompare(b.templateFile));

  // ------------------------------------------------ vergelijking met de vorige export ----
  //
  // Stage 1 wordt afgeleid uit `state: enabled`, en dat betekent dat een nieuw template met
  // die state er vanzelf in valt. Zonder deze rem zou de eerstvolgende --remediate-stage1
  // dat template afdwingen in elke tenant, zonder dat iemand die stap heeft gezet: de
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
        "stage 1, zet het template op 'disabled' (stage 2) of op optional in CATemplate/_manifest.json (stage 3)."
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
    baselineName: "CXNM - STANDARD CA Baseline v1.0",
    _comment: [
      "ONS formaat, niet dat van CIPP — zie de kop van export-cipp-baseline.js. Elke regel in",
      "'standards' is één keer de standard 'Conditional Access Template' toevoegen in het",
      "Add Baseline-scherm, met dat template en die state.",
      "",
      "Vóór stage 1 op Remediate gaat: scripts/New-CaPrerequisites.ps1 -RequireSafeToDeploy moet",
      "groen afsluiten in de doeltenant. De groepen 'Excluded from Conditional Access',",
      "'SG-U-CA-Exclude-Breakglass' en 'Licensed Users' moeten leden hebben; zonder de eerste",
      "twee — één break-glass-uitsluiting onder twee namen, allebei in dezelfde 38 templates —",
      "is er geen break-glass, zonder de derde blokkeert 1110 elke gebruiker.",
    ],
    prerequisites: {
      script: "scripts/New-CaPrerequisites.ps1",
      definition: "prerequisites/ca-prerequisites.json",
      groups: prereq.groups.map((g) => ({ displayName: g.displayName, danger: g.danger, requiresMembers: Boolean(g.requiresMembers) })),
      namedLocations: prereq.namedLocations.map((l) => ({ displayName: l.displayName, danger: l.danger, tenantSpecific: Boolean(l.tenantSpecific), notCreatable: Boolean(l.notCreatable) })),
    },
    blockedStandards: geblokkeerd.map((r) => ({ templateFile: r.templateFile, blockedUntil: r.blockedUntil })),
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
      console.log(`  ${r.action.padEnd(9)} ${r.templateFile}${merk}`);
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

module.exports = { STAGE_PLAN, leesOptioneel, leesVorigPlan, vergelijkMetVorigPlan, stapSamenvatting };
