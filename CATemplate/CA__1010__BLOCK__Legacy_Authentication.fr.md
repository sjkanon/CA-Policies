<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__1010__BLOCK__Legacy_Authentication.md) · [English](CA__1010__BLOCK__Legacy_Authentication.en.md) · **Français**

# CA - 1010 - BLOCK - Legacy Authentication

Bloque la connexion via les protocoles hérités : Exchange ActiveSync et les autres clients legacy comme POP, IMAP et SMTP AUTH. Ils ne connaissent pas la MFA ; tant qu'ils restent ouverts, toutes les autres stratégies de cet ensemble peuvent être contournées.

| | |
|---|---|
| Type | BLOCK |
| State | enabled |
| Stage | 1 |
| Pour qui | tout le monde |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Excluded from Legacy Authentication Block` |
| Sur | toutes les apps |
| Conditions | Clients: Exchange ActiveSync, autres clients legacy |
| Exigence | bloquer |
| Fichier | [`CA__1010__BLOCK__Legacy_Authentication.json`](CA__1010__BLOCK__Legacy_Authentication.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

## Points d'attention

- Un appareil ou une application qui envoie encore du courrier via SMTP AUTH ou IMAP (scanner, ancienne app) cesse de fonctionner. Placez-le temporairement dans `Excluded from Legacy Authentication Block` et nettoyez ensuite le groupe.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software<br>6.3 Require MFA for Externally-Exposed Applications |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-01 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
