<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__3060__SESSION__Defender_for_Cloud_Apps.md) · [English](CA__3060__SESSION__Defender_for_Cloud_Apps.en.md) · **Français**

# CA - 3060 - SESSION - Defender for Cloud Apps

Fait passer les sessions de navigateur par Defender for Cloud Apps, en monitor-only. Requiert une licence Defender for Cloud Apps.

| | |
|---|---|
| Type | SESSION |
| State | enabled |
| Stage | 3* |
| Pour qui | tout le monde |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| Sur | toutes les apps |
| Conditions | Clients: navigateur |
| Exigence | Defender for Cloud Apps |
| Fichier | [`CA__3060__SESSION__Defender_for_Cloud_Apps.json`](CA__3060__SESSION__Defender_for_Cloud_Apps.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

> **Optionnel** — sessiecontrole via Defender for Cloud Apps vereist een MDCA-licentie.

## Points d'attention

- Sans licence Defender for Cloud Apps, le contrôle de session ne peut pas être sélectionné et la stratégie ne fait rien.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.16 Monitoringactiviteiten<br>A.8.15 Logging<br>A.5.23 Informatiebeveiliging voor het gebruik van clouddiensten |
| NIS2 art. 21(2) | art. 21(2)(b) incidentbehandeling<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 8.2 Collect Audit Logs<br>13.1 Centralize Security Event Alerting |
| NIST CSF 2.0 | DE.CM-09<br>DE.CM-03 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
