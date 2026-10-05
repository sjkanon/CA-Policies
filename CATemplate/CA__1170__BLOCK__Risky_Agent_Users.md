<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CA__1170__BLOCK__Risky_Agent_Users.en.md) · [Français](CA__1170__BLOCK__Risky_Agent_Users.fr.md)

# CA - 1170 - BLOCK - Risky Agent Users

Blokkeert agent-users met een gemiddeld of hoog risico. Report-only; vraagt Microsoft Entra Agent ID.

| | |
|---|---|
| Type | BLOCK |
| State | report-only |
| Stage | 3* |
| Voor wie | agent- en workload-identiteiten |
| Uitgesloten | — |
| Op | alle apps |
| Voorwaarden | Risico agent: medium, high |
| Eis | blokkeren |
| Bestand | [`CA__1170__BLOCK__Risky_Agent_Users.json`](CA__1170__BLOCK__Risky_Agent_Users.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

> **Optioneel** — vraagt Microsoft Entra Agent ID. Report-only omdat hij op medium risico al blokkeert — dezelfde afweging als bij 2010/2020, waar medium een extra eis krijgt en niet meteen een blokkade.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.16 Identiteitsbeheer<br>A.5.15 Toegangsbeveiliging<br>A.8.16 Monitoringactiviteiten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(b) incidentbehandeling |
| CIS Controls v8.1 | 13.1 Centralize Security Event Alerting |
| NIST CSF 2.0 | DE.CM-03<br>RS.MI-01 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
