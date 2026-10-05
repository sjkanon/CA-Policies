<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2100__GRANT__MFA_For_Admin_Portals.md) · [English](CA__2100__GRANT__MFA_For_Admin_Portals.en.md) · **Français**

# CA - 2100 - GRANT - MFA for Admin Portals

Exige la MFA sur les portails d'administration Microsoft et l'API Azure Service Management, pour tout le monde — y compris ceux sans rôle d'administration.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 1 |
| Pour qui | tout le monde |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Sur | portails d'admin: Microsoft Admin Portals (`MicrosoftAdminPortals`), Azure Service Management API (`797f4846-ba00-4fd7-ba43-dac1f8f63013`) |
| Conditions | aucune — seulement qui, sur quelle app |
| Exigence | `Multifactor authentication` |
| Fichier | [`CA__2100__GRANT__MFA_For_Admin_Portals.json`](CA__2100__GRANT__MFA_For_Admin_Portals.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.2 Speciale toegangsrechten<br>A.8.5 Veilige authenticatie<br>A.5.17 Authenticatie-informatie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 6.5 Require MFA for Administrative Access |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-05 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
