<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CA__1100__BLOCK__HighRisk_Users.en.md) · [Français](CA__1100__BLOCK__HighRisk_Users.fr.md)

# CA - 1100 - BLOCK - High-Risk Users

Blokkeert een gebruiker die Entra ID Protection als hoog risico inschat, tot het risico is weggenomen. Vraagt Entra ID P2.

| | |
|---|---|
| Type | BLOCK |
| State | disabled |
| Stage | 2 |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Op | alle apps |
| Voorwaarden | Gebruikersrisico: high |
| Eis | blokkeren |
| Bestand | [`CA__1100__BLOCK__HighRisk_Users.json`](CA__1100__BLOCK__HighRisk_Users.json) |

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
