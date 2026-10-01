<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__1180__BLOCK__Agent_Users_Outside_Compliant_Network.md) · **English** · [Français](CXNM__STANDARD__1180__BLOCK__Agent_Users_Outside_Compliant_Network.fr.md)

# CXNM - STANDARD - 1180 - BLOCK - Agent Users Outside Compliant Network

Blocks agent users outside a Global Secure Access compliant network. Report-only; requires Microsoft Entra Agent ID and Global Secure Access.

| | |
|---|---|
| Type | BLOCK |
| State | report-only |
| Stage | 3* (pinned to Report) |
| Who | agent and workload identities |
| Excluded | — |
| On | agent resources |
| Conditions | Location: all locations, except `All Compliant Network locations` |
| Requirement | block |
| File | [`CXNM__STANDARD__1180__BLOCK__Agent_Users_Outside_Compliant_Network.json`](CXNM__STANDARD__1180__BLOCK__Agent_Users_Outside_Compliant_Network.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

> **Optional** — vraagt Microsoft Entra Agent ID én Global Secure Access: de named location 'All Compliant Network locations' bestaat alleen in een tenant met GSA. Report-only tot beide er zijn.

## Touches Intune

No Intune policy this policy depends on.

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.20 Netwerkbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.IR-01<br>PR.AA-05 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
