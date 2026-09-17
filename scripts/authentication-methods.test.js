#!/usr/bin/env node
/**
 * Bewaakt de afspraken in authentication-methods/authentication-methods.json.
 *
 * ========================== WAAROM DIT EEN TEST IS ==========================
 *
 * Dit bestand heeft als enige deel van de baseline geen checkId en dus geen toetsing tegen een
 * klanttenant. Set-AuthenticationMethods.ps1 vergelijkt wel, maar draait pas als iemand hem
 * draait — en bij één klant tegelijk. Deze test is het enige dat in CI faalt wanneer de
 * afspraken zichzelf tegenspreken.
 *
 * Draaien: node --test scripts/authentication-methods.test.js
 */
const assert = require("node:assert");
const { test } = require("node:test");

const { readMethods, templateState, validate } = require("./authentication-methods");

test("het bestand spreekt zichzelf niet tegen", () => {
  const { errors } = validate();
  assert.deepStrictEqual(errors, [], "draai: node scripts/authentication-methods.js");
});

test("Temporary Access Pass staat vóór de rest", () => {
  const methodes = readMethods().methods;
  const tap = methodes.find((m) => m.id === "TemporaryAccessPass");
  assert.ok(tap, "TAP ontbreekt");
  const eerder = methodes.filter((m) => m.order < tap.order);
  assert.deepStrictEqual(
    eerder,
    [],
    "TAP moet als eerste: zonder TAP heeft een nieuwe medewerker niets om zijn eerste passkey mee te registreren."
  );
});

test("wat uitgezet wordt, staat achteraan", () => {
  const methodes = readMethods().methods;
  const laatsteAan = Math.max(...methodes.filter((m) => m.state === "enabled").map((m) => m.order));
  for (const uit of methodes.filter((m) => m.state === "disabled")) {
    assert.ok(
      uit.order > laatsteAan,
      `${uit.displayName} (order ${uit.order}) staat vóór een methode die aangezet wordt. Eerst registreren, dan pas uitzetten — andersom sluit je mensen buiten.`
    );
  }
});

/**
 * De twee koppelingen die stil falen. Ze staan ook in validate(), maar hier apart zodat de
 * testnaam zegt wélke CA-policy stukgaat als iemand dit omzet.
 */
test("Passkey (FIDO2) staat aan zolang GLOBAL__2120 phishing-bestendige MFA eist", () => {
  if (templateState("GLOBAL__2120__GRANT__Phishing_Resistant_MFA_for_All_Users") !== "enabled") return;
  const fido = readMethods().methods.find((m) => m.id === "Fido2");
  assert.strictEqual(fido?.state, "enabled", "2120 staat aan en eist een phishing-bestendige methode; zonder passkeys kan niemand daaraan voldoen.");
});

test("Temporary Access Pass is eenmalig zolang GLOBAL__2180 dat eist", () => {
  const state = templateState("GLOBAL__2180__GRANT__Register_Security_Info_TAP_Only");
  if (!state || state === "disabled") return;
  const tap = readMethods().methods.find((m) => m.id === "TemporaryAccessPass");
  assert.strictEqual(
    tap?.configuration?.isUsableOnce,
    true,
    "2180 accepteert alleen temporaryAccessPassOneTime; een meermalig bruikbare TAP voldoet daar niet aan."
  );
});

test("geen profiel belooft attestation én gesynchroniseerde passkeys", () => {
  for (const methode of readMethods().methods) {
    for (const profiel of methode.profiles || []) {
      if (!profiel.enforceAttestation) continue;
      assert.ok(
        !(profiel.passkeyTypes || []).includes("synced"),
        `${profiel.displayName}: gesynchroniseerde passkeys ondersteunen geen attestation, dus dit profiel laat ze in werkelijkheid niet toe.`
      );
    }
  }
});

/**
 * De twee valstrikken die op 16 september 2026 bij tejo.be dertien mislukte registraties
 * kostten, of er dichtbij liggen. Allebei falen ze stil: de gebruiker probeert, het lukt niet,
 * en niets in het portaal zegt waarom.
 */
test("geen profiel staat Windows Hello toe én dwingt attestation af", () => {
  const gewenst = readMethods();
  const hello = new Set(
    Object.entries(gewenst.knownAaGuids || {})
      .filter(([k]) => k !== "_comment")
      .map(([, v]) => String(v).toLowerCase())
  );
  for (const methode of gewenst.methods) {
    for (const profiel of methode.profiles || []) {
      if (!profiel.enforceAttestation) continue;
      const toegestaan = (profiel.keyRestrictions?.aaGuids || []).filter((g) => hello.has(String(g).toLowerCase()));
      assert.deepStrictEqual(
        toegestaan,
        [],
        `${profiel.displayName}: Microsoft schrijft voor dat een profiel voor Windows Hello-passkeys géén attestation mag afdwingen.`
      );
    }
  }
});

test("een afgedwongen allow-lijst is nooit leeg", () => {
  for (const methode of readMethods().methods) {
    for (const profiel of methode.profiles || []) {
      const kr = profiel.keyRestrictions;
      if (!kr?.isEnforced || kr.enforcementType !== "allow") continue;
      assert.ok(
        (kr.aaGuids || []).length > 0,
        `${profiel.displayName}: een lege allow-lijst staat geen enkele authenticator toe — niemand kan registreren.`
      );
    }
  }
});
