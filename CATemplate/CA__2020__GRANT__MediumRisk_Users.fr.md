<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2020__GRANT__MediumRisk_Users.md) · [English](CA__2020__GRANT__MediumRisk_Users.en.md) · **Français**

# CA - 2020 - GRANT - Medium-Risk Users

Permet à un utilisateur qu'Entra ID Protection évalue à risque moyen de corriger lui-même le risque (Require risk remediation) : un changement de mot de passe sécurisé après la MFA, ou pour un utilisateur sans mot de passe la révocation de toutes les sessions et une nouvelle connexion. Le risque est ensuite levé ; avec la MFA seule, il restait et la demande revenait à chaque connexion. Requiert Entra ID P2.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 1 |
| Pour qui | tout le monde |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, invités |
| Sur | toutes les apps |
| Conditions | Risque utilisateur: medium |
| Exigence | riskRemediation + `Multifactor authentication` + reconnexion à chaque fois |
| Fichier | [`CA__2020__GRANT__MediumRisk_Users.json`](CA__2020__GRANT__MediumRisk_Users.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

## Points d'attention

- Les invités B2B sont exclus. Leur risque utilisateur est évalué dans leur tenant d'origine et ne peut pas être corrigé ici ; avec cette exigence, ils seraient bloqués (Microsoft Learn, ID Protection for B2B users). Le risque de connexion (1090, 2010) s'applique bien à eux.
- Avec mot de passe : le changement de mot de passe n'atteint l'AD local qu'avec la réécriture du mot de passe (password writeback). Sans writeback dans un tenant hybride, un utilisateur ne peut pas corriger le risque lui-même.

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
