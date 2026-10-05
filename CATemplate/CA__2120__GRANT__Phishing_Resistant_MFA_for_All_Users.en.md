<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2120__GRANT__Phishing_Resistant_MFA_for_All_Users.md) · **English** · [Français](CA__2120__GRANT__Phishing_Resistant_MFA_for_All_Users.fr.md)

# CA - 2120 - GRANT - Phishing Resistant MFA for All Users

Requires phishing-resistant MFA for all users. Only works if passkeys and Windows Hello are enabled in the authentication methods policy (see `authentication-methods/`).

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 3* |
| Who | everyone |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| On | all apps |
| Conditions | none — only who, on which app |
| Requirement | `Phishing-resistant MFA` |
| File | [`CA__2120__GRANT__Phishing_Resistant_MFA_for_All_Users.json`](CA__2120__GRANT__Phishing_Resistant_MFA_for_All_Users.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

> **Optional** — vereist dat élke gebruiker een passkey of FIDO2-sleutel heeft. Het einddoel waar de admin-variant (2055) de eerste stap van is, maar een uitrolproject en geen instelling.

## Watch out

- On for everyone: a user without a passkey, Windows Hello or certificate cannot get in anywhere. Make sure registering is possible (TAP, `2185`) before a new tenant gets this policy.

## Touches Intune

This policy depends on Intune policies in the [IntuneBackup repo](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Each policy there shows the link the other way round.

Sets up Windows Hello for Business: on Windows the usual way to meet phishing-resistant MFA. Without WHfB only a separate passkey or security key is left there.

| Platform | Intune policies |
|---|---|
| Windows | [WIN - D - Windows Hello for Business](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.en.md)<br>[WIN - D - Windows Hello for Business Multi User](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.en.md)<br>[WIN - U - Windows Hello for Business](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Hello_for_Business.en.md) |

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie<br>A.5.15 Toegangsbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(g) basispraktijken cyberhygiene en training |
| CIS Controls v8.1 | 6.3 Require MFA for Externally-Exposed Applications<br>6.4 Require MFA for Remote Network Access |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-01 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
