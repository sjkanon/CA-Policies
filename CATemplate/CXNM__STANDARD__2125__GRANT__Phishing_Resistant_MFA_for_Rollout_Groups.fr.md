<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__2125__GRANT__Phishing_Resistant_MFA_for_Rollout_Groups.md) · [English](CXNM__STANDARD__2125__GRANT__Phishing_Resistant_MFA_for_Rollout_Groups.en.md) · **Français**

# CXNM - STANDARD - 2125 - GRANT - Phishing Resistant MFA for Rollout Groups

Exige une MFA résistante au phishing pour les groupes de déploiement `CA-Registered-Phishing-MFA` et `CA-Exception-Authenticator-Phishing-MFA` : la voie groupe par groupe vers `2120`.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 3* |
| Pour qui | `CA-Registered-Phishing-MFA`, `CA-Exception-Authenticator-Phishing-MFA` |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts`, invités |
| Sur | toutes les apps |
| Conditions | aucune — seulement qui, sur quelle app |
| Exigence | `Phishing-resistant MFA` |
| Fichier | [`CXNM__STANDARD__2125__GRANT__Phishing_Resistant_MFA_for_Rollout_Groups.json`](CXNM__STANDARD__2125__GRANT__Phishing_Resistant_MFA_for_Rollout_Groups.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

> **Optionnel** — de groepsgewijze uitrol van 2120: alleen zinvol in een tenant die zijn passkey-uitrol per groep doet, en alleen veilig zolang er niemand in 'CA-Registered-Phishing-MFA' of 'CA-Exception-Authenticator-Phishing-MFA' staat die nog geen phishing-bestendige methode heeft.

## Points d'attention

- Les groupes portent les noms du tenant source (`CA-…`), pas la convention SG-U. Les renommer rompt le lien avec ce tenant.

## Touche Intune

Cette stratégie dépend de stratégies Intune du [dépôt IntuneBackup](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Chaque stratégie y affiche le lien en sens inverse.

Configure Windows Hello for Business : sous Windows, la manière habituelle de satisfaire à une MFA résistante au phishing. Sans WHfB, il ne reste qu'une passkey séparée ou une clé de sécurité.

| Plateforme | Stratégies Intune |
|---|---|
| Windows | [WIN - D - Windows Hello for Business](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.fr.md)<br>[WIN - D - Windows Hello for Business Multi User](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.fr.md)<br>[WIN - U - Windows Hello for Business](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Hello_for_Business.fr.md) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie<br>A.5.15 Toegangsbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(g) basispraktijken cyberhygiene en training |
| CIS Controls v8.1 | 6.3 Require MFA for Externally-Exposed Applications<br>6.4 Require MFA for Remote Network Access |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-01 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
