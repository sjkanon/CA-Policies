<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__1150__BLOCK__Risky_Agent_Identities.md) · [English](CXNM__STANDARD__1150__BLOCK__Risky_Agent_Identities.en.md) · **Français**

# CXNM - STANDARD - 1150 - BLOCK - Risky Agent Identities

Bloque les identités d'agent à risque élevé. Requiert Microsoft Entra Agent ID ; un tenant sans agents n'a rien à évaluer.

| | |
|---|---|
| Type | BLOCK |
| State | enabled |
| Stage | 3* |
| Pour qui | identités d'agent et de workload |
| Exclus | — |
| Sur | toutes les apps |
| Conditions | Risque d'agent: high |
| Exigence | bloquer |
| Fichier | [`CXNM__STANDARD__1150__BLOCK__Risky_Agent_Identities.json`](CXNM__STANDARD__1150__BLOCK__Risky_Agent_Identities.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

> **Optionnel** — vraagt Microsoft Entra Agent ID; een tenant zonder agent-identiteiten heeft niets om te beoordelen.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.16 Identiteitsbeheer<br>A.8.16 Monitoringactiviteiten<br>A.5.23 Informatiebeveiliging voor het gebruik van clouddiensten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(b) incidentbehandeling |
| CIS Controls v8.1 | 5.5 Establish and Maintain an Inventory of Service Accounts |
| NIST CSF 2.0 | PR.AA-01<br>RS.MI-01 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
