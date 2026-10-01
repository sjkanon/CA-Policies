<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__3050__SESSION__Continuous_Access_Evaluation.en.md) · [Français](CXNM__STANDARD__3050__SESSION__Continuous_Access_Evaluation.fr.md)

# CXNM - STANDARD - 3050 - SESSION - Continuous Access Evaluation

Zet strikte Continuous Access Evaluation aan: een ingetrokken sessie of een gewijzigde locatie geldt direct, niet pas als het token verloopt.

| | |
|---|---|
| Type | SESSION |
| State | enabled |
| Stage | 1 |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Op | alle apps |
| Voorwaarden | geen — alleen wie, op welke app |
| Eis | strikte CAE |
| Bestand | [`CXNM__STANDARD__3050__SESSION__Continuous_Access_Evaluation.json`](CXNM__STANDARD__3050__SESSION__Continuous_Access_Evaluation.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.5.18 Toegangsrechten<br>A.8.16 Monitoringactiviteiten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(b) incidentbehandeling |
| CIS Controls v8.1 | 6.2 Establish an Access Revoking Process |
| NIST CSF 2.0 | PR.AA-05<br>RS.MI-01 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
