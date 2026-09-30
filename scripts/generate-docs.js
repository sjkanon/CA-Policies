#!/usr/bin/env node
/**
 * Generates CATemplate/README.md (and .en.md, .fr.md): every policy with who it targets, what it
 * requires, its state and the stage it lands in.
 *
 * Generated and not written by hand, for the same reason as in the IntuneBackup repo: a table of
 * 44 policies that nobody keeps up to date is worse than no table, because it still reads as if
 * it were correct. The facts come from three places, none of which is repeated here:
 *
 *   CATemplate/*.json          who, what and state
 *   CATemplate/_manifest.json  optional, and why
 *   cipp/baseline-stages.json  the stage, and whether a prerequisite pins it to Report
 *
 * Run it after export-cipp-baseline.js, because the stage comes from its output.
 *
 * Usage: node scripts/generate-docs.js [--check]
 *   --check  writes nothing and exits 1 if a README is out of date (for CI and the tests).
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "CATemplate");
const MANIFEST_PATH = path.join(TEMPLATE_DIR, "_manifest.json");
const STAGES_PATH = path.join(REPO_ROOT, "cipp", "baseline-stages.json");
const PREFIX = "CXNM__STANDARD__";

const LANGS = ["nl", "en", "fr"];
const FILE = { nl: "README.md", en: "README.en.md", fr: "README.fr.md" };

/** Vaste tekst per taal. Tekst uit de data (de 'reden' in _manifest.json) blijft Nederlands. */
const T = {
  bar: {
    nl: "**Nederlands** · [English](README.en.md) · [Français](README.fr.md)",
    en: "[Nederlands](README.md) · **English** · [Français](README.fr.md)",
    fr: "[Nederlands](README.md) · [English](README.en.md) · **Français**",
  },
  generated: "<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->",
  title: { nl: "policies", en: "policies", fr: "stratégies" },
  intro: {
    nl: [
      "De bron van deze repo: de afgesproken Conditional Access-policies in CIPP-templateformaat. Alles in",
      "`cipp/` is hieruit afgeleid. De naam is `CXNM__STANDARD__<nummer>__<BLOCK|GRANT|SESSION>__<Naam>.json`;",
      "in de tenant heet de policy `CXNM - STANDARD - <nummer> - <TYPE> - <Naam>`. Hoe je er een toevoegt staat",
      "in de [hoofd-README](../README.md#een-policy-toevoegen).",
    ],
    en: [
      "The source of this repo: the agreed Conditional Access policies in CIPP template format. Everything in",
      "`cipp/` is derived from it. The name is `CXNM__STANDARD__<number>__<BLOCK|GRANT|SESSION>__<Name>.json`;",
      "in the tenant the policy is called `CXNM - STANDARD - <number> - <TYPE> - <Name>`. How to add one is in",
      "the [main README](../README.en.md#adding-a-policy).",
    ],
    fr: [
      "La source de ce dépôt : les stratégies Conditional Access convenues au format de template CIPP. Tout ce qui",
      "se trouve dans `cipp/` en est dérivé. Le nom est `CXNM__STANDARD__<numéro>__<BLOCK|GRANT|SESSION>__<Nom>.json` ;",
      "dans le tenant, la stratégie s'appelle `CXNM - STANDARD - <numéro> - <TYPE> - <Nom>`. Comment en ajouter une",
      "figure dans le [README principal](../README.fr.md#ajouter-une-stratégie).",
    ],
  },
  summaryHead: {
    nl: "| Type | Stage 1 | Stage 2 | Stage 3 | Totaal |",
    en: "| Type | Stage 1 | Stage 2 | Stage 3 | Total |",
    fr: "| Type | Stage 1 | Stage 2 | Stage 3 | Total |",
  },
  total: { nl: "Totaal", en: "Total", fr: "Total" },
  stageExplain: {
    nl: "Stage 1 staat op `enabled`, stage 2 is voorbereid (report-only of uit), stage 3 is optioneel: een licentie of een besluit per tenant (`*` in de tabellen). De indeling staat in [`cipp/`](../cipp/README.md).",
    en: "Stage 1 is `enabled`, stage 2 is prepared (report-only or off), stage 3 is optional: a licence or a decision per tenant (`*` in the tables). The split is described in [`cipp/`](../cipp/README.en.md).",
    fr: "Le stage 1 est `enabled`, le stage 2 est préparé (report-only ou désactivé), le stage 3 est optionnel : une licence ou une décision par tenant (`*` dans les tableaux). La répartition est décrite dans [`cipp/`](../cipp/README.fr.md).",
  },
  section: {
    BLOCK: { nl: "BLOCK — 1xxx", en: "BLOCK — 1xxx", fr: "BLOCK — 1xxx" },
    GRANT: { nl: "GRANT — 2xxx", en: "GRANT — 2xxx", fr: "GRANT — 2xxx" },
    SESSION: { nl: "SESSION — 3xxx", en: "SESSION — 3xxx", fr: "SESSION — 3xxx" },
  },
  tableHead: {
    nl: "| Nr | Policy | Voor wie | Op | Eis | State | Stage |",
    en: "| No | Policy | Who | On | Requirement | State | Stage |",
    fr: "| N° | Stratégie | Pour qui | Sur | Exigence | State | Stage |",
  },
  pinned: { nl: "vast op Report", en: "pinned to Report", fr: "bloqué sur Report" },
  optionalHead: { nl: "## Waarom optioneel", en: "## Why optional", fr: "## Pourquoi optionnel" },
  optionalIntro: {
    nl: "Uit [`_manifest.json`](_manifest.json). Deze templates gaan naar stage 3 en blijven daar op Report.",
    en: "From [`_manifest.json`](_manifest.json) (the reasons are kept in Dutch). These templates go to stage 3 and stay on Report there.",
    fr: "Issu de [`_manifest.json`](_manifest.json) (les raisons sont en néerlandais). Ces templates vont au stage 3 et y restent sur Report.",
  },
  filesHead: { nl: "## Naast de templates", en: "## Next to the templates", fr: "## À côté des templates" },
  files: {
    nl: [
      "| Bestand of map | Wat het vastlegt |",
      "|---|---|",
      "| [`_manifest.json`](_manifest.json) | welke templates optioneel zijn, en waarom |",
      "| [`../prerequisites/`](../prerequisites/README.md) | de groepen, named locations en custom authentication strengths waar de templates naar verwijzen |",
      "| [`../controls/`](../controls/README.md) | per template de ISO 27001-, NIS2-, CIS- en NIST CSF-controls |",
      "| [`../authentication-methods/`](../authentication-methods/README.md) | welke aanmeldmethodes aan staan — zonder passkey is `2120` onvervulbaar |",
    ],
    en: [
      "| File or folder | What it records |",
      "|---|---|",
      "| [`_manifest.json`](_manifest.json) | which templates are optional, and why |",
      "| [`../prerequisites/`](../prerequisites/README.en.md) | the groups, named locations and custom authentication strengths the templates refer to |",
      "| [`../controls/`](../controls/README.en.md) | per template the ISO 27001, NIS2, CIS and NIST CSF controls |",
      "| [`../authentication-methods/`](../authentication-methods/README.en.md) | which sign-in methods are on — without passkeys `2120` cannot be met |",
    ],
    fr: [
      "| Fichier ou dossier | Ce qu'il consigne |",
      "|---|---|",
      "| [`_manifest.json`](_manifest.json) | quels templates sont optionnels, et pourquoi |",
      "| [`../prerequisites/`](../prerequisites/README.fr.md) | les groupes, named locations et custom authentication strengths auxquels les templates renvoient |",
      "| [`../controls/`](../controls/README.fr.md) | par template les contrôles ISO 27001, NIS2, CIS et NIST CSF |",
      "| [`../authentication-methods/`](../authentication-methods/README.fr.md) | quelles méthodes de connexion sont actives — sans passkey, `2120` est irréalisable |",
    ],
  },
  cippNote: {
    nl: "`_manifest.json` en deze README's hebben geen `displayName`; bij een repo-sync maakt CIPP er hooguit een naamloze rij van die niets doet.",
    en: "`_manifest.json` and these READMEs have no `displayName`; a repo sync in CIPP makes at most a nameless row of them that does nothing.",
    fr: "`_manifest.json` et ces README n'ont pas de `displayName` ; une synchronisation du dépôt dans CIPP en fait au plus une ligne sans nom qui ne fait rien.",
  },
};

/** Korte labels voor wat een policy raakt en eist. */
const L = {
  everyone: { nl: "iedereen", en: "everyone", fr: "tout le monde" },
  guests: { nl: "gasten", en: "guests", fr: "invités" },
  roles: { nl: (n) => `${n} beheerrollen`, en: (n) => `${n} admin roles`, fr: (n) => `${n} rôles d'admin` },
  agents: { nl: "agent- en workload-identiteiten", en: "agent and workload identities", fr: "identités d'agent et de workload" },
  allApps: { nl: "alle apps", en: "all apps", fr: "toutes les apps" },
  noApps: { nl: "geen app (lijst per tenant)", en: "no app (list per tenant)", fr: "aucune app (liste par tenant)" },
  apps: { nl: (n) => (n === 1 ? "1 app" : `${n} apps`), en: (n) => (n === 1 ? "1 app" : `${n} apps`), fr: (n) => (n === 1 ? "1 app" : `${n} apps`) },
  adminPortals: { nl: "beheerportalen", en: "admin portals", fr: "portails d'admin" },
  agentResources: { nl: "agent-resources", en: "agent resources", fr: "ressources d'agent" },
  registerSecurityInfo: { nl: "beveiligingsinfo registreren", en: "register security info", fr: "enregistrer les infos de sécurité" },
  registerDevice: { nl: "apparaat registreren", en: "register device", fr: "enregistrer un appareil" },
  block: { nl: "blokkeren", en: "block", fr: "bloquer" },
  mfa: { nl: "MFA", en: "MFA", fr: "MFA" },
  compliantDevice: { nl: "compliant apparaat", en: "compliant device", fr: "appareil conforme" },
  domainJoinedDevice: { nl: "hybrid joined apparaat", en: "hybrid joined device", fr: "appareil hybrid joined" },
  compliantApplication: { nl: "compliant app", en: "compliant app", fr: "app conforme" },
  or: { nl: " of ", en: " or ", fr: " ou " },
  and: { nl: " en ", en: " and ", fr: " et " },
  sifEvery: { nl: "elke keer opnieuw aanmelden", en: "sign in every time", fr: "reconnexion à chaque fois" },
  sif: { nl: (v, u) => `aanmelden elke ${v} ${u === "hours" ? "uur" : "dagen"}`, en: (v, u) => `sign in every ${v} ${u}`, fr: (v, u) => `connexion toutes les ${v} ${u === "hours" ? "heures" : "jours"}` },
  noPersistent: { nl: "geen blijvende browsersessie", en: "no persistent browser session", fr: "pas de session de navigateur persistante" },
  persistent: { nl: "blijvende browsersessie", en: "persistent browser session", fr: "session de navigateur persistante" },
  tokenProtection: { nl: "token protection", en: "token protection", fr: "token protection" },
  appRestrictions: { nl: "app-afgedwongen beperkingen", en: "app enforced restrictions", fr: "restrictions appliquées par l'app" },
  cae: { nl: "strikte CAE", en: "strict CAE", fr: "CAE strict" },
  mdca: { nl: "Defender for Cloud Apps", en: "Defender for Cloud Apps", fr: "Defender for Cloud Apps" },
};

const ADMIN_PORTALS = new Set(["MicrosoftAdminPortals", "797f4846-ba00-4fd7-ba43-dac1f8f63013"]);
const STATE = { enabled: "enabled", enabledForReportingButNotEnforced: "report-only", disabled: "disabled" };

function readTemplates() {
  return fs
    .readdirSync(TEMPLATE_DIR)
    .filter((f) => f.startsWith(PREFIX) && f.endsWith(".json"))
    .sort()
    .map((file) => {
      const name = file.slice(0, -".json".length);
      const [nr, type] = name.slice(PREFIX.length).split("__");
      const policy = JSON.parse(JSON.parse(fs.readFileSync(path.join(TEMPLATE_DIR, file), "utf8")).JSON);
      return { name, nr, type, policy };
    });
}

function who(p, lang) {
  const u = p.conditions.users || {};
  const parts = [];
  if ((u.includeUsers || []).includes("All")) parts.push(L.everyone[lang]);
  if ((u.includeUsers || []).includes("None") && (p.conditions.agents || p.conditions.clientApplications)) parts.push(L.agents[lang]);
  if ((u.includeRoles || []).length) parts.push(L.roles[lang](u.includeRoles.length));
  for (const g of u.includeGroups || []) parts.push("`" + g + "`");
  if (u.includeGuestsOrExternalUsers) parts.push(L.guests[lang]);
  return parts.join(", ") || "—";
}

function on(p, lang) {
  const a = p.conditions.applications || {};
  const actions = a.includeUserActions || [];
  if (actions.includes("urn:user:registersecurityinfo")) return L.registerSecurityInfo[lang];
  if (actions.includes("urn:user:registerdevice")) return L.registerDevice[lang];
  const apps = a.includeApplications || [];
  if (apps.includes("All")) return L.allApps[lang];
  if (apps.includes("None")) return L.noApps[lang];
  if (apps.includes("AllAgentIdResources")) return L.agentResources[lang];
  if (apps.length && apps.every((x) => ADMIN_PORTALS.has(x))) return L.adminPortals[lang];
  return L.apps[lang](apps.length);
}

function requirement(p, lang) {
  const parts = [];
  const g = p.grantControls;
  if (g) {
    const built = (g.builtInControls || []).map((c) => (c === "mfa" ? L.mfa[lang] : c === "block" ? L.block[lang] : L[c]?.[lang] || c));
    if (built.length) parts.push(built.join(g.operator === "AND" ? L.and[lang] : L.or[lang]));
    if (g.authenticationStrength) parts.push("`" + g.authenticationStrength.displayName + "`");
  }
  const s = p.sessionControls || {};
  if (s.signInFrequency?.isEnabled) {
    parts.push(s.signInFrequency.frequencyInterval === "everyTime" || s.signInFrequency.value == null ? L.sifEvery[lang] : L.sif[lang](s.signInFrequency.value, s.signInFrequency.type));
  }
  if (s.persistentBrowser?.isEnabled) parts.push(s.persistentBrowser.mode === "never" ? L.noPersistent[lang] : L.persistent[lang]);
  if (s.secureSignInSession?.isEnabled) parts.push(L.tokenProtection[lang]);
  if (s.applicationEnforcedRestrictions?.isEnabled) parts.push(L.appRestrictions[lang]);
  if (s.continuousAccessEvaluation?.mode) parts.push(L.cae[lang]);
  if (s.cloudAppSecurity?.isEnabled) parts.push(L.mdca[lang]);
  return parts.join(" + ") || "—";
}

function stageIndex() {
  const plan = JSON.parse(fs.readFileSync(STAGES_PATH, "utf8"));
  const byFile = new Map();
  for (const s of plan.stages) for (const r of s.standards) byFile.set(r.templateFile, { stage: s.stage, pinned: !!r.blockedUntil });
  return byFile;
}

function render(lang, templates, stages, manifest) {
  const out = [T.generated, "", T.bar[lang], "", `# CATemplate — ${templates.length} ${T.title[lang]}`, "", ...T.intro[lang], ""];

  // Samenvatting per type en stage.
  out.push(T.summaryHead[lang], "|---|---:|---:|---:|---:|");
  const totals = [0, 0, 0, 0];
  for (const type of ["BLOCK", "GRANT", "SESSION"]) {
    const row = [0, 0, 0];
    for (const t of templates.filter((x) => x.type === type)) row[stages.get(t.name).stage - 1]++;
    const sum = row.reduce((a, b) => a + b, 0);
    row.forEach((n, i) => (totals[i] += n));
    totals[3] += sum;
    out.push(`| [${type}](#${T.section[type][lang].toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/ /g, "-")}) | ${row.join(" | ")} | **${sum}** |`);
  }
  out.push(`| **${T.total[lang]}** | **${totals[0]}** | **${totals[1]}** | **${totals[2]}** | **${totals[3]}** |`, "", T.stageExplain[lang], "");

  for (const type of ["BLOCK", "GRANT", "SESSION"]) {
    out.push(`## ${T.section[type][lang]}`, "", T.tableHead[lang], "|---:|---|---|---|---|---|---|");
    for (const t of templates.filter((x) => x.type === type)) {
      const st = stages.get(t.name);
      const title = t.policy.displayName.replace(/^CXNM - STANDARD - \d+ - \w+ - /, "");
      const stage = `${st.stage}${manifest[t.name]?.optional ? "*" : ""}${st.pinned ? ` (${T.pinned[lang]})` : ""}`;
      out.push(`| ${t.nr} | [${title}](${t.name}.json) | ${who(t.policy, lang)} | ${on(t.policy, lang)} | ${requirement(t.policy, lang)} | ${STATE[t.policy.state] || t.policy.state} | ${stage} |`);
    }
    out.push("");
  }

  out.push(T.optionalHead[lang], "", T.optionalIntro[lang], "");
  for (const t of templates.filter((x) => manifest[x.name]?.optional)) out.push(`- **${t.nr}** — ${manifest[t.name].reden}`);
  out.push("", T.filesHead[lang], "", ...T.files[lang], "", T.cippNote[lang], "");
  return out.join("\n");
}

function build() {
  const templates = readTemplates();
  const stages = stageIndex();
  for (const t of templates) {
    if (!stages.has(t.name)) throw new Error(`${t.name} staat niet in cipp/baseline-stages.json — draai eerst export-cipp-baseline.js.`);
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  return Object.fromEntries(LANGS.map((lang) => [path.join(TEMPLATE_DIR, FILE[lang]), render(lang, templates, stages, manifest)]));
}

function main() {
  const check = process.argv.includes("--check");
  const files = build();
  const stale = Object.entries(files).filter(([p, s]) => !fs.existsSync(p) || fs.readFileSync(p, "utf8") !== s);
  if (check) {
    if (stale.length) {
      for (const [p] of stale) console.error(`verouderd: ${path.relative(REPO_ROOT, p)}`);
      console.error("Draai node scripts/generate-docs.js.");
      process.exit(1);
    }
    console.log(`OK — ${Object.keys(files).length} README's zijn bij.`);
    return;
  }
  for (const [p, s] of stale) fs.writeFileSync(p, s);
  console.log(`Geschreven: ${stale.length} van ${Object.keys(files).length} README's in CATemplate/.`);
}

module.exports = { build };

if (require.main === module) main();
