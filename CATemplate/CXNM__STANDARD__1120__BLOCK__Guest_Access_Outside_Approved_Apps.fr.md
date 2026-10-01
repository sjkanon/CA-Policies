<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__1120__BLOCK__Guest_Access_Outside_Approved_Apps.md) · [English](CXNM__STANDARD__1120__BLOCK__Guest_Access_Outside_Approved_Apps.en.md) · **Français**

# CXNM - STANDARD - 1120 - BLOCK - Guest Access Outside Approved Apps

Bloque les invités et utilisateurs externes sur tout sauf Office 365 et My Apps. My Apps est inclus car sinon un invité ne peut pas accepter son invitation.

| | |
|---|---|
| Type | BLOCK |
| State | enabled |
| Stage | 1 |
| Pour qui | invités |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Sur | toutes les apps, sauf Office 365 (`Office365`), My Apps (`2793995e-0a7d-40d7-bd35-6968ba142197`) |
| Conditions | aucune — seulement qui, sur quelle app |
| Exigence | bloquer |
| Fichier | [`CXNM__STANDARD__1120__BLOCK__Guest_Access_Outside_Approved_Apps.json`](CXNM__STANDARD__1120__BLOCK__Guest_Access_Outside_Approved_Apps.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.5.18 Toegangsrechten<br>A.8.3 Beperking toegang tot informatie |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(d) beveiliging van de toeleveringsketen |
| CIS Controls v8.1 | 6.8 Define and Maintain Role-Based Access Control |
| NIST CSF 2.0 | PR.AA-05 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
