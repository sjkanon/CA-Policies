#!/usr/bin/env node
/**
 * Zet de rauwe Conditional Access-policy-exports in CATemplate/GLOBAL__*.json om naar
 * baseline/conditional-access/baseline-v1.0.json in het BaselineRule-schema van TEST
 * Policies Platform (packages/shared/src/caBaseline.ts), zodat de bestaande
 * baseline-koppeling (TPPBaselineSource) deze categorie kan lezen.
 *
 * Eén rule per GLOBAL__*.json-bestand, type "ca-policy-match". excludeUsers/includeUsers
 * (individuele gebruikers) tellen bewust niet mee. excludeGroups/includeGroups staan hier
 * op naam (bv. "Excluded from Conditional Access") — TPPBaselineEngine.psm1's
 * Test-CaPolicyMatch resolvet de live policy's group-GUID's naar displayName (Get-MgGroup)
 * vóór het vergelijken. Rollen (excludeRoles/includeRoles) tellen ook mee: dat zijn
 * Entra's ingebouwde directory-rol-GUID's, overal hetzelfde, geen resolutie nodig.
 *
 * Herbruikbaar: opnieuw draaien na een wijziging in CATemplate/ regenereert het bestand
 * deterministisch.
 *
 * Gebruik: node scripts/generate-baseline.js
 * (vanuit de root van deze repo; verwacht CATemplate/ naast scripts/)
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "CATemplate");
const OUTPUT_PATH = path.join(REPO_ROOT, "baseline", "conditional-access", "baseline-v1.0.json");

/**
 * De 8 checks die vandaag al in sjkanon/Platform staan. Zodra deze repo de
 * conditional-access-bron wordt, stopt Platform's eigen baseline/ca-policies/
 * baseline-v1.0.json als bron voor die categorie — zonder deze kopie zouden ze
 * stilzwijgend verdwijnen. Overgenomen 2026-08-10, checkIds 001-008.
 */
const EXISTING_RULES = [
  { checkId: "CA-ITCE-Baseline-001-MFAAllUsers", severity: "critical", tags: ["conditional-access", "mfa"], type: "mfa-all-users", what: "Is MFA verplicht voor alle gebruikers, met een expliciete break-glass-uitzondering?", why: "Een actief MFA-vereiste is de belangrijkste enkele maatregel tegen account-overname via gelekte wachtwoorden; zonder break-glass-uitzondering loopt de tenant risico op een volledige lock-out.", source: "MCSB IM-1 / CIS Microsoft 365 Foundations Benchmark 1.1 / buildplan sectie 6.1", remediationScript: "Import-Module Microsoft.Graph.Identity.SignIns\n\n# Vervang door de object-id's van de break-glass-groep (sectie 6.2: nooit zonder uitzondering).\n$breakGlassGroupId = '<object-id-van-break-glass-security-group>'\n\n$params = @{\n    DisplayName = 'CA-ITCE-Baseline-001-MFAAllUsers'\n    State       = 'enabledForReportingButNotEnforced'  # eerst report-only (buildplan sectie 6.2), pas na validatie op 'enabled'\n    Conditions  = @{\n        Users = @{\n            IncludeUsers = @('All')\n            ExcludeGroups = @($breakGlassGroupId)\n        }\n        Applications = @{ IncludeApplications = @('All') }\n    }\n    GrantControls = @{\n        Operator = 'OR'\n        BuiltInControls = @('mfa')\n    }\n}\nNew-MgIdentityConditionalAccessPolicy -BodyParameter $params", learnMoreLinks: [{ label: "Common Conditional Access policy: Require MFA for all users", url: "https://learn.microsoft.com/entra/identity/conditional-access/policy-all-users-mfa-strength" }, { label: "Report-only mode in Conditional Access", url: "https://learn.microsoft.com/entra/identity/conditional-access/concept-conditional-access-report-only" }] },
  { checkId: "CA-ITCE-Baseline-002-BlockLegacyAuth", severity: "critical", tags: ["conditional-access", "legacy-auth"], type: "block-legacy-auth", what: "Is legacy authentication (basic auth, geen moderne auth-stack) geblokkeerd voor alle gebruikers?", why: "Legacy auth-protocollen ondersteunen geen MFA en zijn een bekend pad voor password-spray-aanvallen.", source: "MCSB IM-2 / CIS Microsoft 365 Foundations Benchmark 1.2 / buildplan sectie 6.1", remediationScript: "Import-Module Microsoft.Graph.Identity.SignIns\n\n$params = @{\n    DisplayName = 'CA-ITCE-Baseline-002-BlockLegacyAuth'\n    State       = 'enabledForReportingButNotEnforced'  # eerst report-only, controleer sign-in-logs op legitiem legacy-verkeer\n    Conditions  = @{\n        Users = @{ IncludeUsers = @('All') }\n        Applications = @{ IncludeApplications = @('All') }\n        ClientAppTypes = @('exchangeActiveSync', 'other')\n    }\n    GrantControls = @{\n        Operator = 'OR'\n        BuiltInControls = @('block')\n    }\n}\nNew-MgIdentityConditionalAccessPolicy -BodyParameter $params", learnMoreLinks: [{ label: "Block legacy authentication with Conditional Access", url: "https://learn.microsoft.com/entra/identity/conditional-access/policy-block-legacy-authentication" }] },
  { checkId: "CA-ITCE-Baseline-003-DeviceComplianceSensitiveApps", severity: "high", tags: ["conditional-access", "device-compliance"], type: "device-compliance-sensitive-apps", what: "Is device compliance of hybrid-join vereist voor toegang tot gevoelige applicaties?", why: "Voorkomt dat bedrijfsdata toegankelijk is vanaf onbeheerde, mogelijk gecompromitteerde apparaten.", source: "MCSB IM-6 / Microsoft Intune Security Baselines / buildplan sectie 6.1, 7.1", optional: true, remediationScript: "Import-Module Microsoft.Graph.Identity.SignIns\n\n# Vervang door de app-id('s) van de gevoelige applicatie(s) voor deze klant.\n$sensitiveAppIds = @('<application-id-1>')\n\n$params = @{\n    DisplayName = 'CA-ITCE-Baseline-003-DeviceComplianceSensitiveApps'\n    State       = 'enabledForReportingButNotEnforced'\n    Conditions  = @{\n        Users = @{ IncludeUsers = @('All') }\n        Applications = @{ IncludeApplications = $sensitiveAppIds }\n    }\n    GrantControls = @{\n        Operator = 'OR'\n        BuiltInControls = @('compliantDevice', 'domainJoinedDevice')\n    }\n}\nNew-MgIdentityConditionalAccessPolicy -BodyParameter $params", learnMoreLinks: [{ label: "Require compliant devices with Conditional Access", url: "https://learn.microsoft.com/entra/identity/conditional-access/howto-conditional-access-policy-compliant-device" }] },
  { checkId: "CA-ITCE-Baseline-004-SigninRiskPolicy", severity: "high", tags: ["conditional-access", "identity-protection"], type: "signin-risk-policy", what: "Is er een sign-in risk-policy actief (indien Entra ID P2 aanwezig)?", why: "Detecteert en blokkeert aanmeldpogingen die Entra ID Protection als risicovol classificeert, bovenop een statische MFA-vereiste.", source: "MCSB IM-3 / buildplan sectie 6.1", optional: true, params: { requiresEntraIdP2: true }, remediationScript: "Import-Module Microsoft.Graph.Identity.SignIns\n\n# Vereist Entra ID P2 — controleer eerst de licentie van deze klant.\n$params = @{\n    DisplayName = 'CA-ITCE-Baseline-004-SigninRiskPolicy'\n    State       = 'enabledForReportingButNotEnforced'\n    Conditions  = @{\n        Users = @{ IncludeUsers = @('All') }\n        Applications = @{ IncludeApplications = @('All') }\n        SignInRiskLevels = @('high', 'medium')\n    }\n    GrantControls = @{\n        Operator = 'OR'\n        BuiltInControls = @('mfa')\n    }\n}\nNew-MgIdentityConditionalAccessPolicy -BodyParameter $params", learnMoreLinks: [{ label: "Common Conditional Access policy: Sign-in risk-based", url: "https://learn.microsoft.com/entra/identity/conditional-access/policy-risk-based-sign-in" }] },
  { checkId: "CA-ITCE-Baseline-005-UserRiskPolicy", severity: "high", tags: ["conditional-access", "identity-protection"], type: "user-risk-policy", what: "Is er een user risk-policy actief (indien Entra ID P2 aanwezig)?", why: "Dwingt een wachtwoordwijziging af bij accounts die als gecompromitteerd worden ingeschat, in plaats van alleen de losse sign-in te blokkeren.", source: "MCSB IM-3 / buildplan sectie 6.1", optional: true, params: { requiresEntraIdP2: true }, remediationScript: "Import-Module Microsoft.Graph.Identity.SignIns\n\n# Vereist Entra ID P2 — controleer eerst de licentie van deze klant.\n$params = @{\n    DisplayName = 'CA-ITCE-Baseline-005-UserRiskPolicy'\n    State       = 'enabledForReportingButNotEnforced'\n    Conditions  = @{\n        Users = @{ IncludeUsers = @('All') }\n        Applications = @{ IncludeApplications = @('All') }\n        UserRiskLevels = @('high')\n    }\n    GrantControls = @{\n        Operator = 'AND'\n        BuiltInControls = @('mfa', 'passwordChange')\n    }\n}\nNew-MgIdentityConditionalAccessPolicy -BodyParameter $params", learnMoreLinks: [{ label: "Common Conditional Access policy: User risk-based password change", url: "https://learn.microsoft.com/entra/identity/conditional-access/policy-risk-user-change-password" }] },
  { checkId: "CA-ITCE-Baseline-006-LocationRestriction", severity: "medium", tags: ["conditional-access", "network"], type: "location-restriction", what: "Zijn er locatie- of IP-gebaseerde restricties geconfigureerd waar relevant voor deze klant?", why: "Beperkt het aanvalsoppervlak voor tenants met een bekende, beperkte set toegangslocaties (bv. alleen NL/BE-kantoren).", source: "buildplan sectie 6.1 — nadrukkelijk per klant afwegen, niet universeel", optional: true, remediationScript: "Import-Module Microsoft.Graph.Identity.SignIns\n\n# Stap 1: named location aanmaken met de bekende, vertrouwde IP-ranges van deze klant.\n$namedLocation = @{\n    '@odata.type' = '#microsoft.graph.ipNamedLocation'\n    DisplayName   = 'Vertrouwde kantoorlocaties'\n    IsTrusted     = $true\n    IpRanges      = @(@{ '@odata.type' = '#microsoft.graph.iPv4CidrRange'; CidrAddress = '<klant-ip-range>/32' })\n}\n$location = New-MgIdentityConditionalAccessNamedLocation -BodyParameter $namedLocation\n\n# Stap 2: CA-policy die toegang buiten deze locaties blokkeert (report-only eerst).\n$params = @{\n    DisplayName = 'CA-ITCE-Baseline-006-LocationRestriction'\n    State       = 'enabledForReportingButNotEnforced'\n    Conditions  = @{\n        Users = @{ IncludeUsers = @('All') }\n        Applications = @{ IncludeApplications = @('All') }\n        Locations = @{ IncludeLocations = @('All'); ExcludeLocations = @($location.Id) }\n    }\n    GrantControls = @{ Operator = 'OR'; BuiltInControls = @('block') }\n}\nNew-MgIdentityConditionalAccessPolicy -BodyParameter $params", learnMoreLinks: [{ label: "Conditional Access: Block access by location", url: "https://learn.microsoft.com/entra/identity/conditional-access/howto-conditional-access-policy-location" }] },
  { checkId: "CA-ITCE-Baseline-007-SessionControls", severity: "medium", tags: ["conditional-access", "session-control"], type: "session-controls", what: "Zijn session controls (sign-in frequency, persistent browser session uit) geconfigureerd voor gedeelde/onbeheerde devices?", why: "Voorkomt dat een sessie op een gedeeld of onbeheerd apparaat onbeperkt geldig blijft nadat de gebruiker is weggelopen.", source: "MCSB IM-1 / buildplan sectie 6.1", params: { maxSignInFrequencyHours: 12, persistentBrowserSessionAllowedForUnmanagedDevices: false }, remediationScript: "Import-Module Microsoft.Graph.Identity.SignIns\n\n$params = @{\n    DisplayName = 'CA-ITCE-Baseline-007-SessionControls'\n    State       = 'enabledForReportingButNotEnforced'\n    Conditions  = @{\n        Users = @{ IncludeUsers = @('All') }\n        Applications = @{ IncludeApplications = @('All') }\n    }\n    GrantControls = @{ Operator = 'OR'; BuiltInControls = @('mfa') }\n    SessionControls = @{\n        SignInFrequency   = @{ IsEnabled = $true; Type = 'hours'; Value = 12 }\n        PersistentBrowser  = @{ IsEnabled = $true; Mode = 'never' }\n    }\n}\nNew-MgIdentityConditionalAccessPolicy -BodyParameter $params", learnMoreLinks: [{ label: "Configure authentication session management with Conditional Access", url: "https://learn.microsoft.com/entra/identity/conditional-access/howto-conditional-access-session-lifetime" }] },
  { checkId: "CA-ITCE-Baseline-008-BreakGlassExclusion", severity: "critical", tags: ["conditional-access", "break-glass"], type: "break-glass-exclusion", what: "Zijn break-glass accounts uitgesloten van alle Conditional Access-policies?", why: "Een break-glass account dat zelf binnen scope van een CA-policy valt kan bij een storing of MFA-probleem ook zelf buitengesloten raken, met een volledige tenant-lock-out als risico.", source: "ITCE CA-baseline sectie 6.1 / community-referentie j0eyv/ConditionalAccessBaseline", remediationScript: "Import-Module Microsoft.Graph.Identity.SignIns\n\n# Vervang door de daadwerkelijke break-glass-UPN('s)/groeps-id.\n$breakGlassGroupId = '<object-id-van-break-glass-security-group>'\n\n# Voeg de break-glass-groep toe aan de exclude-lijst van ELKE actieve policy — dit\n# script toont het patroon per policy, in de praktijk over alle policies heen herhalen.\n$policies = Get-MgIdentityConditionalAccessPolicy -All | Where-Object State -eq 'enabled'\nforeach ($policy in $policies) {\n    $excludeGroups = @($policy.Conditions.Users.ExcludeGroups) + $breakGlassGroupId | Select-Object -Unique\n    Update-MgIdentityConditionalAccessPolicy -ConditionalAccessPolicyId $policy.Id -Conditions @{\n        Users = @{ ExcludeGroups = $excludeGroups }\n    }\n}", learnMoreLinks: [{ label: "Manage emergency access (break-glass) accounts", url: "https://learn.microsoft.com/entra/identity/role-based-access-control/security-emergency-access" }] },
];

/** GLOBAL__NNNN__TYPE__Naam.json -> { number, group, name }. */
function parseFileName(baseName) {
  const m = baseName.match(/^GLOBAL__(\d+)__([A-Z]+)__(.+)$/);
  if (!m) return null;
  return { number: m[1], group: m[2], name: m[3] };
}

function slugToPascalCase(name) {
  return name
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

const SEVERITY_BY_GROUP = { BLOCK: "high", GRANT: "high", SESSION: "medium" };

/** Named location uit LocationInfo -> CaPolicyLocationRef (packages/shared/src/caBaseline.ts). */
function toLocationRef(name, locationInfo) {
  if (name === "All" || name === "AllTrusted" || name === "None") {
    return { kind: "sentinel", value: name };
  }
  const info = (locationInfo || []).find((l) => l.displayName === name);
  if (!info) return { kind: "sentinel", value: name }; // onbekende naam: als sentinel bewaren, niet crashen
  if (info["@odata.type"] === "#microsoft.graph.countryNamedLocation") {
    return {
      kind: "country",
      countriesAndRegions: info.countriesAndRegions || [],
      includeUnknownCountriesAndRegions: !!info.includeUnknownCountriesAndRegions,
    };
  }
  if (info["@odata.type"] === "#microsoft.graph.ipNamedLocation") {
    return {
      kind: "ip",
      ipRanges: (info.ipRanges || []).map((r) => r.cidrAddress),
      isTrusted: !!info.isTrusted,
    };
  }
  return { kind: "sentinel", value: name };
}

/** Verwijdert null-waarden op het eerste niveau — sessionControls/grantControls hebben veel ongebruikte sleutels. */
function stripNulls(obj) {
  if (!obj || typeof obj !== "object") return obj;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) continue;
    if (k.endsWith("@odata.context")) continue;
    out[k] = v;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function extractParams(policy) {
  const c = policy.conditions || {};
  const params = {};

  if (c.clientAppTypes && c.clientAppTypes.length > 0) params.clientAppTypes = c.clientAppTypes;
  if (c.userRiskLevels && c.userRiskLevels.length > 0) params.userRiskLevels = c.userRiskLevels;
  if (c.signInRiskLevels && c.signInRiskLevels.length > 0) params.signInRiskLevels = c.signInRiskLevels;

  if (c.platforms) {
    const platforms = stripNulls(c.platforms);
    if (platforms) params.platforms = platforms;
  }

  if (c.applications) {
    const apps = {};
    if (c.applications.includeApplications && c.applications.includeApplications.length > 0) apps.includeApplications = c.applications.includeApplications;
    if (c.applications.excludeApplications && c.applications.excludeApplications.length > 0) apps.excludeApplications = c.applications.excludeApplications;
    if (c.applications.includeUserActions && c.applications.includeUserActions.length > 0) apps.includeUserActions = c.applications.includeUserActions;
    if (Object.keys(apps).length > 0) params.applications = apps;
  }

  if (c.users) {
    const roles = {};
    if (c.users.includeRoles && c.users.includeRoles.length > 0) roles.includeRoles = c.users.includeRoles;
    if (c.users.excludeRoles && c.users.excludeRoles.length > 0) roles.excludeRoles = c.users.excludeRoles;
    if (Object.keys(roles).length > 0) params.roles = roles;

    // Groepen staan in het exportbestand al op naam (bv. "Excluded from Conditional
    // Access") — de engine resolvet de live policy's group-GUID's naar displayName vóór
    // het vergelijken (Get-MgGroup), dus hier gewoon de namen doorgeven.
    const groups = {};
    if (c.users.includeGroups && c.users.includeGroups.length > 0) groups.includeGroups = c.users.includeGroups;
    if (c.users.excludeGroups && c.users.excludeGroups.length > 0) groups.excludeGroups = c.users.excludeGroups;
    if (Object.keys(groups).length > 0) params.groups = groups;
  }

  if (c.locations) {
    const locations = {};
    if (c.locations.includeLocations && c.locations.includeLocations.length > 0) {
      locations.includeLocations = c.locations.includeLocations.map((n) => toLocationRef(n, policy.LocationInfo));
    }
    if (c.locations.excludeLocations && c.locations.excludeLocations.length > 0) {
      locations.excludeLocations = c.locations.excludeLocations.map((n) => toLocationRef(n, policy.LocationInfo));
    }
    if (Object.keys(locations).length > 0) params.locations = locations;
  }

  if (policy.grantControls) {
    const gc = {};
    if (policy.grantControls.operator) gc.operator = policy.grantControls.operator;
    if (policy.grantControls.builtInControls && policy.grantControls.builtInControls.length > 0) gc.builtInControls = policy.grantControls.builtInControls;
    if (policy.grantControls.authenticationStrength && policy.grantControls.authenticationStrength.id) {
      gc.authenticationStrengthId = policy.grantControls.authenticationStrength.id;
    }
    if (Object.keys(gc).length > 0) params.grantControls = gc;
  }

  const sessionControls = stripNulls(policy.sessionControls);
  if (sessionControls) params.sessionControls = sessionControls;

  return params;
}

function convertTemplateFile(filePath, checkNumber) {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const policy = JSON.parse(raw.JSON);

  const baseName = path.basename(filePath, ".json");
  const parsed = parseFileName(baseName);
  const pascalName = parsed ? slugToPascalCase(parsed.name) : slugToPascalCase(baseName);
  const checkId = `CA-ITCE-Baseline-${String(checkNumber).padStart(3, "0")}-${pascalName}`;
  const severity = (parsed && SEVERITY_BY_GROUP[parsed.group]) || "medium";
  const params = extractParams(policy);

  return {
    rule: {
      checkId,
      severity,
      tags: ["conditional-access", "ca-policy-match", parsed ? parsed.group.toLowerCase() : "unknown"],
      type: "ca-policy-match",
      what: `Bevat de tenant een Conditional Access-policy die overeenkomt met de afgesproken baseline-policy "${policy.displayName || baseName}"?`,
      why: "Onderdeel van de tussen ITCE en de klant afgesproken CA-baseline (bron: CA-Policies/CATemplate). Groepsuitsluitingen tellen mee (op naam, na resolutie in de klanttenant); individuele gebruikersuitsluitingen bewust niet — dat is per klant een eigen invulling.",
      source: `CA-Policies/CATemplate/${baseName}.json (afgesproken baseline)`,
      params,
      learnMoreLinks: [{ label: "Conditional Access policies overview", url: "https://learn.microsoft.com/entra/identity/conditional-access/overview" }],
    },
    settingCount: Object.keys(params).length,
  };
}

function main() {
  if (!fs.existsSync(TEMPLATE_DIR)) {
    console.error(`CATemplate/ niet gevonden op ${TEMPLATE_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(TEMPLATE_DIR)
    .filter((f) => f.startsWith("GLOBAL__") && f.endsWith(".json"))
    .sort();

  if (files.length === 0) {
    console.error("Geen GLOBAL__*.json-bestanden gevonden in CATemplate/");
    process.exit(1);
  }

  const generatedRules = [];
  let checkNumber = EXISTING_RULES.length + 1;

  for (const file of files) {
    const filePath = path.join(TEMPLATE_DIR, file);
    const { rule, settingCount } = convertTemplateFile(filePath, checkNumber);
    if (settingCount === 0) {
      console.error(`FOUT: ${file} leverde geen vergelijkbare velden op — wordt overgeslagen, controleer handmatig.`);
      continue;
    }
    generatedRules.push(rule);
    console.log(`${rule.checkId} <- ${file} (${settingCount} veldgroepen)`);
    checkNumber += 1;
  }

  const output = {
    category: "conditional-access",
    version: "baseline-v1.0",
    reviewedAt: new Date().toISOString().slice(0, 10),
    rules: [...EXISTING_RULES, ...generatedRules],
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n");
  console.log(`\nGeschreven: ${OUTPUT_PATH} (${output.rules.length} rules: ${EXISTING_RULES.length} bestaand + ${generatedRules.length} nieuw)`);
}

main();
