# CA-Policies

`CATemplate/` bevat de afgesproken Conditional Access-policies (rauwe export, Table
Storage-backupformaat, genummerd `GLOBAL__1xxx` BLOCK / `2xxx` GRANT / `3xxx` SESSION).

`baseline/conditional-access/baseline-v1.0.json` is daaruit gegenereerd
(`scripts/generate-baseline.js`) in het schema dat
[TEST Policies Platform](https://github.com/sjkanon/Platform) leest via zijn
baseline-koppeling (Instellingen → Baseline-koppelingen, categorie `conditional-access`).
Elke `GLOBAL__*.json` wordt één checkId-regel (`type: "ca-policy-match"`); de
platform-engine vergelijkt de structurele policy-opzet (condities, grant-/session-controls)
tegen wat er in een klanttenant staat.

**Wat wél meetelt in de vergelijking:** `clientAppTypes`, `platforms`, `applications`,
`userRiskLevels`/`signInRiskLevels`, `grantControls`, `sessionControls`, ingebouwde
directory-rollen (`includeRoles`/`excludeRoles` — overal dezelfde GUID's), groepen
(`includeGroups`/`excludeGroups` — op naam, de platform-engine resolvet de live
group-GUID's naar displayName vóór het vergelijken), gasten en externe gebruikers
(`includeGuestsOrExternalUsers`/`excludeGuestsOrExternalUsers` — de gasttypen, niet de
`externalTenants`) en named locations (volledige inhoud: landcodes/IP-ranges, niet alleen
de naam).

**Wat NIET meetelt:** individuele gebruikersuitsluitingen (`includeUsers`/`excludeUsers`)
— te persoonlijk om zinvol tussen tenants te vergelijken. `state` (enabled/disabled) is
geen match-criterium maar bepaalt wel het resultaat: een structureel matchende maar
disabled/report-only policy levert `warning` op, geen `pass`.

**Bij een wijziging in `CATemplate/`:** `.github/workflows/generate-baseline.yml`
regenereert `baseline/conditional-access/baseline-v1.0.json` automatisch en opent daar een
PR voor — controleer de diff vóór je merget. Handmatig opnieuw genereren:
`node scripts/generate-baseline.js`.

## Een policy toevoegen

Eén ding is niet optioneel: **elk template heeft een vastgepind checkId-nummer** in
`CHECK_ID_BY_TEMPLATE` (bovenin `scripts/generate-baseline.js`), en dat nummer verandert
nooit meer. De generator telde hiervóór simpelweg door over de gesorteerde bestandsnamen,
en dan schuift één nieuw template met een laag `GLOBAL`-nummer alles daarna één op. Het
checkId is in het platform de sleutel waarop drift over runs vergeleken wordt en waarop
klantuitzonderingen hangen; een hernummering leest daar als "oude check verdwenen, nieuwe
check erbij" — een regressie in de tijdlijn die er niet is, en een uitzondering die
stilzwijgend op een andere check terechtkomt.

Dus:

1. Zet het template in `CATemplate/` als `GLOBAL__<nummer>__<BLOCK|GRANT|SESSION>__<Naam>.json`.
2. Geef het in `CHECK_ID_BY_TEMPLATE` het **eerstvolgende vrije** nummer — nooit een
   bestaand nummer, ook niet als het bijbehorende template ooit verwijderd is.
3. Vraagt de policy een licentie of is hij een klantkeuze? Zet 'm dan in
   `OPTIONAL_TEMPLATES` met de reden; hij krijgt dan `optional: true` en levert bij een
   klant zonder die licentie geen `fail` op voor iets wat hij niet kán hebben.
4. `node scripts/generate-baseline.js && node --test scripts/generate-baseline.test.js`.

De generator faalt hard op een template zonder pin en noemt het eerstvolgende vrije nummer;
de test bewaakt hetzelfde in CI, ná het genereren.
