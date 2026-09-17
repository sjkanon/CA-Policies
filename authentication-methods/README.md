# authentication-methods/

`authentication-methods.json` is de gewenste stand van het **authentication methods policy** in
een klanttenant: welke methodes aan staan, en onder welke voorwaarden een passkey geregistreerd
mag worden.

**Dit is geen Conditional Access.** Een CA-policy zegt *wanneer* je ergens bij mag; dit zegt
*waarmee* je je überhaupt kunt aanmelden. De twee grijpen wel in elkaar, en precies daar gaat het
mis als je er één los bekijkt:

| Als dit hier uit staat | Dan gebeurt dit aan de CA-kant |
|---|---|
| Passkey (FIDO2) | `GLOBAL__2120` eist een phishing-bestendige methode die niemand heeft — de tenant is dicht |
| Temporary Access Pass | `GLOBAL__2180` laat registratie alleen achter een TAP toe; een nieuwe medewerker kan dan niets registreren |

`scripts/authentication-methods.js` controleert die twee koppelingen tegen de werkelijke `state`
van die templates, en faalt hard. Dat is geen schemavalidatie maar de enige plek waar deze
afhankelijkheid wordt bewaakt.

## Waarom hier geen checkId bij zit

De platform-engine kent de categorie `authentication-methods` niet. Er is dus geen
`baseline-v1.0.json`, geen toetsing tegen een klanttenant en geen driftsignaal — wat hier
scheefstaat, staat scheef tot iemand het merkt.

Wat er wél is:

| | Doet |
|---|---|
| `node scripts/authentication-methods.js` | Bewaakt het bestand zelf en de twee koppelingen. Blokkerend in CI |
| `node --test scripts/authentication-methods.test.js` | Zes tests, waaronder de uitzetvolgorde |
| `./scripts/Set-AuthenticationMethods.ps1 -TenantId <tenant>` | Vergelijkt een echte tenant met dit bestand. Zonder `-Apply` wijzigt het niets |

Komt die categorie er ooit in het platform, dan staat dit bestand al in de vorm die hij nodig
heeft: één regel per methode, met `state` en `configuration`.

## De volgorde is niet vrij

`order` is de uitrolvolgorde, en omdraaien sluit mensen buiten:

1. **Temporary Access Pass** — de enige methode waarmee iemand zónder bestaande methode kan
   beginnen. Ook de terugval als iemand zijn laptop kwijt is: een WHfB-passkey zat in de TPM van
   dát apparaat en komt niet terug.
2. **Passkey (FIDO2)** — de methode waar de phishing-bestendige CA-policies op steunen.
3. **Microsoft Authenticator** — blijft aan naast passkeys. Het is wat de meeste gebruikers al
   hebben, en de weg waarlangs ze een passkey in Authenticator registreren.
4. **SMS** en 5. **spraak** — gaan uit, en alleen nadat 2 en 3 staan.

Stap 4 en 5 zijn de enige die iets wégnemen. `Set-AuthenticationMethods.ps1` weigert ze met
`-CheckRegistrationFirst` zolang er gebruikers zijn zonder MFA-methode, en de test bewaakt dat
een uit te zetten methode nooit vóór een aan te zetten methode staat.

## Passkey profiles: handwerk, en dat blijft zo

Profielen vragen een eenmalige opt-in in het portaal (**Entra ID › Security › Authentication
methods › Policies › Passkey (FIDO2)**, via de banner). **Die opt-in is onomkeerbaar.** Je
bestaande globale instellingen verhuizen dan naar een *Default passkey profile*; er passen er
maximaal drie, dat profiel meegerekend.

`Set-AuthenticationMethods.ps1` leest de profielen wel uit en meldt wat er afwijkt van dit
bestand, maar zet ze niet. Een script dat dit half doet is gevaarlijker dan een script dat het
niet doet: profielen bepalen wie er nog kan inloggen.

De twee profielen hier:

| Profiel | Doelgroep | Types | Attestation |
|---|---|---|---|
| Beheerders | `Passkey Profile Admins` | Alleen device-bound | Aan |
| Alle gebruikers | AllUsers | Device-bound en synced | Uit |

`Passkey Profile Admins` staat in [`../prerequisites/ca-prerequisites.json`](../prerequisites/ca-prerequisites.json)
en wordt aangemaakt door `New-CaPrerequisites.ps1` — een passkey profile kan niet op
directory-rollen richten zoals een CA-policy dat doet, alleen op groepen.

## Twee dingen die stil misgaan

**Attestation geldt alleen bij registratie.** Zet je hem later aan, dan blijven passkeys die
eerder zonder attestation zijn geregistreerd gewoon werken. Je sluit nieuwe registraties af, niet
bestaande sleutels.

**Iets weghalen sluit mensen buiten.** Een passkeytype uitzetten of een AAGUID uit een allow-list
halen geldt voor registratie én aanmelding: wie daarmee registreerde, kan niet meer inloggen.
