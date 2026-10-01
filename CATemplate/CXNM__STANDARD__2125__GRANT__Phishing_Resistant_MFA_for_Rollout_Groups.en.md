<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__2125__GRANT__Phishing_Resistant_MFA_for_Rollout_Groups.md) · **English** · [Français](CXNM__STANDARD__2125__GRANT__Phishing_Resistant_MFA_for_Rollout_Groups.fr.md)

# CXNM - STANDARD - 2125 - GRANT - Phishing Resistant MFA for Rollout Groups

Requires phishing-resistant MFA for the rollout groups `CA-Registered-Phishing-MFA` and `CA-Exception-Authenticator-Phishing-MFA`: the group-by-group route to `2120`.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 3* |
| Who | `CA-Registered-Phishing-MFA`, `CA-Exception-Authenticator-Phishing-MFA` |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts`, guests |
| On | all apps |
| Conditions | none — only who, on which app |
| Requirement | `Phishing-resistant MFA` |
| File | [`CXNM__STANDARD__2125__GRANT__Phishing_Resistant_MFA_for_Rollout_Groups.json`](CXNM__STANDARD__2125__GRANT__Phishing_Resistant_MFA_for_Rollout_Groups.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

> **Optional** — de groepsgewijze uitrol van 2120: alleen zinvol in een tenant die zijn passkey-uitrol per groep doet, en alleen veilig zolang er niemand in 'CA-Registered-Phishing-MFA' of 'CA-Exception-Authenticator-Phishing-MFA' staat die nog geen phishing-bestendige methode heeft.

## Watch out

- The groups carry the names from the source tenant (`CA-…`), not the SG-U convention. Renaming breaks the link with that tenant.

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
