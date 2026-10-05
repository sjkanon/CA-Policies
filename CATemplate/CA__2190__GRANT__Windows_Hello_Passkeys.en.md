<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2190__GRANT__Windows_Hello_Passkeys.md) · **English** · [Français](CA__2190__GRANT__Windows_Hello_Passkeys.fr.md)

# CA - 2190 - GRANT - Windows Hello Passkeys

Requires a Windows Hello passkey for `U-WHfB-Passkeys`: FIDO2, restricted to the Windows Hello AAGUIDs. Report-only. A regular WHfB credential does not count here.

| | |
|---|---|
| Type | GRANT |
| State | report-only |
| Stage | 3* |
| Who | `U-WHfB-Passkeys` |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| On | all apps |
| Conditions | none — only who, on which app |
| Requirement | `CA-WHfB-Passkeys` |
| File | [`CA__2190__GRANT__Windows_Hello_Passkeys.json`](CA__2190__GRANT__Windows_Hello_Passkeys.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

> **Optional** — vraagt de custom authentication strength 'CA-WHfB-Passkeys' met AAGUID-beperking, per tenant aangemaakt. Staat op report-only: hij laat op álle apps alleen een Windows Hello-passkey toe, dus geen WHfB-credential, geen telefoon en geen beveiligingssleutel. Eerst de report-only-uitslag lezen.

## Watch out

- Anyone working on a joined device with WHfB does not qualify, and often cannot register a Windows Hello passkey there either. If WHfB should count, `windowsHelloForBusiness` belongs in the strength.
- The strength allows the Windows Hello software AAGUID; `authentication-methods/` restricts the profile to hardware and VBS. The two lists contradict each other.

## Touches Intune

This policy depends on Intune policies in the [IntuneBackup repo](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Each policy there shows the link the other way round.

Sets the PIN of the Windows Hello passkey that this CA policy requires. Stricter than users are used to, and registering only succeeds once the PIN meets the requirement.

| Platform | Intune policies |
|---|---|
| Windows | [WIN - D - Windows Hello Passkey PIN Complexity Alphanumeric](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Alphanumeric.en.md)<br>[WIN - D - Windows Hello Passkey PIN Complexity Numeric](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Numeric.en.md) |

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie<br>A.8.1 Eindpuntapparatuur van gebruikers |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 6.3 Require MFA for Externally-Exposed Applications<br>6.4 Require MFA for Remote Network Access |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-01 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
