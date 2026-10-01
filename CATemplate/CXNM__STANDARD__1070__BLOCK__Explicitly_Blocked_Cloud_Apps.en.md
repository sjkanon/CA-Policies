<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__1070__BLOCK__Explicitly_Blocked_Cloud_Apps.md) · **English** · [Français](CXNM__STANDARD__1070__BLOCK__Explicitly_Blocked_Cloud_Apps.fr.md)

# CXNM - STANDARD - 1070 - BLOCK - Explicitly Blocked Cloud Apps

Blocks cloud apps the organisation explicitly does not want to allow. The template contains no apps: the list is filled in per tenant, and until then the policy does nothing.

| | |
|---|---|
| Type | BLOCK |
| State | disabled |
| Stage | 2 |
| Who | everyone |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| On | no app (list per tenant) |
| Conditions | none — only who, on which app |
| Requirement | block |
| File | [`CXNM__STANDARD__1070__BLOCK__Explicitly_Blocked_Cloud_Apps.json`](CXNM__STANDARD__1070__BLOCK__Explicitly_Blocked_Cloud_Apps.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

## Touches Intune

No Intune policy this policy depends on.

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.5.23 Informatiebeveiliging voor het gebruik van clouddiensten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 2.3 Address Unauthorized Software |
| NIST CSF 2.0 | ID.AM-02<br>PR.AA-05 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
