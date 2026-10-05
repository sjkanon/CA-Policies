<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2050__GRANT__MFA_for_All_Users.md) · **English** · [Français](CA__2050__GRANT__MFA_for_All_Users.fr.md)

# CA - 2050 - GRANT - MFA for All Users

Requires MFA for all users on all apps. Microsoft Intune itself is excluded so that a device can check in; service accounts are covered by `1060`.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 1 |
| Who | everyone |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts`, 1 admin roles |
| On | all apps, except Microsoft Intune (`0000000a-0000-0000-c000-000000000000`) |
| Conditions | none — only who, on which app |
| Requirement | `Multifactor authentication` |
| File | [`CA__2050__GRANT__MFA_for_All_Users.json`](CA__2050__GRANT__MFA_for_All_Users.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

## Watch out

- Service accounts are excluded; `1060` must be on to restrict them to trusted IP addresses.

## Touches Intune

No Intune policy this policy depends on.

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie<br>A.5.15 Toegangsbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 6.3 Require MFA for Externally-Exposed Applications<br>6.4 Require MFA for Remote Network Access |
| NIST CSF 2.0 | PR.AA-01<br>PR.AA-03 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
