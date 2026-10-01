<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__2080__GRANT__MFA_For_Device_Registration.md) · **English** · [Français](CXNM__STANDARD__2080__GRANT__MFA_For_Device_Registration.fr.md)

# CXNM - STANDARD - 2080 - GRANT - MFA for Device Registration

Requires MFA when registering or joining a device in Entra ID, so that a stolen password alone cannot attach a device to the tenant.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 1 |
| Who | everyone |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| On | register device |
| Conditions | none — only who, on which app |
| Requirement | `Multifactor authentication` |
| File | [`CXNM__STANDARD__2080__GRANT__MFA_For_Device_Registration.json`](CXNM__STANDARD__2080__GRANT__MFA_For_Device_Registration.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

## Touches Intune

No Intune policy this policy depends on.

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
