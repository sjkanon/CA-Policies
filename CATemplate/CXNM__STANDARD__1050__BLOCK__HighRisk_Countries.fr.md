<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__1050__BLOCK__HighRisk_Countries.md) · [English](CXNM__STANDARD__1050__BLOCK__HighRisk_Countries.en.md) · **Français**

# CXNM - STANDARD - 1050 - BLOCK - High-Risk Countries

Bloque la connexion depuis les pays de la named location `High-Risk Countries`.

| | |
|---|---|
| Type | BLOCK |
| State | enabled |
| Stage | 1 |
| Pour qui | tout le monde |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Sur | toutes les apps |
| Conditions | Emplacement: `High-Risk Countries` |
| Exigence | bloquer |
| Fichier | [`CXNM__STANDARD__1050__BLOCK__HighRisk_Countries.json`](CXNM__STANDARD__1050__BLOCK__HighRisk_Countries.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.20 Netwerkbeveiliging<br>A.5.7 Informatie en analyses over dreigingen |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.AA-05<br>PR.IR-01 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
