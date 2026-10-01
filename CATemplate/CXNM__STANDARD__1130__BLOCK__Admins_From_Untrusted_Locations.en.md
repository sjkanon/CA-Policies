<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__1130__BLOCK__Admins_From_Untrusted_Locations.md) · **English** · [Français](CXNM__STANDARD__1130__BLOCK__Admins_From_Untrusted_Locations.fr.md)

# CXNM - STANDARD - 1130 - BLOCK - Admins From Untrusted Locations

Blocks the 28 admin roles outside the trusted locations. Optional: an admin working from home or on the road can then no longer administer.

| | |
|---|---|
| Type | BLOCK |
| State | enabled |
| Stage | 3* |
| Who | 28 admin roles |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| On | all apps |
| Conditions | Location: all locations, except all trusted locations |
| Requirement | block |
| File | [`CXNM__STANDARD__1130__BLOCK__Admins_From_Untrusted_Locations.json`](CXNM__STANDARD__1130__BLOCK__Admins_From_Untrusted_Locations.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

> **Optional** — beheerders vastzetten op vertrouwde locaties sluit ze buiten zodra ze thuis of onderweg werken. Alleen inschakelen na expliciete afstemming met de organisatie.

## Touches Intune

No Intune policy this policy depends on.

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.2 Speciale toegangsrechten<br>A.5.15 Toegangsbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 12.8 Establish and Maintain Dedicated Computing Resources for All Administrative Work<br>13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.AA-05<br>PR.IR-01 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
