<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2070__GRANT__Mobile_Device_Access_Requirements.md) · [English](CA__2070__GRANT__Mobile_Device_Access_Requirements.en.md) · **Français**

# CA - 2070 - GRANT - Mobile Device Access Requirements

Exige sur iOS et Android une app couverte par une app protection policy pour les applications mobiles. Les données de l'entreprise restent ainsi dans des apps Microsoft protégées sur un téléphone personnel.

| | |
|---|---|
| Type | GRANT |
| State | disabled |
| Stage | 2 |
| Pour qui | tout le monde |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| Sur | toutes les apps, sauf Microsoft Intune (`0000000a-0000-0000-c000-000000000000`) |
| Conditions | Clients: apps mobiles et clients de bureau<br>Plateforme: android, iOS |
| Exigence | app conforme |
| Fichier | [`CA__2070__GRANT__Mobile_Device_Access_Requirements.json`](CA__2070__GRANT__Mobile_Device_Access_Requirements.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

## Touche Intune

Cette stratégie dépend de stratégies Intune du [dépôt IntuneBackup](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Chaque stratégie y affiche le lien en sens inverse.

L'app protection policy que demande `compliantApplication`. Sans stratégie affectée, aucune app ne satisfait et l'accès sur iOS et Android est fermé.

| Plateforme | Stratégies Intune |
|---|---|
| iOS/iPadOS | [IOS - U - App Protection](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/AppProtection/Baseline_IOS_U_App_Protection.fr.md) |
| Android | [AND - U - App Protection](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/AppProtection/Baseline_AND_U_App_Protection.fr.md) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.12 Voorkomen van datalekken<br>A.6.7 Werken op afstand |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(h) cryptografie en versleuteling |
| CIS Controls v8.1 | 4.12 Separate Enterprise Workspaces on Mobile End-User Devices |
| NIST CSF 2.0 | PR.DS-01<br>PR.AA-05 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
