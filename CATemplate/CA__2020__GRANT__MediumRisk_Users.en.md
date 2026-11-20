<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2020__GRANT__MediumRisk_Users.md) · **English** · [Français](CA__2020__GRANT__MediumRisk_Users.fr.md)

# CA - 2020 - GRANT - Medium-Risk Users

Lets a user that Entra ID Protection rates as medium risk remediate the risk themselves (Require risk remediation): a secure password change after MFA, or for passwordless users revocation of all sessions and a fresh sign-in. The risk is then cleared; with MFA alone it stayed and the prompt came back at every sign-in. Requires Entra ID P2.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 1 |
| Who | everyone |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, guests |
| On | all apps |
| Conditions | User risk: medium |
| Requirement | riskRemediation + `Multifactor authentication` + sign in every time |
| File | [`CA__2020__GRANT__MediumRisk_Users.json`](CA__2020__GRANT__MediumRisk_Users.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

## Watch out

- B2B guests are excluded. Their user risk is evaluated in their home tenant and cannot be remediated here; with this grant they would be blocked (Microsoft Learn, ID Protection for B2B users). Sign-in risk (1090, 2010) does apply to them.
- With a password: the password change only reaches on-premises AD with password writeback. Without writeback in a hybrid tenant a user cannot remediate the risk themselves.

## Touches Intune

No Intune policy this policy depends on.

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.5 Veilige authenticatie<br>A.5.17 Authenticatie-informatie<br>A.8.16 Monitoringactiviteiten |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(b) incidentbehandeling |
| CIS Controls v8.1 | 6.3 Require MFA for Externally-Exposed Applications |
| NIST CSF 2.0 | PR.AA-03<br>DE.CM-03 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
