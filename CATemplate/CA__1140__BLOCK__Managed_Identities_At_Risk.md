<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CA__1140__BLOCK__Managed_Identities_At_Risk.en.md) · [Français](CA__1140__BLOCK__Managed_Identities_At_Risk.fr.md)

# CA - 1140 - BLOCK - Managed Identities At Risk

Blokkeert workload-identiteiten (service principals) met een gemiddeld of hoog risico. Vraagt Microsoft Entra Workload ID Premium — dat zit niet in Entra ID P2.

| | |
|---|---|
| Type | BLOCK |
| State | enabled |
| Stage | 3* |
| Voor wie | agent- en workload-identiteiten |
| Uitgesloten | — |
| Op | alle apps |
| Voorwaarden | Risico workload-identiteit: medium, high |
| Eis | blokkeren |
| Bestand | [`CA__1140__BLOCK__Managed_Identities_At_Risk.json`](CA__1140__BLOCK__Managed_Identities_At_Risk.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

> **Optioneel** — risicodetectie op workload-identiteiten vereist Microsoft Entra Workload ID Premium.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.16 Identiteitsbeheer<br>A.8.2 Speciale toegangsrechten<br>A.8.16 Monitoringactiviteiten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(b) incidentbehandeling |
| CIS Controls v8.1 | 5.5 Establish and Maintain an Inventory of Service Accounts |
| NIST CSF 2.0 | PR.AA-01<br>RS.MI-01 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
