<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2115__GRANT__Token_Protection_Apple.md) · [English](CA__2115__GRANT__Token_Protection_Apple.en.md) · **Français**

# CA - 2115 - GRANT - Token Protection Apple

Exige la token protection pour Exchange Online et SharePoint Online dans les applications Microsoft sur les iPhone, iPad et Mac gérés : le jeton de connexion est lié à la Secure Enclave de l'appareil et ne fonctionne plus s'il est volé. L'équivalent Apple de 2110.

| | |
|---|---|
| Type | GRANT |
| State | report-only |
| Stage | 3* |
| Pour qui | tout le monde |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| Sur | 2 apps: Exchange Online (`00000002-0000-0ff1-ce00-000000000000`), SharePoint Online (`00000003-0000-0ff1-ce00-000000000000`) |
| Conditions | Clients: apps mobiles et clients de bureau<br>Plateforme: iOS, macOS<br>Filtre d'appareil: uniquement `device.isCompliant -eq True` |
| Exigence | token protection |
| Fichier | [`CA__2115__GRANT__Token_Protection_Apple.json`](CA__2115__GRANT__Token_Protection_Apple.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

> **Optionnel** — token protection op Apple werkt alleen op MDM-beheerde toestellen met de Microsoft Enterprise SSO-plug-in (iOS) of Platform SSO (macOS), en blokkeert de ingebouwde Mail- en Agenda-apps van Apple. Report-only tot de sign-in-logs (statuscodes 1003/1004 zijn zelf op te lossen) laten zien dat de beheerde toestellen klaar zijn, en tot gebruikers van Apple Mail zijn overgestapt op Outlook.

## Points d'attention

- Seuls les appareils gérés par MDM sont pris en charge. Le filtre d'appareil (device.isCompliant -eq True, include) limite donc la stratégie aux appareils conformes ; un iPhone personnel avec seulement App Protection n'est pas enregistré, ne correspond pas au filtre et n'est pas bloqué. Ne retirez pas ce filtre.
- Les applications Mail et Calendrier intégrées d'Apple ne prennent pas en charge la token protection et sont bloquées dès que la stratégie est active. Sur un appareil conforme, 2070 autorise actuellement ces applications ; annoncez le passage à Outlook avant l'activation.
- Les appareils enregistrés avant la mise en place du plug-in SSO ou de Platform SSO reçoivent une seule invite de connexion, puis passent automatiquement à un enregistrement lié au matériel (code d'état 1003/1004 dans les journaux de connexion).

## Touche Intune

Cette stratégie dépend de stratégies Intune du [dépôt IntuneBackup](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Chaque stratégie y affiche le lien en sens inverse.

La token protection sur Apple exige un enregistrement d'appareil lié au matériel, qui ne passe que par le plug-in Microsoft Enterprise SSO (iOS) ou Platform SSO (macOS). Sans cette stratégie Intune, le jeton n'est pas lié et cette stratégie CA bloque les applications Microsoft.

| Plateforme | Stratégies Intune |
|---|---|
| macOS | [MAC - D - Platform SSO](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Platform_SSO.fr.md) |
| iOS/iPadOS | [IOS - D - Enterprise SSO](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Enterprise_SSO.fr.md) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie<br>A.8.24 Gebruik van cryptografie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(h) cryptografie en versleuteling |
| CIS Controls v8.1 | 6.3 Require MFA for Externally-Exposed Applications |
| NIST CSF 2.0 | PR.AA-04<br>PR.DS-02 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
