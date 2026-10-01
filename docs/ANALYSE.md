**Nederlands** · [English](ANALYSE.en.md) · [Français](ANALYSE.fr.md)

# Gapanalyse — wat mist de CA-baseline, en wat moet er veranderen

Handgeschreven. Dit legt vast waar de
33 templates vandaan komen, waartegen ze zijn getoetst, en — belangrijker — wat er bewust
**niet** in zit en waarom. Zonder dat laatste weegt een volgende ronde dezelfde policies
opnieuw.

Datum: 3 september 2026. De set telde toen 33 templates. Na de latere rondes (onderaan) zijn
het er 44; de cijfers in de rest van dit document zijn die van de ronde waarin ze staan en zijn
bewust niet herschreven.

## De vraag

De Intune-set is in augustus 2026 tegen IntuneAdmin gelegd (874 profielen, zie
`docs/ANALYSE.md` in de IntuneBackup-repo).
Voor CA gebeurde iets vergelijkbaars, maar de uitkomst staat ergens anders en is inmiddels
verlopen. Deze ronde beantwoordt twee vragen die daar niet in zaten:

1. Hoe verhoudt de set zich tot de **normatieve** bronnen — MCSB, CIS Microsoft 365
   Foundations en Microsofts eigen CA-templates — in plaats van tot community-frameworks?
2. Wat mankeert er aan de set **als geheel**, los van welke maatregelen erin zitten?

Die tweede vraag kwam op door de set naast een echte tenant te leggen (september
2026). Daar bleek dat drie eigenschappen van de set uitrol in de weg zitten, en die zijn met
geen enkele policyvergelijking te vinden.

## Wat er al lag

Een gaprapport van 13 augustus 2026, gegenereerd buiten deze repo. Dat rapport legde de set
naast drie persona- of nummergebaseerde frameworks:

| Framework | Policies | Toen gedekt |
|---|---:|---:|
| Daniel Chronlund — CA policy design baseline | 21 | 20 (95%) |
| Kenneth van Surksum — CA baseline v2025-10 | 49 | 28 (57%) |
| Joey Verlinden — CA Framework 2026.6.1 | 36 | 24 (67%) |

Het legde ook de herkomst vast, en dat is nog steeds het belangrijkste stuk context in deze
repo: **onze nummering *is* Chronlunds baseline.** De reeks `1010`–`3040`, de indeling
BLOCK/GRANT/SESSION en de naamvorm `GLOBAL - nnnn - ACTIE - Omschrijving` komen één op één
uit zijn ontwerp. Dat verklaart waarom alles één prefix draagt — sinds 30 september 2026
`CXNM - STANDARD` in plaats van Chronlunds `GLOBAL` — terwijl de andere twee
frameworks persona-gebaseerd zijn — zie *Waarom er geen persona's zijn* hieronder.

**Dat rapport is verlopen.** Het beschrijft 20 templates; er zijn er 33. En dat is geen
achterstand maar het tegendeel: **elke kandidaat die het aandroeg is inmiddels gebouwd.**

| Kandidatenlijst van 13 augustus | Nu |
|---|---|
| MFA bij registreren/joinen van een apparaat | `2080` |
| Gasten alleen naar goedgekeurde apps (allow-list) | `1120` |
| MFA op beheerportalen voor álle gebruikers | `2100` |
| Voorwaarde op browsertoegang vanaf onbeheerd apparaat | `2090` |
| Token protection | `2110` |
| Accounts zonder licentie blokkeren | `1110` |
| *optional* — sessies via Defender for Cloud Apps | `3060` |
| *optional* — managed identities bij verhoogd risico | `1140` |
| *optional* — Cloud PC-toegang vanaf mobiel | `2150` |
| *besluit per tenant* — Terms of Use | geen template — toen een losse controle zonder uitrol, die in september 2026 is vervallen |
| *besluit per tenant* — phishing-resistant MFA voor iedereen | `2120` |
| *besluit per tenant* — beheerders alleen vanaf compliant apparaat | `2130` |
| *besluit per tenant* — beheerders niet vanaf onvertrouwde locaties | `1130` |
| *besluit per tenant* — CAE expliciet afdwingen | `3050` |
| *nog niet* — agent-identiteiten | **nog steeds niet** — zie hieronder |

Veertien van de vijftien afgehandeld; Terms of Use is nooit een template geworden en staat
sinds september 2026 nergens meer. De vergelijking met community-frameworks is daarmee
uitgeput; wat overblijft moet uit een andere hoek komen.

## Bronnen van deze ronde

| Bron | Wat het is | Hoe gebruikt |
|---|---|---|
| [Microsoft cloud security benchmark — Identity Management](https://learn.microsoft.com/en-us/security/benchmark/azure/mcsb-identity-management) | IM-1 t/m IM-9; IM-7 somt zeven CA-toepassingen op | alle zeven nagelopen |
| [CIS Microsoft 365 Foundations Benchmark](https://www.cisecurity.org/benchmark/microsoft_365), sectie 5.2.2 | v4/v5 controls 1–12, plus de vijf die v7.0.0 toevoegde | de vijf nieuwe apart getoetst |
| [Microsofts eigen CA-templates](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-policy-common) | zes categorieën, waaronder de nieuwe **AI Agents** | per categorie vergeleken |
| Vergelijking met een echte tenant, september 2026 | 33 templates tegen 16 werkelijke policies | leverde de structurele bevindingen |

De frameworks van Chronlund, van Surksum en Verlinden zijn **niet** opnieuw gedraaid; het
rapport van 13 augustus volstond daarvoor.

## Uitkomst in cijfers

| | |
|---|---:|
| Templates | 33 |
| Waarvan `state: enabled` | 21 |
| Waarvan `state: disabled` | **11** |
| Waarvan report-only | **1** |
| MCSB IM-7-toepassingen gedekt | 7 van 7 |
| CIS 5.2.2 nieuw in v7.0.0 gedekt | 3 van 5 (1 half) |
| Microsoft-templatecategorieën gedekt | 5 van 6 |

## Wat we missen

### Toevoegen

| Maatregel | Bron | Waarom het de lat haalt |
|---|---|---|
| **Periodieke herauthenticatie voor alle gebruikers** | CIS 5.2.2.13 (L1); Microsoft *No persistent browser session* | We zetten sessieduur alleen voor beheerders (`3010`) en BYOD (`3020`). Een gewone gebruiker op een beheerd apparaat houdt zijn sessie onbeperkt. Dat is precies het token dat bij AiTM wordt gestolen en waar `2110` alleen op Windows/Exchange/SharePoint iets tegen doet. Eén nieuw SESSION-template, sign-in frequency op de tenantbrede waarde, `persistentBrowser` ongemoeid (die hoort bij onbeheerde apparaten, niet bij alle). |
| **Named locations als onderdeel van de repo** | CIS 5.2.2.14 (L2) | Zie *Wat er stuk is*, punt 1. Dit is geen policy maar een randvoorwaarde, en het ontbreken ervan is het gevaarlijkst van alles wat hier staat. |

### Toevoegen (`optional`)

| Maatregel | Bron | Licentie | Waarom |
|---|---|---|---|
| **Insider risk** | Microsoft, categorie Zero Trust — *Block access for users with insider risk* | Microsoft Purview | `insiderRiskLevels` komt in geen enkel template voor. Onze risicopolicies (`1090`/`1100`/`2010`/`2020`) kijken naar aanmeldsignalen; insider risk kijkt naar gedrag in de data — exfiltratie vlak voor vertrek, ongebruikelijke downloads. Een andere vraag, geen dubbeling. Vraagt Purview, dus `optional`. |

### Heroverwegen: agent-identiteiten

Het rapport van 13 augustus zette dit op *nog niet*, met een goed argument: Entra Agent ID
was niet breed beschikbaar, en een baselineregel voor een voorziening die de tenant niet
kent levert bij iedereen ruis op.

Er is sindsdien iets veranderd. **Microsoft levert nu zelf een templatecategorie AI Agents**
met drie policies (*Block high-risk agent identities*, *Configure policy for autonomous agent
access*, *Configure policy for on-behalf-of agent access*), en de conditie `agents` staat in
het Graph-schema van élke policy — hij staat in alle 33 van onze templates, op `null`.

Dat verandert de afweging maar niet het antwoord. Het argument tegen was nooit "de maatregel
deugt niet" maar "de voorziening is er niet". Zodra `agents` in tenants daadwerkelijk te
configureren is, is dit een `optional`-template van hetzelfde soort als `1140` — en het
`optional`-mechanisme bestaat juist om die ruis te voorkomen. **Actie: opnieuw beoordelen
zodra Entra Agent ID algemeen beschikbaar is, en dan als `optional` toevoegen, niet als
gewoon template.**

### Wat wél gedekt bleek

- **MCSB IM-7** somt zeven CA-toepassingen op: MFA voor beheerders (`2055`, `2100`), MFA voor
  Azure-beheer (`2100` bevat `797f4846-…`, de Azure Service Management API), legacy auth
  blokkeren (`1010`), vertrouwde locaties voor MFA-registratie (`3030`), toegang per locatie
  (`1040`, `1050`), risicovol aanmeldgedrag (`1090`, `2010`), beheerde apparaten voor
  specifieke apps (`2060`, `2130`). Alle zeven aanwezig.
- **CIS 5.2.2.15** (geografische uitsluiting) — `1040` en `1050`.
- **CIS 5.2.2.16** (token protection) — `2110`.
- **CIS 5.2.2.17** (authentication transfer blokkeren) — `1020` dekt dit, met
  `authenticationFlows.transferMethods = "deviceCodeFlow,authenticationTransfer"`. **Maar dat
  template staat op `disabled`** en dwingt dus niets af. Zie hieronder.

## Wat er stuk is aan de set zelf

Vier eigenschappen die met geen policyvergelijking te vinden zijn, maar die uitrol in de weg
zitten. Alle vier gevonden door de set op een echte tenant te leggen.

### 1. De randvoorwaarden worden niet meegeleverd — en dat is gevaarlijk

De templates verwijzen naar zes groepen en vier named locations die de repo nergens
definieert en nergens als voorwaarde noemt:

```
Excluded from Conditional Access                  Allowed Countries
Conditional Access Service Accounts               High-Risk Countries
Licensed Users                                    Service Accounts Trusted IPs
Excluded from Legacy Authentication Block         AllTrusted
Excluded from Device Code Auth Flow Block
Excluded from Country Block List
```

Bij de getoetste tenant bestond **geen van de zes groepen**, en de named locations heetten er anders.
Het probleem is niet dat de uitrol dan faalt. Het probleem is dat hij *slaagt*: een
uitzonderingsgroep die niet bestaat sluit niemand uit, dus de policy wordt strenger dan
bedoeld. `Excluded from Conditional Access` is de break-glass-uitsluiting. Een set van 33
policies uitrollen waarvan de break-glass-groep niet bestaat is de klassieke manier om een
tenant volledig buiten te sluiten — en dan veroorzaakt door onze eigen templates.

**Wat moet veranderen:** de repo levert de groepen en named locations als aanmaakscript mee,
en de generator faalt op een template dat naar een groep of locatie verwijst die
niet in die lijst staat. Zoals `check-scope.js` in IntuneBackup bewaakt dat elk bestand op
zijn plek staat, moet hier bewaakt worden dat elke verwijzing een gedefinieerde tegenhanger
heeft.

### 2. Twaalf van de 33 templates dwingen niets af

Elf templates staan op `disabled`, één op report-only. Ze worden meegeleverd, maar een tenant
die de set overneemt krijgt van deze twaalf niets afgedwongen.

```
disabled    1020  Device Code Auth Flow            <- dekt CIS 5.2.2.17 (L1)
disabled    1030  Unsupported Device Platforms
disabled    1040  Countries not Allowed            <- dekt CIS 5.2.2.15 (L1)
disabled    1060  Service Accounts
disabled    1070  Explicitly Blocked Cloud Apps
disabled    1080  Guest Access to Sensitive Apps
disabled    1100  High-Risk Users
disabled    2055  Phishing Resistant MFA for Admins
disabled    2060  Mobile Apps and Desktop Clients
disabled    2070  Mobile Device Access Requirements
disabled    3040  Block File Downloads On Unmanaged Devices
report-only 3020  BYOD Persistence
```

Dat is een derde van de set die per definitie niets doet. Nergens staat wélke, of waarom.
Twee gevallen zijn bovendien onderling tegenstrijdig:

- **`2055` staat uit, `2120` staat aan.** 2055 is phishing-resistant MFA voor beheerders,
  2120 voor álle gebruikers. De lijst met optionele templates (nu `CATemplate/_manifest.json`) noemt 2120 *"het einddoel waar de
  admin-variant (2055) de eerste stap van is… een uitrolproject en geen instelling"*. De set
  levert dus de eerste stap uit en het einddoel aan. Omgedraaid.
- **`1090` staat aan, `1100` staat uit.** Beide risicopolicies, beide Entra ID P2. Geen reden
  gedocumenteerd waarom aanmeldrisico wel en gebruikersrisico niet.

**Wat moet veranderen:** één veld per template dat zegt waarom het uit staat, zoals
`faseWaarom` in IntuneBackup dat doet — en een generator die faalt op een niet-`enabled`
template zonder die reden. Daarna 2055 aanzetten en de 1090/1100-keuze rechttrekken.

### 3. De licentiemarkering is half

De optionele lijst bestaat precies om te voorkomen dat een tenant iets afgedwongen krijgt wat
hij zonder licentie niet kán hebben. Zes templates staan erin. **Vijf die Entra ID P2 vereisen
staan er niet in:**

| Template | Vereist | Optioneel |
|---|---|---|
| `1090` High-Risk Sign-Ins | Entra ID P2 | nee |
| `1100` High-Risk Users | Entra ID P2 | nee |
| `2010` Medium-Risk Sign-ins | Entra ID P2 | nee |
| `2020` Medium-Risk Users | Entra ID P2 | nee |
| `2110` Token Protection | Entra ID P2 | nee |
| `1140` Managed Identities At Risk | Workload ID Premium | ja |
| `3060` Defender for Cloud Apps | MDCA | ja |

De inconsistentie is aantoonbaar en niet bedoeld: de oudere, losse controles die deze
templates vervingen droegen de P2-markering wél. De templates (`1090`, `1100`, `2010`,
`2020`) namen die markering niet mee.

**Wat moet veranderen:** die vijf optioneel, met de licentie als reden. In een tenant zonder P2
zijn dat nu vijf policies in de kern die daar niet kunnen werken — en een kern waarvan een deel
nooit werkt leert iedereen om de rest ook niet serieus te nemen.

### 4. De gapanalyse stond buiten deze repo

Het rapport van 13 augustus beschreef de templates van deze repo, maar stond ergens anders. De
README hier zei bij *Een policy toevoegen* niets over het bijwerken daarvan, dus het rapport liep
onopgemerkt drie weken achter — 20 templates beschreven, 33 aanwezig.

**Wat moet veranderen:** de analyse hoort naast de templates, en bij elke inhoudelijke wijziging
in `CATemplate/` een ronde erbij. Dat is dit document.

## Waarom er geen persona's zijn

Elk template draagt hetzelfde prefix, terwijl van Surksum en Verlinden per persona indelen — Admins,
Internals, Externals, Guests, ServiceAccounts, Agents. Dat is geen omissie en hoeft niet
opnieuw gewogen te worden.

De set is Chronlunds ontwerp, en dat is bewust global: één set regels die voor iedereen
geldt, met rol- en groepsfilters *binnen* de policy waar dat nodig is. Dat doen we ook —
`1130`, `2055`, `2130` en `3010` richten alle vier op dezelfde elf directory-rollen via
`includeRoles`. Het onderscheid bestaat dus wel degelijk, het staat alleen in de conditie in
plaats van in de naam.

Persona's toevoegen zou betekenen: dezelfde maatregel in twee policies knippen zodra hij voor
twee groepen anders uitpakt. Dat is precies wat het rapport van 13 augustus expliciet
afwijst — *"één regel per maatregel, niet per policy"* — omdat het twee policies
oplevert voor één vraag.

**Het prefix.** Tot 30 september 2026 heette alles `GLOBAL`, naar Chronlund. Dat suggereerde een
tweede dimensie die er niet is en ook niet komt. Nu is het `CXNM - STANDARD` in de tenant en
`CXNM__STANDARD__` als bestandsnaam: het zegt van wie de set is en dat het de standaard is, niet
voor wie. De nummering is ongewijzigd. Als er ooit een tweede persona bijkomt, is dat een
herontwerp en geen toevoeging.

## Wat we bewust niet doen

| Maatregel | Waarom niet |
|---|---|
| **Persona-splitsing** | Zie hierboven. Eén regel per maatregel; het onderscheid zit in `includeRoles`. |
| **MFA voor serviceaccounts** (Verlinden `CA300`) | Spreekt onszelf tegen: `1060` beperkt serviceaccounts tot vertrouwde IP's en `2050` sluit ze juist uit van de MFA-eis. Een niet-interactief account kan geen MFA doen. |
| **Linux toestaan vanaf compliant apparaat** (van Surksum `CAD011`) | Spreekt `1030` tegen, dat alles buiten Android/iOS/Windows/macOS blokkeert. Wie Linux wil ondersteunen past `1030` aan — één wijziging, geen tweede policy. |
| **Microsofts templates rechtstreeks via Graph** (`/identity/conditionalAccess/templates`) | De meest onderhoudsarme toetssteen, en nog steeds niet uitgezocht welke permissies dat vraagt. Deze ronde is de templatelijst uit de documentatie gebruikt in plaats van uit de API. Blijft openstaan. |
| **[AlexFilipin/ConditionalAccess](https://github.com/AlexFilipin/ConditionalAccess)** | Vierde persona-gebaseerde set. Niet meegenomen — de drie uit het rapport van 13 augustus leverden nul nieuwe maatregelen op die niet al uit CIS of Microsoft kwamen. Opnieuw bekijken zodra die drie niets meer opleveren. |

## Wat er moet veranderen — de lijst

Op volgorde. De eerste drie zijn dringender dan elk nieuw template, want ze raken de set die
er al staat.

1. **Randvoorwaarden meeleveren.** Groepen en named locations als aanmaakscript, plus een
   controle die faalt op een verwijzing zonder definitie. Zonder
   dit is elke uitrol een lock-outrisico.
2. **De optionele lijst aanvullen** met `1090`, `1100`, `2010`, `2020` en `2110`, reden
   Entra ID P2.
3. **Een reden verplichten bij elke niet-`enabled` `state`,** en de twaalf gevallen
   langslopen. Begin met `2055` aanzetten en de `1090`/`1100`-tegenstrijdigheid oplossen.
4. **Nieuw template:** periodieke herauthenticatie voor alle gebruikers (CIS 5.2.2.13).
5. **Nieuw template (`optional`):** insider risk, licentie Microsoft Purview.
6. **De gapanalyse naast de templates houden**, zodat hij niet opnieuw drie weken achterloopt.
7. **Agent-identiteiten opnieuw beoordelen** zodra Entra Agent ID algemeen beschikbaar is —
   dan als `optional`.
8. **Microsofts templates via Graph** uitzoeken als vervanging voor de handmatige
   documentatievergelijking.

Punt 1 t/m 3 zijn onderhoud aan wat er is en veranderen geen enkele maatregel. Punt 4 en 5
voegen twee templates toe. Punt 6 t/m 8 zijn proces.

---

# Ronde 2 — j0eyv Conditional Access Baseline 2026.6.1

Datum: 4 september 2026. De eerste ronde legde de set naast MCSB, CIS en Microsofts eigen
templates en zette de community-frameworks bewust opzij. Deze ronde doet er alsnog één met de hand, en wel de enige die sinds augustus
is bijgewerkt: [`j0eyv/ConditionalAccessBaseline`](https://github.com/j0eyv/ConditionalAccessBaseline),
versie **2026.6.1** (12 juni 2026), 36 policies. Met de hand, want wat hier moest gebeuren is
templates schrijven in het CIPP-formaat van `CATemplate/`.

**Uitkomst: 26 van zijn 36 waren gedekt (72%, was 67% in augustus).** Wat ontbrak zat in twee
hoeken — agent-identiteiten en gastsessies — plus vier fouten in policies die er al stonden.

## Wat is toegevoegd

| Template | Bron | Waarom |
|---|---|---|
| `3070 SESSION` Session Limits All Users | CA402/CA403 + CIS 5.2.2.13 | Sessieduur gold alleen voor beheerders (`3010`) en BYOD (`3020`), en `3020` sloot gasten expliciet uit. Een gast had dus een **onbeperkte sessie op een onbeheerd apparaat**. Nu 12 uur voor iedereen behalve break-glass en serviceaccounts; `3010` blijft met 9 uur strenger voor beheerders. |
| `1150 BLOCK` Risky Agent Identities | CA501 | `agentIdRiskLevels: high` op agent-service-principals. `1140` dekt alleen `servicePrincipalRiskLevels` — een andere identiteit, geen dubbeling. |
| `1160 BLOCK` Agent Identities To Agent Resources | CA502 | Allow-list op `AllAgentIdResources`. |
| `2160 GRANT` Agent Users Compliant Device | CA503 | `agentContext: agentUserSessionsInitiatedFromEndpoints`. |
| `1170 BLOCK` Risky Agent Users | CA504 | `agentIdRiskLevels: medium,high` op agent-*users*. |
| `1180 BLOCK` Agent Users Outside Compliant Network | CA505 | Enige plek in de set met een compliant-network-conditie (Global Secure Access). |
| `2170 GRANT` MFA for Intune Enrollment | CA203 | `2080` dekt de user action `urn:user:registerdevice`, niet de app `d4ebce55` (Intune Enrollment) met `frequencyInterval: everyTime`. Ander pad, zelfde moment. |

De vijf agent-templates zijn optioneel (vereisen Entra Agent ID, `1180` ook
GSA). Vier ervan staan op report-only, net als bij Verlinden — `1160` is een allow-list die
bij blind inschakelen elke bestaande agent stillegt, `2160` en `1170` blokkeren op iets wat
in vrijwel geen tenant in kaart is. **De reden staat per template in de optionele lijst (nu
`CATemplate/_manifest.json`) en komt daarmee als `optionalReason` in `cipp/baseline-stages.json`.** Dat is de mechanisme-loze variant van punt 3
hieronder ("een reden verplichten bij elke niet-`enabled` state"); het veld bestaat nog niet,
dus dit is de beste plek die er vandaag is. Daarmee staat de teller op **16 van de 40
templates die niets afdwingen** — het probleem uit ronde 1 is niet opgelost,
alleen niet vergroot zonder uitleg.

Hiermee is punt 4 van de lijst uit ronde 1 afgehandeld (periodieke herauthenticatie) en punt
7 ingehaald door de werkelijkheid: Microsoft levert de agent-condities nu in Graph en
Verlinden gebruikt ze, dus "opnieuw beoordelen zodra Entra Agent ID GA is" is nu gebeurd —
als `optional`, precies zoals ronde 1 voorschreef.

## Wat is gerepareerd

1. **De admin-rollenlijst was te kort: 11 rollen, nu 28.** `1130`, `2055`, `2130` en `3010`
   richtten zich op elf rollen; Verlinden gebruikt er 24. Toegevoegd zijn onder meer
   **Exchange-, SharePoint-, Intune-, Teams-, User-, Helpdesk-, Password- en Authentication
   Administrator** — allemaal rollen waarmee je de tenant kunt overnemen — plus de rollen die
   2026.6.1 toevoegde: **Agent ID, Agent Registry, AI, Windows 365, Entra Backup, Microsoft
   365 Backup en Dragon Administrator**. Onze vier eigen rollen (Authentication Policy,
   Compliance, Compliance Data, Hybrid Identity) blijven staan; die heeft hij niet.
2. **`2050` sloot `AllTrusted` uit.** MFA voor alle gebruikers verviel op een vertrouwde
   locatie — ook voor gasten. Verlinden kent die uitzondering niet (CA000/CA400) en CIS raadt
   trusted-IP-bypass af. Uitzondering verwijderd.
3. **`2060` en `2090` sloten de Intune-apps niet uit.** "Vereis een compliant apparaat"
   zonder uitzondering voor `0000000a` (Microsoft Intune) en `d4ebce55` (Intune Enrollment)
   is een kip-ei: je kunt niet enrollen om compliant te wórden. `2070` deed het half. Beide
   apps nu uitgesloten, zoals in CA205/CA208.
4. **`1120` blokkeerde My Apps voor gasten.** Zonder `2793995e-…` in de uitzonderingen kan
   een gast zijn uitnodiging niet inwisselen. Toegevoegd, zoals in CA401.
5. **`3020` sloot gasten uit.** De policy die onbeheerde apparaten begrenst, sloeg niet aan
   op juist de groep die per definitie geen beheerd apparaat heeft. Uitsluiting verwijderd.

## Wat we van hem niet overnemen

| Zijn policy | Waarom niet |
|---|---|
| CA300 — MFA voor serviceaccounts | Al afgewezen in ronde 1: spreekt `1060` en `2050` tegen. |
| Persona-splitsing (CA100-105 naast CA200-210) | Al afgewezen in ronde 1: één regel per maatregel, het onderscheid zit in `includeRoles`. Zijn admin- en internals-persona's zijn grotendeels dezelfde maatregel twee keer. |
| CA104 `continuousAccessEvaluation: strictLocation` | Ons `3050` staat op `strictEnforcement` en is strenger. |
| CA005/CA006 los | Gedekt door `2070`, `2090` en `3040` samen. |

Andersom heeft hij tien maatregelen niet die wij wel hebben: `1050`, `1110`, `1140`, `2110`,
`2120`, `2130`, `1130`, `3030`, `3040`, `3060` en `2150`. Dit was geen inhaalslag.

## Wat hierna nog openstaat

De punten 1, 2, 3, 6 en 8 uit de lijst van ronde 1 staan onveranderd open — en punt 1
(randvoorwaarden meeleveren) is met deze ronde dringender geworden: `1180` verwijst naar de
named location **All Compliant Network locations**, en de nieuwe agent-templates komen uit een
tenant waar Entra Agent ID aan staat. Daar komt één ding bij:

- **Controleren of CIPP's CA-deploy de beta-velden meestuurt** (`agents`, `agentContext`,
  `agentIdRiskLevels`, `includeAgentIdServicePrincipals`, `AllAgentIdResources`). Zo niet, dan
  rollen de vijf agent-templates wel uit maar zonder hun onderscheidende conditie — en dat is
  gevaarlijker dan ze niet uitrollen, want `1160` wordt dan een blokkade op alles.

# Ronde 3 — registratie van MFA-methodes achter een TAP (7 september 2026)

## De aanleiding

De r/msp-draad *"Block new PassKey registrations"* beschrijft een gat dat deze set niet
dichtte: wie een sessie overneemt — AiTM-phishing, een rogue browser-extensie, of gewoon
overtuigingskracht — registreert er zélf een passkey bij en heeft daarna een eigen,
phishing-resistente sleutel tot de tenant. Een wachtwoordreset raakt die niet, en de
sign-in-log laat een schone, sterke aanmelding zien.

De draad noemt drie richtingen; alleen de eerste is een Conditional Access-maatregel:

1. de registratiepagina achter een authentication strength zetten die alleen een TAP
   accepteert — registreren kan dan niet meer vanuit een bestaande sessie;
2. attestation afdwingen en AAGUID's beperken, zodat synced passkeys uit password managers
   niet meer registreren — dat staat in het **authentication methods policy**, niet in CA,
   en valt dus buiten deze repo;
3. browser-extensies beheren via Intune — idem, andere repo.

Wat de set al had is `3030`: die target dezelfde user action (`urn:user:registersecurityinfo`)
maar zet er alleen een sign-in frequency van 90 dagen op, zónder `grantControls`. De
registratie zelf stond daarmee open voor precies de sessie die een aanvaller al heeft.

## Wat is toegevoegd

| Template | Waarom |
|---|---|
| `2180 GRANT` Register Security Info TAP Only | `grantControls` op de user action die `3030` alleen in duur begrenst: alleen een eenmalige Temporary Access Pass voldoet. Een gekaapte sessie kan er geen methode bij zetten; de helpdesk geeft een TAP uit of het gebeurt niet. |

**Waarom apart en niet ín 3030.** Het zijn twee maatregelen met een verschillende
levenscyclus: `3030` is een sessiebegrenzing die overal aan kan, `2180` is een grant die pas
kan zodra de tenant een custom authentication strength én een TAP-proces heeft.

`2180` is optioneel (stage 3, report-only): hij vraagt een randvoorwaarde
per tenant, en hij verlegt het aanvalsoppervlak naar de servicedesk. Zonder identiteits-
verificatie bij de TAP-aanvraag is de winst kleiner dan hij lijkt.

## Wat hierna nog openstaat

- **De custom strength is een randvoorwaarde die de validator niet ziet.**
  `prerequisites/ca-prerequisites.json` kent alleen groepen en named locations, dus
  `scripts/prerequisites.js` valt hier stil. Het id in het template is een placeholder
  (`00000000-0000-0000-0000-000000000000`); bij uitrol moet het id van de aangemaakte
  strength in die tenant erin. Zolang dat handwerk is, hoort `2180` niet in stage 1.
- **Controleren of CIPP's CA-deploy een custom authentication strength meestuurt of alleen
  koppelt.** Zo niet, dan rolt `2180` uit zonder grant control — dat is geen strengere maar
  een lege policy.

# Ronde 4 — j0eyv na 2026.6.1, en de set generiek (14 september 2026)

## De aanleiding

[`j0eyv/ConditionalAccessBaseline`](https://github.com/j0eyv/ConditionalAccessBaseline) is na de
tag 2026.6.1 (die ronde 2 volgde) nog bijgewerkt, zonder nieuwe tag. Inhoudelijk telt één ding:
CA005 en CA006 zijn omgebouwd van *Require app protection policy* naar
**app enforced restrictions** als sessiecontrole. De rest is een README, afbeeldingen en een
typfout in de namen van CA403/CA404.

| Zijn policy (na 13 juli 2026) | Wat hij doet | In deze set |
|---|---|---|
| CA005 — iOS/Android, browser én apps, Office 365, onbeheerd | `compliantApplication` als grant **plus** app enforced restrictions; uitgesloten: compliant én bedrijfseigen apparaten | `2070` (compliant app op iOS/Android). `2090` eist in de browser al een compliant apparaat, dus browser toevoegen aan `2070` voegt niets toe. |
| CA006 — elk platform, browser, **SharePoint én Exchange Online**, onbeheerd | alleen app enforced restrictions | `3040` — maar die gold alleen voor SharePoint Online |

## Wat is aangepast

**`3040` dekt nu ook Exchange Online** (`00000002-0000-0ff1-ce00-000000000000`). Ronde 2 schreef
"CA005/CA006 los: gedekt door `2070`, `2090` en `3040` samen"; dat klopte voor SharePoint en
OneDrive, maar een bijlage downloaden via Outlook op het web op een onbeheerd apparaat ging er
langs. Eén kanttekening:

- Voor Exchange doet de sessiecontrole alleen iets als de OWA-mailboxpolicy meewerkt:
  `Set-OwaMailboxPolicy -Identity OwaMailboxPolicy-Default -ConditionalAccessPolicy ReadOnly` (of
  `ReadOnlyPlusAttachmentsBlocked`). Zonder die stap is de policy voor Exchange stil. Die instelling
  staat niet in deze repo; hij hoort in de randvoorwaarden per tenant.

Het apparaatfilter van j0eyv (compliant **én** `deviceOwnership -eq "Company"`) is niet
overgenomen. Dat zou een ingeschreven, compliant privéapparaat ook onder de beperking brengen;
dat is een keuze per tenant over BYOD, geen baselinemaatregel.

**`1060` draagt geen IP-range meer.** Het template bevatte één publiek IP uit de tenant waaruit
het ooit geëxporteerd is. De generator haalde het er bij de CIPP-export al uit en
`New-CaPrerequisites.ps1` gebruikte het niet, maar het stond wel in `CATemplate/` en in de
gegenereerde bestanden. Nu is de named location in het template leeg,
gelijk aan `prerequisites/ca-prerequisites.json`; de waarde komt per tenant binnen via
`-ServiceAccountIpRange`. Het IP staat nog wel in de git-geschiedenis.

**`1040` draagt geen standaardlanden meer.** Het template en `prerequisites/` noemden BE en NL —
de landen van één organisatie. Nu is `Allowed Countries` leeg en gemarkeerd als `requiresCountries`:
de CIPP-export zet `1040` vast op Report tot de landen van de tenant bekend zijn, en
`New-CaPrerequisites.ps1` maakt de locatie alleen aan met `-AllowedCountry`. Een lege
landenlijst uitrollen zou élke aanmelding buiten "geen enkel land" blokkeren.

# Ronde 5 — de normenmapping die alleen als pad bestond (15 september 2026)

## De aanleiding

`scripts/generate-compliance.js` in de IntuneBackup-repo leest sinds augustus
`../CA-Policies/controls/ca-controls.json`. Het pad stond in de scriptkop, de leesfunctie
`readConditionalAccess()` bestond, COMPLIANCE.md had er een kolom **CA actief** voor — alleen het
bestand is er nooit gekomen. Iedereen draaide daarom `--no-ca`, en dat document zei vervolgens
letterlijk dat Conditional Access "bewust niet meegenomen" was.

Dat is geen ontbrekende regel maar een verkeerd beeld. De verantwoording beweerde dat NIS2 (j),
multifactorauthenticatie, met drie Intune-policies wordt ingevuld. Die tien CA-policies die het
echte werk doen stonden al jaren in de tenant, maar in geen enkel document dat een auditor leest.

## Wat is toegevoegd

**`controls/ca-controls.json`** — alle 44 templates gemapt op ISO/IEC 27001:2022 Annex A, NIS2
art. 21 lid 2, CIS Controls v8.1 en NIST CSF 2.0, in exact dezelfde vocabulaire als
`IntuneTemplate/_controls.json` in de andere repo. De fase komt niet uit een manifest maar uit
`state` in het template zelf: `enabled` telt als afgedwongen, report-only als voorbereid,
`disabled` als niet uitgerold.

**`scripts/check-controls.js`** en zijn test — bewaken de twee kanten waarop dit stil scheef
groeit. Een template zonder mapping verdwijnt geruisloos uit de verantwoording; een mapping
zonder template dekt daar een control af met een policy die niet bestaat, en dat merkt pas de
auditor die de verwijzing volgt. De labels zelf worden alleen lokaal getoetst — de vocabulaire
woont in de andere repo, dus in CI doet `generate-compliance.js --strict` dat.

## Wat het oplevert

| NIS2 art. 21(2) | zonder CA | met CA |
|---|---:|---:|
| (j) multifactorauthenticatie en beveiligde communicatie | 3 | 13 |
| (i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen | 22 | 39 |
| (b) incidentbehandeling | 8 | 15 |

## Wat hierna nog openstaat

- **Wat in git staat is nog steeds de `--no-ca`-versie**, want dat is wat de workflow daar
  regenereert; CI ziet deze repo niet. De CA-versie in git krijgen vraagt een
  `CA_POLICIES_TOKEN`-secret en het aanzetten van de CA-checkout in de workflow van de
  IntuneBackup-repo — de twee stappen staan in open punt 3 van zijn `docs/ANALYSE.md`.
- **De mapping is een oordeel, geen norm.** Er bestaat geen gezaghebbende bron die CA-policies aan
  Annex A-controls koppelt; deze is met de hand gelegd naar analogie van de Intune-kant. Bij een
  audit is dat verdedigbaar, niet bewijsbaar.
- **Zes policies staan op report-only** en tellen dus niet als afgedekt. Dat is juist — ze doen
  niets — maar het betekent wel dat de matrix verbetert zodra iemand die zes aanzet, zonder dat er
  één policy bijkomt.

# Ronde 6 — drie templates uit een tenant, en het prefix CXNM - STANDARD (30 september 2026)

## De aanleiding

Drie templates kwamen rechtstreeks uit een CIPP-export van een klanttenant in `CATemplate/`:
`CACUSTOMWHfBPasskeys`, `GRANT__MFA_PHISHING_RESISTENT__Benelux_` en
`MFA__Phishing_Resistent__Rollout`. Samen zijn ze een passkey-uitrol per groep. Maar de scripts
lazen alleen `GLOBAL__*.json`, dus ze vielen buiten elke controle en buiten de CIPP-export — en
ze droegen wat de set er bewust uit houdt: echte strength-id's, IP-ranges van twee AVD-locaties,
en een klantnaam in de displayName.

Tegelijk is het prefix veranderd: `GLOBAL` wordt `CXNM - STANDARD` in de tenant en
`CXNM__STANDARD__` als bestandsnaam. Zie *Waarom er geen persona's zijn*.

## Wat is aangepast

| Was | Wordt | Wat er veranderde |
|---|---|---|
| `GRANT \| MFA PHISHING RESISTENT \| Benelux` | `2125 GRANT` Phishing Resistant MFA for Rollout Groups | AVD-uitsluitingen weg (tenant-specifieke IP's; de test op IP-lekken faalde erop). Persistent browser `always` weg: een sessiecontrole hoort niet in een grant, en `always` op elk apparaat spreekt `3020` tegen. Break-glass en serviceaccounts uitgesloten. |
| `MFA \| Phishing Resistent \| Rollout` | `2185 GRANT` Register Security Info Passkey Rollout | Strength-id vervangen door de nul-GUID; SMS en spraak uit de strength, want `authentication-methods/` zet die uit. Break-glass en serviceaccounts uitgesloten. |
| `CA-CUSTOM-WHfB-Passkeys` | `2190 GRANT` Windows Hello Passkeys | Stond op `includeApplications: None` en dwong dus niets af — een drager om de strength via CIPP in de tenant te krijgen. Dat doet `New-CaPrerequisites.ps1` hier, dus nu een echte policy op alle apps, op report-only. |

Alle drie zijn optioneel (stage 3). Hun vier groepen en twee strengths staan in `prerequisites/`.

**De AAGUID-beperking werd niet bewaakt.** De strength van `2190` is FIDO2, beperkt tot de
Windows Hello-AAGUID's — die beperking zit in `combinationConfigurations`, en daar keek niemand
naar: `prerequisites.js` vergeleek alleen `allowedCombinations`, en `New-CaPrerequisites.ps1`
maakte de strength zonder beperking aan. Dan voldoet elke passkey. Beide doen het nu wel.

## Wat hierna nog openstaat

- **`2190` telt geen WHfB.** Een Windows Hello for Business-credential is de combinatie
  `windowsHelloForBusiness`, geen `fido2`. Wie op een joined toestel met WHfB werkt voldoet
  niet — en kan daar vaak ook geen Windows Hello-passkey registreren (zie
  `authentication-methods/`, `windowsHelloPasskeys`). Als WHfB wél moet tellen, hoort
  `windowsHelloForBusiness` in de strength. Dat is een keuze voor wie de policy bedacht.
- **De software-AAGUID.** De strength staat `6028b017…` (Windows Hello software) toe;
  `authentication-methods/` beperkt het profiel tot hardware en VBS. Registreren met de
  software-variant lukt daardoor toch niet, maar de twee lijsten spreken elkaar tegen.
- **`2185` naast `2180`.** Staan beide op enabled, dan is de enige combinatie die aan beide
  voldoet een eenmalige TAP. De uitrolgroep verliest dan het gemak waarvoor `2185` bestaat.
- **De groepen dragen de namen uit de brontenant** (`CA-…`, `U-WHfB-Passkeys`), niet de
  SG-U-conventie. Hernoemen breekt de koppeling met die tenant.
- **De IntuneBackup-kant** leest de sleutels uit `controls/ca-controls.json`; zijn `COMPLIANCE.md`
  toont de oude `GLOBAL__`-namen tot die opnieuw gegenereerd is. *Opgelost op 1 oktober 2026:* de
  namen kwamen uit `_licenties.json` daar, dat nu `CXNM__STANDARD__` gebruikt; `generate-compliance.js`
  meldt voortaan een CA-template in die lijst dat niet bestaat.
