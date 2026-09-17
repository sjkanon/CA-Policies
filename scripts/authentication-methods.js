#!/usr/bin/env node
/**
 * Bewaakt authentication-methods/authentication-methods.json: de gewenste stand van het
 * authentication methods policy in een klanttenant.
 *
 * ===================== WAAROM DIT BESTAND BEWAAKT MOET WORDEN =====================
 *
 * Dit is het enige deel van de baseline zonder checkId. De platform-engine kent de categorie
 * 'authentication-methods' niet, dus er is geen toetsing tegen een klanttenant en geen drift-
 * signaal. Wat hier scheefstaat, staat scheef tot iemand het met de hand opmerkt.
 *
 * Twee afhankelijkheden lopen van hier naar de CA-kant, en beide falen stil:
 *
 *   GLOBAL__2120 eist een phishing-bestendige methode. Staat Passkey (FIDO2) hier uit, dan is
 *                die eis door niemand te vervullen en is de tenant dicht.
 *   GLOBAL__2180 eist een eenmalige Temporary Access Pass bij het registreren van
 *                beveiligingsinformatie. Staat TAP hier uit, dan kan een nieuwe medewerker
 *                niets registreren — en dus nooit aan 2120 voldoen.
 *
 * Vandaar dat dit script die twee koppelingen expliciet controleert in plaats van alleen het
 * schema te valideren.
 *
 * Gebruik: node scripts/authentication-methods.js   (rapporteert, exit 1 bij fouten)
 * Als module: readMethods(), validate()
 */

const fs = require("fs");
const path = require("path");

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
    }
  }

  // ----------------------------------------- koppelingen met de CA-kant ----

  const opId = new Map(methodes.map((m) => [m.id, m]));

  const fido = opId.get("Fido2");
  const state2120 = templateState("GLOBAL__2120__GRANT__Phishing_Resistant_MFA_for_All_Users");
  if (state2120 === "enabled" && fido?.state !== "enabled") {
    errors.push(
      "GLOBAL__2120 eist een phishing-bestendige methode en staat op enabled, maar Passkey (FIDO2) staat hier niet op enabled. " +
        "Niemand kan dan aan die grant voldoen."
    );
  }

  const tap = opId.get("TemporaryAccessPass");
  const state2180 = templateState("GLOBAL__2180__GRANT__Register_Security_Info_TAP_Only");
  if (state2180 && state2180 !== "disabled" && tap?.state !== "enabled") {
    errors.push(
      "GLOBAL__2180 eist een Temporary Access Pass bij het registreren van beveiligingsinformatie, maar TAP staat hier niet op enabled. " +
        "Een nieuwe medewerker kan dan niets registreren."
    );
  }
  if (tap?.state === "enabled" && tap.configuration?.isUsableOnce !== true) {
    warnings.push("Temporary Access Pass staat op meermalig bruikbaar. GLOBAL__2180 accepteert alleen temporaryAccessPassOneTime, dus die grant faalt dan.");
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
