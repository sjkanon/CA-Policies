<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2055__GRANT__Phishing_Resistant_MFA_for_Admins.md) · [English](CA__2055__GRANT__Phishing_Resistant_MFA_for_Admins.en.md) · **Français**

# CA - 2055 - GRANT - Phishing Resistant MFA for Admins

Exige une MFA résistante au phishing — Windows Hello for Business, une passkey ou un certificat — pour les 28 rôles d'administration. La première étape vers `2120`.

| | |
|---|---|
| Type | GRANT |
| State | disabled |
| Stage | 2 |
| Pour qui | 28 rôles d'admin |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Sur | toutes les apps |
| Conditions | aucune — seulement qui, sur quelle app |
| Exigence | `Phishing-resistant MFA` |
| Fichier | [`CA__2055__GRANT__Phishing_Resistant_MFA_for_Admins.json`](CA__2055__GRANT__Phishing_Resistant_MFA_for_Admins.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

## Points d'attention

- Ne l'activez qu'une fois que chaque administrateur a enregistré une méthode résistante au phishing, sinon vous bloquez les administrateurs. Vérifiez le break-glass au préalable.

## Touche Intune

Cette stratégie dépend de stratégies Intune du [dépôt IntuneBackup](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Chaque stratégie y affiche le lien en sens inverse.

Configure Windows Hello for Business : sous Windows, la manière habituelle de satisfaire à une MFA résistante au phishing. Sans WHfB, il ne reste qu'une passkey séparée ou une clé de sécurité.

| Plateforme | Stratégies Intune |
|---|---|
| Windows | [WIN - D - Windows Hello for Business](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.fr.md)<br>[WIN - D - Windows Hello for Business Multi User](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.fr.md)<br>[WIN - U - Windows Hello for Business](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Hello_for_Business.fr.md) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.2 Speciale toegangsrechten<br>A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 6.5 Require MFA for Administrative Access |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-05 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
