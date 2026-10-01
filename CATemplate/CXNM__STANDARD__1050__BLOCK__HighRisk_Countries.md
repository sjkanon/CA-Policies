<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__1050__BLOCK__HighRisk_Countries.en.md) · [Français](CXNM__STANDARD__1050__BLOCK__HighRisk_Countries.fr.md)

# CXNM - STANDARD - 1050 - BLOCK - High-Risk Countries

Blokkeert aanmelden vanuit de landen in de named location `High-Risk Countries`.

| | |
|---|---|
| Type | BLOCK |
| State | enabled |
| Stage | 1 |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Op | alle apps |
| Voorwaarden | Locatie: `High-Risk Countries` |
| Eis | blokkeren |
| Bestand | [`CXNM__STANDARD__1050__BLOCK__HighRisk_Countries.json`](CXNM__STANDARD__1050__BLOCK__HighRisk_Countries.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.20 Netwerkbeveiliging<br>A.5.7 Informatie en analyses over dreigingen |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.AA-05<br>PR.IR-01 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
