<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2050__GRANT__MFA_for_All_Users.md) · [English](CA__2050__GRANT__MFA_for_All_Users.en.md) · **Français**

# CA - 2050 - GRANT - MFA for All Users

Exige la MFA pour tous les utilisateurs sur toutes les apps. Microsoft Intune lui-même est exclu pour qu'un appareil puisse se synchroniser ; les comptes de service relèvent de `1060`.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 1 |
| Pour qui | tout le monde |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts`, 1 rôles d'admin |
| Sur | toutes les apps, sauf Microsoft Intune (`0000000a-0000-0000-c000-000000000000`) |
| Conditions | aucune — seulement qui, sur quelle app |
| Exigence | `Multifactor authentication` |
| Fichier | [`CA__2050__GRANT__MFA_for_All_Users.json`](CA__2050__GRANT__MFA_for_All_Users.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

## Points d'attention

- Les comptes de service sont exclus ; `1060` doit être active pour les limiter à des adresses IP de confiance.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie<br>A.5.15 Toegangsbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 6.3 Require MFA for Externally-Exposed Applications<br>6.4 Require MFA for Remote Network Access |
| NIST CSF 2.0 | PR.AA-01<br>PR.AA-03 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
