<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__3030__SESSION__Register_Security_Info_Requirements.md) · **English** · [Français](CXNM__STANDARD__3030__SESSION__Register_Security_Info_Requirements.fr.md)

# CXNM - STANDARD - 3030 - SESSION - Register Security Info Requirements

Limits the session used to register security info to 90 days: anyone signed in for longer signs in again first. `2180` governs what you may register with.

| | |
|---|---|
| Type | SESSION |
| State | enabled |
| Stage | 1 |
| Who | everyone |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| On | register security info |
| Conditions | none — only who, on which app |
| Requirement | sign in every 90 days |
| File | [`CXNM__STANDARD__3030__SESSION__Register_Security_Info_Requirements.json`](CXNM__STANDARD__3030__SESSION__Register_Security_Info_Requirements.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

## Touches Intune

No Intune policy this policy depends on.

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.5.16 Identiteitsbeheer |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 6.1 Establish an Access Granting Process |
| NIST CSF 2.0 | PR.AA-02<br>PR.AA-01 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
