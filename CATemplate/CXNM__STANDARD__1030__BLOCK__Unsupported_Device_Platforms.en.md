<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__1030__BLOCK__Unsupported_Device_Platforms.md) · **English** · [Français](CXNM__STANDARD__1030__BLOCK__Unsupported_Device_Platforms.fr.md)

# CXNM - STANDARD - 1030 - BLOCK - Unsupported Device Platforms

Blocks sign-in from every platform except Windows, macOS, iOS and Android — the platforms Intune manages and the other policies rely on. The platform comes from the user agent; this is a hurdle, not a boundary.

| | |
|---|---|
| Type | BLOCK |
| State | disabled |
| Stage | 2 |
| Who | everyone |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Excluded from Legacy Authentication Block` |
| On | all apps |
| Conditions | Platform: all except android, iOS, windows, macOS |
| Requirement | block |
| File | [`CXNM__STANDARD__1030__BLOCK__Unsupported_Device_Platforms.json`](CXNM__STANDARD__1030__BLOCK__Unsupported_Device_Platforms.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

## Watch out

- The exclusion group is `Excluded from Legacy Authentication Block`, not a group of its own. Whoever is in it for legacy auth may also sign in from any platform here.

## Touches Intune

No Intune policy this policy depends on.

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.1 Eindpuntapparatuur van gebruikers |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 1.2 Address Unauthorized Assets |
| NIST CSF 2.0 | ID.AM-01<br>PR.AA-05 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
