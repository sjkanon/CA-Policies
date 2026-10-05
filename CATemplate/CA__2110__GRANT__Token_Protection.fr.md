<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2110__GRANT__Token_Protection.md) · [English](CA__2110__GRANT__Token_Protection.en.md) · **Français**

# CA - 2110 - GRANT - Token Protection

Exige la token protection pour Exchange Online et SharePoint Online dans les applications de bureau sous Windows : le jeton de connexion est lié à l'appareil et ne fonctionne plus s'il est volé.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 1 |
| Pour qui | tout le monde |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| Sur | 2 apps: Exchange Online (`00000002-0000-0ff1-ce00-000000000000`), SharePoint Online (`00000003-0000-0ff1-ce00-000000000000`) |
| Conditions | Clients: apps mobiles et clients de bureau<br>Plateforme: windows |
| Exigence | token protection |
| Fichier | [`CA__2110__GRANT__Token_Protection.json`](CA__2110__GRANT__Token_Protection.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

## Points d'attention

- Uniquement les applications de bureau Windows sur un appareil Entra joined, hybrid joined ou enregistré. Un client non pris en charge est bloqué, pas ignoré — vérifiez d'abord dans les journaux de connexion quels clients se connectent.

## Touche Intune

Cette stratégie dépend de stratégies Intune du [dépôt IntuneBackup](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Chaque stratégie y affiche le lien en sens inverse.

La token protection ne fonctionne que dans les versions de client qui prennent en charge les jetons liés. Une app Office ou un client de synchronisation OneDrive trop ancien est bloqué par cette stratégie ; cette stratégie Intune maintient ces clients à jour.

| Plateforme | Stratégies Intune |
|---|---|
| Windows | [WIN - D - Microsoft Office Updates](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Office_Updates.fr.md)<br>[WIN - D - Microsoft OneDrive](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_OneDrive.fr.md) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie<br>A.8.24 Gebruik van cryptografie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(h) cryptografie en versleuteling |
| CIS Controls v8.1 | 6.3 Require MFA for Externally-Exposed Applications |
| NIST CSF 2.0 | PR.AA-04<br>PR.DS-02 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
