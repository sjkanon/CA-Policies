<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__2185__GRANT__Register_Security_Info_Passkey_Rollout.md) · [English](CXNM__STANDARD__2185__GRANT__Register_Security_Info_Passkey_Rollout.en.md) · **Français**

# CXNM - STANDARD - 2185 - GRANT - Register Security Info Passkey Rollout

Exige la strength `Passkey Rollout` pour le groupe de déploiement `CA-Rollout-Phishing-MFA` lors de l'enregistrement des infos de sécurité, avec une reconnexion tous les sept jours. Si celle-ci et `2180` sont actives, seul un TAP convient encore.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 3* |
| Pour qui | `CA-Rollout-Phishing-MFA` |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| Sur | enregistrer les infos de sécurité |
| Conditions | aucune — seulement qui, sur quelle app |
| Exigence | `Passkey Rollout` + connexion toutes les 7 jours |
| Fichier | [`CXNM__STANDARD__2185__GRANT__Register_Security_Info_Passkey_Rollout.json`](CXNM__STANDARD__2185__GRANT__Register_Security_Info_Passkey_Rollout.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

> **Optionnel** — hoort bij de passkey-uitrol per groep (2125) en vraagt de custom authentication strength 'Passkey Rollout', waarvan het id per tenant wordt vervangen. Naast 2180 op enabled wint de strengste: registreren kan dan alleen met een eenmalige TAP.

## Points d'attention

- L'id de strength du template est un placeholder (GUID nul) ; au déploiement, l'id de la strength créée doit y figurer.
- Le SMS et la voix ne figurent pas dans `Passkey Rollout`, car `authentication-methods/` les désactive.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.5.16 Identiteitsbeheer |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 6.1 Establish an Access Granting Process |
| NIST CSF 2.0 | PR.AA-02<br>PR.AA-01 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
