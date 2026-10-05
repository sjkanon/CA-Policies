<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CA__2110__GRANT__Token_Protection.en.md) · [Français](CA__2110__GRANT__Token_Protection.fr.md)

# CA - 2110 - GRANT - Token Protection

Eist token protection voor Exchange Online en SharePoint Online in desktopapps op Windows: het aanmeldtoken is aan het apparaat gebonden en werkt niet meer als het gestolen wordt.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 1 |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| Op | 2 apps: Exchange Online (`00000002-0000-0ff1-ce00-000000000000`), SharePoint Online (`00000003-0000-0ff1-ce00-000000000000`) |
| Voorwaarden | Clients: mobiele apps en desktopclients<br>Platform: windows |
| Eis | token protection |
| Bestand | [`CA__2110__GRANT__Token_Protection.json`](CA__2110__GRANT__Token_Protection.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Let op

- Alleen Windows-desktopapps op een Entra joined, hybrid joined of geregistreerd apparaat. Een niet-ondersteunde client wordt geblokkeerd, niet overgeslagen — kijk eerst in de sign-in-logs welke clients aanmelden.

## Raakt Intune

Deze policy hangt af van Intune-policies in de [IntuneBackup-repo](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Bij elke policy daar staat de koppeling omgekeerd.

Token protection werkt alleen in client-versies die gebonden tokens ondersteunen. Een Office-app of OneDrive-sync-client op een te oude versie wordt door deze policy geblokkeerd; deze Intune-policy houdt die clients bij.

| Platform | Intune-policies |
|---|---|
| Windows | [WIN - D - Microsoft Office Updates](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Office_Updates.md)<br>[WIN - D - Microsoft OneDrive](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_OneDrive.md) |

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
