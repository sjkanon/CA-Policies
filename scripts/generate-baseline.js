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
  { checkId: "CA-BASE-001-MFAAllUsers", severity: "critical", tags: ["conditional-access", "mfa"], type: "mfa-all-users", what: "Is MFA verplicht voor alle gebruikers, met een expliciete break-glass-uitzondering?", why: "Een actief MFA-vereiste is de belangrijkste enkele maatregel tegen account-overname via gelekte wachtwoorden; zonder break-glass-uitzondering loopt de tenant risico op een volledige lock-out.", source: "MCSB IM-1 / CIS Microsoft 365 Foundations Benchmark 1.1 / buildplan sectie 6.1", remediationScript: "Import-Module Microsoft.Graph.Identity.SignIns\n\n# Vervang door de object-id's van de break-glass-groep (sectie 6.2: nooit zonder uitzondering).\n$breakGlassGroupId = '<object-id-van-break-glass-security-group>'\n\n$params = @{\n    DisplayName = 'CA-BASE-001-MFAAllUsers'\n    State       = 'enabledForReportingButNotEnforced'  # eerst report-only (buildplan sectie 6.2), pas na validatie op 'enabled'\n    Conditions  = @{\n        Users = @{\n            IncludeUsers = @('All')\n            ExcludeGroups = @($breakGlassGroupId)\n        }\n        Applications = @{ IncludeApplications = @('All') }\n    }\n    GrantControls = @{\n        Operator = 'OR'\n        BuiltInControls = @('mfa')\n    }\n}\nNew-MgIdentityConditionalAccessPolicy -BodyParameter $params", learnMoreLinks: [{ label: "Common Conditional Access policy: Require MFA for all users", url: "https://learn.microsoft.com/entra/identity/conditional-access/policy-all-users-mfa-strength" }, { label: "Report-only mode in Conditional Access", url: "https://learn.microsoft.com/entra/identity/conditional-access/concept-conditional-access-report-only" }] },
  { checkId: "CA-BASE-002-BlockLegacyAuth", severity: "critical", tags: ["conditional-access", "legacy-auth"], type: "block-legacy-auth", what: "Is legacy authentication (basic auth, geen moderne auth-stack) geblokkeerd voor alle gebruikers?", why: "Legacy auth-protocollen ondersteunen geen MFA en zijn een bekend pad voor password-spray-aanvallen.", source: "MCSB IM-2 / CIS Microsoft 365 Foundations Benchmark 1.2 / buildplan sectie 6.1", remediationScript: "Import-Module Microsoft.Graph.Identity.SignIns\n\n$params = @{\n    DisplayName = 'CA-BASE-002-BlockLegacyAuth'\n    State       = 'enabledForReportingButNotEnforced'  # eerst report-only, controleer sign-in-logs op legitiem legacy-verkeer\n    Conditions  = @{\n        Users = @{ IncludeUsers = @('All') }\n        Applications = @{ IncludeApplications = @('All') }\n        ClientAppTypes = @('exchangeActiveSync', 'other')\n    }\n    GrantControls = @{\n        Operator = 'OR'\n        BuiltInControls = @('block')\n    }\n}\nNew-MgIdentityConditionalAccessPolicy -BodyParameter $params", learnMoreLinks: [{ label: "Block legacy authentication with Conditional Access", url: "https://learn.microsoft.com/entra/identity/conditional-access/policy-block-legacy-authentication" }] },
  { checkId: "CA-BASE-003-DeviceComplianceSensitiveApps", severity: "high", tags: ["conditional-access", "device-compliance"], type: "device-compliance-sensitive-apps", what: "Is device compliance of hybrid-join vereist voor toegang tot gevoelige applicaties?", why: "Voorkomt dat bedrijfsdata toegankelijk is vanaf onbeheerde, mogelijk gecompromitteerde apparaten.", source: "MCSB IM-6 / Microsoft Intune Security Baselines / buildplan sectie 6.1, 7.1", optional: true, remediationScript: "Import-Module Microsoft.Graph.Identity.SignIns\n\n# Vervang door de app-id('s) van de gevoelige applicatie(s) voor deze klant.\n$sensitiveAppIds = @('<application-id-1>')\n\n$params = @{\n    DisplayName = 'CA-BASE-003-DeviceComplianceSensitiveApps'\n    State       = 'enabledForReportingButNotEnforced'\n    Conditions  = @{\n        Users = @{ IncludeUsers = @('All') }\n        Applications = @{ IncludeApplications = $sensitiveAppIds }\n    }\n    GrantControls = @{\n        Operator = 'OR'\n        BuiltInControls = @('compliantDevice', 'domainJoinedDevice')\n    }\n}\nNew-MgIdentityConditionalAccessPolicy -BodyParameter $params", learnMoreLinks: [{ label: "Require compliant devices with Conditional Access", url: "https://learn.microsoft.com/entra/identity/conditional-access/howto-conditional-access-policy-compliant-device" }] },
  { checkId: "CA-BASE-004-SigninRiskPolicy", severity: "high", tags: ["conditional-access", "identity-protection"], type: "signin-risk-policy", what: "Is er een sign-in risk-policy actief (indien Entra ID P2 aanwezig)?", why: "Detecteert en blokkeert aanmeldpogingen die Entra ID Protection als risicovol classificeert, bovenop een statische MFA-vereiste.", source: "MCSB IM-3 / buildplan sectie 6.1", optional: true, params: { requiresEntraIdP2: true }, remediationScript: "Import-Module Microsoft.Graph.Identity.SignIns\n\n# Vereist Entra ID P2 — controleer eerst de licentie van deze klant.\n$params = @{\n    DisplayName = 'CA-BASE-004-SigninRiskPolicy'\n    State       = 'enabledForReportingButNotEnforced'\n    Conditions  = @{\n        Users = @{ IncludeUsers = @('All') }\n        Applications = @{ IncludeApplications = @('All') }\n        SignInRiskLevels = @('high', 'medium')\n    }\n    GrantControls = @{\n        Operator = 'OR'\n        BuiltInControls = @('mfa')\n    }\n}\nNew-MgIdentityConditionalAccessPolicy -BodyParameter $params", learnMoreLinks: [{ label: "Common Conditional Access policy: Sign-in risk-based", url: "https://learn.microsoft.com/entra/identity/conditional-access/policy-risk-based-sign-in" }] },
  { checkId: "CA-BASE-005-UserRiskPolicy", severity: "high", tags: ["conditional-access", "identity-protection"], type: "user-risk-policy", what: "Is er een user risk-policy actief (indien Entra ID P2 aanwezig)?", why: "Dwingt een wachtwoordwijziging af bij accounts die als gecompromitteerd worden ingeschat, in plaats van alleen de losse sign-in te blokkeren.", source: "MCSB IM-3 / buildplan sectie 6.1", optional: true, params: { requiresEntraIdP2: true }, remediationScript: "Import-Module Microsoft.Graph.Identity.SignIns\n\n# Vereist Entra ID P2 — controleer eerst de licentie van deze klant.\n$params = @{\n    DisplayName = 'CA-BASE-005-UserRiskPolicy'\n    State       = 'enabledForReportingButNotEnforced'\n    Conditions  = @{\n        Users = @{ IncludeUsers = @('All') }\n        Applications = @{ IncludeApplications = @('All') }\n        UserRiskLevels = @('high')\n    }\n    GrantControls = @{\n        Operator = 'AND'\n        BuiltInControls = @('mfa', 'passwordChange')\n    }\n}\nNew-MgIdentityConditionalAccessPolicy -BodyParameter $params", learnMoreLinks: [{ label: "Common Conditional Access policy: User risk-based password change", url: "https://learn.microsoft.com/entra/identity/conditional-access/policy-risk-user-change-password" }] },
  { checkId: "CA-BASE-006-LocationRestriction", severity: "medium", tags: ["conditional-access", "network"], type: "location-restriction", what: "Zijn er locatie- of IP-gebaseerde restricties geconfigureerd waar relevant voor deze klant?", why: "Beperkt het aanvalsoppervlak voor tenants met een bekende, beperkte set toegangslocaties (bv. alleen NL/BE-kantoren).", source: "buildplan sectie 6.1 — nadrukkelijk per klant afwegen, niet universeel", optional: true, remediationScript: "Import-Module Microsoft.Graph.Identity.SignIns\n\n# Stap 1: named location aanmaken met de bekende, vertrouwde IP-ranges van deze klant.\n$namedLocation = @{\n    '@odata.type' = '#microsoft.graph.ipNamedLocation'\n    DisplayName   = 'Vertrouwde kantoorlocaties'\n    IsTrusted     = $true\n    IpRanges      = @(@{ '@odata.type' = '#microsoft.graph.iPv4CidrRange'; CidrAddress = '<klant-ip-range>/32' })\n}\n$location = New-MgIdentityConditionalAccessNamedLocation -BodyParameter $namedLocation\n\n# Stap 2: CA-policy die toegang buiten deze locaties blokkeert (report-only eerst).\n$params = @{\n    DisplayName = 'CA-BASE-006-LocationRestriction'\n    State       = 'enabledForReportingButNotEnforced'\n    Conditions  = @{\n        Users = @{ IncludeUsers = @('All') }\n        Applications = @{ IncludeApplications = @('All') }\n        Locations = @{ IncludeLocations = @('All'); ExcludeLocations = @($location.Id) }\n    }\n    GrantControls = @{ Operator = 'OR'; BuiltInControls = @('block') }\n}\nNew-MgIdentityConditionalAccessPolicy -BodyParameter $params", learnMoreLinks: [{ label: "Conditional Access: Block access by location", url: "https://learn.microsoft.com/entra/identity/conditional-access/howto-conditional-access-policy-location" }] },
  { checkId: "CA-BASE-007-SessionControls", severity: "medium", tags: ["conditional-access", "session-control"], type: "session-controls", what: "Zijn session controls (sign-in frequency, persistent browser session uit) geconfigureerd voor gedeelde/onbeheerde devices?", why: "Voorkomt dat een sessie op een gedeeld of onbeheerd apparaat onbeperkt geldig blijft nadat de gebruiker is weggelopen.", source: "MCSB IM-1 / buildplan sectie 6.1", params: { maxSignInFrequencyHours: 12, persistentBrowserSessionAllowedForUnmanagedDevices: false }, remediationScript: "Import-Module Microsoft.Graph.Identity.SignIns\n\n$params = @{\n    DisplayName = 'CA-BASE-007-SessionControls'\n    State       = 'enabledForReportingButNotEnforced'\n    Conditions  = @{\n        Users = @{ IncludeUsers = @('All') }\n        Applications = @{ IncludeApplications = @('All') }\n    }\n    GrantControls = @{ Operator = 'OR'; BuiltInControls = @('mfa') }\n    SessionControls = @{\n        SignInFrequency   = @{ IsEnabled = $true; Type = 'hours'; Value = 12 }\n        PersistentBrowser  = @{ IsEnabled = $true; Mode = 'never' }\n    }\n}\nNew-MgIdentityConditionalAccessPolicy -BodyParameter $params", learnMoreLinks: [{ label: "Configure authentication session management with Conditional Access", url: "https://learn.microsoft.com/entra/identity/conditional-access/howto-conditional-access-session-lifetime" }] },
  { checkId: "CA-BASE-008-BreakGlassExclusion", severity: "critical", tags: ["conditional-access", "break-glass"], type: "break-glass-exclusion", what: "Zijn break-glass accounts uitgesloten van alle Conditional Access-policies?", why: "Een break-glass account dat zelf binnen scope van een CA-policy valt kan bij een storing of MFA-probleem ook zelf buitengesloten raken, met een volledige tenant-lock-out als risico.", source: "ITCE CA-baseline sectie 6.1 / community-referentie j0eyv/ConditionalAccessBaseline", remediationScript: "Import-Module Microsoft.Graph.Identity.SignIns\n\n# Vervang door de daadwerkelijke break-glass-UPN('s)/groeps-id.\n$breakGlassGroupId = '<object-id-van-break-glass-security-group>'\n\n# Voeg de break-glass-groep toe aan de exclude-lijst van ELKE actieve policy — dit\n# script toont het patroon per policy, in de praktijk over alle policies heen herhalen.\n$policies = Get-MgIdentityConditionalAccessPolicy -All | Where-Object State -eq 'enabled'\nforeach ($policy in $policies) {\n    $excludeGroups = @($policy.Conditions.Users.ExcludeGroups) + $breakGlassGroupId | Select-Object -Unique\n    Update-MgIdentityConditionalAccessPolicy -ConditionalAccessPolicyId $policy.Id -Conditions @{\n        Users = @{ ExcludeGroups = $excludeGroups }\n    }\n}", learnMoreLinks: [{ label: "Manage emergency access (break-glass) accounts", url: "https://learn.microsoft.com/entra/identity/role-based-access-control/security-emergency-access" }] },
  /**
   * 029 hoort hier omdat hij géén CA-policy-match is maar een eigen meting op de
   * userRegistrationDetails-populatie — er is dus geen template in CATemplate/ dat hem
   * genereert. Hij is op 2026-08-12 met de hand aan het gegenereerde bestand toegevoegd
   * (PR #3) en zou bij de eerstvolgende regeneratie zijn weggeschreven; daarom staat hij
   * nu in de bron in plaats van in het resultaat.
   */
  /**
   * 040 is net als 029 géén ca-policy-match en heeft dus geen template in CATemplate/.
   * `grantControls.termsOfUse` bevat een object-id dat per tenant is aangemaakt; een
   * structurele vergelijking zou dat id bij elke andere klant missen en dus altijd falen,
   * om een reden die niets met die klant te maken heeft. Het eigen rule-type stelt de
   * zinnige vraag: wordt er überhaupt een gebruiksvoorwaarde afgedwongen.
   *
   * `optional`, want of er een gebruiksvoorwaarde is en wat erin staat is een juridisch
   * klantbesluit — geen technische tekortkoming.
   */
  { checkId: "CA-BASE-040-TermsOfUseRequired", severity: "low", tags: ["conditional-access", "governance", "terms-of-use"], type: "terms-of-use-required", optional: true, what: "Dwingt een actieve Conditional Access-policy een Terms of Use af?", why: "De enige policy uit Daniel Chronlunds ontwerpbaseline (2040) die deze set niet had overgenomen, en ook van Surksum kent hem (CAU010). Een gebruiksvoorwaarde is geen technische maatregel maar een aantoonbaar moment van instemming — bruikbaar bij een aansprakelijkheidsvraag of een NIS2-audit, en zonder CA-koppeling krijgt niemand hem te zien.", source: "Daniel Chronlund CA design baseline 2040 / Kenneth van Surksum CAU010 (zie docs/ca-baseline-gap.md in sjkanon/Platform)", remediationScript: "# 1. Maak de gebruiksvoorwaarde aan in Entra:\n#    Identity Governance > Terms of use > New terms\n#    (PDF uploaden, taal instellen, 'Require users to expand the terms of use' aanzetten)\n#\n# 2. Koppel hem als grant control aan een policy die alle gebruikers raakt:\nImport-Module Microsoft.Graph.Identity.SignIns\n\n$termsOfUseId = '<object-id-van-de-terms-of-use>'   # zichtbaar in de URL van de agreement\n\n$params = @{\n    DisplayName = 'GLOBAL - 2140 - GRANT - Terms of Use'\n    State       = 'enabledForReportingButNotEnforced'  # eerst report-only: een ToU die onverwacht blokkeert legt iedereen stil\n    Conditions  = @{\n        Users        = @{ IncludeUsers = @('All'); ExcludeGroups = @('<object-id-break-glass-groep>') }\n        Applications = @{ IncludeApplications = @('All') }\n    }\n    GrantControls = @{\n        Operator   = 'AND'\n        TermsOfUse = @($termsOfUseId)\n    }\n}\nNew-MgIdentityConditionalAccessPolicy -BodyParameter $params", learnMoreLinks: [{ label: "Microsoft Entra terms of use", url: "https://learn.microsoft.com/entra/identity/conditional-access/terms-of-use" }] },
  { checkId: "CA-BASE-029-NonAdminPasskeyCoverage", severity: "medium", tags: ["conditional-access", "mfa", "passkey"], type: "non-admin-passkey-coverage", what: "Hebben alle actieve, niet-admin gebruikers een passkey (of andere phishing-resistente methode) geregistreerd?", why: "Microsoft schakelt vanaf 1 september 2026 automatisch een passkey-registratiecampagne in voor gebruikers op SMS/Voice, en handhaaft vanaf 1 februari 2027: zonder geregistreerde passkey kunnen zij dan niet meer inloggen als SMS/Voice hun enige methode is.", source: "Microsoft Entra — SMS/Voice-retirement en passkey-default-rollout (learn.microsoft.com/entra/identity/authentication/concept-sms-voice-retirement)", learnMoreLinks: [{ label: "Passkeys by default and retirement of Microsoft-provided SMS and voice authentication", url: "https://learn.microsoft.com/en-us/entra/identity/authentication/concept-sms-voice-retirement" }] },
];

/**
 * Welk checkId-nummer hoort bij welk templatebestand — met de hand vastgepind.
 *
 * ===================== WAAROM DIT NIET AUTOMATISCH MAG =====================
 *
 * Hiervóór telde dit script simpelweg door over de gesorteerde bestandsnamen:
 * `checkNumber = EXISTING_RULES.length + 1`, en dan +1 per bestand. Dat werkt precies
 * zolang er niets tussen komt. Voeg je `GLOBAL__1110__…` toe, dan sorteert die ná 1100 en
 * schuift álles daarna één op: `CA-BASE-019-MediumRiskSignins` wordt `020`, `020` wordt
 * `021`, tot en met `028`.
 *
 * Dat is geen cosmetische verschuiving. Het checkId is in TEST Policies Platform de sleutel
 * waarop:
 *   - drift over runs heen vergeleken wordt (een hernummerde regel leest als "oude check
 *     verdwenen, nieuwe check erbij" — in de tijdlijn een regressie die er niet is);
 *   - klantuitzonderingen hangen (`baselineExceptions.ts` matcht op de exacte `checkId`,
 *     dus een uitzondering die een klant bewust heeft laten vastleggen valt stilzwijgend op
 *     een andere check);
 *   - de corroboratielaag koppelt (die matcht op het achtervoegsel, dus die overleeft het —
 *     maar dat is toeval, geen ontwerp).
 *
 * Vandaar: elk template krijgt hier één keer een nummer, en dat nummer verandert nooit meer.
 * Een template zonder pin is een harde fout, geen stilzwijgende doornummering — zie
 * `convertTemplateFile`.
 *
 * 001-008 zijn de handgeschreven regels in EXISTING_RULES, 009-028 de eerste twintig
 * templates (vastgepind op de nummers die ze bij de eerste generatie kregen), 029 de
 * handmatig toegevoegde passkey-regel. Nieuwe templates beginnen bij 030.
 *
 * LET OP: `validateBaseline` in packages/shared eist exact drie cijfers, dus 030-999.
 */
const CHECK_ID_BY_TEMPLATE = {
  GLOBAL__1010__BLOCK__Legacy_Authentication: "009",
  GLOBAL__1020__BLOCK__Device_Code_Auth_Flow: "010",
  GLOBAL__1030__BLOCK__Unsupported_Device_Platforms: "011",
  GLOBAL__1040__BLOCK__Countries_not_Allowed: "012",
  GLOBAL__1050__BLOCK__HighRisk_Countries: "013",
  GLOBAL__1060__BLOCK__Service_Accounts_Trusted_Locations_Excluded: "014",
  GLOBAL__1070__BLOCK__Explicitly_Blocked_Cloud_Apps: "015",
  GLOBAL__1080__BLOCK__Guest_Access_to_Sensitive_Apps: "016",
  GLOBAL__1090__BLOCK__HighRisk_SignIns: "017",
  GLOBAL__1100__BLOCK__HighRisk_Users: "018",
  GLOBAL__2010__GRANT__MediumRisk_Signins: "019",
  GLOBAL__2020__GRANT__MediumRisk_Users: "020",
  GLOBAL__2050__GRANT__MFA_for_All_Users: "021",
  GLOBAL__2055__GRANT__Phishing_Resistant_MFA_for_Admins: "022",
  GLOBAL__2060__GRANT__Mobile_Apps_and_Desktop_Clients: "023",
  GLOBAL__2070__GRANT__Mobile_Device_Access_Requirements: "024",
  GLOBAL__3010__SESSION__Admin_Persistence: "025",
  GLOBAL__3020__SESSION__BYOD_Persistence: "026",
  GLOBAL__3030__SESSION__Register_Security_Info_Requirements: "027",
  GLOBAL__3040__SESSION__Block_File_Downloads_On_Unmanaged_Devices: "028",

  // 029 = CA-BASE-029-NonAdminPasskeyCoverage, staat in EXISTING_RULES (geen template).

  // --- Nieuw sinds de frameworkvergelijking van 2026-08-13 (docs/ca-baseline-gap.md in
  //     sjkanon/Platform). Eén template per maatregel, niet per policy van een framework.
  GLOBAL__1110__BLOCK__Unlicensed_Users: "030",
  GLOBAL__1120__BLOCK__Guest_Access_Outside_Approved_Apps: "031",
  GLOBAL__1130__BLOCK__Admins_From_Untrusted_Locations: "032",
  GLOBAL__1140__BLOCK__Managed_Identities_At_Risk: "033",
  GLOBAL__2080__GRANT__MFA_For_Device_Registration: "034",
  GLOBAL__2090__GRANT__Browser_Access_On_Unmanaged_Devices: "035",
  GLOBAL__2100__GRANT__MFA_For_Admin_Portals: "036",
  GLOBAL__2110__GRANT__Token_Protection: "037",
  GLOBAL__2120__GRANT__Phishing_Resistant_MFA_for_All_Users: "038",
  GLOBAL__2130__GRANT__Admins_Compliant_Device: "039",
  GLOBAL__2150__GRANT__Cloud_PC_Mobile_Access: "041",
  GLOBAL__3050__SESSION__Continuous_Access_Evaluation: "042",
  GLOBAL__3060__SESSION__Defender_for_Cloud_Apps: "043",
};

/**
 * 040 STAAT NIET IN DEZE KAART, EN DAT IS GEEN OMISSIE.
 *
 * `CA-BASE-040-TermsOfUseRequired` is geen `ca-policy-match` maar een eigen rule-type
 * (`terms-of-use-required`) en staat daarom in EXISTING_RULES hierboven, net als 001-008 en
 * 029. Reden: `grantControls.termsOfUse` bevat het object-id van een agreement dat per
 * tenant is aangemaakt. Een structurele vergelijking zou dus een id verwachten dat bij geen
 * enkele andere klant bestaat — de check faalt dan altijd, om een reden die niets met die
 * klant te maken heeft. De zinnige vraag is "wordt er überhaupt een gebruiksvoorwaarde
 * afgedwongen", en die stelt de engine zelf (Test-TermsOfUseRequired).
 */

/**
 * Templates die niet bij elke klant van toepassing zijn — ze krijgen `optional: true` plus
 * de reden in hun `why`.
 *
 * Zonder dit levert een licentiegebonden policy bij élke klant zonder die licentie een
 * `fail` op voor iets wat hij niet kán hebben, en dat is precies de valse bevinding die
 * guardrail #5 van de andere kant uitsluit. De waarde is de zin die achter "Niet bij elke
 * klant van toepassing:" komt te staan.
 */
const OPTIONAL_TEMPLATES = {
  GLOBAL__1140__BLOCK__Managed_Identities_At_Risk:
    "risicodetectie op workload-identiteiten vereist Microsoft Entra Workload ID Premium.",
  GLOBAL__1130__BLOCK__Admins_From_Untrusted_Locations:
    "beheerders vastzetten op vertrouwde locaties sluit ze buiten zodra ze thuis of onderweg werken. Alleen inschakelen na expliciete afstemming met de klant.",
  GLOBAL__2120__GRANT__Phishing_Resistant_MFA_for_All_Users:
    "vereist dat élke gebruiker een passkey of FIDO2-sleutel heeft. Het einddoel waar de admin-variant (2055) de eerste stap van is, maar een uitrolproject en geen instelling.",
  GLOBAL__2130__GRANT__Admins_Compliant_Device:
    "eist dat élke beheerder een beheerd apparaat heeft — bij een MSP dus ook elke engineer die in de klanttenant komt. Klantbeslissing.",
  GLOBAL__2150__GRANT__Cloud_PC_Mobile_Access:
    "alleen relevant bij een klant met Windows 365 / Cloud PC.",
  GLOBAL__3060__SESSION__Defender_for_Cloud_Apps:
    "sessiecontrole via Defender for Cloud Apps vereist een MDCA-licentie.",
};

/** Het eerstvolgende nummer dat nog niet vergeven is — puur voor de foutmelding. */
function eerstvolgendVrijNummer() {
  const gebruikt = new Set([...Object.values(CHECK_ID_BY_TEMPLATE), "001", "002", "003", "004", "005", "006", "007", "008", "029"]);
  for (let n = 1; n < 1000; n += 1) {
    const kandidaat = String(n).padStart(3, "0");
    if (!gebruikt.has(kandidaat)) return kandidaat;
  }
  throw new Error("Geen vrij checkId-nummer meer beschikbaar (001-999 zijn allemaal vergeven).");
}

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

  // Workload identities. Zonder deze twee velden is een policy die service principals
  // blokkeert bij verhoogd risico niet te onderscheiden van een gewone "blokkeer
  // alles"-policy: er blijven dan alleen applications en grantControls over, en die zijn
  // identiek. Het platform zou dan pass melden op grond van iets heel anders.
  if (c.servicePrincipalRiskLevels && c.servicePrincipalRiskLevels.length > 0) {
    params.servicePrincipalRiskLevels = c.servicePrincipalRiskLevels;
  }
  if (c.clientApplications) {
    const clientApps = {};
    if (c.clientApplications.includeServicePrincipals && c.clientApplications.includeServicePrincipals.length > 0) {
      clientApps.includeServicePrincipals = c.clientApplications.includeServicePrincipals;
    }
    if (c.clientApplications.excludeServicePrincipals && c.clientApplications.excludeServicePrincipals.length > 0) {
      clientApps.excludeServicePrincipals = c.clientApplications.excludeServicePrincipals;
    }
    if (Object.keys(clientApps).length > 0) params.clientApplications = clientApps;
  }

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

    // Gasten en externe gebruikers. Graph levert de typen als één komma-gescheiden string
    // ("b2bCollaborationGuest,internalGuest"); hier splitsen we ze, zodat de engine ze als
    // verzameling kan vergelijken. Zonder dit veld is de gastenscope van een policy voor de
    // vergelijking onzichtbaar, en zou een gastenregel net zo goed aanslaan op een policy
    // die iedereen raakt — zie CaPolicyMatchParams.guestsOrExternalUsers in packages/shared.
    // externalTenants blijft er bewust buiten: per klant verschillend, en het zegt niets
    // over de vraag of de maatregel er is.
    const guestTypes = (node) => {
      const raw = node && node.guestOrExternalUserTypes;
      if (!raw) return [];
      return String(raw)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    };
    const guests = {};
    const includeTypes = guestTypes(c.users.includeGuestsOrExternalUsers);
    const excludeTypes = guestTypes(c.users.excludeGuestsOrExternalUsers);
    if (includeTypes.length > 0) guests.includeTypes = includeTypes;
    if (excludeTypes.length > 0) guests.excludeTypes = excludeTypes;
    if (Object.keys(guests).length > 0) params.guestsOrExternalUsers = guests;
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

function convertTemplateFile(filePath) {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const policy = JSON.parse(raw.JSON);

  const baseName = path.basename(filePath, ".json");
  const parsed = parseFileName(baseName);
  const pascalName = parsed ? slugToPascalCase(parsed.name) : slugToPascalCase(baseName);

  const nummer = CHECK_ID_BY_TEMPLATE[baseName];
  if (!nummer) {
    throw new Error(
      `${baseName} heeft geen vastgepind checkId-nummer in CHECK_ID_BY_TEMPLATE.\n` +
        `Voeg er een toe — het eerstvolgende vrije nummer is ${eerstvolgendVrijNummer()}.\n` +
        `Zie het docblok bij CHECK_ID_BY_TEMPLATE voor waarom dit niet automatisch mag.`
    );
  }

  const checkId = `CA-BASE-${nummer}-${pascalName}`;
  const severity = (parsed && SEVERITY_BY_GROUP[parsed.group]) || "medium";
  const params = extractParams(policy);

  const rule = {
    checkId,
    severity,
    tags: ["conditional-access", "ca-policy-match", parsed ? parsed.group.toLowerCase() : "unknown"],
    type: "ca-policy-match",
    what: `Bevat de tenant een Conditional Access-policy die overeenkomt met de afgesproken baseline-policy "${policy.displayName || baseName}"?`,
    why: "Onderdeel van de tussen ITCE en de klant afgesproken CA-baseline (bron: CA-Policies/CATemplate). Groepsuitsluitingen tellen mee (op naam, na resolutie in de klanttenant); individuele gebruikersuitsluitingen bewust niet — dat is per klant een eigen invulling.",
    source: `CA-Policies/CATemplate/${baseName}.json (afgesproken baseline)`,
    params,
    learnMoreLinks: [{ label: "Conditional Access policies overview", url: "https://learn.microsoft.com/entra/identity/conditional-access/overview" }],
  };

  const optioneel = OPTIONAL_TEMPLATES[baseName];
  if (optioneel) {
    rule.optional = true;
    rule.why = `${rule.why}\n\nNiet bij elke klant van toepassing: ${optioneel}`;
  }

  return { rule, settingCount: Object.keys(params).length };
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

  for (const file of files) {
    const filePath = path.join(TEMPLATE_DIR, file);
    const { rule, settingCount } = convertTemplateFile(filePath);
    if (settingCount === 0) {
      console.error(`FOUT: ${file} leverde geen vergelijkbare velden op — wordt overgeslagen, controleer handmatig.`);
      continue;
    }
    generatedRules.push(rule);
    console.log(`${rule.checkId} <- ${file} (${settingCount} veldgroepen)${rule.optional ? " [optional]" : ""}`);
  }

  // Sorteren op checkId zodat de volgorde in het bestand het nummer volgt en niet de
  // alfabetische bestandsnaam — anders staat 030 tussen 017 en 018 zodra er een template
  // met een lager GLOBAL-nummer bijkomt, en leest een diff als een herschikking.
  generatedRules.sort((a, b) => a.checkId.localeCompare(b.checkId));

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
