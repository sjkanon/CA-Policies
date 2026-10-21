<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2126__GRANT__Phishing_Resistant_MFA_for_Passkey_Campaign.md) · **English** · [Français](CA__2126__GRANT__Phishing_Resistant_MFA_for_Passkey_Campaign.fr.md)

# CA - 2126 - GRANT - Phishing Resistant MFA for Passkey Campaign

Requires phishing-resistant MFA for `SG-U-CA-Campaign-Passkey`: the hard deadline of the registration campaign. The campaign asks for a passkey at sign-in and stops allowing skips after three, but only on an interactive sign-in with MFA; this policy leaves no gap. `SG-U-CA-Onboarding-Passkey` is excluded.

| | |
|---|---|
| Type | GRANT |
| State | report-only |
| Stage | 3* |
| Who | `SG-U-CA-Campaign-Passkey` |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts`, `SG-U-CA-Onboarding-Passkey`, guests |
| On | all apps |
| Conditions | none — only who, on which app |
| Requirement | `Phishing-resistant MFA` |
| File | [`CA__2126__GRANT__Phishing_Resistant_MFA_for_Passkey_Campaign.json`](CA__2126__GRANT__Phishing_Resistant_MFA_for_Passkey_Campaign.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

> **Optional** — de deadline van de passkey-campagne: eist phishing-bestendige MFA voor 'SG-U-CA-Campaign-Passkey'. Pas aanzetten als de campagne lang genoeg heeft gelopen; wie dan nog geen phishing-bestendige methode heeft, moet bij de volgende aanmelding meteen een passkey registreren. Passkey (FIDO2) moet daarvoor ook voor de campagnegroep aan staan in het passkeyprofiel.

## Watch out

- Only turn it on once the campaign has run long enough and users have been told. Anyone without a phishing-resistant method by then must register a passkey straight away at the next sign-in, without skipping. That only works if passkey (FIDO2) is also enabled for `SG-U-CA-Campaign-Passkey` in the passkey profile; otherwise error 53003 (*Additional sign-in methods are required*) follows and they cannot get in anywhere. If registering fails (for example a phone without screen lock), the service desk puts them in `SG-U-CA-Onboarding-Passkey` for a while (`2185`).
- Same requirement as `2125`; the difference is the group and the timing. Members of the campaign group no longer need to be moved to `SG-U-CA-Passkey-Forced` by hand: once 2126 is on, the requirement applies to the whole campaign group.

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
