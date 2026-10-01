<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__2070__GRANT__Mobile_Device_Access_Requirements.en.md) · [Français](CXNM__STANDARD__2070__GRANT__Mobile_Device_Access_Requirements.fr.md)

# CXNM - STANDARD - 2070 - GRANT - Mobile Device Access Requirements

Eist op iOS en Android een app met een app protection policy voor mobiele apps. Zo blijft bedrijfsdata op een persoonlijke telefoon binnen beschermde Microsoft-apps.

| | |
|---|---|
| Type | GRANT |
| State | disabled |
| Stage | 2 |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| Op | alle apps, behalve Microsoft Intune (`0000000a-0000-0000-c000-000000000000`) |
| Voorwaarden | Clients: mobiele apps en desktopclients<br>Platform: android, iOS |
| Eis | compliant app |
| Bestand | [`CXNM__STANDARD__2070__GRANT__Mobile_Device_Access_Requirements.json`](CXNM__STANDARD__2070__GRANT__Mobile_Device_Access_Requirements.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Raakt Intune

Deze policy hangt af van Intune-policies in de [IntuneBackup-repo](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Bij elke policy daar staat de koppeling omgekeerd.

De app protection policy waar `compliantApplication` naar vraagt. Zonder toegewezen policy voldoet geen enkele app en is de toegang op iOS en Android dicht.

| Platform | Intune-policies |
|---|---|
| iOS/iPadOS | [IOS - U - App Protection](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/AppProtection/Baseline_IOS_U_App_Protection.md) |
| Android | [AND - U - App Protection](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/AppProtection/Baseline_AND_U_App_Protection.md) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.12 Voorkomen van datalekken<br>A.6.7 Werken op afstand |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(h) cryptografie en versleuteling |
| CIS Controls v8.1 | 4.12 Separate Enterprise Workspaces on Mobile End-User Devices |
| NIST CSF 2.0 | PR.DS-01<br>PR.AA-05 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
