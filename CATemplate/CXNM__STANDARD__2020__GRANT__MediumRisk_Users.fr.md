<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__2020__GRANT__MediumRisk_Users.md) · [English](CXNM__STANDARD__2020__GRANT__MediumRisk_Users.en.md) · **Français**

# CXNM - STANDARD - 2020 - GRANT - Medium-Risk Users

Exige la MFA, à chaque fois, pour un utilisateur qu'Entra ID Protection évalue à risque moyen. Requiert Entra ID P2.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 1 |
| Pour qui | tout le monde |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Sur | toutes les apps |
| Conditions | Risque utilisateur: medium |
| Exigence | `Multifactor authentication` + reconnexion à chaque fois |
| Fichier | [`CXNM__STANDARD__2020__GRANT__MediumRisk_Users.json`](CXNM__STANDARD__2020__GRANT__MediumRisk_Users.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.5 Veilige authenticatie<br>A.5.17 Authenticatie-informatie<br>A.8.16 Monitoringactiviteiten |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(b) incidentbehandeling |
| CIS Controls v8.1 | 6.3 Require MFA for Externally-Exposed Applications |
| NIST CSF 2.0 | PR.AA-03<br>DE.CM-03 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
