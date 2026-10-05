<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2110__GRANT__Token_Protection.md) · **English** · [Français](CA__2110__GRANT__Token_Protection.fr.md)

# CA - 2110 - GRANT - Token Protection

Requires token protection for Exchange Online and SharePoint Online in desktop apps on Windows: the sign-in token is bound to the device and stops working when it is stolen.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 1 |
| Who | everyone |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| On | 2 apps: Exchange Online (`00000002-0000-0ff1-ce00-000000000000`), SharePoint Online (`00000003-0000-0ff1-ce00-000000000000`) |
| Conditions | Clients: mobile apps and desktop clients<br>Platform: windows |
| Requirement | token protection |
| File | [`CA__2110__GRANT__Token_Protection.json`](CA__2110__GRANT__Token_Protection.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

## Watch out

- Only Windows desktop apps on an Entra joined, hybrid joined or registered device. An unsupported client is blocked, not skipped — check the sign-in logs first for which clients sign in.

## Touches Intune

This policy depends on Intune policies in the [IntuneBackup repo](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Each policy there shows the link the other way round.

Token protection only works in client versions that support bound tokens. An Office app or OneDrive sync client on too old a version is blocked by this policy; this Intune policy keeps those clients current.

| Platform | Intune policies |
|---|---|
| Windows | [WIN - D - Microsoft Office Updates](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Office_Updates.en.md)<br>[WIN - D - Microsoft OneDrive](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_OneDrive.en.md) |

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie<br>A.8.24 Gebruik van cryptografie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(h) cryptografie en versleuteling |
| CIS Controls v8.1 | 6.3 Require MFA for Externally-Exposed Applications |
| NIST CSF 2.0 | PR.AA-04<br>PR.DS-02 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
