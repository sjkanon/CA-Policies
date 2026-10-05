<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__1010__BLOCK__Legacy_Authentication.md) · **English** · [Français](CA__1010__BLOCK__Legacy_Authentication.fr.md)

# CA - 1010 - BLOCK - Legacy Authentication

Blocks sign-in over legacy protocols: Exchange ActiveSync and the other legacy clients such as POP, IMAP and SMTP AUTH. They have no MFA, so as long as they are open every other policy in this set can be bypassed.

| | |
|---|---|
| Type | BLOCK |
| State | enabled |
| Stage | 1 |
| Who | everyone |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Excluded from Legacy Authentication Block` |
| On | all apps |
| Conditions | Clients: Exchange ActiveSync, other legacy clients |
| Requirement | block |
| File | [`CA__1010__BLOCK__Legacy_Authentication.json`](CA__1010__BLOCK__Legacy_Authentication.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

## Watch out

- A device or application that still sends mail over SMTP AUTH or IMAP (scanner, old app) stops working. Put it in `Excluded from Legacy Authentication Block` temporarily and clean up the group afterwards.

## Touches Intune

No Intune policy this policy depends on.

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software<br>6.3 Require MFA for Externally-Exposed Applications |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-01 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
