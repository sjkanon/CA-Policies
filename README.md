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
group-GUID's naar displayName vóór het vergelijken) en named locations (volledige inhoud:
landcodes/IP-ranges, niet alleen de naam).

**Wat NIET meetelt:** individuele gebruikersuitsluitingen (`includeUsers`/`excludeUsers`)
— te persoonlijk om zinvol tussen tenants te vergelijken. `state` (enabled/disabled) is
geen match-criterium maar bepaalt wel het resultaat: een structureel matchende maar
disabled/report-only policy levert `warning` op, geen `pass`.

**Bij een wijziging in `CATemplate/`:** `.github/workflows/generate-baseline.yml`
regenereert `baseline/conditional-access/baseline-v1.0.json` automatisch en opent daar een
PR voor — controleer de diff vóór je merget. Handmatig opnieuw genereren:
`node scripts/generate-baseline.js`.
