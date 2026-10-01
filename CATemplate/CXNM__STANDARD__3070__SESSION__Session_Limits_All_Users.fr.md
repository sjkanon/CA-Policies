<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__3070__SESSION__Session_Limits_All_Users.md) · [English](CXNM__STANDARD__3070__SESSION__Session_Limits_All_Users.en.md) · **Français**

# CXNM - STANDARD - 3070 - SESSION - Session Limits All Users

Oblige tous les utilisateurs à se reconnecter toutes les 12 heures, invités compris. Les administrateurs sont soumis à 9 heures, plus strict, par `3010`.

| | |
|---|---|
| Type | SESSION |
| State | enabled |
| Stage | 1 |
| Pour qui | tout le monde |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| Sur | toutes les apps |
| Conditions | aucune — seulement qui, sur quelle app |
| Exigence | connexion toutes les 12 heures |
| Fichier | [`CXNM__STANDARD__3070__SESSION__Session_Limits_All_Users.json`](CXNM__STANDARD__3070__SESSION__Session_Limits_All_Users.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.7.7 Clear desk en clear screen<br>A.5.15 Toegangsbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.AA-05 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
