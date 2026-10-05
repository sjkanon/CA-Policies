<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2170__GRANT__MFA_For_Intune_Enrollment.md) · **English** · [Français](CA__2170__GRANT__MFA_For_Intune_Enrollment.fr.md)

# CA - 2170 - GRANT - MFA for Intune Enrollment

Requires MFA, every time, when enrolling in Intune (the Microsoft Intune Enrollment app). A different path from `2080`, at the same moment.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 1 |
| Who | everyone |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| On | 1 app: Microsoft Intune Enrollment (`d4ebce55-015a-49b5-a083-c84d1797ae8c`) |
| Conditions | none — only who, on which app |
| Requirement | `Multifactor authentication` + sign in every time |
| File | [`CA__2170__GRANT__MFA_For_Intune_Enrollment.json`](CA__2170__GRANT__MFA_For_Intune_Enrollment.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

## Watch out

- A new employee without a registered MFA method cannot enrol their first device. Issue a TAP at onboarding.

## Touches Intune

This policy depends on Intune policies in the [IntuneBackup repo](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Each policy there shows the link the other way round.

Setup Assistant with modern authentication signs in to Microsoft Intune Enrollment, so this CA policy asks for MFA there. If the user has no working MFA method at that moment, enrolment gets stuck.

| Platform | Intune policies |
|---|---|
| macOS | [MAC - D - Enrollment Profile Administrator User Affinity](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Administrator_User_Affinity.en.md)<br>[MAC - D - Enrollment Profile Standard User Affinity](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Standard_User_Affinity.en.md) |

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.16 Identiteitsbeheer<br>A.8.5 Veilige authenticatie<br>A.8.1 Eindpuntapparatuur van gebruikers |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 1.1 Establish and Maintain Detailed Enterprise Asset Inventory<br>6.3 Require MFA for Externally-Exposed Applications |
| NIST CSF 2.0 | PR.AA-01<br>ID.AM-01 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
