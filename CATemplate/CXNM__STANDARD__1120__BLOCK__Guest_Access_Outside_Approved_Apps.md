<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__1120__BLOCK__Guest_Access_Outside_Approved_Apps.en.md) · [Français](CXNM__STANDARD__1120__BLOCK__Guest_Access_Outside_Approved_Apps.fr.md)

# CXNM - STANDARD - 1120 - BLOCK - Guest Access Outside Approved Apps

Blokkeert gasten en externe gebruikers op alles behalve Office 365 en My Apps. My Apps staat erbij omdat een gast anders zijn uitnodiging niet kan inwisselen.

| | |
|---|---|
| Type | BLOCK |
| State | enabled |
| Stage | 1 |
| Voor wie | gasten |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Op | alle apps, behalve Office 365 (`Office365`), My Apps (`2793995e-0a7d-40d7-bd35-6968ba142197`) |
| Voorwaarden | geen — alleen wie, op welke app |
| Eis | blokkeren |
| Bestand | [`CXNM__STANDARD__1120__BLOCK__Guest_Access_Outside_Approved_Apps.json`](CXNM__STANDARD__1120__BLOCK__Guest_Access_Outside_Approved_Apps.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.5.18 Toegangsrechten<br>A.8.3 Beperking toegang tot informatie |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(d) beveiliging van de toeleveringsketen |
| CIS Controls v8.1 | 6.8 Define and Maintain Role-Based Access Control |
| NIST CSF 2.0 | PR.AA-05 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
