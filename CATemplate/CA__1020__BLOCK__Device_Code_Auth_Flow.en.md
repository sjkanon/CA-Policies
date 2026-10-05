<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__1020__BLOCK__Device_Code_Auth_Flow.md) · **English** · [Français](CA__1020__BLOCK__Device_Code_Auth_Flow.fr.md)

# CA - 1020 - BLOCK - Device Code Auth Flow

Blocks the device code flow and authentication transfer: signing in by entering a code on another device. In phishing, an attacker uses this to get the victim to approve the attacker's token.

| | |
|---|---|
| Type | BLOCK |
| State | disabled |
| Stage | 2 |
| Who | everyone |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Excluded from Device Code Auth Flow Block` |
| On | all apps |
| Conditions | Authentication flow: `deviceCodeFlow`, `authenticationTransfer` |
| Requirement | block |
| File | [`CA__1020__BLOCK__Device_Code_Auth_Flow.json`](CA__1020__BLOCK__Device_Code_Auth_Flow.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

## Watch out

- Teams Rooms, some meeting devices and CLI tools sign in with a device code. Put them in `Excluded from Device Code Auth Flow Block` before turning this policy on.

## Touches Intune

No Intune policy this policy depends on.

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(g) basispraktijken cyberhygiene en training |
| CIS Controls v8.1 | 6.3 Require MFA for Externally-Exposed Applications |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-04 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
