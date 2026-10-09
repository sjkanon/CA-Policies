<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2155__GRANT__Virtual_Desktop_Phishing_Resistant_MFA.md) · **English** · [Français](CA__2155__GRANT__Virtual_Desktop_Phishing_Resistant_MFA.fr.md)

# CA - 2155 - GRANT - Virtual Desktop Phishing Resistant MFA

Requires phishing-resistant MFA — a passkey, Windows Hello for Business or a certificate — for Azure Virtual Desktop, Windows 365 and Windows Cloud Login from a device that is not compliant. Where the virtual desktop is the route for personal devices and third parties, the device is unknown; then the sign-in is all you can require, and a stolen password with a text-message code must not be enough there.

| | |
|---|---|
| Type | GRANT |
| State | report-only |
| Stage | 3* |
| Who | everyone |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| On | 3 apps: Azure Virtual Desktop (`9cdead84-a844-4324-93f2-b2e6bb768d07`), Windows 365 (`0af06dc6-e4b5-4f28-818e-e78e62d137a5`), Windows Cloud Login (`270efc09-cd0d-444b-a71f-39af4910ec45`) |
| Conditions | Device filter: not on `device.isCompliant -eq True` |
| Requirement | `Phishing-resistant MFA` |
| File | [`CA__2155__GRANT__Virtual_Desktop_Phishing_Resistant_MFA.json`](CA__2155__GRANT__Virtual_Desktop_Phishing_Resistant_MFA.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

> **Optional** — vraagt dat elke gebruiker van Azure Virtual Desktop of Windows 365 een passkey, Windows Hello for Business of FIDO2-sleutel heeft. Zinvol waar de virtuele werkplek de route is voor persoonlijke toestellen en derden; daar is het toestel onbekend en is de aanmelding het enige wat je kunt eisen.

## Watch out

- Only turn it on once every virtual desktop user has a phishing-resistant method; check that with scripts/Test-EntraPasskeyReadiness.ps1. A compliant device is out of scope: there 2050 and compliance already cover the sign-in.
- What happens inside the session — clipboard, drives, printers, screen capture — is not controlled by this policy. The Intune policies on the session host and the host pool RDP properties do that.

## Touches Intune

This policy depends on Intune policies in the [IntuneBackup repo](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Each policy there shows the link the other way round.

Sets up Windows Hello for Business: on Windows the usual way to meet phishing-resistant MFA. Without WHfB only a separate passkey or security key is left there.

| Platform | Intune policies |
|---|---|
| Windows | [WIN - D - Windows Hello for Business](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.en.md)<br>[WIN - D - Windows Hello for Business Multi User](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.en.md)<br>[WIN - U - Windows Hello for Business](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Hello_for_Business.en.md) |

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.6.7 Werken op afstand<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 6.4 Require MFA for Remote Network Access<br>13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-05 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
