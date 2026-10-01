<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__1160__BLOCK__Agent_Identities_To_Agent_Resources.md) · **English** · [Français](CXNM__STANDARD__1160__BLOCK__Agent_Identities_To_Agent_Resources.fr.md)

# CXNM - STANDARD - 1160 - BLOCK - Agent Identities To Agent Resources

Blocks every agent identity on agent resources, except the explicitly excluded ones. An allow list, so report-only until the existing agents have been mapped — switching it on blind stops all of them.

| | |
|---|---|
| Type | BLOCK |
| State | report-only |
| Stage | 3* |
| Who | agent and workload identities |
| Excluded | — |
| On | agent resources |
| Conditions | none — only who, on which app |
| Requirement | block |
| File | [`CXNM__STANDARD__1160__BLOCK__Agent_Identities_To_Agent_Resources.json`](CXNM__STANDARD__1160__BLOCK__Agent_Identities_To_Agent_Resources.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

> **Optional** — vraagt Microsoft Entra Agent ID. Staat bewust op report-only: dit is een allow-list — hij blokkeert élke agent-identiteit op agent-resources behalve de expliciet uitgezonderde, en dat legt bij inschakelen zonder inventarisatie alle bestaande agents stil. Eerst de report-only-uitslag lezen, dan de uitzonderingen invullen, dan aanzetten.

## Watch out

- Check whether CIPP sends the beta fields for agents. If not, this template deploys without its agent condition and becomes a block on everything.

## Touches Intune

No Intune policy this policy depends on.

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.3 Beperking toegang tot informatie |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 6.7 Centralize Access Control |
| NIST CSF 2.0 | PR.AA-05 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
