<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2150__GRANT__Cloud_PC_Mobile_Access.md) · **English** · [Français](CA__2150__GRANT__Cloud_PC_Mobile_Access.fr.md)

# CA - 2150 - GRANT - Cloud PC Mobile Access

Requires an app protection policy or a compliant device for Windows 365 and Microsoft Remote Desktop on iOS and Android, so that a Cloud PC cannot be reached from just any phone.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 3* |
| Who | everyone |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| On | 2 apps: Windows 365 (`0af06dc6-e4b5-4f28-818e-e78e62d137a5`), Microsoft Remote Desktop (`a4a365df-50f1-4397-bc59-1a1564b8bb9c`) |
| Conditions | Clients: mobile apps and desktop clients<br>Platform: android, iOS |
| Requirement | compliant app or compliant device |
| File | [`CA__2150__GRANT__Cloud_PC_Mobile_Access.json`](CA__2150__GRANT__Cloud_PC_Mobile_Access.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

> **Optional** — alleen relevant in een tenant met Windows 365 / Cloud PC.

## Touches Intune

This policy depends on Intune policies in the [IntuneBackup repo](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Each policy there shows the link the other way round.

One of the two ways to meet this policy: the app is covered by an app protection policy. Without an assigned policy only a compliant device is left.

| Platform | Intune policies |
|---|---|
| iOS/iPadOS | [IOS - U - App Protection](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/AppProtection/Baseline_IOS_U_App_Protection.en.md) |
| Android | [AND - U - App Protection](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/AppProtection/Baseline_AND_U_App_Protection.en.md) |

The other way: a compliant device. Helps determine whether an iPhone or Android device counts as compliant.

| Platform | Intune policies |
|---|---|
| iOS/iPadOS | [IOS - U - Compliance Defender for Endpoint](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Defender_for_Endpoint.en.md)<br>[IOS - U - Compliance Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Device_Health.en.md)<br>[IOS - U - Compliance Password](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Password.en.md) |
| Android | [AND - D - Compliance Dedicated Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_D_Compliance_Dedicated_Device_Health.en.md)<br>[AND - U - Compliance Block Device Administrator](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Block_Device_Administrator.en.md)<br>[AND - U - Compliance Corporate Defender for Endpoint](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Defender_for_Endpoint.en.md)<br>[AND - U - Compliance Corporate Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Device_Health.en.md)<br>[AND - U - Compliance Corporate Password](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Password.en.md)<br>[AND - U - Compliance Defender for Endpoint](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Defender_for_Endpoint.en.md)<br>[AND - U - Compliance Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.en.md)<br>[AND - U - Compliance Password](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Password.en.md) |

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Eindpuntapparatuur van gebruikers<br>A.6.7 Werken op afstand |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.12 Separate Enterprise Workspaces on Mobile End-User Devices<br>13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.AA-05 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
