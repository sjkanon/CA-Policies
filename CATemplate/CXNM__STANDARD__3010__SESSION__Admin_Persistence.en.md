<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__3010__SESSION__Admin_Persistence.md) · **English** · [Français](CXNM__STANDARD__3010__SESSION__Admin_Persistence.fr.md)

# CXNM - STANDARD - 3010 - SESSION - Admin Persistence

Makes the 28 admin roles sign in again every 9 hours and gives them no persistent browser session.

| | |
|---|---|
| Type | SESSION |
| State | enabled |
| Stage | 1 |
| Who | 28 admin roles |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| On | all apps |
| Conditions | none — only who, on which app |
| Requirement | sign in every 9 hours + no persistent browser session |
| File | [`CXNM__STANDARD__3010__SESSION__Admin_Persistence.json`](CXNM__STANDARD__3010__SESSION__Admin_Persistence.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

## Touches Intune

No Intune policy this policy depends on.

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.2 Speciale toegangsrechten<br>A.7.7 Clear desk en clear screen<br>A.5.15 Toegangsbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.AA-05 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
