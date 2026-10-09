<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2155__GRANT__Virtual_Desktop_Phishing_Resistant_MFA.md) · [English](CA__2155__GRANT__Virtual_Desktop_Phishing_Resistant_MFA.en.md) · **Français**

# CA - 2155 - GRANT - Virtual Desktop Phishing Resistant MFA

Exige une MFA résistante au phishing — une passkey, Windows Hello for Business ou un certificat — pour Azure Virtual Desktop, Windows 365 et Windows Cloud Login depuis un appareil non conforme. Là où le poste de travail virtuel est la voie d'accès des appareils personnels et des tiers, l'appareil est inconnu ; la connexion est alors tout ce que l'on peut exiger, et un mot de passe volé avec un code SMS ne doit pas y suffire.

| | |
|---|---|
| Type | GRANT |
| State | report-only |
| Stage | 3* |
| Pour qui | tout le monde |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| Sur | 3 apps: Azure Virtual Desktop (`9cdead84-a844-4324-93f2-b2e6bb768d07`), Windows 365 (`0af06dc6-e4b5-4f28-818e-e78e62d137a5`), Windows Cloud Login (`270efc09-cd0d-444b-a71f-39af4910ec45`) |
| Conditions | Filtre d'appareil: pas sur `device.isCompliant -eq True` |
| Exigence | `Phishing-resistant MFA` |
| Fichier | [`CA__2155__GRANT__Virtual_Desktop_Phishing_Resistant_MFA.json`](CA__2155__GRANT__Virtual_Desktop_Phishing_Resistant_MFA.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

> **Optionnel** — vraagt dat elke gebruiker van Azure Virtual Desktop of Windows 365 een passkey, Windows Hello for Business of FIDO2-sleutel heeft. Zinvol waar de virtuele werkplek de route is voor persoonlijke toestellen en derden; daar is het toestel onbekend en is de aanmelding het enige wat je kunt eisen.

## Points d'attention

- Ne l'activez qu'une fois que chaque utilisateur du poste de travail virtuel dispose d'une méthode résistante au phishing ; vérifiez-le avec scripts/Test-EntraPasskeyReadiness.ps1. Un appareil conforme n'est pas concerné : là, 2050 et la conformité couvrent déjà la connexion.
- Ce qui se passe dans la session — presse-papiers, lecteurs, imprimantes, capture d'écran — n'est pas régi par cette stratégie. Ce sont les stratégies Intune sur l'hôte de session et les propriétés RDP du pool d'hôtes qui s'en chargent.

## Touche Intune

Cette stratégie dépend de stratégies Intune du [dépôt IntuneBackup](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Chaque stratégie y affiche le lien en sens inverse.

Configure Windows Hello for Business : sous Windows, la manière habituelle de satisfaire à une MFA résistante au phishing. Sans WHfB, il ne reste qu'une passkey séparée ou une clé de sécurité.

| Plateforme | Stratégies Intune |
|---|---|
| Windows | [WIN - D - Windows Hello for Business](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.fr.md)<br>[WIN - D - Windows Hello for Business Multi User](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.fr.md)<br>[WIN - U - Windows Hello for Business](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Hello_for_Business.fr.md) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.6.7 Werken op afstand<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 6.4 Require MFA for Remote Network Access<br>13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-05 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
