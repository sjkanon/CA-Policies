<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__1170__BLOCK__Risky_Agent_Users.md) · [English](CA__1170__BLOCK__Risky_Agent_Users.en.md) · **Français**

# CA - 1170 - BLOCK - Risky Agent Users

Bloque les agent users à risque moyen ou élevé. Report-only ; requiert Microsoft Entra Agent ID.

| | |
|---|---|
| Type | BLOCK |
| State | report-only |
| Stage | 3* |
| Pour qui | identités d'agent et de workload |
| Exclus | — |
| Sur | toutes les apps |
| Conditions | Risque d'agent: medium, high |
| Exigence | bloquer |
| Fichier | [`CA__1170__BLOCK__Risky_Agent_Users.json`](CA__1170__BLOCK__Risky_Agent_Users.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

> **Optionnel** — vraagt Microsoft Entra Agent ID. Report-only omdat hij op medium risico al blokkeert — dezelfde afweging als bij 2010/2020, waar medium een extra eis krijgt en niet meteen een blokkade.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.16 Identiteitsbeheer<br>A.5.15 Toegangsbeveiliging<br>A.8.16 Monitoringactiviteiten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(b) incidentbehandeling |
| CIS Controls v8.1 | 13.1 Centralize Security Event Alerting |
| NIST CSF 2.0 | DE.CM-03<br>RS.MI-01 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
