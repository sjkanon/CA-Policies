<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__1080__BLOCK__Guest_Access_to_Sensitive_Apps.en.md) · [Français](CXNM__STANDARD__1080__BLOCK__Guest_Access_to_Sensitive_Apps.fr.md)

# CXNM - STANDARD - 1080 - BLOCK - Guest Access to Sensitive Apps

Blokkeert gasten en externe gebruikers op de Microsoft-beheerportalen en de Azure Service Management API.

| | |
|---|---|
| Type | BLOCK |
| State | disabled |
| Stage | 2 |
| Voor wie | gasten |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Op | beheerportalen: Microsoft Admin Portals (`MicrosoftAdminPortals`), Azure Service Management API (`797f4846-ba00-4fd7-ba43-dac1f8f63013`) |
| Voorwaarden | geen — alleen wie, op welke app |
| Eis | blokkeren |
| Bestand | [`CXNM__STANDARD__1080__BLOCK__Guest_Access_to_Sensitive_Apps.json`](CXNM__STANDARD__1080__BLOCK__Guest_Access_to_Sensitive_Apps.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.5.18 Toegangsrechten<br>A.8.2 Speciale toegangsrechten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(d) beveiliging van de toeleveringsketen |
| CIS Controls v8.1 | 5.4 Restrict Administrator Privileges to Dedicated Administrator Accounts<br>6.8 Define and Maintain Role-Based Access Control |
| NIST CSF 2.0 | PR.AA-05 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
