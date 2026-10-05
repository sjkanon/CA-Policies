#!/usr/bin/env node
/**
 * Guards authentication-methods/authentication-methods.json: the desired state of the
 * authentication methods policy in a tenant.
 *
 * ===================== WHY THIS FILE NEEDS GUARDING =====================
 *
 * Nothing compares this file with a tenant automatically. Set-EntraAuthenticationMethods.ps1
 * does, but only when someone runs it, one tenant at a time. What is wrong here stays wrong
 * until somebody notices by hand.
 *
 * Two dependencies run from here to the CA side, and both fail silently:
 *
 *   CA__2120 requires a phishing-resistant method. If Passkey (FIDO2) is off here, nobody
 *                can meet that requirement and the tenant is closed.
 *   CA__2180 requires a one-time Temporary Access Pass to register security info. If TAP
 *                is off here, a new employee cannot register anything — and so can never
 *                meet 2120.
 *
 * That is why this script checks those two links explicitly instead of only validating the
 * schema.
 *
 * Usage: node scripts/authentication-methods.js   (reports, exit 1 on errors)
 * As a module: readMethods(), validate()
 */

const fs = require("fs");
const path = require("path");
const { FILE_PREFIX } = require("./lib/organisation");

const REPO_ROOT = path.resolve(__dirname, "..");
const METHODS_PATH = path.join(REPO_ROOT, "authentication-methods", "authentication-methods.json");
const TEMPLATE_DIR = path.join(REPO_ROOT, "CATemplate");

const GELDIGE_STATES = new Set(["enabled", "disabled"]);
const GELDIGE_PASSKEY_TYPES = new Set(["deviceBound", "synced"]);

function readMethods() {
  return JSON.parse(fs.readFileSync(METHODS_PATH, "utf8"));
}

/** De staat van een CA-template, om de koppelingen mee te controleren. */
function templateState(bestandsnaam) {
  const pad = path.join(TEMPLATE_DIR, `${bestandsnaam}.json`);
  if (!fs.existsSync(pad)) return null;
  const rij = JSON.parse(fs.readFileSync(pad, "utf8"));
  const policy = JSON.parse(rij.JSON);
  return policy.state ?? null;
}

/** @returns {{ errors: string[], warnings: string[] }} */
function validate(gewenst = readMethods()) {
  const errors = [];
  const warnings = [];
  const methodes = gewenst.methods || [];
  const aaGuids = Object.fromEntries(Object.entries(gewenst.knownAaGuids || {}).filter(([k]) => k !== "_comment"));

  if (methodes.length === 0) errors.push("Geen enkele methode gedefinieerd.");

  const volgordes = new Set();
  const ids = new Set();

  for (const methode of methodes) {
    const naam = methode.displayName || methode.id || "(naamloos)";

    if (!methode.id) errors.push(`${naam}: geen id. Dat is de sleutel waarmee Graph de methode aanspreekt.`);
    if (ids.has(methode.id)) errors.push(`${methode.id} staat er twee keer in.`);
    ids.add(methode.id);

    if (!GELDIGE_STATES.has(methode.state)) {
      errors.push(`${naam}: state "${methode.state}" bestaat niet. Alleen enabled of disabled.`);
    }
    if (typeof methode.order !== "number") {
      errors.push(`${naam}: geen order. De volgorde ís de uitrolvolgorde en mag niet impliciet zijn.`);
    } else if (volgordes.has(methode.order)) {
      errors.push(`${naam}: order ${methode.order} staat er al. Twee methodes met dezelfde volgorde maken de uitrolvolgorde dubbelzinnig.`);
    }
    volgordes.add(methode.order);

    if (!methode.doel) errors.push(`${naam}: geen doel. Een regel zonder onderbouwing is een regel waar niemand op besluit.`);

    // Uitzetten is de enige handeling die iets wegneemt en dus de enige die mensen buitensluit.
    if (methode.state === "disabled" && !methode.dangerReason) {
      errors.push(`${naam}: staat op disabled maar heeft geen dangerReason. Uitzetten sluit gebruikers buiten die alleen die methode hebben — schrijf op in welke volgorde dat mag.`);
    }

    for (const profiel of methode.profiles || []) {
      const pNaam = `${naam} / ${profiel.displayName || "(naamloos profiel)"}`;
      if (!profiel.target) errors.push(`${pNaam}: geen target.`);
      if (!Array.isArray(profiel.passkeyTypes) || profiel.passkeyTypes.length === 0) {
        errors.push(`${pNaam}: geen passkeyTypes.`);
      }
      for (const type of profiel.passkeyTypes || []) {
        if (!GELDIGE_PASSKEY_TYPES.has(type)) errors.push(`${pNaam}: passkeytype "${type}" bestaat niet.`);
      }
      // Attestation en synced sluiten elkaar uit: gesynchroniseerde passkeys ondersteunen
      // geen attestation, dus dit profiel zou in de praktijk alleen device-bound toelaten.
      if (profiel.enforceAttestation && (profiel.passkeyTypes || []).includes("synced")) {
        errors.push(
          `${pNaam}: enforceAttestation staat aan én synced staat in passkeyTypes. Gesynchroniseerde passkeys ondersteunen geen attestation, dus dit profiel laat ze in werkelijkheid niet toe — het bestand belooft iets anders dan de tenant doet.`
        );
      }

      // Windows Hello-passkeys kunnen niet met attestation. Een profiel dat ze toestaat én
      // attestation afdwingt laat in werkelijkheid niets toe: de gebruiker probeert, het
      // faalt, en niets in het portaal zegt waarom.
      const helloGuids = new Set(Object.values(aaGuids).filter((v) => typeof v === "string"));
      const toegestaneHello = (profiel.keyRestrictions?.aaGuids || []).filter(
        (g) => helloGuids.has(String(g).toLowerCase()) || Object.keys(aaGuids).includes(g)
      );
      if (profiel.enforceAttestation && toegestaneHello.length > 0) {
        errors.push(
          `${pNaam}: staat Windows Hello-AAGUID's toe (${toegestaneHello.join(", ")}) én dwingt attestation af. Microsoft: "The profile can't Enforce attestation" — met deze combinatie kan niemand een Windows Hello-passkey registreren.`
        );
      }

      // Een allow-lijst die aan staat maar leeg is, staat niets toe.
      if (profiel.keyRestrictions?.isEnforced && profiel.keyRestrictions?.enforcementType === "allow" && (profiel.keyRestrictions?.aaGuids || []).length === 0) {
        errors.push(
          `${pNaam}: keyRestrictions staat op allow en is afgedwongen, maar de AAGUID-lijst is leeg. Dat staat geen enkele authenticator toe — niemand kan registreren.`
        );
      }
    }
  }

  // ----------------------------------------- koppelingen met de CA-kant ----

  const opId = new Map(methodes.map((m) => [m.id, m]));

  const fido = opId.get("Fido2");
  const state2120 = templateState(`${FILE_PREFIX}2120__GRANT__Phishing_Resistant_MFA_for_All_Users`);
  if (state2120 === "enabled" && fido?.state !== "enabled") {
    errors.push(
      `${FILE_PREFIX}2120 eist een phishing-bestendige methode en staat op enabled, maar Passkey (FIDO2) staat hier niet op enabled. ` +
        "Niemand kan dan aan die grant voldoen."
    );
  }

  const tap = opId.get("TemporaryAccessPass");
  const state2180 = templateState(`${FILE_PREFIX}2180__GRANT__Register_Security_Info_TAP_Only`);
  if (state2180 && state2180 !== "disabled" && tap?.state !== "enabled") {
    errors.push(
      `${FILE_PREFIX}2180 eist een Temporary Access Pass bij het registreren van beveiligingsinformatie, maar TAP staat hier niet op enabled. ` +
        "Een nieuwe medewerker kan dan niets registreren."
    );
  }
  if (tap?.state === "enabled" && tap.configuration?.isUsableOnce !== true) {
    warnings.push(`Temporary Access Pass staat op meermalig bruikbaar. ${FILE_PREFIX}2180 accepteert alleen temporaryAccessPassOneTime, dus die grant faalt dan.`);
  }

  // Een methode uitzetten kan alleen veilig als er iets anders aan staat.
  const uitgezet = methodes.filter((m) => m.state === "disabled");
  const sterkeAan = methodes.some((m) => ["Fido2", "MicrosoftAuthenticator"].includes(m.id) && m.state === "enabled");
  if (uitgezet.length > 0 && !sterkeAan) {
    errors.push(
      `${uitgezet.length} methode(s) staan op disabled terwijl noch Passkey (FIDO2) noch Microsoft Authenticator aan staat. Dat laat gebruikers zonder enige methode achter.`
    );
  }

  return { errors, warnings };
}

function main() {
  const { errors, warnings } = validate();
  for (const w of warnings) console.warn(`waarschuwing: ${w}`);
  for (const e of errors) console.error(`FOUT: ${e}`);
  if (errors.length > 0) {
    console.error(`\n${errors.length} probleem(en) in authentication-methods/authentication-methods.json.`);
    process.exitCode = 1;
    return;
  }
  const gewenst = readMethods();
  const aan = gewenst.methods.filter((m) => m.state === "enabled").length;
  const uit = gewenst.methods.length - aan;
  console.log(`OK — ${aan} methode(s) aan, ${uit} uit${warnings.length ? ` (${warnings.length} waarschuwing(en))` : ""}.`);
}

module.exports = { readMethods, templateState, validate, METHODS_PATH };

if (require.main === module) main();
