<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2115__GRANT__Token_Protection_Apple.md) · **English** · [Français](CA__2115__GRANT__Token_Protection_Apple.fr.md)

# CA - 2115 - GRANT - Token Protection Apple

Requires token protection for Exchange Online and SharePoint Online in the Microsoft apps on managed iPhones, iPads and Macs: the sign-in token is bound to the device's Secure Enclave and stops working when it is stolen. The Apple counterpart of 2110.

| | |
|---|---|
| Type | GRANT |
| State | report-only |
| Stage | 3* |
| Who | everyone |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| On | 2 apps: Exchange Online (`00000002-0000-0ff1-ce00-000000000000`), SharePoint Online (`00000003-0000-0ff1-ce00-000000000000`) |
| Conditions | Clients: mobile apps and desktop clients<br>Platform: iOS, macOS<br>Device filter: only `device.isCompliant -eq True` |
| Requirement | token protection |
| File | [`CA__2115__GRANT__Token_Protection_Apple.json`](CA__2115__GRANT__Token_Protection_Apple.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

> **Optional** — token protection op Apple werkt alleen op MDM-beheerde toestellen met de Microsoft Enterprise SSO-plug-in (iOS) of Platform SSO (macOS), en blokkeert de ingebouwde Mail- en Agenda-apps van Apple. Report-only tot de sign-in-logs (statuscodes 1003/1004 zijn zelf op te lossen) laten zien dat de beheerde toestellen klaar zijn, en tot gebruikers van Apple Mail zijn overgestapt op Outlook.

## Watch out

- Only MDM-managed devices are supported. The device filter (device.isCompliant -eq True, include) therefore keeps the policy on compliant devices; a personal iPhone with only App Protection is not registered, does not match the filter and is not blocked. Do not remove that filter.
- Apple's built-in Mail and Calendar apps do not support token protection and are blocked once the policy is on. On a compliant device 2070 currently allows those apps; announce the move to Outlook before enabling.
- Devices registered before the SSO plug-in or Platform SSO was in place get one sign-in prompt and are then automatically upgraded to hardware-backed registration (status code 1003/1004 in the sign-in logs).

## Touches Intune

This policy depends on Intune policies in the [IntuneBackup repo](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Each policy there shows the link the other way round.

Token protection on Apple needs hardware-backed device registration, which only comes through the Microsoft Enterprise SSO plug-in (iOS) or Platform SSO (macOS). Without this Intune policy the token is not bound and this CA policy blocks the Microsoft apps.

| Platform | Intune policies |
|---|---|
| macOS | [MAC - D - Platform SSO](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Platform_SSO.en.md) |
| iOS/iPadOS | [IOS - D - Enterprise SSO](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Enterprise_SSO.en.md) |

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
