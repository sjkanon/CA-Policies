<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__1140__BLOCK__Managed_Identities_At_Risk.md) · **English** · [Français](CXNM__STANDARD__1140__BLOCK__Managed_Identities_At_Risk.fr.md)

# CXNM - STANDARD - 1140 - BLOCK - Managed Identities At Risk

Blocks workload identities (service principals) with medium or high risk. Requires Microsoft Entra Workload ID Premium — which is not part of Entra ID P2.

| | |
|---|---|
| Type | BLOCK |
| State | enabled |
| Stage | 3* |
| Who | agent and workload identities |
| Excluded | — |
| On | all apps |
| Conditions | Workload identity risk: medium, high |
| Requirement | block |
| File | [`CXNM__STANDARD__1140__BLOCK__Managed_Identities_At_Risk.json`](CXNM__STANDARD__1140__BLOCK__Managed_Identities_At_Risk.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

> **Optional** — risicodetectie op workload-identiteiten vereist Microsoft Entra Workload ID Premium.

## Touches Intune

No Intune policy this policy depends on.

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.16 Identiteitsbeheer<br>A.8.2 Speciale toegangsrechten<br>A.8.16 Monitoringactiviteiten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(b) incidentbehandeling |
| CIS Controls v8.1 | 5.5 Establish and Maintain an Inventory of Service Accounts |
| NIST CSF 2.0 | PR.AA-01<br>RS.MI-01 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
