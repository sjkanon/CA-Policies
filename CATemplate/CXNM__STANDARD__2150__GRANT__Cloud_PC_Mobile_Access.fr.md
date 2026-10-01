<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__2150__GRANT__Cloud_PC_Mobile_Access.md) · [English](CXNM__STANDARD__2150__GRANT__Cloud_PC_Mobile_Access.en.md) · **Français**

# CXNM - STANDARD - 2150 - GRANT - Cloud PC Mobile Access

Exige une app protection policy ou un appareil conforme pour Windows 365 et Microsoft Remote Desktop sur iOS et Android, afin qu'un Cloud PC ne soit pas accessible depuis n'importe quel téléphone.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 3* |
| Pour qui | tout le monde |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| Sur | 2 apps: Windows 365 (`0af06dc6-e4b5-4f28-818e-e78e62d137a5`), Microsoft Remote Desktop (`a4a365df-50f1-4397-bc59-1a1564b8bb9c`) |
| Conditions | Clients: apps mobiles et clients de bureau<br>Plateforme: android, iOS |
| Exigence | app conforme ou appareil conforme |
| Fichier | [`CXNM__STANDARD__2150__GRANT__Cloud_PC_Mobile_Access.json`](CXNM__STANDARD__2150__GRANT__Cloud_PC_Mobile_Access.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

> **Optionnel** — alleen relevant in een tenant met Windows 365 / Cloud PC.

## Touche Intune

Cette stratégie dépend de stratégies Intune du [dépôt IntuneBackup](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Chaque stratégie y affiche le lien en sens inverse.

L'une des deux façons de satisfaire à cette stratégie : l'app est couverte par une app protection policy. Sans stratégie affectée, il ne reste qu'un appareil conforme.

| Plateforme | Stratégies Intune |
|---|---|
| iOS/iPadOS | [IOS - U - App Protection](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/AppProtection/Baseline_IOS_U_App_Protection.fr.md) |
| Android | [AND - U - App Protection](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/AppProtection/Baseline_AND_U_App_Protection.fr.md) |

L'autre façon : un appareil conforme. Contribue à déterminer si un iPhone ou un appareil Android est considéré comme conforme.

| Plateforme | Stratégies Intune |
|---|---|
| iOS/iPadOS | [IOS - U - Compliance Defender for Endpoint](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Defender_for_Endpoint.fr.md)<br>[IOS - U - Compliance Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Device_Health.fr.md)<br>[IOS - U - Compliance Password](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Password.fr.md) |
| Android | [AND - D - Compliance Dedicated Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_D_Compliance_Dedicated_Device_Health.fr.md)<br>[AND - U - Compliance Block Device Administrator](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Block_Device_Administrator.fr.md)<br>[AND - U - Compliance Corporate Defender for Endpoint](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Defender_for_Endpoint.fr.md)<br>[AND - U - Compliance Corporate Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Device_Health.fr.md)<br>[AND - U - Compliance Corporate Password](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Password.fr.md)<br>[AND - U - Compliance Defender for Endpoint](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Defender_for_Endpoint.fr.md)<br>[AND - U - Compliance Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.fr.md)<br>[AND - U - Compliance Password](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Password.fr.md) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Eindpuntapparatuur van gebruikers<br>A.6.7 Werken op afstand |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.12 Separate Enterprise Workspaces on Mobile End-User Devices<br>13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.AA-05 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
