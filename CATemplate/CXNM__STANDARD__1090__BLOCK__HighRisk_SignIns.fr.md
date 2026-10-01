<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__1090__BLOCK__HighRisk_SignIns.md) · [English](CXNM__STANDARD__1090__BLOCK__HighRisk_SignIns.en.md) · **Français**

# CXNM - STANDARD - 1090 - BLOCK - High-Risk Sign-Ins

Bloque une connexion qu'Entra ID Protection évalue à risque élevé. Requiert Entra ID P2 ; en P1 la condition n'est jamais vraie et la stratégie ne fait rien.

| | |
|---|---|
| Type | BLOCK |
| State | enabled |
| Stage | 1 |
| Pour qui | tout le monde |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Sur | toutes les apps |
| Conditions | Risque de connexion: high |
| Exigence | bloquer |
| Fichier | [`CXNM__STANDARD__1090__BLOCK__HighRisk_SignIns.json`](CXNM__STANDARD__1090__BLOCK__HighRisk_SignIns.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.16 Monitoringactiviteiten<br>A.5.25 Beoordelen van en besluiten over informatiebeveiligingsgebeurtenissen |
| NIS2 art. 21(2) | art. 21(2)(b) incidentbehandeling<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 13.1 Centralize Security Event Alerting |
| NIST CSF 2.0 | DE.CM-03<br>RS.MI-01 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
