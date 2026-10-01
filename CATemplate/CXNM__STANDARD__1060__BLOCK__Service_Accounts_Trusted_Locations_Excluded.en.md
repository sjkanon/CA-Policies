<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__1060__BLOCK__Service_Accounts_Trusted_Locations_Excluded.md) · **English** · [Français](CXNM__STANDARD__1060__BLOCK__Service_Accounts_Trusted_Locations_Excluded.fr.md)

# CXNM - STANDARD - 1060 - BLOCK - Service Accounts (Trusted Locations Excluded)

Blocks the service accounts in `Conditional Access Service Accounts` outside the IP addresses in `Service Accounts Trusted IPs`. Service accounts are excluded from MFA; this policy takes its place. Pinned to Report until the IP range is filled in per tenant.

| | |
|---|---|
| Type | BLOCK |
| State | disabled |
| Stage | 2 (pinned to Report) |
| Who | `Conditional Access Service Accounts` |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| On | all apps |
| Conditions | Location: all locations, except `Service Accounts Trusted IPs` |
| Requirement | block |
| File | [`CXNM__STANDARD__1060__BLOCK__Service_Accounts_Trusted_Locations_Excluded.json`](CXNM__STANDARD__1060__BLOCK__Service_Accounts_Trusted_Locations_Excluded.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

## Watch out

- A service account in `Conditional Access Service Accounts` has no MFA (see `2050`). If this policy is not on, such an account can be used from anywhere with just a password.

## Touches Intune

No Intune policy this policy depends on.

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.2 Speciale toegangsrechten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 5.5 Establish and Maintain an Inventory of Service Accounts<br>13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.AA-05<br>PR.IR-01 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
