<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](README.md) · **English** · [Français](README.fr.md)

# CATemplate — 44 policies

The source of this repo: the agreed Conditional Access policies in CIPP template format. Everything in
`cipp/` is derived from it. The name is `CA__<number>__<BLOCK|GRANT|SESSION>__<Name>.json`;
in the tenant the policy is called `CA - <number> - <TYPE> - <Name>`. How to add one is in
the [main README](../README.en.md#adding-a-policy).

Every policy has its own README next to its JSON: what it does, what to watch out for, the standards,
and which Intune policies it touches. Click the name in the table.

| Type | Stage 1 | Stage 2 | Stage 3 | Total |
|---|---:|---:|---:|---:|
| [BLOCK](#block--1xxx) | 5 | 7 | 6 | **18** |
| [GRANT](#grant--2xxx) | 8 | 3 | 8 | **19** |
| [SESSION](#session--3xxx) | 4 | 2 | 1 | **7** |
| **Total** | **17** | **12** | **15** | **44** |

Stage 1 is `enabled`, stage 2 is prepared (report-only or off), stage 3 is optional: a licence or a decision per tenant (`*` in the tables). The split is described in [`cipp/`](../cipp/README.en.md). The Intune column counts the Intune policies a policy depends on.

## BLOCK — 1xxx

| No | Policy | Who | On | Requirement | State | Stage | Intune |
|---:|---|---|---|---|---|---|---:|
| 1010 | [Legacy Authentication](CA__1010__BLOCK__Legacy_Authentication.en.md) | everyone | all apps | block | enabled | 1 | — |
| 1020 | [Device Code Auth Flow](CA__1020__BLOCK__Device_Code_Auth_Flow.en.md) | everyone | all apps | block | disabled | 2 | — |
| 1030 | [Unsupported Device Platforms](CA__1030__BLOCK__Unsupported_Device_Platforms.en.md) | everyone | all apps | block | disabled | 2 | — |
| 1040 | [Countries not Allowed](CA__1040__BLOCK__Countries_not_Allowed.en.md) | everyone | all apps | block | disabled | 2 (pinned to Report) | — |
| 1050 | [High-Risk Countries](CA__1050__BLOCK__HighRisk_Countries.en.md) | everyone | all apps | block | enabled | 1 | — |
| 1060 | [Service Accounts (Trusted Locations Excluded)](CA__1060__BLOCK__Service_Accounts_Trusted_Locations_Excluded.en.md) | `Conditional Access Service Accounts` | all apps | block | disabled | 2 (pinned to Report) | — |
| 1070 | [Explicitly Blocked Cloud Apps](CA__1070__BLOCK__Explicitly_Blocked_Cloud_Apps.en.md) | everyone | no app (list per tenant) | block | disabled | 2 | — |
| 1080 | [Guest Access to Sensitive Apps](CA__1080__BLOCK__Guest_Access_to_Sensitive_Apps.en.md) | guests | admin portals | block | disabled | 2 | — |
| 1090 | [High-Risk Sign-Ins](CA__1090__BLOCK__HighRisk_SignIns.en.md) | everyone | all apps | block | enabled | 1 | — |
| 1100 | [High-Risk Users](CA__1100__BLOCK__HighRisk_Users.en.md) | everyone | all apps | block | disabled | 2 | — |
| 1110 | [Unlicensed Users](CA__1110__BLOCK__Unlicensed_Users.en.md) | everyone | all apps | block | enabled | 1 | — |
| 1120 | [Guest Access Outside Approved Apps](CA__1120__BLOCK__Guest_Access_Outside_Approved_Apps.en.md) | guests | all apps | block | enabled | 1 | — |
| 1130 | [Admins From Untrusted Locations](CA__1130__BLOCK__Admins_From_Untrusted_Locations.en.md) | 28 admin roles | all apps | block | enabled | 3* | — |
| 1140 | [Managed Identities At Risk](CA__1140__BLOCK__Managed_Identities_At_Risk.en.md) | agent and workload identities | all apps | block | enabled | 3* | — |
| 1150 | [Risky Agent Identities](CA__1150__BLOCK__Risky_Agent_Identities.en.md) | agent and workload identities | all apps | block | enabled | 3* | — |
| 1160 | [Agent Identities To Agent Resources](CA__1160__BLOCK__Agent_Identities_To_Agent_Resources.en.md) | agent and workload identities | agent resources | block | report-only | 3* | — |
| 1170 | [Risky Agent Users](CA__1170__BLOCK__Risky_Agent_Users.en.md) | agent and workload identities | all apps | block | report-only | 3* | — |
| 1180 | [Agent Users Outside Compliant Network](CA__1180__BLOCK__Agent_Users_Outside_Compliant_Network.en.md) | agent and workload identities | agent resources | block | report-only | 3* (pinned to Report) | — |

## GRANT — 2xxx

| No | Policy | Who | On | Requirement | State | Stage | Intune |
|---:|---|---|---|---|---|---|---:|
| 2010 | [Medium-Risk Sign-ins](CA__2010__GRANT__MediumRisk_Signins.en.md) | everyone | all apps | `Multifactor authentication` + sign in every time | enabled | 1 | — |
| 2020 | [Medium-Risk Users](CA__2020__GRANT__MediumRisk_Users.en.md) | everyone | all apps | `Multifactor authentication` + sign in every time | enabled | 1 | — |
| 2050 | [MFA for All Users](CA__2050__GRANT__MFA_for_All_Users.en.md) | everyone | all apps | `Multifactor authentication` | enabled | 1 | — |
| 2055 | [Phishing Resistant MFA for Admins](CA__2055__GRANT__Phishing_Resistant_MFA_for_Admins.en.md) | 28 admin roles | all apps | `Phishing-resistant MFA` | disabled | 2 | 3 |
| 2060 | [Mobile Apps and Desktop Clients](CA__2060__GRANT__Mobile_Apps_and_Desktop_Clients.en.md) | everyone | all apps | compliant device | disabled | 2 | 28 |
| 2070 | [Mobile Device Access Requirements](CA__2070__GRANT__Mobile_Device_Access_Requirements.en.md) | everyone | all apps | compliant app | disabled | 2 | 2 |
| 2080 | [MFA for Device Registration](CA__2080__GRANT__MFA_For_Device_Registration.en.md) | everyone | register device | `Multifactor authentication` | enabled | 1 | — |
| 2090 | [Browser Access On Unmanaged Devices](CA__2090__GRANT__Browser_Access_On_Unmanaged_Devices.en.md) | everyone | all apps | compliant device or hybrid joined device | enabled | 1 | 29 |
| 2100 | [MFA for Admin Portals](CA__2100__GRANT__MFA_For_Admin_Portals.en.md) | everyone | admin portals | `Multifactor authentication` | enabled | 1 | — |
| 2110 | [Token Protection](CA__2110__GRANT__Token_Protection.en.md) | everyone | 2 apps | token protection | enabled | 1 | 2 |
| 2120 | [Phishing Resistant MFA for All Users](CA__2120__GRANT__Phishing_Resistant_MFA_for_All_Users.en.md) | everyone | all apps | `Phishing-resistant MFA` | enabled | 3* | 3 |
| 2125 | [Phishing Resistant MFA for Rollout Groups](CA__2125__GRANT__Phishing_Resistant_MFA_for_Rollout_Groups.en.md) | `CA-Registered-Phishing-MFA`, `CA-Exception-Authenticator-Phishing-MFA` | all apps | `Phishing-resistant MFA` | enabled | 3* | 3 |
| 2130 | [Admins Compliant Device](CA__2130__GRANT__Admins_Compliant_Device.en.md) | 28 admin roles | all apps | compliant device or hybrid joined device | enabled | 3* | 29 |
| 2150 | [Cloud PC Mobile Access](CA__2150__GRANT__Cloud_PC_Mobile_Access.en.md) | everyone | 2 apps | compliant app or compliant device | enabled | 3* | 13 |
| 2160 | [Agent Users Compliant Device](CA__2160__GRANT__Agent_Users_Compliant_Device.en.md) | agent and workload identities | all apps | compliant device | report-only | 3* | 15 |
| 2170 | [MFA for Intune Enrollment](CA__2170__GRANT__MFA_For_Intune_Enrollment.en.md) | everyone | 1 app | `Multifactor authentication` + sign in every time | enabled | 1 | 2 |
| 2180 | [Register Security Info TAP Only](CA__2180__GRANT__Register_Security_Info_TAP_Only.en.md) | everyone | register security info | `Temporary Access Pass only` | report-only | 3* | — |
| 2185 | [Register Security Info Passkey Rollout](CA__2185__GRANT__Register_Security_Info_Passkey_Rollout.en.md) | `CA-Rollout-Phishing-MFA` | register security info | `Passkey Rollout` + sign in every 7 days | enabled | 3* | — |
| 2190 | [Windows Hello Passkeys](CA__2190__GRANT__Windows_Hello_Passkeys.en.md) | `U-WHfB-Passkeys` | all apps | `CA-WHfB-Passkeys` | report-only | 3* | 2 |

## SESSION — 3xxx

| No | Policy | Who | On | Requirement | State | Stage | Intune |
|---:|---|---|---|---|---|---|---:|
| 3010 | [Admin Persistence](CA__3010__SESSION__Admin_Persistence.en.md) | 28 admin roles | all apps | sign in every 9 hours + no persistent browser session | enabled | 1 | — |
| 3020 | [BYOD Persistence](CA__3020__SESSION__BYOD_Persistence.en.md) | everyone | all apps | sign in every 9 hours + no persistent browser session | report-only | 2 | 26 |
| 3030 | [Register Security Info Requirements](CA__3030__SESSION__Register_Security_Info_Requirements.en.md) | everyone | register security info | sign in every 90 days | enabled | 1 | — |
| 3040 | [Block File Downloads On Unmanaged Devices](CA__3040__SESSION__Block_File_Downloads_On_Unmanaged_Devices.en.md) | everyone | 2 apps | app enforced restrictions | disabled | 2 | 26 |
| 3050 | [Continuous Access Evaluation](CA__3050__SESSION__Continuous_Access_Evaluation.en.md) | everyone | all apps | strict CAE | enabled | 1 | — |
| 3060 | [Defender for Cloud Apps](CA__3060__SESSION__Defender_for_Cloud_Apps.en.md) | everyone | all apps | Defender for Cloud Apps | enabled | 3* | — |
| 3070 | [Session Limits All Users](CA__3070__SESSION__Session_Limits_All_Users.en.md) | everyone | all apps | sign in every 12 hours | enabled | 1 | — |

## Why optional

From [`_manifest.json`](_manifest.json) (the reasons are kept in Dutch). These templates go to stage 3 and stay on Report there.

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

## Next to the templates

| File or folder | What it records |
|---|---|
| [`_manifest.json`](_manifest.json) | which templates are optional, and why |
| [`../docs/policies.json`](../docs/policies.json) | per template what it does, what to watch out for and which Intune policies it touches — the source of the per-policy README |
| [`../prerequisites/`](../prerequisites/README.en.md) | the groups, named locations and custom authentication strengths the templates refer to |
| [`../controls/`](../controls/README.en.md) | per template the ISO 27001, NIS2, CIS and NIST CSF controls |
| [`../authentication-methods/`](../authentication-methods/README.en.md) | which sign-in methods are on — without passkeys `2120` cannot be met |

`_manifest.json` and these READMEs have no `displayName`; a repo sync in CIPP makes at most a nameless row of them that does nothing.
