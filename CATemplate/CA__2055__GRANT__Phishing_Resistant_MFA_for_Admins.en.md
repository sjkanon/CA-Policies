<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2055__GRANT__Phishing_Resistant_MFA_for_Admins.md) · **English** · [Français](CA__2055__GRANT__Phishing_Resistant_MFA_for_Admins.fr.md)

# CA - 2055 - GRANT - Phishing Resistant MFA for Admins

Requires phishing-resistant MFA — Windows Hello for Business, a passkey or a certificate — for the 28 admin roles. The first step towards `2120`.

| | |
|---|---|
| Type | GRANT |
| State | disabled |
| Stage | 2 |
| Who | 28 admin roles |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| On | all apps |
| Conditions | none — only who, on which app |
| Requirement | `Phishing-resistant MFA` |
| File | [`CA__2055__GRANT__Phishing_Resistant_MFA_for_Admins.json`](CA__2055__GRANT__Phishing_Resistant_MFA_for_Admins.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

## Watch out

- Only turn it on once every admin has registered a phishing-resistant method, or you lock admins out. Check break-glass beforehand.

## Touches Intune

This policy depends on Intune policies in the [IntuneBackup repo](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Each policy there shows the link the other way round.

Sets up Windows Hello for Business: on Windows the usual way to meet phishing-resistant MFA. Without WHfB only a separate passkey or security key is left there.

| Platform | Intune policies |
|---|---|
| Windows | [WIN - D - Windows Hello for Business](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.en.md)<br>[WIN - D - Windows Hello for Business Multi User](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.en.md)<br>[WIN - U - Windows Hello for Business](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Hello_for_Business.en.md) |

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.2 Speciale toegangsrechten<br>A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 6.5 Require MFA for Administrative Access |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-05 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
