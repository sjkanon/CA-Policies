<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__1070__BLOCK__Explicitly_Blocked_Cloud_Apps.md) · [English](CA__1070__BLOCK__Explicitly_Blocked_Cloud_Apps.en.md) · **Français**

# CA - 1070 - BLOCK - Explicitly Blocked Cloud Apps

Bloque les applications cloud que l'organisation ne veut explicitement pas autoriser. Le template ne contient aucune app : la liste est renseignée par tenant, et d'ici là la stratégie ne fait rien.

| | |
|---|---|
| Type | BLOCK |
| State | disabled |
| Stage | 2 |
| Pour qui | tout le monde |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Sur | aucune app (liste par tenant) |
| Conditions | aucune — seulement qui, sur quelle app |
| Exigence | bloquer |
| Fichier | [`CA__1070__BLOCK__Explicitly_Blocked_Cloud_Apps.json`](CA__1070__BLOCK__Explicitly_Blocked_Cloud_Apps.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.5.23 Informatiebeveiliging voor het gebruik van clouddiensten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 2.3 Address Unauthorized Software |
| NIST CSF 2.0 | ID.AM-02<br>PR.AA-05 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
