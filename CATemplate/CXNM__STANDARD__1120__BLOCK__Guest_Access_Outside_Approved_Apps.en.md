<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__1120__BLOCK__Guest_Access_Outside_Approved_Apps.md) · **English** · [Français](CXNM__STANDARD__1120__BLOCK__Guest_Access_Outside_Approved_Apps.fr.md)

# CXNM - STANDARD - 1120 - BLOCK - Guest Access Outside Approved Apps

Blocks guests and external users on everything except Office 365 and My Apps. My Apps is included because otherwise a guest cannot redeem their invitation.

| | |
|---|---|
| Type | BLOCK |
| State | enabled |
| Stage | 1 |
| Who | guests |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| On | all apps, except Office 365 (`Office365`), My Apps (`2793995e-0a7d-40d7-bd35-6968ba142197`) |
| Conditions | none — only who, on which app |
| Requirement | block |
| File | [`CXNM__STANDARD__1120__BLOCK__Guest_Access_Outside_Approved_Apps.json`](CXNM__STANDARD__1120__BLOCK__Guest_Access_Outside_Approved_Apps.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

## Touches Intune

No Intune policy this policy depends on.

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.5.18 Toegangsrechten<br>A.8.3 Beperking toegang tot informatie |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(d) beveiliging van de toeleveringsketen |
| CIS Controls v8.1 | 6.8 Define and Maintain Role-Based Access Control |
| NIST CSF 2.0 | PR.AA-05 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
