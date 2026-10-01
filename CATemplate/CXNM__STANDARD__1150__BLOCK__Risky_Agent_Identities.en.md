<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__1150__BLOCK__Risky_Agent_Identities.md) · **English** · [Français](CXNM__STANDARD__1150__BLOCK__Risky_Agent_Identities.fr.md)

# CXNM - STANDARD - 1150 - BLOCK - Risky Agent Identities

Blocks agent identities with high risk. Requires Microsoft Entra Agent ID; a tenant without agents has nothing to evaluate.

| | |
|---|---|
| Type | BLOCK |
| State | enabled |
| Stage | 3* |
| Who | agent and workload identities |
| Excluded | — |
| On | all apps |
| Conditions | Agent risk: high |
| Requirement | block |
| File | [`CXNM__STANDARD__1150__BLOCK__Risky_Agent_Identities.json`](CXNM__STANDARD__1150__BLOCK__Risky_Agent_Identities.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

> **Optional** — vraagt Microsoft Entra Agent ID; een tenant zonder agent-identiteiten heeft niets om te beoordelen.

## Touches Intune

No Intune policy this policy depends on.

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.16 Identiteitsbeheer<br>A.8.16 Monitoringactiviteiten<br>A.5.23 Informatiebeveiliging voor het gebruik van clouddiensten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(b) incidentbehandeling |
| CIS Controls v8.1 | 5.5 Establish and Maintain an Inventory of Service Accounts |
| NIST CSF 2.0 | PR.AA-01<br>RS.MI-01 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
