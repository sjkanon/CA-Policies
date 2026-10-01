<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__2150__GRANT__Cloud_PC_Mobile_Access.en.md) · [Français](CXNM__STANDARD__2150__GRANT__Cloud_PC_Mobile_Access.fr.md)

# CXNM - STANDARD - 2150 - GRANT - Cloud PC Mobile Access

Eist voor Windows 365 en Microsoft Remote Desktop op iOS en Android een app protection policy of een compliant toestel, zodat een Cloud PC niet vanaf een willekeurige telefoon bereikbaar is.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 3* |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| Op | 2 apps: Windows 365 (`0af06dc6-e4b5-4f28-818e-e78e62d137a5`), Microsoft Remote Desktop (`a4a365df-50f1-4397-bc59-1a1564b8bb9c`) |
| Voorwaarden | Clients: mobiele apps en desktopclients<br>Platform: android, iOS |
| Eis | compliant app of compliant apparaat |
| Bestand | [`CXNM__STANDARD__2150__GRANT__Cloud_PC_Mobile_Access.json`](CXNM__STANDARD__2150__GRANT__Cloud_PC_Mobile_Access.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

> **Optioneel** — alleen relevant in een tenant met Windows 365 / Cloud PC.

## Raakt Intune

Deze policy hangt af van Intune-policies in de [IntuneBackup-repo](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Bij elke policy daar staat de koppeling omgekeerd.

Eén van de twee manieren om aan deze policy te voldoen: de app valt onder een app protection policy. Zonder toegewezen policy blijft alleen een compliant toestel over.

| Platform | Intune-policies |
|---|---|
| iOS/iPadOS | [IOS - U - App Protection](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/AppProtection/Baseline_IOS_U_App_Protection.md) |
| Android | [AND - U - App Protection](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/AppProtection/Baseline_AND_U_App_Protection.md) |

De andere manier: een compliant toestel. Bepaalt mee of een iPhone of Android-toestel als compliant telt.

| Platform | Intune-policies |
|---|---|
| iOS/iPadOS | [IOS - U - Compliance Defender for Endpoint](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Defender_for_Endpoint.md)<br>[IOS - U - Compliance Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Device_Health.md)<br>[IOS - U - Compliance Password](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Password.md) |
| Android | [AND - D - Compliance Dedicated Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_D_Compliance_Dedicated_Device_Health.md)<br>[AND - U - Compliance Block Device Administrator](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Block_Device_Administrator.md)<br>[AND - U - Compliance Corporate Defender for Endpoint](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Defender_for_Endpoint.md)<br>[AND - U - Compliance Corporate Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Device_Health.md)<br>[AND - U - Compliance Corporate Password](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Password.md)<br>[AND - U - Compliance Defender for Endpoint](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Defender_for_Endpoint.md)<br>[AND - U - Compliance Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.md)<br>[AND - U - Compliance Password](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Password.md) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Eindpuntapparatuur van gebruikers<br>A.6.7 Werken op afstand |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.12 Separate Enterprise Workspaces on Mobile End-User Devices<br>13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.AA-05 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
