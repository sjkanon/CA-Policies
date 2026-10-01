<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__1060__BLOCK__Service_Accounts_Trusted_Locations_Excluded.md) · [English](CXNM__STANDARD__1060__BLOCK__Service_Accounts_Trusted_Locations_Excluded.en.md) · **Français**

# CXNM - STANDARD - 1060 - BLOCK - Service Accounts (Trusted Locations Excluded)

Bloque les comptes de service de `Conditional Access Service Accounts` en dehors des adresses IP de `Service Accounts Trusted IPs`. Les comptes de service sont exclus de la MFA ; cette stratégie la remplace. Bloqué sur Report tant que la plage IP n'est pas renseignée par tenant.

| | |
|---|---|
| Type | BLOCK |
| State | disabled |
| Stage | 2 (bloqué sur Report) |
| Pour qui | `Conditional Access Service Accounts` |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Sur | toutes les apps |
| Conditions | Emplacement: tous les emplacements, sauf `Service Accounts Trusted IPs` |
| Exigence | bloquer |
| Fichier | [`CXNM__STANDARD__1060__BLOCK__Service_Accounts_Trusted_Locations_Excluded.json`](CXNM__STANDARD__1060__BLOCK__Service_Accounts_Trusted_Locations_Excluded.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

## Points d'attention

- Un compte de service de `Conditional Access Service Accounts` n'a pas de MFA (voir `2050`). Si cette stratégie n'est pas active, un tel compte est utilisable de partout avec un simple mot de passe.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.2 Speciale toegangsrechten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 5.5 Establish and Maintain an Inventory of Service Accounts<br>13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.AA-05<br>PR.IR-01 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
