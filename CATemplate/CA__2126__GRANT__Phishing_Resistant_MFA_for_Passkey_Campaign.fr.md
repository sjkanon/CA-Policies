<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2126__GRANT__Phishing_Resistant_MFA_for_Passkey_Campaign.md) · [English](CA__2126__GRANT__Phishing_Resistant_MFA_for_Passkey_Campaign.en.md) · **Français**

# CA - 2126 - GRANT - Phishing Resistant MFA for Passkey Campaign

Exige une MFA résistante au phishing pour `SG-U-CA-Campaign-Passkey` : l'échéance ferme de la campagne d'enregistrement. La campagne demande une passkey à la connexion et n'autorise plus de report après trois fois, mais seulement lors d'une connexion interactive avec MFA ; cette stratégie ne laisse aucune faille. `SG-U-CA-Onboarding-Passkey` est exclu.

| | |
|---|---|
| Type | GRANT |
| State | report-only |
| Stage | 3* |
| Pour qui | `SG-U-CA-Campaign-Passkey` |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts`, `SG-U-CA-Onboarding-Passkey`, invités |
| Sur | toutes les apps |
| Conditions | aucune — seulement qui, sur quelle app |
| Exigence | `Phishing-resistant MFA` |
| Fichier | [`CA__2126__GRANT__Phishing_Resistant_MFA_for_Passkey_Campaign.json`](CA__2126__GRANT__Phishing_Resistant_MFA_for_Passkey_Campaign.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

> **Optionnel** — de deadline van de passkey-campagne: eist phishing-bestendige MFA voor 'SG-U-CA-Campaign-Passkey'. Pas aanzetten als de campagne lang genoeg heeft gelopen; wie dan nog geen phishing-bestendige methode heeft, moet bij de volgende aanmelding meteen een passkey registreren. Passkey (FIDO2) moet daarvoor ook voor de campagnegroep aan staan in het passkeyprofiel.

## Points d'attention

- Ne l'activez qu'une fois la campagne suffisamment longue et les utilisateurs informés. Qui n'a alors pas de méthode résistante au phishing doit enregistrer une passkey immédiatement à la connexion suivante, sans report. Cela ne fonctionne que si la passkey (FIDO2) est aussi activée pour `SG-U-CA-Campaign-Passkey` dans le profil de passkey ; sinon l'erreur 53003 (*Additional sign-in methods are required*) s'affiche et il n'accède à rien. Si l'enregistrement échoue (par exemple un téléphone sans verrouillage d'écran), le service desk le place temporairement dans `SG-U-CA-Onboarding-Passkey` (`2185`).
- Même exigence que `2125` ; la différence est le groupe et le moment. Les membres du groupe de campagne n'ont plus besoin d'être déplacés à la main vers `SG-U-CA-Passkey-Forced` : dès que 2126 est active, l'exigence s'applique à tout le groupe de campagne.

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
