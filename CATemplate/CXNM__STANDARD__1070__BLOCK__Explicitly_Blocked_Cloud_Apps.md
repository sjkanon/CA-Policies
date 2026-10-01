<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__1070__BLOCK__Explicitly_Blocked_Cloud_Apps.en.md) · [Français](CXNM__STANDARD__1070__BLOCK__Explicitly_Blocked_Cloud_Apps.fr.md)

# CXNM - STANDARD - 1070 - BLOCK - Explicitly Blocked Cloud Apps

Blokkeert cloud-apps die de organisatie uitdrukkelijk niet wil toestaan. Het template bevat geen apps: de lijst wordt per tenant ingevuld, en tot dan doet de policy niets.

| | |
|---|---|
| Type | BLOCK |
| State | disabled |
| Stage | 2 |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Op | geen app (lijst per tenant) |
| Voorwaarden | geen — alleen wie, op welke app |
| Eis | blokkeren |
| Bestand | [`CXNM__STANDARD__1070__BLOCK__Explicitly_Blocked_Cloud_Apps.json`](CXNM__STANDARD__1070__BLOCK__Explicitly_Blocked_Cloud_Apps.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.5.23 Informatiebeveiliging voor het gebruik van clouddiensten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 2.3 Address Unauthorized Software |
| NIST CSF 2.0 | ID.AM-02<br>PR.AA-05 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
