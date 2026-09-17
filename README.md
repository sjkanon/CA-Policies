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
`userRiskLevels`/`signInRiskLevels`, `servicePrincipalRiskLevels` en `clientApplications`
(workload-identiteiten), `agentIdRiskLevels`, `agents` en `agentContext`
(Entra Agent ID), `authenticationFlows` (device code flow / authentication transfer),
`grantControls`, `sessionControls`, ingebouwde
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
regenereert `baseline/conditional-access/baseline-v1.0.json` en `cipp/*.json`, en opent daar
een PR voor — controleer de diff vóór je merget. Dezelfde workflow draait op de PR zelf
(zónder een PR te openen): een ontbrekende pin of randvoorwaarde loopt daar stuk, terwijl
je nog weet wat je bedoelde. Handmatig: `node scripts/generate-baseline.js && node
scripts/export-cipp-baseline.js`.

**Wat níet vanzelf meebeweegt**, ook niet na een groene PR:

| | |
|---|---|
| `OPTIONAL_TEMPLATES` | een licentiegebonden template dat je hier vergeet belandt stil in stage 1 of 2 — hier faalt niets op |
| De baseline ín CIPP | `cipp/baseline-stages.json` is een bestand; de baseline in CIPP is een aparte kopie die iemand bijwerkt |
| De klanttenants | een template dat een nieuwe groep of locatie introduceert vraagt `New-CaPrerequisites.ps1`, per tenant |
| Het id van een custom authentication strength | Entra bepaalt het bij aanmaken, dus het template draagt een placeholder (nul-GUID). `New-CaPrerequisites.ps1` maakt de strength aan en meldt het echte id; dat moet met de hand in de CIPP-uitrol. Vandaag alleen `2180` |
| Passkey profiles | de opt-in is onomkeerbaar en het beheer loopt via het portaal. `Set-AuthenticationMethods.ps1` meldt het verschil, maar zet ze niet — zie [`authentication-methods/`](authentication-methods/README.md) |

## Wat er naast de CA-policies staat

`CATemplate/` is niet het hele verhaal. Twee mappen ernaast dragen wat een CA-policy nodig
heeft maar zelf niet is:

| Map | Wat erin staat | Bewaakt door |
|---|---|---|
| [`prerequisites/`](prerequisites/ca-prerequisites.json) | Groepen, named locations, custom authentication strengths en authentication contexts waar templates naar verwijzen | `scripts/prerequisites.js`, blokkerend in CI |
| [`authentication-methods/`](authentication-methods/README.md) | Welke aanmeldmethodes aan staan, en de passkey-profielen | `scripts/authentication-methods.js`, blokkerend in CI |

Die tweede map is het enige deel zonder checkId: de platform-engine kent de categorie niet, dus
er is geen toetsing tegen een klanttenant. Twee afhankelijkheden lopen van daar naar hier en
falen allebei stil — `2120` eist een phishing-bestendige methode die er niet is, of `2180` eist
een Temporary Access Pass die uit staat. De validator controleert precies die twee tegen de
werkelijke `state` van die templates.

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
4. Verwijst het template naar een groep of named location? Zorg dat die in
   `prerequisites/ca-prerequisites.json` staat — de generator weigert anders te draaien.
5. Geef het een normenmapping in `controls/ca-controls.json` — welke ISO-, NIS2-, CIS- en
   CSF-controls deze policy invult. `scripts/check-controls.js` weigert een template zonder.
6. `node scripts/generate-baseline.js && node scripts/export-cipp-baseline.js && node scripts/check-controls.js && node --test scripts/*.test.js`.

De generator faalt hard op een template zonder pin en noemt het eerstvolgende vrije nummer;
de test bewaakt hetzelfde in CI, ná het genereren.

## Verantwoording naar ISO 27001, NIS2, CIS en NIST CSF

`controls/ca-controls.json` zegt per policy welke controls hij technisch invult. Dat bestand is
geen document op zichzelf: het voedt `COMPLIANCE.md` in de
[IntuneBackup-repo](https://github.com/sjkanon/IntuneBackup), die de Intune- en de CA-kant in één
matrix zet — per ISO/IEC 27001:2022 Annex A-control, per NIS2-maatregel (art. 21 lid 2), per CIS
Controls v8.1-safeguard en per NIST CSF 2.0-subcategorie.

```
cd ../IntuneBackup
node scripts/generate-compliance.js --strict --ca ../CA-Policies/controls/ca-controls.json
```

Zonder `--ca` — en dat is wat er in git staat, want dat is wat CI daar regenereert — mist die
matrix de CA-kant. Dat scheelt het meest bij NIS2 (j), multifactorauthenticatie en beveiligde
communicatie: dat punt hangt vrijwel helemaal aan deze repo en nauwelijks aan Intune.

De fase komt niet uit een manifest maar uit `state` in het template zelf: `enabled` telt als
afgedwongen, report-only als voorbereid, `disabled` als niet uitgerold. Een policy in report-only
telt dus niet als afgedekt — hij doet niets, en zo hoort een auditor hem ook te zien.

De vocabulaire (de exacte labels) staat in `IntuneTemplate/_controls.json` in die andere repo.
`check-controls.js` toetst de labels daartegen als die repo ernaast staat; in CI kan dat niet, en
doet `generate-compliance.js --strict` het daar.

**Wat dit níet is:** een uitspraak dat een klant ISO-gecertificeerd of NIS2-conform is. Dit zegt
wat de baseline afdwingt, niet wat een tenant doet (dat toetst het platform), en beide kaders
vragen governance, risicobeheer, ketenafspraken en incidentmelding die met geen enkele
CA-policy in te vullen zijn.

## Uitrollen via CIPP

Dezelfde 41 templates voeden twee dingen die het tegenovergestelde doen:

| | Genereert | Doet |
|---|---|---|
| `scripts/generate-baseline.js` | `baseline/conditional-access/baseline-v1.0.json` | **toetst** een klanttenant |
| `scripts/export-cipp-baseline.js` | `cipp/ca-templates-import.json` + `cipp/baseline-stages.json` | **rolt uit** via CIPP |

Een CIPP-baseline bestaat niet uit policies maar uit *standards*: elk template is één keer
de standard **Conditional Access Template** in een stage, met een template-GUID, een state
en een actie (Report / Alert / Remediate). `cipp/baseline-stages.json` is die lijst, in ons
eigen formaat — het schema dat CIPP's Baselines-scherm zelf opslaat is versiegebonden en
staat daarom bewust niet vastgelegd in dit script.

De stage-indeling volgt de metadata die de repo al had:

| Stage | Wat erin | Uitgerold als |
|---|---|---|
| 1 — Kern | `state: enabled`, niet optioneel (17) | `enabled` |
| 2 — Aanscherping | `disabled` of report-only in het template (12) | report-only |
| 3 — Klantkeuze en licentie | `OPTIONAL_TEMPLATES` (12) | report-only, blijft op Report |

### Eerst de randvoorwaarden, dan pas Remediate

De templates verwijzen naar zes groepen en vier named locations die geen enkele tenant
vanzelf heeft. Ontbreken ze, dan faalt dat de verkeerde kant op: **een uitzonderingsgroep
die niet bestaat sluit niemand uit**, dus de policy wordt strenger dan bedoeld en niets slaat
alarm. Twee gevallen zijn daarbij geen "strenger" maar "gesloten":

- `Excluded from Conditional Access` staat in 35 van de 41 templates. De zes zonder richten
  zich op workload- en agent-identiteiten (`includeUsers: "None"`), dus daar raakt hij niets.
  Leeg = geen break-glass.
- `Licensed Users` — 1110 staat op `enabled` en blokkeert `All` behalve deze groep. Statisch
  of leeg aangemaakt blokkeert dat élke gebruiker in de tenant. Hij moet dynamisch zijn.

Daarom:

```powershell
./scripts/New-CaPrerequisites.ps1 -TenantId <klant> -WhatIf          # eerst kijken
./scripts/New-CaPrerequisites.ps1 -TenantId <klant> `
    -ServiceAccountIpRange '<cidr van deze klant>' `
    -BreakGlassUserId '<object-id>' -RequireSafeToDeploy             # dan aanmaken
```

Het script is idempotent en sluit met een fout af zolang de kritieke groepen leeg zijn.
Pas als het groen afsluit mag stage 1 afdwingen:

```bash
node scripts/export-cipp-baseline.js --remediate-stage1
```

Zonder die vlag staat élke standard op `Report`, en dat is ook wat CI genereert.

Die vlag weigert zolang er templates **nieuw in stage 1** staan ten opzichte van de vorige
export. Stage 1 leidt zichzelf af uit `state: enabled`, dus een template dat je vandaag
toevoegt valt daar vanzelf in; zonder die rem zou "ik heb een bestand toegevoegd" samenvallen
met "dit wordt bij elke klant afgedwongen". Het script noemt welke, en `--accept-new`
bevestigt ze. Hoort er iets niet in stage 1: zet het template op `disabled` (stage 2) of in
`OPTIONAL_TEMPLATES` (stage 3).

Wat die rem *niet* weet: wat er in CIPP en in de klanttenants daadwerkelijk staat — dat is
daar de waarheid, niet hier. Hij vergelijkt met de vorige export in deze repo, en vangt de
toevoeging dus af bij de auteur, niet bij de uitrol. Drie
templates blijven daar hoe dan ook op staan, omdat hun randvoorwaarde niet uit deze repo kan
komen: `1040` (vereist de landenlijst van die klant), `1060` (vereist de IP-ranges van die specifieke klant) en `1180` (vereist de
compliant-network-locatie die Entra pas levert bij Global Secure Access).

`prerequisites/ca-prerequisites.json` is de bron voor beide scripts.
`scripts/prerequisites.js` faalt op elke verwijzing zonder definitie, en op een named
location waarvan de inhoud in het template afwijkt van de definitie — de platform-engine
vergelijkt die op volledige inhoud, dus die twee moeten gelijk blijven.
