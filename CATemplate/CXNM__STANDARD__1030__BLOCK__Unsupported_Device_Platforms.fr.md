<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__1030__BLOCK__Unsupported_Device_Platforms.md) · [English](CXNM__STANDARD__1030__BLOCK__Unsupported_Device_Platforms.en.md) · **Français**

# CXNM - STANDARD - 1030 - BLOCK - Unsupported Device Platforms

Bloque la connexion depuis toute plateforme autre que Windows, macOS, iOS et Android — les plateformes gérées par Intune et sur lesquelles s'appuient les autres stratégies. La plateforme vient du user agent : c'est un obstacle, pas une frontière.

| | |
|---|---|
| Type | BLOCK |
| State | disabled |
| Stage | 2 |
| Pour qui | tout le monde |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Excluded from Legacy Authentication Block` |
| Sur | toutes les apps |
| Conditions | Plateforme: toutes sauf android, iOS, windows, macOS |
| Exigence | bloquer |
| Fichier | [`CXNM__STANDARD__1030__BLOCK__Unsupported_Device_Platforms.json`](CXNM__STANDARD__1030__BLOCK__Unsupported_Device_Platforms.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

## Points d'attention

- Le groupe d'exclusion est `Excluded from Legacy Authentication Block`, pas un groupe dédié. Qui y figure pour l'authentification legacy peut aussi se connecter ici depuis n'importe quelle plateforme.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.1 Eindpuntapparatuur van gebruikers |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 1.2 Address Unauthorized Assets |
| NIST CSF 2.0 | ID.AM-01<br>PR.AA-05 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
