<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__1160__BLOCK__Agent_Identities_To_Agent_Resources.md) · [English](CXNM__STANDARD__1160__BLOCK__Agent_Identities_To_Agent_Resources.en.md) · **Français**

# CXNM - STANDARD - 1160 - BLOCK - Agent Identities To Agent Resources

Bloque toute identité d'agent sur les ressources d'agent, sauf celles explicitement exclues. Une liste d'autorisation, donc en report-only jusqu'à l'inventaire des agents existants — l'activer à l'aveugle les arrête tous.

| | |
|---|---|
| Type | BLOCK |
| State | report-only |
| Stage | 3* |
| Pour qui | identités d'agent et de workload |
| Exclus | — |
| Sur | ressources d'agent |
| Conditions | aucune — seulement qui, sur quelle app |
| Exigence | bloquer |
| Fichier | [`CXNM__STANDARD__1160__BLOCK__Agent_Identities_To_Agent_Resources.json`](CXNM__STANDARD__1160__BLOCK__Agent_Identities_To_Agent_Resources.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

> **Optionnel** — vraagt Microsoft Entra Agent ID. Staat bewust op report-only: dit is een allow-list — hij blokkeert élke agent-identiteit op agent-resources behalve de expliciet uitgezonderde, en dat legt bij inschakelen zonder inventarisatie alle bestaande agents stil. Eerst de report-only-uitslag lezen, dan de uitzonderingen invullen, dan aanzetten.

## Points d'attention

- Vérifiez que CIPP transmet les champs bêta pour les agents. Sinon, ce template est déployé sans sa condition d'agent et devient un blocage de tout.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.3 Beperking toegang tot informatie |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 6.7 Centralize Access Control |
| NIST CSF 2.0 | PR.AA-05 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
