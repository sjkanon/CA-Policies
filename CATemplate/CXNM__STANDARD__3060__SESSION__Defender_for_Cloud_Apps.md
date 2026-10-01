<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__3060__SESSION__Defender_for_Cloud_Apps.en.md) · [Français](CXNM__STANDARD__3060__SESSION__Defender_for_Cloud_Apps.fr.md)

# CXNM - STANDARD - 3060 - SESSION - Defender for Cloud Apps

Leidt browsersessies via Defender for Cloud Apps, in monitor-only. Vraagt een licentie voor Defender for Cloud Apps.

| | |
|---|---|
| Type | SESSION |
| State | enabled |
| Stage | 3* |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| Op | alle apps |
| Voorwaarden | Clients: browser |
| Eis | Defender for Cloud Apps |
| Bestand | [`CXNM__STANDARD__3060__SESSION__Defender_for_Cloud_Apps.json`](CXNM__STANDARD__3060__SESSION__Defender_for_Cloud_Apps.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

> **Optioneel** — sessiecontrole via Defender for Cloud Apps vereist een MDCA-licentie.

## Let op

- Zonder licentie voor Defender for Cloud Apps is de sessiecontrole niet te kiezen en doet de policy niets.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.16 Monitoringactiviteiten<br>A.8.15 Logging<br>A.5.23 Informatiebeveiliging voor het gebruik van clouddiensten |
| NIS2 art. 21(2) | art. 21(2)(b) incidentbehandeling<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 8.2 Collect Audit Logs<br>13.1 Centralize Security Event Alerting |
| NIST CSF 2.0 | DE.CM-09<br>DE.CM-03 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
