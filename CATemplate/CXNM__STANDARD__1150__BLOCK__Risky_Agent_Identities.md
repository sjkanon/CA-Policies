<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__1150__BLOCK__Risky_Agent_Identities.en.md) · [Français](CXNM__STANDARD__1150__BLOCK__Risky_Agent_Identities.fr.md)

# CXNM - STANDARD - 1150 - BLOCK - Risky Agent Identities

Blokkeert agent-identiteiten met een hoog risico. Vraagt Microsoft Entra Agent ID; een tenant zonder agents heeft niets om te beoordelen.

| | |
|---|---|
| Type | BLOCK |
| State | enabled |
| Stage | 3* |
| Voor wie | agent- en workload-identiteiten |
| Uitgesloten | — |
| Op | alle apps |
| Voorwaarden | Risico agent: high |
| Eis | blokkeren |
| Bestand | [`CXNM__STANDARD__1150__BLOCK__Risky_Agent_Identities.json`](CXNM__STANDARD__1150__BLOCK__Risky_Agent_Identities.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

> **Optioneel** — vraagt Microsoft Entra Agent ID; een tenant zonder agent-identiteiten heeft niets om te beoordelen.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.16 Identiteitsbeheer<br>A.8.16 Monitoringactiviteiten<br>A.5.23 Informatiebeveiliging voor het gebruik van clouddiensten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(b) incidentbehandeling |
| CIS Controls v8.1 | 5.5 Establish and Maintain an Inventory of Service Accounts |
| NIST CSF 2.0 | PR.AA-01<br>RS.MI-01 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
