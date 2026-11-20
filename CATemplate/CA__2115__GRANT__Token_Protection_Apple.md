<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CA__2115__GRANT__Token_Protection_Apple.en.md) · [Français](CA__2115__GRANT__Token_Protection_Apple.fr.md)

# CA - 2115 - GRANT - Token Protection Apple

Eist token protection voor Exchange Online en SharePoint Online in de Microsoft-apps op beheerde iPhones, iPads en Macs: het aanmeldtoken is aan de Secure Enclave van het toestel gebonden en werkt niet meer als het gestolen wordt. De Apple-tegenhanger van 2110.

| | |
|---|---|
| Type | GRANT |
| State | report-only |
| Stage | 3* |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| Op | 2 apps: Exchange Online (`00000002-0000-0ff1-ce00-000000000000`), SharePoint Online (`00000003-0000-0ff1-ce00-000000000000`) |
| Voorwaarden | Clients: mobiele apps en desktopclients<br>Platform: iOS, macOS<br>Apparaatfilter: alleen `device.isCompliant -eq True` |
| Eis | token protection |
| Bestand | [`CA__2115__GRANT__Token_Protection_Apple.json`](CA__2115__GRANT__Token_Protection_Apple.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

> **Optioneel** — token protection op Apple werkt alleen op MDM-beheerde toestellen met de Microsoft Enterprise SSO-plug-in (iOS) of Platform SSO (macOS), en blokkeert de ingebouwde Mail- en Agenda-apps van Apple. Report-only tot de sign-in-logs (statuscodes 1003/1004 zijn zelf op te lossen) laten zien dat de beheerde toestellen klaar zijn, en tot gebruikers van Apple Mail zijn overgestapt op Outlook.

## Let op

- Alleen MDM-beheerde toestellen worden ondersteund. Het apparaatfilter (device.isCompliant -eq True, include) houdt de policy daarom bij compliant toestellen; een persoonlijke iPhone met alleen App Protection is niet geregistreerd, valt niet onder het filter en wordt niet geblokkeerd. Haal dat filter niet weg.
- De ingebouwde Mail- en Agenda-apps van Apple ondersteunen geen token protection en worden geblokkeerd zodra de policy aan staat. Op een compliant toestel laat 2070 die apps nu wel toe; kondig de overstap naar Outlook aan vóór je aanzet.
- Toestellen die al geregistreerd waren vóór de SSO-plug-in of Platform SSO er stond, krijgen één keer een aanmeldvraag en worden dan automatisch naar hardwaregebonden registratie overgezet (statuscode 1003/1004 in de sign-in-logs).

## Raakt Intune

Deze policy hangt af van Intune-policies in de [IntuneBackup-repo](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Bij elke policy daar staat de koppeling omgekeerd.

Token protection op Apple vraagt hardwaregebonden apparaatregistratie, en die komt alleen via de Microsoft Enterprise SSO-plug-in (iOS) of Platform SSO (macOS). Zonder deze Intune-policy is het token niet gebonden en blokkeert deze CA-policy de Microsoft-apps.

| Platform | Intune-policies |
|---|---|
| macOS | [MAC - D - Platform SSO](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Platform_SSO.md) |
| iOS/iPadOS | [IOS - D - Enterprise SSO](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Enterprise_SSO.md) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie<br>A.8.24 Gebruik van cryptografie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(h) cryptografie en versleuteling |
| CIS Controls v8.1 | 6.3 Require MFA for Externally-Exposed Applications |
| NIST CSF 2.0 | PR.AA-04<br>PR.DS-02 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
