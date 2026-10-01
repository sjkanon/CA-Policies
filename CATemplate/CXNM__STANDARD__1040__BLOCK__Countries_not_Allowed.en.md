<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__1040__BLOCK__Countries_not_Allowed.md) · **English** · [Français](CXNM__STANDARD__1040__BLOCK__Countries_not_Allowed.fr.md)

# CXNM - STANDARD - 1040 - BLOCK - Countries not Allowed

Blocks sign-in from outside the countries in the named location `Allowed Countries`. Pinned to Report until those countries are filled in per tenant: an empty list would block every sign-in.

| | |
|---|---|
| Type | BLOCK |
| State | disabled |
| Stage | 2 (pinned to Report) |
| Who | everyone |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Excluded from Country Block List` |
| On | all apps |
| Conditions | Location: all locations, except `Allowed Countries` |
| Requirement | block |
| File | [`CXNM__STANDARD__1040__BLOCK__Countries_not_Allowed.json`](CXNM__STANDARD__1040__BLOCK__Countries_not_Allowed.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

## Watch out

- Anyone travelling outside the allowed countries cannot sign in. Put them in `Excluded from Country Block List` temporarily, and remove them again on return.

## Touches Intune

No Intune policy this policy depends on.

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.20 Netwerkbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.AA-05<br>PR.IR-01 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
