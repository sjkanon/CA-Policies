<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__2170__GRANT__MFA_For_Intune_Enrollment.md) · [English](CXNM__STANDARD__2170__GRANT__MFA_For_Intune_Enrollment.en.md) · **Français**

# CXNM - STANDARD - 2170 - GRANT - MFA for Intune Enrollment

Exige la MFA, à chaque fois, lors de l'inscription dans Intune (l'app Microsoft Intune Enrollment). Un autre chemin que `2080`, au même moment.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 1 |
| Pour qui | tout le monde |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Sur | 1 app: Microsoft Intune Enrollment (`d4ebce55-015a-49b5-a083-c84d1797ae8c`) |
| Conditions | aucune — seulement qui, sur quelle app |
| Exigence | `Multifactor authentication` + reconnexion à chaque fois |
| Fichier | [`CXNM__STANDARD__2170__GRANT__MFA_For_Intune_Enrollment.json`](CXNM__STANDARD__2170__GRANT__MFA_For_Intune_Enrollment.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

## Points d'attention

- Un nouvel employé sans méthode MFA enregistrée ne peut pas inscrire son premier appareil. Délivrez un TAP lors de l'arrivée.

## Touche Intune

Cette stratégie dépend de stratégies Intune du [dépôt IntuneBackup](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Chaque stratégie y affiche le lien en sens inverse.

Setup Assistant avec authentification moderne se connecte à Microsoft Intune Enrollment ; cette stratégie CA y demande donc la MFA. Si l'utilisateur n'a pas de méthode MFA fonctionnelle à ce moment, l'inscription est bloquée.

| Plateforme | Stratégies Intune |
|---|---|
| macOS | [MAC - D - Enrollment Profile Administrator User Affinity](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Administrator_User_Affinity.fr.md)<br>[MAC - D - Enrollment Profile Standard User Affinity](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Standard_User_Affinity.fr.md) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.16 Identiteitsbeheer<br>A.8.5 Veilige authenticatie<br>A.8.1 Eindpuntapparatuur van gebruikers |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 1.1 Establish and Maintain Detailed Enterprise Asset Inventory<br>6.3 Require MFA for Externally-Exposed Applications |
| NIST CSF 2.0 | PR.AA-01<br>ID.AM-01 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
