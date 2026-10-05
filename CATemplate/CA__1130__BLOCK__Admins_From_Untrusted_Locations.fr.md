<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__1130__BLOCK__Admins_From_Untrusted_Locations.md) · [English](CA__1130__BLOCK__Admins_From_Untrusted_Locations.en.md) · **Français**

# CA - 1130 - BLOCK - Admins From Untrusted Locations

Bloque les 28 rôles d'administration en dehors des emplacements de confiance. Optionnel : un administrateur qui travaille chez lui ou en déplacement ne peut alors plus administrer.

| | |
|---|---|
| Type | BLOCK |
| State | enabled |
| Stage | 3* |
| Pour qui | 28 rôles d'admin |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Sur | toutes les apps |
| Conditions | Emplacement: tous les emplacements, sauf tous les emplacements de confiance |
| Exigence | bloquer |
| Fichier | [`CA__1130__BLOCK__Admins_From_Untrusted_Locations.json`](CA__1130__BLOCK__Admins_From_Untrusted_Locations.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

> **Optionnel** — beheerders vastzetten op vertrouwde locaties sluit ze buiten zodra ze thuis of onderweg werken. Alleen inschakelen na expliciete afstemming met de organisatie.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.2 Speciale toegangsrechten<br>A.5.15 Toegangsbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 12.8 Establish and Maintain Dedicated Computing Resources for All Administrative Work<br>13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.AA-05<br>PR.IR-01 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
