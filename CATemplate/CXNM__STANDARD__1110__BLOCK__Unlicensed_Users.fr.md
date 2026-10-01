<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__1110__BLOCK__Unlicensed_Users.md) · [English](CXNM__STANDARD__1110__BLOCK__Unlicensed_Users.en.md) · **Français**

# CXNM - STANDARD - 1110 - BLOCK - Unlicensed Users

Bloque les utilisateurs qui ne sont pas dans `Licensed Users`, afin qu'un compte sans licence — un compte de test oublié, une boîte partagée avec un mot de passe — ne puisse pas se connecter.

| | |
|---|---|
| Type | BLOCK |
| State | enabled |
| Stage | 1 |
| Pour qui | tout le monde |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts`, `Licensed Users` |
| Sur | toutes les apps |
| Conditions | aucune — seulement qui, sur quelle app |
| Exigence | bloquer |
| Fichier | [`CXNM__STANDARD__1110__BLOCK__Unlicensed_Users.json`](CXNM__STANDARD__1110__BLOCK__Unlicensed_Users.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

## Points d'attention

- `Licensed Users` doit contenir toute personne disposant d'une licence — en pratique un groupe dynamique. Qui en est absent est bloqué.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.16 Identiteitsbeheer<br>A.5.18 Toegangsrechten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 5.1 Establish and Maintain an Inventory of Accounts<br>5.3 Disable Dormant Accounts |
| NIST CSF 2.0 | PR.AA-01<br>PR.AA-05 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
