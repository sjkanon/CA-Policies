<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__2100__GRANT__MFA_For_Admin_Portals.md) · **English** · [Français](CXNM__STANDARD__2100__GRANT__MFA_For_Admin_Portals.fr.md)

# CXNM - STANDARD - 2100 - GRANT - MFA for Admin Portals

Requires MFA on the Microsoft admin portals and the Azure Service Management API, for everyone — including those without an admin role.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 1 |
| Who | everyone |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| On | admin portals: Microsoft Admin Portals (`MicrosoftAdminPortals`), Azure Service Management API (`797f4846-ba00-4fd7-ba43-dac1f8f63013`) |
| Conditions | none — only who, on which app |
| Requirement | `Multifactor authentication` |
| File | [`CXNM__STANDARD__2100__GRANT__MFA_For_Admin_Portals.json`](CXNM__STANDARD__2100__GRANT__MFA_For_Admin_Portals.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

## Touches Intune

No Intune policy this policy depends on.

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.2 Speciale toegangsrechten<br>A.8.5 Veilige authenticatie<br>A.5.17 Authenticatie-informatie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 6.5 Require MFA for Administrative Access |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-05 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
