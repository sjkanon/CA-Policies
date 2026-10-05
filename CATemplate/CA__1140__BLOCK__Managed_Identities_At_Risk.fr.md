<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__1140__BLOCK__Managed_Identities_At_Risk.md) · [English](CA__1140__BLOCK__Managed_Identities_At_Risk.en.md) · **Français**

# CA - 1140 - BLOCK - Managed Identities At Risk

Bloque les identités de workload (service principals) à risque moyen ou élevé. Requiert Microsoft Entra Workload ID Premium — qui n'est pas inclus dans Entra ID P2.

| | |
|---|---|
| Type | BLOCK |
| State | enabled |
| Stage | 3* |
| Pour qui | identités d'agent et de workload |
| Exclus | — |
| Sur | toutes les apps |
| Conditions | Risque d'identité de workload: medium, high |
| Exigence | bloquer |
| Fichier | [`CA__1140__BLOCK__Managed_Identities_At_Risk.json`](CA__1140__BLOCK__Managed_Identities_At_Risk.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

> **Optionnel** — risicodetectie op workload-identiteiten vereist Microsoft Entra Workload ID Premium.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.16 Identiteitsbeheer<br>A.8.2 Speciale toegangsrechten<br>A.8.16 Monitoringactiviteiten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(b) incidentbehandeling |
| CIS Controls v8.1 | 5.5 Establish and Maintain an Inventory of Service Accounts |
| NIST CSF 2.0 | PR.AA-01<br>RS.MI-01 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
