#!/usr/bin/env node
/**
 * Generates the documentation in CATemplate/, each in Dutch, English and French:
 *
 *   CATemplate/README.md        every policy in one table: who, what, state, stage
 *   CATemplate/<name>.md        per policy: what it does, every condition, the stage, what to
 *                               watch out for, the standards, and the Intune policies it touches
 *
 * Generated and not written by hand, for the same reason as in the IntuneBackup repo: a table of
 * 44 policies that nobody keeps up to date is worse than no table, because it still reads as if
 * it were correct. The facts come from these places, none of which is repeated here:
 *
 *   CATemplate/*.json             who, what and state
 *   CATemplate/_manifest.json     optional, and why
 *   cipp/baseline-stages.json     the stage, and whether a prerequisite pins it to Report
 *   docs/policies.json            what the policy is for, what to watch out for, which Intune
 *                                 policies it touches
 *   controls/ca-controls.json     the standards
 *
 * Run it after export-cipp-baseline.js, because the stage comes from its output.
 *
 * With the IntuneBackup repo next to this one (../IntuneBackup or ../CIPP-Templates-Intune) it
 * also checks that every Intune path in docs/policies.json exists, and that every Intune
 * compliance policy is in a group. Without it, that check is skipped — the links are written
 * either way, so the output does not depend on what is next to the repo.
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
const POLICIES_PATH = path.join(REPO_ROOT, "docs", "policies.json");
const CONTROLS_PATH = path.join(REPO_ROOT, "controls", "ca-controls.json");
const PREFIX = "CXNM__STANDARD__";

/**
 * De Intune-kant staat in een andere repo. Een relatief pad naar ../IntuneBackup werkt op GitHub
 * niet en de map heet per clone anders, dus de links gaan naar de gedeelde mirror.
 */
const INTUNE_URL = "https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/";
const INTUNE_SIBLINGS = ["IntuneBackup", "CIPP-Templates-Intune"].map((d) => path.resolve(REPO_ROOT, "..", d));

const LANGS = ["nl", "en", "fr"];
const variant = (file, lang) => (lang === "nl" ? file : file.replace(/\.md$/, `.${lang}.md`));

/** Vaste tekst per taal. Tekst uit de data (de 'reden' in _manifest.json) blijft Nederlands. */
const T = {
  bar: (file, lang) =>
    [
      lang === "nl" ? "**Nederlands**" : `[Nederlands](${variant(file, "nl")})`,
      lang === "en" ? "**English**" : `[English](${variant(file, "en")})`,
      lang === "fr" ? "**Français**" : `[Français](${variant(file, "fr")})`,
    ].join(" · "),
  generated: "<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->",
  title: { nl: "policies", en: "policies", fr: "stratégies" },
  intro: {
    nl: [
      "De bron van deze repo: de afgesproken Conditional Access-policies in CIPP-templateformaat. Alles in",
      "`cipp/` is hieruit afgeleid. De naam is `CXNM__STANDARD__<nummer>__<BLOCK|GRANT|SESSION>__<Naam>.json`;",
      "in de tenant heet de policy `CXNM - STANDARD - <nummer> - <TYPE> - <Naam>`. Hoe je er een toevoegt staat",
      "in de [hoofd-README](../README.md#een-policy-toevoegen).",
      "",
      "Elke policy heeft een eigen README naast zijn JSON: wat hij doet, waar je op moet letten, de normen,",
      "en welke Intune-policies hij raakt. Klik op de naam in de tabel.",
    ],
    en: [
      "The source of this repo: the agreed Conditional Access policies in CIPP template format. Everything in",
      "`cipp/` is derived from it. The name is `CXNM__STANDARD__<number>__<BLOCK|GRANT|SESSION>__<Name>.json`;",
      "in the tenant the policy is called `CXNM - STANDARD - <number> - <TYPE> - <Name>`. How to add one is in",
      "the [main README](../README.en.md#adding-a-policy).",
      "",
      "Every policy has its own README next to its JSON: what it does, what to watch out for, the standards,",
      "and which Intune policies it touches. Click the name in the table.",
    ],
    fr: [
      "La source de ce dépôt : les stratégies Conditional Access convenues au format de template CIPP. Tout ce qui",
      "se trouve dans `cipp/` en est dérivé. Le nom est `CXNM__STANDARD__<numéro>__<BLOCK|GRANT|SESSION>__<Nom>.json` ;",
      "dans le tenant, la stratégie s'appelle `CXNM - STANDARD - <numéro> - <TYPE> - <Nom>`. Comment en ajouter une",
      "figure dans le [README principal](../README.fr.md#ajouter-une-stratégie).",
      "",
      "Chaque stratégie a son propre README à côté de son JSON : ce qu'elle fait, les points d'attention, les normes,",
      "et les stratégies Intune qu'elle touche. Cliquez sur le nom dans le tableau.",
    ],
  },
  summaryHead: {
    nl: "| Type | Stage 1 | Stage 2 | Stage 3 | Totaal |",
    en: "| Type | Stage 1 | Stage 2 | Stage 3 | Total |",
    fr: "| Type | Stage 1 | Stage 2 | Stage 3 | Total |",
  },
  total: { nl: "Totaal", en: "Total", fr: "Total" },
  stageExplain: {
    nl: "Stage 1 staat op `enabled`, stage 2 is voorbereid (report-only of uit), stage 3 is optioneel: een licentie of een besluit per tenant (`*` in de tabellen). De indeling staat in [`cipp/`](../cipp/README.md). De kolom Intune telt de Intune-policies waar een policy van afhangt.",
    en: "Stage 1 is `enabled`, stage 2 is prepared (report-only or off), stage 3 is optional: a licence or a decision per tenant (`*` in the tables). The split is described in [`cipp/`](../cipp/README.en.md). The Intune column counts the Intune policies a policy depends on.",
    fr: "Le stage 1 est `enabled`, le stage 2 est préparé (report-only ou désactivé), le stage 3 est optionnel : une licence ou une décision par tenant (`*` dans les tableaux). La répartition est décrite dans [`cipp/`](../cipp/README.fr.md). La colonne Intune compte les stratégies Intune dont dépend une stratégie.",
  },
  section: {
    BLOCK: { nl: "BLOCK — 1xxx", en: "BLOCK — 1xxx", fr: "BLOCK — 1xxx" },
    GRANT: { nl: "GRANT — 2xxx", en: "GRANT — 2xxx", fr: "GRANT — 2xxx" },
    SESSION: { nl: "SESSION — 3xxx", en: "SESSION — 3xxx", fr: "SESSION — 3xxx" },
  },
  tableHead: {
    nl: "| Nr | Policy | Voor wie | Op | Eis | State | Stage | Intune |",
    en: "| No | Policy | Who | On | Requirement | State | Stage | Intune |",
    fr: "| N° | Stratégie | Pour qui | Sur | Exigence | State | Stage | Intune |",
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
      "| [`../docs/policies.json`](../docs/policies.json) | per template wat hij doet, waar je op let en welke Intune-policies hij raakt — de bron van de README per policy |",
      "| [`../prerequisites/`](../prerequisites/README.md) | de groepen, named locations en custom authentication strengths waar de templates naar verwijzen |",
      "| [`../controls/`](../controls/README.md) | per template de ISO 27001-, NIS2-, CIS- en NIST CSF-controls |",
      "| [`../authentication-methods/`](../authentication-methods/README.md) | welke aanmeldmethodes aan staan — zonder passkey is `2120` onvervulbaar |",
    ],
    en: [
      "| File or folder | What it records |",
      "|---|---|",
      "| [`_manifest.json`](_manifest.json) | which templates are optional, and why |",
      "| [`../docs/policies.json`](../docs/policies.json) | per template what it does, what to watch out for and which Intune policies it touches — the source of the per-policy README |",
      "| [`../prerequisites/`](../prerequisites/README.en.md) | the groups, named locations and custom authentication strengths the templates refer to |",
      "| [`../controls/`](../controls/README.en.md) | per template the ISO 27001, NIS2, CIS and NIST CSF controls |",
      "| [`../authentication-methods/`](../authentication-methods/README.en.md) | which sign-in methods are on — without passkeys `2120` cannot be met |",
    ],
    fr: [
      "| Fichier ou dossier | Ce qu'il consigne |",
      "|---|---|",
      "| [`_manifest.json`](_manifest.json) | quels templates sont optionnels, et pourquoi |",
      "| [`../docs/policies.json`](../docs/policies.json) | par template ce qu'il fait, les points d'attention et les stratégies Intune qu'il touche — la source du README par stratégie |",
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

/** Vaste tekst van de README per policy. */
const P = {
  type: { nl: "Type", en: "Type", fr: "Type" },
  stage: { nl: "Stage", en: "Stage", fr: "Stage" },
  optional: { nl: "optioneel", en: "optional", fr: "optionnel" },
  who: { nl: "Voor wie", en: "Who", fr: "Pour qui" },
  excluded: { nl: "Uitgesloten", en: "Excluded", fr: "Exclus" },
  on: { nl: "Op", en: "On", fr: "Sur" },
  except: { nl: "behalve", en: "except", fr: "sauf" },
  conditions: { nl: "Voorwaarden", en: "Conditions", fr: "Conditions" },
  requirement: { nl: "Eis", en: "Requirement", fr: "Exigence" },
  file: { nl: "Bestand", en: "File", fr: "Fichier" },
  optionalWhy: { nl: "Optioneel", en: "Optional", fr: "Optionnel" },
  watchHead: { nl: "## Let op", en: "## Watch out", fr: "## Points d'attention" },
  intuneHead: { nl: "## Raakt Intune", en: "## Touches Intune", fr: "## Touche Intune" },
  intuneIntro: {
    nl: "Deze policy hangt af van Intune-policies in de [IntuneBackup-repo](" + INTUNE_URL.replace(/blob\/main\/$/, "") + "). Bij elke policy daar staat de koppeling omgekeerd.",
    en: "This policy depends on Intune policies in the [IntuneBackup repo](" + INTUNE_URL.replace(/blob\/main\/$/, "") + "). Each policy there shows the link the other way round.",
    fr: "Cette stratégie dépend de stratégies Intune du [dépôt IntuneBackup](" + INTUNE_URL.replace(/blob\/main\/$/, "") + "). Chaque stratégie y affiche le lien en sens inverse.",
  },
  intuneNone: {
    nl: "Geen Intune-policy waar deze policy van afhangt.",
    en: "No Intune policy this policy depends on.",
    fr: "Aucune stratégie Intune dont dépend cette stratégie.",
  },
  platform: { nl: "Platform", en: "Platform", fr: "Plateforme" },
  policies: { nl: "Intune-policies", en: "Intune policies", fr: "Stratégies Intune" },
  standardsHead: { nl: "## Normen", en: "## Standards", fr: "## Normes" },
  standardsHeadRow: { nl: "| Kader | Controls |", en: "| Framework | Controls |", fr: "| Référentiel | Mesures |" },
  standardsNote: {
    nl: `Uit [\`controls/ca-controls.json\`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](${INTUNE_URL}docs/COMPLIANCE.md) in de IntuneBackup-repo.`,
    en: `From [\`controls/ca-controls.json\`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](${INTUNE_URL}docs/COMPLIANCE.en.md) in the IntuneBackup repo.`,
    fr: `Issu de [\`controls/ca-controls.json\`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](${INTUNE_URL}docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.`,
  },
  prereq: {
    nl: "Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.",
    en: "Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.",
    fr: "Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.",
  },
  back: {
    nl: "Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)",
    en: "Back to the [overview](README.en.md) · [main README](../README.en.md)",
    fr: "Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)",
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

/** Labels voor de voorwaarden in de README per policy. */
const C = {
  clients: { nl: "Clients", en: "Clients", fr: "Clients" },
  client: {
    browser: { nl: "browser", en: "browser", fr: "navigateur" },
    mobileAppsAndDesktopClients: { nl: "mobiele apps en desktopclients", en: "mobile apps and desktop clients", fr: "apps mobiles et clients de bureau" },
    exchangeActiveSync: { nl: "Exchange ActiveSync", en: "Exchange ActiveSync", fr: "Exchange ActiveSync" },
    other: { nl: "overige legacy clients", en: "other legacy clients", fr: "autres clients legacy" },
  },
  platforms: { nl: "Platform", en: "Platform", fr: "Plateforme" },
  allBut: { nl: "alle behalve", en: "all except", fr: "toutes sauf" },
  locations: { nl: "Locatie", en: "Location", fr: "Emplacement" },
  allLocations: { nl: "alle locaties", en: "all locations", fr: "tous les emplacements" },
  allTrusted: { nl: "alle vertrouwde locaties", en: "all trusted locations", fr: "tous les emplacements de confiance" },
  signInRisk: { nl: "Aanmeldrisico", en: "Sign-in risk", fr: "Risque de connexion" },
  userRisk: { nl: "Gebruikersrisico", en: "User risk", fr: "Risque utilisateur" },
  spRisk: { nl: "Risico workload-identiteit", en: "Workload identity risk", fr: "Risque d'identité de workload" },
  agentRisk: { nl: "Risico agent", en: "Agent risk", fr: "Risque d'agent" },
  agentContext: { nl: "Agent-context", en: "Agent context", fr: "Contexte d'agent" },
  flows: { nl: "Aanmeldflow", en: "Authentication flow", fr: "Flux d'authentification" },
  deviceFilter: { nl: "Apparaatfilter", en: "Device filter", fr: "Filtre d'appareil" },
  filterMode: { include: { nl: "alleen", en: "only", fr: "uniquement" }, exclude: { nl: "niet op", en: "not on", fr: "pas sur" } },
  none: { nl: "geen — alleen wie, op welke app", en: "none — only who, on which app", fr: "aucune — seulement qui, sur quelle app" },
  users: { nl: (n) => `${n} gebruiker(s)`, en: (n) => `${n} user(s)`, fr: (n) => `${n} utilisateur(s)` },
};

const ADMIN_PORTALS = new Set(["MicrosoftAdminPortals", "797f4846-ba00-4fd7-ba43-dac1f8f63013"]);
const STATE = { enabled: "enabled", enabledForReportingButNotEnforced: "report-only", disabled: "disabled" };
const FRAMEWORKS = [
  ["iso", "ISO/IEC 27001:2022"],
  ["nis2", "NIS2 art. 21(2)"],
  ["cis", "CIS Controls v8.1"],
  ["nistcsf", "NIST CSF 2.0"],
];
const PLATFORM_LABEL = { WIN: "Windows", MAC: "macOS", IOS: "iOS/iPadOS", AND: "Android" };

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const code = (s) => "`" + s + "`";
const esc = (s) => String(s).replace(/\|/g, "\\|");

function readTemplates() {
  return fs
    .readdirSync(TEMPLATE_DIR)
    .filter((f) => f.startsWith(PREFIX) && f.endsWith(".json"))
    .sort()
    .map((file) => {
      const name = file.slice(0, -".json".length);
      const [nr, type] = name.slice(PREFIX.length).split("__");
      const policy = JSON.parse(readJson(path.join(TEMPLATE_DIR, file)).JSON);
      return { name, nr, type, policy };
    });
}

function who(p, lang) {
  const u = p.conditions.users || {};
  const parts = [];
  if ((u.includeUsers || []).includes("All")) parts.push(L.everyone[lang]);
  if ((u.includeUsers || []).includes("None") && (p.conditions.agents || p.conditions.clientApplications)) parts.push(L.agents[lang]);
  if ((u.includeRoles || []).length) parts.push(L.roles[lang](u.includeRoles.length));
  for (const g of u.includeGroups || []) parts.push(code(g));
  if (u.includeGuestsOrExternalUsers) parts.push(L.guests[lang]);
  return parts.join(", ") || "—";
}

function excluded(p, lang) {
  const u = p.conditions.users || {};
  const parts = (u.excludeGroups || []).map(code);
  if ((u.excludeRoles || []).length) parts.push(L.roles[lang](u.excludeRoles.length));
  if ((u.excludeUsers || []).length) parts.push(C.users[lang](u.excludeUsers.length));
  if (u.excludeGuestsOrExternalUsers) parts.push(L.guests[lang]);
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

/** De app-id's die in de templates voorkomen. Een GUID alleen zegt een lezer niets. */
const APP_NAMES = {
  "0000000a-0000-0000-c000-000000000000": "Microsoft Intune",
  "d4ebce55-015a-49b5-a083-c84d1797ae8c": "Microsoft Intune Enrollment",
  "00000002-0000-0ff1-ce00-000000000000": "Exchange Online",
  "00000003-0000-0ff1-ce00-000000000000": "SharePoint Online",
  "797f4846-ba00-4fd7-ba43-dac1f8f63013": "Azure Service Management API",
  "2793995e-0a7d-40d7-bd35-6968ba142197": "My Apps",
  "0af06dc6-e4b5-4f28-818e-e78e62d137a5": "Windows 365",
  "a4a365df-50f1-4397-bc59-1a1564b8bb9c": "Microsoft Remote Desktop",
  MicrosoftAdminPortals: "Microsoft Admin Portals",
  Office365: "Office 365",
};
const app = (id) => (APP_NAMES[id] && APP_NAMES[id] !== id ? `${APP_NAMES[id]} (${code(id)})` : code(id));

/** De apps achter `on()`, met de uitzonderingen: in de README per policy telt elke app. */
function onDetail(p, lang) {
  const a = p.conditions.applications || {};
  const apps = a.includeApplications || [];
  const listed = apps.length && !["All", "None", "AllAgentIdResources"].some((x) => apps.includes(x)) ? `: ${apps.map(app).join(", ")}` : "";
  const ex = (a.excludeApplications || []).length ? `, ${P.except[lang]} ${a.excludeApplications.map(app).join(", ")}` : "";
  return on(p, lang) + listed + ex;
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

/** Alles in `conditions` behalve wie en welke app — die staan al in hun eigen rij. */
function conditions(p, lang) {
  const c = p.conditions;
  const out = [];
  const types = c.clientAppTypes || [];
  if (types.length && !types.includes("all")) out.push(`${C.clients[lang]}: ${types.map((t) => C.client[t]?.[lang] || t).join(", ")}`);
  if (c.platforms) {
    const inc = c.platforms.includePlatforms || [];
    const exc = c.platforms.excludePlatforms || [];
    out.push(`${C.platforms[lang]}: ${inc.includes("all") ? C.allBut[lang] + " " + exc.join(", ") : inc.join(", ") + (exc.length ? `, ${P.except[lang]} ${exc.join(", ")}` : "")}`);
  }
  if (c.locations) {
    const name = (l) => (l === "All" ? C.allLocations[lang] : l === "AllTrusted" ? C.allTrusted[lang] : code(l));
    const inc = (c.locations.includeLocations || []).map(name).join(", ");
    const exc = (c.locations.excludeLocations || []).map(name).join(", ");
    out.push(`${C.locations[lang]}: ${inc}${exc ? `, ${P.except[lang]} ${exc}` : ""}`);
  }
  if ((c.signInRiskLevels || []).length) out.push(`${C.signInRisk[lang]}: ${c.signInRiskLevels.join(", ")}`);
  if ((c.userRiskLevels || []).length) out.push(`${C.userRisk[lang]}: ${c.userRiskLevels.join(", ")}`);
  if ((c.servicePrincipalRiskLevels || []).length) out.push(`${C.spRisk[lang]}: ${c.servicePrincipalRiskLevels.join(", ")}`);
  if (c.agentIdRiskLevels) out.push(`${C.agentRisk[lang]}: ${String(c.agentIdRiskLevels).split(",").join(", ")}`);
  if (c.agentContext?.includeAgentContexts?.length) out.push(`${C.agentContext[lang]}: ${c.agentContext.includeAgentContexts.map(code).join(", ")}`);
  if (c.authenticationFlows?.transferMethods) out.push(`${C.flows[lang]}: ${c.authenticationFlows.transferMethods.split(",").map(code).join(", ")}`);
  if (c.devices?.deviceFilter) out.push(`${C.deviceFilter[lang]}: ${C.filterMode[c.devices.deviceFilter.mode]?.[lang] || c.devices.deviceFilter.mode} ${code(c.devices.deviceFilter.rule)}`);
  return out.length ? out.map(esc).join("<br>") : C.none[lang];
}

function stageIndex() {
  const plan = readJson(STAGES_PATH);
  const byFile = new Map();
  for (const s of plan.stages) for (const r of s.standards) byFile.set(r.templateFile, { stage: s.stage, pinned: !!r.blockedUntil });
  return byFile;
}

function stageLabel(t, ctx, lang) {
  const st = ctx.stages.get(t.name);
  return `${st.stage}${ctx.manifest[t.name]?.optional ? "*" : ""}${st.pinned ? ` (${T.pinned[lang]})` : ""}`;
}

/** `WIN/CompliancePolicies/Baseline_WIN_U_Compliance_TPM` -> `WIN - U - Compliance TPM`. */
function intuneLabel(target) {
  const [plat, scope, ...rest] = path.posix.basename(target).replace(/^Baseline_/, "").split("_");
  return `${plat} - ${scope} - ${rest.join(" ")}`;
}

/** De Intune-paden van één koppeling, met @groep uitgeklapt. Volgorde blijft, dubbelen gaan eruit. */
function expand(targets, groups) {
  const out = [];
  for (const t of targets) for (const x of t.startsWith("@") ? groups[t.slice(1)] : [t]) if (!out.includes(x)) out.push(x);
  return out;
}

/** Alle Intune-paden waar een CA-policy van afhangt. */
function intuneTargets(entry, groups) {
  return expand((entry.intune || []).flatMap((l) => l.targets), groups);
}

function intuneSection(entry, ctx, lang) {
  if (!(entry.intune || []).length) return [P.intuneHead[lang], "", P.intuneNone[lang], ""];
  const out = [P.intuneHead[lang], "", P.intuneIntro[lang], ""];
  for (const link of entry.intune) {
    const targets = expand(link.targets, ctx.groups);
    out.push(link.waarom[lang], "", `| ${P.platform[lang]} | ${P.policies[lang]} |`, "|---|---|");
    for (const plat of Object.keys(PLATFORM_LABEL)) {
      const list = targets.filter((x) => x.startsWith(plat + "/"));
      if (list.length) out.push(`| ${PLATFORM_LABEL[plat]} | ${list.map((x) => `[${intuneLabel(x)}](${INTUNE_URL}IntuneTemplate/${variant(x + ".md", lang)})`).join("<br>")} |`);
    }
    out.push("");
  }
  return out;
}

function standardsSection(controls, lang) {
  const rows = FRAMEWORKS.filter(([k]) => (controls?.[k] || []).length).map(
    ([k, label]) => `| ${label} | ${controls[k].map((c) => esc(k === "cis" ? c.replace(/^CIS Controls v8\.1 /, "") : c)).join("<br>")} |`
  );
  if (!rows.length) return [];
  return [P.standardsHead[lang], "", P.standardsHeadRow[lang], "|---|---|", ...rows, "", P.standardsNote[lang], ""];
}

function policyDocument(lang, t, ctx) {
  const entry = ctx.policies[t.name];
  const p = t.policy;
  const out = [
    T.generated,
    "",
    T.bar(`${t.name}.md`, lang),
    "",
    `# ${p.displayName}`,
    "",
    entry.doel[lang],
    "",
    "| | |",
    "|---|---|",
    `| ${P.type[lang]} | ${t.type} |`,
    `| State | ${STATE[p.state] || p.state} |`,
    `| ${P.stage[lang]} | ${stageLabel(t, ctx, lang)} |`,
    `| ${P.who[lang]} | ${who(p, lang)} |`,
    `| ${P.excluded[lang]} | ${excluded(p, lang)} |`,
    `| ${P.on[lang]} | ${onDetail(p, lang)} |`,
    `| ${P.conditions[lang]} | ${conditions(p, lang)} |`,
    `| ${P.requirement[lang]} | ${requirement(p, lang)} |`,
    `| ${P.file[lang]} | [\`${t.name}.json\`](${t.name}.json) |`,
    "",
    P.prereq[lang],
    "",
  ];
  if (ctx.manifest[t.name]?.optional) out.push(`> **${P.optionalWhy[lang]}** — ${ctx.manifest[t.name].reden}`, "");
  if ((entry.letOp || []).length) out.push(P.watchHead[lang], "", ...entry.letOp.map((x) => `- ${x[lang]}`), "");
  out.push(...intuneSection(entry, ctx, lang), ...standardsSection(ctx.controls[t.name], lang), "---", "", P.back[lang], "");
  return out.join("\n");
}

function overview(lang, ctx) {
  const { templates } = ctx;
  const out = [T.generated, "", T.bar("README.md", lang), "", `# CATemplate — ${templates.length} ${T.title[lang]}`, "", ...T.intro[lang], ""];

  // Samenvatting per type en stage.
  out.push(T.summaryHead[lang], "|---|---:|---:|---:|---:|");
  const totals = [0, 0, 0, 0];
  for (const type of ["BLOCK", "GRANT", "SESSION"]) {
    const row = [0, 0, 0];
    for (const t of templates.filter((x) => x.type === type)) row[ctx.stages.get(t.name).stage - 1]++;
    const sum = row.reduce((a, b) => a + b, 0);
    row.forEach((n, i) => (totals[i] += n));
    totals[3] += sum;
    out.push(`| [${type}](#${T.section[type][lang].toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/ /g, "-")}) | ${row.join(" | ")} | **${sum}** |`);
  }
  out.push(`| **${T.total[lang]}** | **${totals[0]}** | **${totals[1]}** | **${totals[2]}** | **${totals[3]}** |`, "", T.stageExplain[lang], "");

  for (const type of ["BLOCK", "GRANT", "SESSION"]) {
    out.push(`## ${T.section[type][lang]}`, "", T.tableHead[lang], "|---:|---|---|---|---|---|---|---:|");
    for (const t of templates.filter((x) => x.type === type)) {
      const title = t.policy.displayName.replace(/^CXNM - STANDARD - \d+ - \w+ - /, "");
      const n = intuneTargets(ctx.policies[t.name], ctx.groups).length;
      out.push(`| ${t.nr} | [${title}](${variant(`${t.name}.md`, lang)}) | ${who(t.policy, lang)} | ${on(t.policy, lang)} | ${requirement(t.policy, lang)} | ${STATE[t.policy.state] || t.policy.state} | ${stageLabel(t, ctx, lang)} | ${n || "—"} |`);
    }
    out.push("");
  }

  out.push(T.optionalHead[lang], "", T.optionalIntro[lang], "");
  for (const t of templates.filter((x) => ctx.manifest[x.name]?.optional)) out.push(`- **${t.nr}** — ${ctx.manifest[t.name].reden}`);
  out.push("", T.filesHead[lang], "", ...T.files[lang], "", T.cippNote[lang], "");
  return out.join("\n");
}

/**
 * docs/policies.json tegen de templates. Faalt hard: een policy zonder doel krijgt een README die
 * alleen techniek toont, en een koppeling naar een groep die niet bestaat valt stil weg.
 */
function validate(templates, data) {
  const errors = [];
  const names = new Set(templates.map((t) => t.name));
  const groups = data.groepen || {};
  const hasAll = (o) => o && LANGS.every((l) => typeof o[l] === "string" && o[l].trim());
  for (const t of templates) {
    const e = data.policies[t.name];
    if (!e) {
      errors.push(`${t.name} staat niet in docs/policies.json`);
      continue;
    }
    if (!hasAll(e.doel)) errors.push(`${t.name}: doel ontbreekt in nl, en of fr`);
    for (const [i, x] of (e.letOp || []).entries()) if (!hasAll(x)) errors.push(`${t.name}: letOp[${i}] ontbreekt in nl, en of fr`);
    for (const [i, link] of (e.intune || []).entries()) {
      if (!hasAll(link.waarom)) errors.push(`${t.name}: intune[${i}].waarom ontbreekt in nl, en of fr`);
      if (!(link.targets || []).length) errors.push(`${t.name}: intune[${i}] heeft geen targets`);
      for (const x of link.targets || []) {
        if (x.startsWith("@") && !groups[x.slice(1)]) errors.push(`${t.name}: groep ${x} bestaat niet`);
        if (!x.startsWith("@") && !/^(WIN|MAC|IOS|AND)\/[A-Za-z]+\/Baseline_\w+$/.test(x)) errors.push(`${t.name}: ${x} is geen pad onder IntuneTemplate/`);
      }
    }
  }
  for (const k of Object.keys(data.policies)) if (!names.has(k)) errors.push(`docs/policies.json noemt ${k}, maar dat template bestaat niet`);
  return errors;
}

/** Alleen met de IntuneBackup-repo ernaast: bestaan de paden, en staat elke compliance-policy in een groep? */
function validateIntune(data) {
  const root = INTUNE_SIBLINGS.find((d) => fs.existsSync(path.join(d, "IntuneTemplate")));
  if (!root) return { root: null, errors: [] };
  const dir = path.join(root, "IntuneTemplate");
  const errors = [];
  const used = new Set([...Object.values(data.groepen || {}).flat(), ...Object.values(data.policies).flatMap((e) => (e.intune || []).flatMap((l) => l.targets))]);
  for (const x of used) if (!x.startsWith("@") && !fs.existsSync(path.join(dir, x + ".json"))) errors.push(`Intune-pad bestaat niet: IntuneTemplate/${x}.json`);
  const grouped = new Set(Object.values(data.groepen || {}).flat());
  for (const plat of Object.keys(PLATFORM_LABEL)) {
    const cdir = path.join(dir, plat, "CompliancePolicies");
    if (!fs.existsSync(cdir)) continue;
    for (const f of fs.readdirSync(cdir).filter((f) => f.endsWith(".json"))) {
      const x = `${plat}/CompliancePolicies/${f.slice(0, -5)}`;
      if (!grouped.has(x)) errors.push(`compliance-policy ${x} staat in geen groep in docs/policies.json — een compliant-eis leunt er wel op`);
    }
  }
  return { root, errors };
}

function build() {
  const templates = readTemplates();
  const stages = stageIndex();
  for (const t of templates) {
    if (!stages.has(t.name)) throw new Error(`${t.name} staat niet in cipp/baseline-stages.json — draai eerst export-cipp-baseline.js.`);
  }
  const data = readJson(POLICIES_PATH);
  const errors = validate(templates, data);
  if (errors.length) throw new Error(`docs/policies.json klopt niet:\n  ${errors.join("\n  ")}`);
  const ctx = {
    templates,
    stages,
    manifest: readJson(MANIFEST_PATH),
    policies: data.policies,
    groups: data.groepen || {},
    controls: readJson(CONTROLS_PATH),
  };
  const files = {};
  for (const lang of LANGS) {
    files[path.join(TEMPLATE_DIR, variant("README.md", lang))] = overview(lang, ctx);
    for (const t of templates) files[path.join(TEMPLATE_DIR, variant(`${t.name}.md`, lang))] = policyDocument(lang, t, ctx);
  }
  return files;
}

/**
 * Of een README op schijf gelijk is aan wat de generator maakt. Regeleinden tellen niet mee: met
 * core.autocrlf op Windows staat een ingecheckte LF-README als CRLF op schijf, en dat is geen
 * verouderde README.
 */
function isBij(pad, verwacht) {
  return fs.existsSync(pad) && fs.readFileSync(pad, "utf8").replace(/\r\n/g, "\n") === verwacht;
}

function main() {
  const check = process.argv.includes("--check");
  const intune = validateIntune(readJson(POLICIES_PATH));
  if (intune.errors.length) {
    console.error(`Tegen ${path.basename(intune.root)}:\n  ${intune.errors.join("\n  ")}`);
    process.exit(1);
  }
  const files = build();
  const stale = Object.entries(files).filter(([p, s]) => !isBij(p, s));
  // Een README per policy waarvan het template weg is, blijft anders als wees staan.
  const orphans = fs
    .readdirSync(TEMPLATE_DIR)
    .filter((f) => f.startsWith(PREFIX) && f.endsWith(".md"))
    .map((f) => path.join(TEMPLATE_DIR, f))
    .filter((p) => !(p in files));
  if (check) {
    if (stale.length || orphans.length) {
      for (const [p] of stale) console.error(`verouderd: ${path.relative(REPO_ROOT, p)}`);
      for (const p of orphans) console.error(`wees: ${path.relative(REPO_ROOT, p)}`);
      console.error("Draai node scripts/generate-docs.js.");
      process.exit(1);
    }
    console.log(`OK — ${Object.keys(files).length} README's zijn bij${intune.root ? `, Intune-paden getoetst tegen ${path.basename(intune.root)}` : ""}.`);
    return;
  }
  for (const [p, s] of stale) fs.writeFileSync(p, s);
  for (const p of orphans) fs.unlinkSync(p);
  console.log(`Geschreven: ${stale.length} van ${Object.keys(files).length} README's in CATemplate/${orphans.length ? `, ${orphans.length} wees verwijderd` : ""}.`);
  if (!intune.root) console.log("Geen IntuneBackup-repo ernaast: de Intune-paden zijn niet getoetst.");
}

module.exports = { build, isBij, validate, intuneTargets, POLICIES_PATH };

if (require.main === module) main();
