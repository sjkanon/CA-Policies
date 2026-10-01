<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__2070__GRANT__Mobile_Device_Access_Requirements.md) · **English** · [Français](CXNM__STANDARD__2070__GRANT__Mobile_Device_Access_Requirements.fr.md)

# CXNM - STANDARD - 2070 - GRANT - Mobile Device Access Requirements

Requires an app with an app protection policy for mobile apps on iOS and Android. That keeps company data on a personal phone inside protected Microsoft apps.

| | |
|---|---|
| Type | GRANT |
| State | disabled |
| Stage | 2 |
| Who | everyone |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| On | all apps, except Microsoft Intune (`0000000a-0000-0000-c000-000000000000`) |
| Conditions | Clients: mobile apps and desktop clients<br>Platform: android, iOS |
| Requirement | compliant app |
| File | [`CXNM__STANDARD__2070__GRANT__Mobile_Device_Access_Requirements.json`](CXNM__STANDARD__2070__GRANT__Mobile_Device_Access_Requirements.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

## Touches Intune

This policy depends on Intune policies in the [IntuneBackup repo](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Each policy there shows the link the other way round.

The app protection policy that `compliantApplication` asks for. Without an assigned policy no app qualifies and access on iOS and Android is closed.

| Platform | Intune policies |
|---|---|
| iOS/iPadOS | [IOS - U - App Protection](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/AppProtection/Baseline_IOS_U_App_Protection.en.md) |
| Android | [AND - U - App Protection](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/AppProtection/Baseline_AND_U_App_Protection.en.md) |

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.12 Voorkomen van datalekken<br>A.6.7 Werken op afstand |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(h) cryptografie en versleuteling |
| CIS Controls v8.1 | 4.12 Separate Enterprise Workspaces on Mobile End-User Devices |
| NIST CSF 2.0 | PR.DS-01<br>PR.AA-05 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
