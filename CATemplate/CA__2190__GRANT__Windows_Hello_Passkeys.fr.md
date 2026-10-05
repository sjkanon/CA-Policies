<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2190__GRANT__Windows_Hello_Passkeys.md) · [English](CA__2190__GRANT__Windows_Hello_Passkeys.en.md) · **Français**

# CA - 2190 - GRANT - Windows Hello Passkeys

Exige une passkey Windows Hello pour `U-WHfB-Passkeys` : FIDO2, limitée aux AAGUID Windows Hello. Report-only. Un credential WHfB ordinaire ne compte pas ici.

| | |
|---|---|
| Type | GRANT |
| State | report-only |
| Stage | 3* |
| Pour qui | `U-WHfB-Passkeys` |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| Sur | toutes les apps |
| Conditions | aucune — seulement qui, sur quelle app |
| Exigence | `CA-WHfB-Passkeys` |
| Fichier | [`CA__2190__GRANT__Windows_Hello_Passkeys.json`](CA__2190__GRANT__Windows_Hello_Passkeys.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

> **Optionnel** — vraagt de custom authentication strength 'CA-WHfB-Passkeys' met AAGUID-beperking, per tenant aangemaakt. Staat op report-only: hij laat op álle apps alleen een Windows Hello-passkey toe, dus geen WHfB-credential, geen telefoon en geen beveiligingssleutel. Eerst de report-only-uitslag lezen.

## Points d'attention

- Qui travaille sur un appareil joined avec WHfB ne satisfait pas, et ne peut souvent pas y enregistrer de passkey Windows Hello. Si WHfB doit compter, `windowsHelloForBusiness` doit figurer dans la strength.
- La strength autorise l'AAGUID logiciel de Windows Hello ; `authentication-methods/` limite le profil au matériel et au VBS. Les deux listes se contredisent.

## Touche Intune

Cette stratégie dépend de stratégies Intune du [dépôt IntuneBackup](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Chaque stratégie y affiche le lien en sens inverse.

Définit le code PIN de la passkey Windows Hello qu'exige cette stratégie CA. Plus strict que ce dont l'utilisateur a l'habitude, et l'enregistrement ne réussit qu'une fois le PIN conforme.

| Plateforme | Stratégies Intune |
|---|---|
| Windows | [WIN - D - Windows Hello Passkey PIN Complexity Alphanumeric](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Alphanumeric.fr.md)<br>[WIN - D - Windows Hello Passkey PIN Complexity Numeric](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Numeric.fr.md) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie<br>A.8.1 Eindpuntapparatuur van gebruikers |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 6.3 Require MFA for Externally-Exposed Applications<br>6.4 Require MFA for Remote Network Access |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-01 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
