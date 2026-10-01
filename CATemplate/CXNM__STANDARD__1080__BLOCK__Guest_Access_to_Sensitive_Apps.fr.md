<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__1080__BLOCK__Guest_Access_to_Sensitive_Apps.md) · [English](CXNM__STANDARD__1080__BLOCK__Guest_Access_to_Sensitive_Apps.en.md) · **Français**

# CXNM - STANDARD - 1080 - BLOCK - Guest Access to Sensitive Apps

Bloque les invités et utilisateurs externes sur les portails d'administration Microsoft et l'API Azure Service Management.

| | |
|---|---|
| Type | BLOCK |
| State | disabled |
| Stage | 2 |
| Pour qui | invités |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Sur | portails d'admin: Microsoft Admin Portals (`MicrosoftAdminPortals`), Azure Service Management API (`797f4846-ba00-4fd7-ba43-dac1f8f63013`) |
| Conditions | aucune — seulement qui, sur quelle app |
| Exigence | bloquer |
| Fichier | [`CXNM__STANDARD__1080__BLOCK__Guest_Access_to_Sensitive_Apps.json`](CXNM__STANDARD__1080__BLOCK__Guest_Access_to_Sensitive_Apps.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.5.18 Toegangsrechten<br>A.8.2 Speciale toegangsrechten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(d) beveiliging van de toeleveringsketen |
| CIS Controls v8.1 | 5.4 Restrict Administrator Privileges to Dedicated Administrator Accounts<br>6.8 Define and Maintain Role-Based Access Control |
| NIST CSF 2.0 | PR.AA-05 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
