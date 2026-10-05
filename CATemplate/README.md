<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](README.en.md) · [Français](README.fr.md)

# CATemplate — 44 policies

De bron van deze repo: de afgesproken Conditional Access-policies in CIPP-templateformaat. Alles in
`cipp/` is hieruit afgeleid. De naam is `CA__<nummer>__<BLOCK|GRANT|SESSION>__<Naam>.json`;
in de tenant heet de policy `CA - <nummer> - <TYPE> - <Naam>`. Hoe je er een toevoegt staat
in de [hoofd-README](../README.md#een-policy-toevoegen).

Elke policy heeft een eigen README naast zijn JSON: wat hij doet, waar je op moet letten, de normen,
en welke Intune-policies hij raakt. Klik op de naam in de tabel.

| Type | Stage 1 | Stage 2 | Stage 3 | Totaal |
|---|---:|---:|---:|---:|
| [BLOCK](#block--1xxx) | 5 | 7 | 6 | **18** |
| [GRANT](#grant--2xxx) | 8 | 3 | 8 | **19** |
| [SESSION](#session--3xxx) | 4 | 2 | 1 | **7** |
| **Totaal** | **17** | **12** | **15** | **44** |

Stage 1 staat op `enabled`, stage 2 is voorbereid (report-only of uit), stage 3 is optioneel: een licentie of een besluit per tenant (`*` in de tabellen). De indeling staat in [`cipp/`](../cipp/README.md). De kolom Intune telt de Intune-policies waar een policy van afhangt.

## BLOCK — 1xxx

| Nr | Policy | Voor wie | Op | Eis | State | Stage | Intune |
|---:|---|---|---|---|---|---|---:|
| 1010 | [Legacy Authentication](CA__1010__BLOCK__Legacy_Authentication.md) | iedereen | alle apps | blokkeren | enabled | 1 | — |
| 1020 | [Device Code Auth Flow](CA__1020__BLOCK__Device_Code_Auth_Flow.md) | iedereen | alle apps | blokkeren | disabled | 2 | — |
| 1030 | [Unsupported Device Platforms](CA__1030__BLOCK__Unsupported_Device_Platforms.md) | iedereen | alle apps | blokkeren | disabled | 2 | — |
| 1040 | [Countries not Allowed](CA__1040__BLOCK__Countries_not_Allowed.md) | iedereen | alle apps | blokkeren | disabled | 2 (vast op Report) | — |
| 1050 | [High-Risk Countries](CA__1050__BLOCK__HighRisk_Countries.md) | iedereen | alle apps | blokkeren | enabled | 1 | — |
| 1060 | [Service Accounts (Trusted Locations Excluded)](CA__1060__BLOCK__Service_Accounts_Trusted_Locations_Excluded.md) | `Conditional Access Service Accounts` | alle apps | blokkeren | disabled | 2 (vast op Report) | — |
| 1070 | [Explicitly Blocked Cloud Apps](CA__1070__BLOCK__Explicitly_Blocked_Cloud_Apps.md) | iedereen | geen app (lijst per tenant) | blokkeren | disabled | 2 | — |
| 1080 | [Guest Access to Sensitive Apps](CA__1080__BLOCK__Guest_Access_to_Sensitive_Apps.md) | gasten | beheerportalen | blokkeren | disabled | 2 | — |
| 1090 | [High-Risk Sign-Ins](CA__1090__BLOCK__HighRisk_SignIns.md) | iedereen | alle apps | blokkeren | enabled | 1 | — |
| 1100 | [High-Risk Users](CA__1100__BLOCK__HighRisk_Users.md) | iedereen | alle apps | blokkeren | disabled | 2 | — |
| 1110 | [Unlicensed Users](CA__1110__BLOCK__Unlicensed_Users.md) | iedereen | alle apps | blokkeren | enabled | 1 | — |
| 1120 | [Guest Access Outside Approved Apps](CA__1120__BLOCK__Guest_Access_Outside_Approved_Apps.md) | gasten | alle apps | blokkeren | enabled | 1 | — |
| 1130 | [Admins From Untrusted Locations](CA__1130__BLOCK__Admins_From_Untrusted_Locations.md) | 28 beheerrollen | alle apps | blokkeren | enabled | 3* | — |
| 1140 | [Managed Identities At Risk](CA__1140__BLOCK__Managed_Identities_At_Risk.md) | agent- en workload-identiteiten | alle apps | blokkeren | enabled | 3* | — |
| 1150 | [Risky Agent Identities](CA__1150__BLOCK__Risky_Agent_Identities.md) | agent- en workload-identiteiten | alle apps | blokkeren | enabled | 3* | — |
| 1160 | [Agent Identities To Agent Resources](CA__1160__BLOCK__Agent_Identities_To_Agent_Resources.md) | agent- en workload-identiteiten | agent-resources | blokkeren | report-only | 3* | — |
| 1170 | [Risky Agent Users](CA__1170__BLOCK__Risky_Agent_Users.md) | agent- en workload-identiteiten | alle apps | blokkeren | report-only | 3* | — |
| 1180 | [Agent Users Outside Compliant Network](CA__1180__BLOCK__Agent_Users_Outside_Compliant_Network.md) | agent- en workload-identiteiten | agent-resources | blokkeren | report-only | 3* (vast op Report) | — |

## GRANT — 2xxx

| Nr | Policy | Voor wie | Op | Eis | State | Stage | Intune |
|---:|---|---|---|---|---|---|---:|
| 2010 | [Medium-Risk Sign-ins](CA__2010__GRANT__MediumRisk_Signins.md) | iedereen | alle apps | `Multifactor authentication` + elke keer opnieuw aanmelden | enabled | 1 | — |
| 2020 | [Medium-Risk Users](CA__2020__GRANT__MediumRisk_Users.md) | iedereen | alle apps | `Multifactor authentication` + elke keer opnieuw aanmelden | enabled | 1 | — |
| 2050 | [MFA for All Users](CA__2050__GRANT__MFA_for_All_Users.md) | iedereen | alle apps | `Multifactor authentication` | enabled | 1 | — |
| 2055 | [Phishing Resistant MFA for Admins](CA__2055__GRANT__Phishing_Resistant_MFA_for_Admins.md) | 28 beheerrollen | alle apps | `Phishing-resistant MFA` | disabled | 2 | 3 |
| 2060 | [Mobile Apps and Desktop Clients](CA__2060__GRANT__Mobile_Apps_and_Desktop_Clients.md) | iedereen | alle apps | compliant apparaat | disabled | 2 | 28 |
| 2070 | [Mobile Device Access Requirements](CA__2070__GRANT__Mobile_Device_Access_Requirements.md) | iedereen | alle apps | compliant app | disabled | 2 | 2 |
| 2080 | [MFA for Device Registration](CA__2080__GRANT__MFA_For_Device_Registration.md) | iedereen | apparaat registreren | `Multifactor authentication` | enabled | 1 | — |
| 2090 | [Browser Access On Unmanaged Devices](CA__2090__GRANT__Browser_Access_On_Unmanaged_Devices.md) | iedereen | alle apps | compliant apparaat of hybrid joined apparaat | enabled | 1 | 29 |
| 2100 | [MFA for Admin Portals](CA__2100__GRANT__MFA_For_Admin_Portals.md) | iedereen | beheerportalen | `Multifactor authentication` | enabled | 1 | — |
| 2110 | [Token Protection](CA__2110__GRANT__Token_Protection.md) | iedereen | 2 apps | token protection | enabled | 1 | 2 |
| 2120 | [Phishing Resistant MFA for All Users](CA__2120__GRANT__Phishing_Resistant_MFA_for_All_Users.md) | iedereen | alle apps | `Phishing-resistant MFA` | enabled | 3* | 3 |
| 2125 | [Phishing Resistant MFA for Rollout Groups](CA__2125__GRANT__Phishing_Resistant_MFA_for_Rollout_Groups.md) | `CA-Registered-Phishing-MFA`, `CA-Exception-Authenticator-Phishing-MFA` | alle apps | `Phishing-resistant MFA` | enabled | 3* | 3 |
| 2130 | [Admins Compliant Device](CA__2130__GRANT__Admins_Compliant_Device.md) | 28 beheerrollen | alle apps | compliant apparaat of hybrid joined apparaat | enabled | 3* | 29 |
| 2150 | [Cloud PC Mobile Access](CA__2150__GRANT__Cloud_PC_Mobile_Access.md) | iedereen | 2 apps | compliant app of compliant apparaat | enabled | 3* | 13 |
| 2160 | [Agent Users Compliant Device](CA__2160__GRANT__Agent_Users_Compliant_Device.md) | agent- en workload-identiteiten | alle apps | compliant apparaat | report-only | 3* | 15 |
| 2170 | [MFA for Intune Enrollment](CA__2170__GRANT__MFA_For_Intune_Enrollment.md) | iedereen | 1 app | `Multifactor authentication` + elke keer opnieuw aanmelden | enabled | 1 | 2 |
| 2180 | [Register Security Info TAP Only](CA__2180__GRANT__Register_Security_Info_TAP_Only.md) | iedereen | beveiligingsinfo registreren | `Temporary Access Pass only` | report-only | 3* | — |
| 2185 | [Register Security Info Passkey Rollout](CA__2185__GRANT__Register_Security_Info_Passkey_Rollout.md) | `CA-Rollout-Phishing-MFA` | beveiligingsinfo registreren | `Passkey Rollout` + aanmelden elke 7 dagen | enabled | 3* | — |
| 2190 | [Windows Hello Passkeys](CA__2190__GRANT__Windows_Hello_Passkeys.md) | `U-WHfB-Passkeys` | alle apps | `CA-WHfB-Passkeys` | report-only | 3* | 2 |

## SESSION — 3xxx

| Nr | Policy | Voor wie | Op | Eis | State | Stage | Intune |
|---:|---|---|---|---|---|---|---:|
| 3010 | [Admin Persistence](CA__3010__SESSION__Admin_Persistence.md) | 28 beheerrollen | alle apps | aanmelden elke 9 uur + geen blijvende browsersessie | enabled | 1 | — |
| 3020 | [BYOD Persistence](CA__3020__SESSION__BYOD_Persistence.md) | iedereen | alle apps | aanmelden elke 9 uur + geen blijvende browsersessie | report-only | 2 | 26 |
| 3030 | [Register Security Info Requirements](CA__3030__SESSION__Register_Security_Info_Requirements.md) | iedereen | beveiligingsinfo registreren | aanmelden elke 90 dagen | enabled | 1 | — |
| 3040 | [Block File Downloads On Unmanaged Devices](CA__3040__SESSION__Block_File_Downloads_On_Unmanaged_Devices.md) | iedereen | 2 apps | app-afgedwongen beperkingen | disabled | 2 | 26 |
| 3050 | [Continuous Access Evaluation](CA__3050__SESSION__Continuous_Access_Evaluation.md) | iedereen | alle apps | strikte CAE | enabled | 1 | — |
| 3060 | [Defender for Cloud Apps](CA__3060__SESSION__Defender_for_Cloud_Apps.md) | iedereen | alle apps | Defender for Cloud Apps | enabled | 3* | — |
| 3070 | [Session Limits All Users](CA__3070__SESSION__Session_Limits_All_Users.md) | iedereen | alle apps | aanmelden elke 12 uur | enabled | 1 | — |

## Waarom optioneel

Uit [`_manifest.json`](_manifest.json). Deze templates gaan naar stage 3 en blijven daar op Report.

- **1130** — beheerders vastzetten op vertrouwde locaties sluit ze buiten zodra ze thuis of onderweg werken. Alleen inschakelen na expliciete afstemming met de organisatie.
- **1140** — risicodetectie op workload-identiteiten vereist Microsoft Entra Workload ID Premium.
- **1150** — vraagt Microsoft Entra Agent ID; een tenant zonder agent-identiteiten heeft niets om te beoordelen.
- **1160** — vraagt Microsoft Entra Agent ID. Staat bewust op report-only: dit is een allow-list — hij blokkeert élke agent-identiteit op agent-resources behalve de expliciet uitgezonderde, en dat legt bij inschakelen zonder inventarisatie alle bestaande agents stil. Eerst de report-only-uitslag lezen, dan de uitzonderingen invullen, dan aanzetten.
- **1170** — vraagt Microsoft Entra Agent ID. Report-only omdat hij op medium risico al blokkeert — dezelfde afweging als bij 2010/2020, waar medium een extra eis krijgt en niet meteen een blokkade.
- **1180** — vraagt Microsoft Entra Agent ID én Global Secure Access: de named location 'All Compliant Network locations' bestaat alleen in een tenant met GSA. Report-only tot beide er zijn.
- **2120** — vereist dat élke gebruiker een passkey of FIDO2-sleutel heeft. Het einddoel waar de admin-variant (2055) de eerste stap van is, maar een uitrolproject en geen instelling.
- **2125** — de groepsgewijze uitrol van 2120: alleen zinvol in een tenant die zijn passkey-uitrol per groep doet, en alleen veilig zolang er niemand in 'CA-Registered-Phishing-MFA' of 'CA-Exception-Authenticator-Phishing-MFA' staat die nog geen phishing-bestendige methode heeft.
- **2130** — eist dat élke beheerder een beheerd apparaat heeft — bij uitbesteed beheer dus ook elke engineer die in de tenant komt. Besluit per tenant.
- **2150** — alleen relevant in een tenant met Windows 365 / Cloud PC.
- **2160** — vraagt Microsoft Entra Agent ID. Report-only: een agent-usersessie vanaf een endpoint dat (nog) niet compliant is valt hiermee stil, en welke endpoints agents gebruiken is in de meeste tenants nog niet in kaart.
- **2180** — vraagt een custom authentication strength ('Temporary Access Pass only') die per tenant wordt aangemaakt: Entra kent daar zelf een id aan toe, dus het id in het template is een placeholder die bij de uitrol per tenant wordt vervangen. En het is een procesbesluit — zonder helpdesk die TAPs uitgeeft en de aanvrager verifieert kan niemand nog zelf een methode registreren, ook niet zijn eerste.
- **2185** — hoort bij de passkey-uitrol per groep (2125) en vraagt de custom authentication strength 'Passkey Rollout', waarvan het id per tenant wordt vervangen. Naast 2180 op enabled wint de strengste: registreren kan dan alleen met een eenmalige TAP.
- **2190** — vraagt de custom authentication strength 'CA-WHfB-Passkeys' met AAGUID-beperking, per tenant aangemaakt. Staat op report-only: hij laat op álle apps alleen een Windows Hello-passkey toe, dus geen WHfB-credential, geen telefoon en geen beveiligingssleutel. Eerst de report-only-uitslag lezen.
- **3060** — sessiecontrole via Defender for Cloud Apps vereist een MDCA-licentie.

## Naast de templates

| Bestand of map | Wat het vastlegt |
|---|---|
| [`_manifest.json`](_manifest.json) | welke templates optioneel zijn, en waarom |
| [`../docs/policies.json`](../docs/policies.json) | per template wat hij doet, waar je op let en welke Intune-policies hij raakt — de bron van de README per policy |
| [`../prerequisites/`](../prerequisites/README.md) | de groepen, named locations en custom authentication strengths waar de templates naar verwijzen |
| [`../controls/`](../controls/README.md) | per template de ISO 27001-, NIS2-, CIS- en NIST CSF-controls |
| [`../authentication-methods/`](../authentication-methods/README.md) | welke aanmeldmethodes aan staan — zonder passkey is `2120` onvervulbaar |

`_manifest.json` en deze README's hebben geen `displayName`; bij een repo-sync maakt CIPP er hooguit een naamloze rij van die niets doet.
