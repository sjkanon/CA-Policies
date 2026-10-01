<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__1040__BLOCK__Countries_not_Allowed.en.md) · [Français](CXNM__STANDARD__1040__BLOCK__Countries_not_Allowed.fr.md)

# CXNM - STANDARD - 1040 - BLOCK - Countries not Allowed

Blokkeert aanmelden van buiten de landen in de named location `Allowed Countries`. Staat vast op Report tot die landen per tenant zijn ingevuld: een lege lijst zou elke aanmelding blokkeren.

| | |
|---|---|
| Type | BLOCK |
| State | disabled |
| Stage | 2 (vast op Report) |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Excluded from Country Block List` |
| Op | alle apps |
| Voorwaarden | Locatie: alle locaties, behalve `Allowed Countries` |
| Eis | blokkeren |
| Bestand | [`CXNM__STANDARD__1040__BLOCK__Countries_not_Allowed.json`](CXNM__STANDARD__1040__BLOCK__Countries_not_Allowed.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Let op

- Wie op reis is buiten de toegestane landen kan niet aanmelden. Zet die tijdelijk in `Excluded from Country Block List`, en haal hem er na terugkomst weer uit.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.20 Netwerkbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.AA-05<br>PR.IR-01 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
