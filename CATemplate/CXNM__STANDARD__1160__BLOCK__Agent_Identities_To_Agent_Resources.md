<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__1160__BLOCK__Agent_Identities_To_Agent_Resources.en.md) · [Français](CXNM__STANDARD__1160__BLOCK__Agent_Identities_To_Agent_Resources.fr.md)

# CXNM - STANDARD - 1160 - BLOCK - Agent Identities To Agent Resources

Blokkeert elke agent-identiteit op agent-resources, behalve de uitdrukkelijk uitgezonderde. Een allow-list, dus op report-only tot de bestaande agents in kaart zijn — blind aanzetten legt ze allemaal stil.

| | |
|---|---|
| Type | BLOCK |
| State | report-only |
| Stage | 3* |
| Voor wie | agent- en workload-identiteiten |
| Uitgesloten | — |
| Op | agent-resources |
| Voorwaarden | geen — alleen wie, op welke app |
| Eis | blokkeren |
| Bestand | [`CXNM__STANDARD__1160__BLOCK__Agent_Identities_To_Agent_Resources.json`](CXNM__STANDARD__1160__BLOCK__Agent_Identities_To_Agent_Resources.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

> **Optioneel** — vraagt Microsoft Entra Agent ID. Staat bewust op report-only: dit is een allow-list — hij blokkeert élke agent-identiteit op agent-resources behalve de expliciet uitgezonderde, en dat legt bij inschakelen zonder inventarisatie alle bestaande agents stil. Eerst de report-only-uitslag lezen, dan de uitzonderingen invullen, dan aanzetten.

## Let op

- Controleer of CIPP de beta-velden voor agents meestuurt. Zo niet, dan rolt dit template uit zonder zijn agent-conditie en wordt het een blokkade op alles.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.3 Beperking toegang tot informatie |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 6.7 Centralize Access Control |
| NIST CSF 2.0 | PR.AA-05 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
