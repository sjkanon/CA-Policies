<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__1090__BLOCK__HighRisk_SignIns.en.md) · [Français](CXNM__STANDARD__1090__BLOCK__HighRisk_SignIns.fr.md)

# CXNM - STANDARD - 1090 - BLOCK - High-Risk Sign-Ins

Blokkeert een aanmelding die Entra ID Protection als hoog risico inschat. Vraagt Entra ID P2; op P1 wordt de conditie nooit waar en doet de policy niets.

| | |
|---|---|
| Type | BLOCK |
| State | enabled |
| Stage | 1 |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Op | alle apps |
| Voorwaarden | Aanmeldrisico: high |
| Eis | blokkeren |
| Bestand | [`CXNM__STANDARD__1090__BLOCK__HighRisk_SignIns.json`](CXNM__STANDARD__1090__BLOCK__HighRisk_SignIns.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.16 Monitoringactiviteiten<br>A.5.25 Beoordelen van en besluiten over informatiebeveiligingsgebeurtenissen |
| NIS2 art. 21(2) | art. 21(2)(b) incidentbehandeling<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 13.1 Centralize Security Event Alerting |
| NIST CSF 2.0 | DE.CM-03<br>RS.MI-01 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
