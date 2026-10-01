<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__1020__BLOCK__Device_Code_Auth_Flow.md) · [English](CXNM__STANDARD__1020__BLOCK__Device_Code_Auth_Flow.en.md) · **Français**

# CXNM - STANDARD - 1020 - BLOCK - Device Code Auth Flow

Bloque le device code flow et l'authentication transfer : la connexion en saisissant un code sur un autre appareil. En phishing, un attaquant s'en sert pour faire approuver son jeton par la victime.

| | |
|---|---|
| Type | BLOCK |
| State | disabled |
| Stage | 2 |
| Pour qui | tout le monde |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Excluded from Device Code Auth Flow Block` |
| Sur | toutes les apps |
| Conditions | Flux d'authentification: `deviceCodeFlow`, `authenticationTransfer` |
| Exigence | bloquer |
| Fichier | [`CXNM__STANDARD__1020__BLOCK__Device_Code_Auth_Flow.json`](CXNM__STANDARD__1020__BLOCK__Device_Code_Auth_Flow.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

## Points d'attention

- Teams Rooms, certains appareils de réunion et outils CLI se connectent avec un device code. Placez-les dans `Excluded from Device Code Auth Flow Block` avant d'activer cette stratégie.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(g) basispraktijken cyberhygiene en training |
| CIS Controls v8.1 | 6.3 Require MFA for Externally-Exposed Applications |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-04 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
