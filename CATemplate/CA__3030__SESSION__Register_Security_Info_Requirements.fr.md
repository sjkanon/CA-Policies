<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__3030__SESSION__Register_Security_Info_Requirements.md) · [English](CA__3030__SESSION__Register_Security_Info_Requirements.en.md) · **Français**

# CA - 3030 - SESSION - Register Security Info Requirements

Limite à 90 jours la session utilisée pour enregistrer les infos de sécurité : qui est connecté depuis plus longtemps se reconnecte d'abord. `2180` règle avec quoi on peut s'enregistrer.

| | |
|---|---|
| Type | SESSION |
| State | enabled |
| Stage | 1 |
| Pour qui | tout le monde |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Sur | enregistrer les infos de sécurité |
| Conditions | aucune — seulement qui, sur quelle app |
| Exigence | connexion toutes les 90 jours |
| Fichier | [`CA__3030__SESSION__Register_Security_Info_Requirements.json`](CA__3030__SESSION__Register_Security_Info_Requirements.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.5.16 Identiteitsbeheer |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 6.1 Establish an Access Granting Process |
| NIST CSF 2.0 | PR.AA-02<br>PR.AA-01 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
