<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](README.md) · [English](README.en.md) · **Français**

# CATemplate — 45 stratégies

La source de ce dépôt : les stratégies Conditional Access convenues au format de template CIPP. Tout ce qui
se trouve dans `cipp/` en est dérivé. Le nom est `CA__<numéro>__<BLOCK|GRANT|SESSION>__<Nom>.json` ;
dans le tenant, la stratégie s'appelle `CA - <numéro> - <TYPE> - <Nom>`. Comment en ajouter une
figure dans le [README principal](../README.fr.md#ajouter-une-stratégie).

Chaque stratégie a son propre README à côté de son JSON : ce qu'elle fait, les points d'attention, les normes,
et les stratégies Intune qu'elle touche. Cliquez sur le nom dans le tableau.

| Type | Stage 1 | Stage 2 | Stage 3 | Total |
|---|---:|---:|---:|---:|
| [BLOCK](#block--1xxx) | 5 | 7 | 6 | **18** |
| [GRANT](#grant--2xxx) | 8 | 3 | 9 | **20** |
| [SESSION](#session--3xxx) | 4 | 2 | 1 | **7** |
| **Total** | **17** | **12** | **16** | **45** |

Le stage 1 est `enabled`, le stage 2 est préparé (report-only ou désactivé), le stage 3 est optionnel : une licence ou une décision par tenant (`*` dans les tableaux). La répartition est décrite dans [`cipp/`](../cipp/README.fr.md). La colonne Intune compte les stratégies Intune dont dépend une stratégie.

## BLOCK — 1xxx

| N° | Stratégie | Pour qui | Sur | Exigence | State | Stage | Intune |
|---:|---|---|---|---|---|---|---:|
| 1010 | [Legacy Authentication](CA__1010__BLOCK__Legacy_Authentication.fr.md) | tout le monde | toutes les apps | bloquer | enabled | 1 | — |
| 1020 | [Device Code Auth Flow](CA__1020__BLOCK__Device_Code_Auth_Flow.fr.md) | tout le monde | toutes les apps | bloquer | disabled | 2 | — |
| 1030 | [Unsupported Device Platforms](CA__1030__BLOCK__Unsupported_Device_Platforms.fr.md) | tout le monde | toutes les apps | bloquer | disabled | 2 | — |
| 1040 | [Countries not Allowed](CA__1040__BLOCK__Countries_not_Allowed.fr.md) | tout le monde | toutes les apps | bloquer | disabled | 2 (bloqué sur Report) | — |
| 1050 | [High-Risk Countries](CA__1050__BLOCK__HighRisk_Countries.fr.md) | tout le monde | toutes les apps | bloquer | enabled | 1 | — |
| 1060 | [Service Accounts (Trusted Locations Excluded)](CA__1060__BLOCK__Service_Accounts_Trusted_Locations_Excluded.fr.md) | `Conditional Access Service Accounts` | toutes les apps | bloquer | disabled | 2 (bloqué sur Report) | — |
| 1070 | [Explicitly Blocked Cloud Apps](CA__1070__BLOCK__Explicitly_Blocked_Cloud_Apps.fr.md) | tout le monde | aucune app (liste par tenant) | bloquer | disabled | 2 | — |
| 1080 | [Guest Access to Sensitive Apps](CA__1080__BLOCK__Guest_Access_to_Sensitive_Apps.fr.md) | invités | portails d'admin | bloquer | disabled | 2 | — |
| 1090 | [High-Risk Sign-Ins](CA__1090__BLOCK__HighRisk_SignIns.fr.md) | tout le monde | toutes les apps | bloquer | enabled | 1 | — |
| 1100 | [High-Risk Users](CA__1100__BLOCK__HighRisk_Users.fr.md) | tout le monde | toutes les apps | bloquer | disabled | 2 | — |
| 1110 | [Unlicensed Users](CA__1110__BLOCK__Unlicensed_Users.fr.md) | tout le monde | toutes les apps | bloquer | enabled | 1 | — |
| 1120 | [Guest Access Outside Approved Apps](CA__1120__BLOCK__Guest_Access_Outside_Approved_Apps.fr.md) | invités | toutes les apps | bloquer | enabled | 1 | — |
| 1130 | [Admins From Untrusted Locations](CA__1130__BLOCK__Admins_From_Untrusted_Locations.fr.md) | 28 rôles d'admin | toutes les apps | bloquer | enabled | 3* | — |
| 1140 | [Managed Identities At Risk](CA__1140__BLOCK__Managed_Identities_At_Risk.fr.md) | identités d'agent et de workload | toutes les apps | bloquer | enabled | 3* | — |
| 1150 | [Risky Agent Identities](CA__1150__BLOCK__Risky_Agent_Identities.fr.md) | identités d'agent et de workload | toutes les apps | bloquer | enabled | 3* | — |
| 1160 | [Agent Identities To Agent Resources](CA__1160__BLOCK__Agent_Identities_To_Agent_Resources.fr.md) | identités d'agent et de workload | ressources d'agent | bloquer | report-only | 3* | — |
| 1170 | [Risky Agent Users](CA__1170__BLOCK__Risky_Agent_Users.fr.md) | identités d'agent et de workload | toutes les apps | bloquer | report-only | 3* | — |
| 1180 | [Agent Users Outside Compliant Network](CA__1180__BLOCK__Agent_Users_Outside_Compliant_Network.fr.md) | identités d'agent et de workload | ressources d'agent | bloquer | report-only | 3* (bloqué sur Report) | — |

## GRANT — 2xxx

| N° | Stratégie | Pour qui | Sur | Exigence | State | Stage | Intune |
|---:|---|---|---|---|---|---|---:|
| 2010 | [Medium-Risk Sign-ins](CA__2010__GRANT__MediumRisk_Signins.fr.md) | tout le monde | toutes les apps | `Multifactor authentication` + reconnexion à chaque fois | enabled | 1 | — |
| 2020 | [Medium-Risk Users](CA__2020__GRANT__MediumRisk_Users.fr.md) | tout le monde | toutes les apps | `Multifactor authentication` + reconnexion à chaque fois | enabled | 1 | — |
| 2050 | [MFA for All Users](CA__2050__GRANT__MFA_for_All_Users.fr.md) | tout le monde | toutes les apps | `Multifactor authentication` | enabled | 1 | — |
| 2055 | [Phishing Resistant MFA for Admins](CA__2055__GRANT__Phishing_Resistant_MFA_for_Admins.fr.md) | 28 rôles d'admin | toutes les apps | `Phishing-resistant MFA` | disabled | 2 | 3 |
| 2060 | [Mobile Apps and Desktop Clients](CA__2060__GRANT__Mobile_Apps_and_Desktop_Clients.fr.md) | tout le monde | toutes les apps | appareil conforme | disabled | 2 | 28 |
| 2070 | [Mobile Device Access Requirements](CA__2070__GRANT__Mobile_Device_Access_Requirements.fr.md) | tout le monde | toutes les apps | app conforme | disabled | 2 | 2 |
| 2080 | [MFA for Device Registration](CA__2080__GRANT__MFA_For_Device_Registration.fr.md) | tout le monde | enregistrer un appareil | `Multifactor authentication` | enabled | 1 | — |
| 2090 | [Browser Access On Unmanaged Devices](CA__2090__GRANT__Browser_Access_On_Unmanaged_Devices.fr.md) | tout le monde | toutes les apps | appareil conforme ou appareil hybrid joined | enabled | 1 | 29 |
| 2100 | [MFA for Admin Portals](CA__2100__GRANT__MFA_For_Admin_Portals.fr.md) | tout le monde | portails d'admin | `Multifactor authentication` | enabled | 1 | — |
| 2110 | [Token Protection](CA__2110__GRANT__Token_Protection.fr.md) | tout le monde | 2 apps | token protection | enabled | 1 | 2 |
| 2120 | [Phishing Resistant MFA for All Users](CA__2120__GRANT__Phishing_Resistant_MFA_for_All_Users.fr.md) | tout le monde | toutes les apps | `Phishing-resistant MFA` | enabled | 3* | 3 |
| 2125 | [Phishing Resistant MFA for Rollout Groups](CA__2125__GRANT__Phishing_Resistant_MFA_for_Rollout_Groups.fr.md) | `CA-Registered-Phishing-MFA`, `CA-Exception-Authenticator-Phishing-MFA` | toutes les apps | `Phishing-resistant MFA` | enabled | 3* | 3 |
| 2130 | [Admins Compliant Device](CA__2130__GRANT__Admins_Compliant_Device.fr.md) | 28 rôles d'admin | toutes les apps | appareil conforme ou appareil hybrid joined | enabled | 3* | 29 |
| 2150 | [Cloud PC Mobile Access](CA__2150__GRANT__Cloud_PC_Mobile_Access.fr.md) | tout le monde | 4 apps | app conforme ou appareil conforme | enabled | 3* | 13 |
| 2155 | [Virtual Desktop Phishing Resistant MFA](CA__2155__GRANT__Virtual_Desktop_Phishing_Resistant_MFA.fr.md) | tout le monde | 3 apps | `Phishing-resistant MFA` | report-only | 3* | 3 |
| 2160 | [Agent Users Compliant Device](CA__2160__GRANT__Agent_Users_Compliant_Device.fr.md) | identités d'agent et de workload | toutes les apps | appareil conforme | report-only | 3* | 15 |
| 2170 | [MFA for Intune Enrollment](CA__2170__GRANT__MFA_For_Intune_Enrollment.fr.md) | tout le monde | 1 app | `Multifactor authentication` + reconnexion à chaque fois | enabled | 1 | 2 |
| 2180 | [Register Security Info TAP Only](CA__2180__GRANT__Register_Security_Info_TAP_Only.fr.md) | tout le monde | enregistrer les infos de sécurité | `Temporary Access Pass only` | report-only | 3* | — |
| 2185 | [Register Security Info Passkey Rollout](CA__2185__GRANT__Register_Security_Info_Passkey_Rollout.fr.md) | `CA-Rollout-Phishing-MFA` | enregistrer les infos de sécurité | `Passkey Rollout` + connexion toutes les 7 jours | enabled | 3* | — |
| 2190 | [Windows Hello Passkeys](CA__2190__GRANT__Windows_Hello_Passkeys.fr.md) | `U-WHfB-Passkeys` | toutes les apps | `CA-WHfB-Passkeys` | report-only | 3* | 2 |

## SESSION — 3xxx

| N° | Stratégie | Pour qui | Sur | Exigence | State | Stage | Intune |
|---:|---|---|---|---|---|---|---:|
| 3010 | [Admin Persistence](CA__3010__SESSION__Admin_Persistence.fr.md) | 28 rôles d'admin | toutes les apps | connexion toutes les 9 heures + pas de session de navigateur persistante | enabled | 1 | — |
| 3020 | [BYOD Persistence](CA__3020__SESSION__BYOD_Persistence.fr.md) | tout le monde | toutes les apps | connexion toutes les 9 heures + pas de session de navigateur persistante | report-only | 2 | 26 |
| 3030 | [Register Security Info Requirements](CA__3030__SESSION__Register_Security_Info_Requirements.fr.md) | tout le monde | enregistrer les infos de sécurité | connexion toutes les 90 jours | enabled | 1 | — |
| 3040 | [Block File Downloads On Unmanaged Devices](CA__3040__SESSION__Block_File_Downloads_On_Unmanaged_Devices.fr.md) | tout le monde | 2 apps | restrictions appliquées par l'app | disabled | 2 | 26 |
| 3050 | [Continuous Access Evaluation](CA__3050__SESSION__Continuous_Access_Evaluation.fr.md) | tout le monde | toutes les apps | CAE strict | enabled | 1 | — |
| 3060 | [Defender for Cloud Apps](CA__3060__SESSION__Defender_for_Cloud_Apps.fr.md) | tout le monde | toutes les apps | Defender for Cloud Apps | enabled | 3* | — |
| 3070 | [Session Limits All Users](CA__3070__SESSION__Session_Limits_All_Users.fr.md) | tout le monde | toutes les apps | connexion toutes les 12 heures | enabled | 1 | — |

## Pourquoi optionnel

Issu de [`_manifest.json`](_manifest.json) (les raisons sont en néerlandais). Ces templates vont au stage 3 et y restent sur Report.

- **1130** — beheerders vastzetten op vertrouwde locaties sluit ze buiten zodra ze thuis of onderweg werken. Alleen inschakelen na expliciete afstemming met de organisatie.
- **1140** — risicodetectie op workload-identiteiten vereist Microsoft Entra Workload ID Premium.
- **1150** — vraagt Microsoft Entra Agent ID; een tenant zonder agent-identiteiten heeft niets om te beoordelen.
- **1160** — vraagt Microsoft Entra Agent ID. Staat bewust op report-only: dit is een allow-list — hij blokkeert élke agent-identiteit op agent-resources behalve de expliciet uitgezonderde, en dat legt bij inschakelen zonder inventarisatie alle bestaande agents stil. Eerst de report-only-uitslag lezen, dan de uitzonderingen invullen, dan aanzetten.
- **1170** — vraagt Microsoft Entra Agent ID. Report-only omdat hij op medium risico al blokkeert — dezelfde afweging als bij 2010/2020, waar medium een extra eis krijgt en niet meteen een blokkade.
- **1180** — vraagt Microsoft Entra Agent ID én Global Secure Access: de named location 'All Compliant Network locations' bestaat alleen in een tenant met GSA. Report-only tot beide er zijn.
- **2120** — vereist dat élke gebruiker een passkey of FIDO2-sleutel heeft. Het einddoel waar de admin-variant (2055) de eerste stap van is, maar een uitrolproject en geen instelling.
- **2125** — de groepsgewijze uitrol van 2120: alleen zinvol in een tenant die zijn passkey-uitrol per groep doet, en alleen veilig zolang er niemand in 'CA-Registered-Phishing-MFA' of 'CA-Exception-Authenticator-Phishing-MFA' staat die nog geen phishing-bestendige methode heeft.
- **2130** — eist dat élke beheerder een beheerd apparaat heeft — bij uitbesteed beheer dus ook elke engineer die in de tenant komt. Besluit per tenant.
- **2150** — alleen relevant in een tenant met Azure Virtual Desktop of Windows 365.
- **2155** — vraagt dat elke gebruiker van Azure Virtual Desktop of Windows 365 een passkey, Windows Hello for Business of FIDO2-sleutel heeft. Zinvol waar de virtuele werkplek de route is voor persoonlijke toestellen en derden; daar is het toestel onbekend en is de aanmelding het enige wat je kunt eisen.
- **2160** — vraagt Microsoft Entra Agent ID. Report-only: een agent-usersessie vanaf een endpoint dat (nog) niet compliant is valt hiermee stil, en welke endpoints agents gebruiken is in de meeste tenants nog niet in kaart.
- **2180** — vraagt een custom authentication strength ('Temporary Access Pass only') die per tenant wordt aangemaakt: Entra kent daar zelf een id aan toe, dus het id in het template is een placeholder die bij de uitrol per tenant wordt vervangen. En het is een procesbesluit — zonder helpdesk die TAPs uitgeeft en de aanvrager verifieert kan niemand nog zelf een methode registreren, ook niet zijn eerste.
- **2185** — hoort bij de passkey-uitrol per groep (2125) en vraagt de custom authentication strength 'Passkey Rollout', waarvan het id per tenant wordt vervangen. Naast 2180 op enabled wint de strengste: registreren kan dan alleen met een eenmalige TAP.
- **2190** — vraagt de custom authentication strength 'CA-WHfB-Passkeys' met AAGUID-beperking, per tenant aangemaakt. Staat op report-only: hij laat op álle apps alleen een Windows Hello-passkey toe, dus geen WHfB-credential, geen telefoon en geen beveiligingssleutel. Eerst de report-only-uitslag lezen.
- **3060** — sessiecontrole via Defender for Cloud Apps vereist een MDCA-licentie.

## À côté des templates

| Fichier ou dossier | Ce qu'il consigne |
|---|---|
| [`_manifest.json`](_manifest.json) | quels templates sont optionnels, et pourquoi |
| [`../docs/policies.json`](../docs/policies.json) | par template ce qu'il fait, les points d'attention et les stratégies Intune qu'il touche — la source du README par stratégie |
| [`../prerequisites/`](../prerequisites/README.fr.md) | les groupes, named locations et custom authentication strengths auxquels les templates renvoient |
| [`../controls/`](../controls/README.fr.md) | par template les contrôles ISO 27001, NIS2, CIS et NIST CSF |
| [`../authentication-methods/`](../authentication-methods/README.fr.md) | quelles méthodes de connexion sont actives — sans passkey, `2120` est irréalisable |

`_manifest.json` et ces README n'ont pas de `displayName` ; une synchronisation du dépôt dans CIPP en fait au plus une ligne sans nom qui ne fait rien.
