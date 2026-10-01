<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__3050__SESSION__Continuous_Access_Evaluation.md) · **English** · [Français](CXNM__STANDARD__3050__SESSION__Continuous_Access_Evaluation.fr.md)

# CXNM - STANDARD - 3050 - SESSION - Continuous Access Evaluation

Turns on strict Continuous Access Evaluation: a revoked session or a changed location takes effect immediately, not only when the token expires.

| | |
|---|---|
| Type | SESSION |
| State | enabled |
| Stage | 1 |
| Who | everyone |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| On | all apps |
| Conditions | none — only who, on which app |
| Requirement | strict CAE |
| File | [`CXNM__STANDARD__3050__SESSION__Continuous_Access_Evaluation.json`](CXNM__STANDARD__3050__SESSION__Continuous_Access_Evaluation.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

## Touches Intune

No Intune policy this policy depends on.

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.5.18 Toegangsrechten<br>A.8.16 Monitoringactiviteiten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(b) incidentbehandeling |
| CIS Controls v8.1 | 6.2 Establish an Access Revoking Process |
| NIST CSF 2.0 | PR.AA-05<br>RS.MI-01 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
