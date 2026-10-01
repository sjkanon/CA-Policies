<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__1180__BLOCK__Agent_Users_Outside_Compliant_Network.md) · [English](CXNM__STANDARD__1180__BLOCK__Agent_Users_Outside_Compliant_Network.en.md) · **Français**

# CXNM - STANDARD - 1180 - BLOCK - Agent Users Outside Compliant Network

Bloque les agent users en dehors d'un réseau conforme Global Secure Access. Report-only ; requiert Microsoft Entra Agent ID et Global Secure Access.

| | |
|---|---|
| Type | BLOCK |
| State | report-only |
| Stage | 3* (bloqué sur Report) |
| Pour qui | identités d'agent et de workload |
| Exclus | — |
| Sur | ressources d'agent |
| Conditions | Emplacement: tous les emplacements, sauf `All Compliant Network locations` |
| Exigence | bloquer |
| Fichier | [`CXNM__STANDARD__1180__BLOCK__Agent_Users_Outside_Compliant_Network.json`](CXNM__STANDARD__1180__BLOCK__Agent_Users_Outside_Compliant_Network.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

> **Optionnel** — vraagt Microsoft Entra Agent ID én Global Secure Access: de named location 'All Compliant Network locations' bestaat alleen in een tenant met GSA. Report-only tot beide er zijn.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.20 Netwerkbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.IR-01<br>PR.AA-05 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
