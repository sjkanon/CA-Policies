<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__2090__GRANT__Browser_Access_On_Unmanaged_Devices.en.md) · [Français](CXNM__STANDARD__2090__GRANT__Browser_Access_On_Unmanaged_Devices.fr.md)

# CXNM - STANDARD - 2090 - GRANT - Browser Access On Unmanaged Devices

Eist in de browser een compliant of hybrid joined apparaat; op een onbeheerd apparaat is er via de browser geen toegang. Microsoft Intune en Intune Enrollment zijn uitgezonderd.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 1 |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| Op | alle apps, behalve Microsoft Intune (`0000000a-0000-0000-c000-000000000000`), Microsoft Intune Enrollment (`d4ebce55-015a-49b5-a083-c84d1797ae8c`) |
| Voorwaarden | Clients: browser |
| Eis | compliant apparaat of hybrid joined apparaat |
| Bestand | [`CXNM__STANDARD__2090__GRANT__Browser_Access_On_Unmanaged_Devices.json`](CXNM__STANDARD__2090__GRANT__Browser_Access_On_Unmanaged_Devices.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Let op

- Chrome op Windows geeft de apparaatstatus alleen door met de extensie Microsoft Single Sign On; Firefox met zijn instelling voor Windows SSO. Zonder die extensie of instelling faalt de eis ook op een beheerd apparaat.

## Raakt Intune

Deze policy hangt af van Intune-policies in de [IntuneBackup-repo](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Bij elke policy daar staat de koppeling omgekeerd.

Bepaalt mee of een apparaat compliant is. Voldoet een apparaat hier niet aan, dan wordt het niet-compliant en houdt de compliant-eis van Conditional Access het tegen.

| Platform | Intune-policies |
|---|---|
| Windows | [WIN - U - Compliance Antispyware](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antispyware.md)<br>[WIN - U - Compliance Antivirus](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antivirus.md)<br>[WIN - U - Compliance BitLocker](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_BitLocker.md)<br>[WIN - U - Compliance Code Integrity](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Code_Integrity.md)<br>[WIN - U - Compliance Defender Real Time Protection](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Real_Time_Protection.md)<br>[WIN - U - Compliance Defender Security Intelligence](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Security_Intelligence.md)<br>[WIN - U - Compliance Defender for Endpoint Risk](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.md)<br>[WIN - U - Compliance Firewall](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Firewall.md)<br>[WIN - U - Compliance OS Version](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_OS_Version.md)<br>[WIN - U - Compliance Secure Boot](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Secure_Boot.md)<br>[WIN - U - Compliance TPM](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_TPM.md) |
| macOS | [MAC - U - Compliance Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Health.md)<br>[MAC - U - Compliance Device Security](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Security.md)<br>[MAC - U - Compliance OS Version](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_OS_Version.md)<br>[MAC - U - Compliance Password](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Password.md) |
| iOS/iPadOS | [IOS - U - Compliance Defender for Endpoint](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Defender_for_Endpoint.md)<br>[IOS - U - Compliance Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Device_Health.md)<br>[IOS - U - Compliance Password](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Password.md) |
| Android | [AND - D - Compliance Dedicated Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_D_Compliance_Dedicated_Device_Health.md)<br>[AND - U - Compliance Block Device Administrator](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Block_Device_Administrator.md)<br>[AND - U - Compliance Corporate Defender for Endpoint](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Defender_for_Endpoint.md)<br>[AND - U - Compliance Corporate Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Device_Health.md)<br>[AND - U - Compliance Corporate Password](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Password.md)<br>[AND - U - Compliance Defender for Endpoint](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Defender_for_Endpoint.md)<br>[AND - U - Compliance Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.md)<br>[AND - U - Compliance Password](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Password.md) |

Zorgt dat de browser de apparaatstatus meegeeft. Edge doet dat alleen met een werkprofiel; Safari op de Mac en iOS via de Microsoft Enterprise SSO-plug-in. Ontbreekt dat, dan faalt de compliant-eis ook op een beheerd apparaat.

| Platform | Intune-policies |
|---|---|
| Windows | [WIN - U - Microsoft Edge Profiles and Sync](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Profiles_and_Sync.md) |
| macOS | [MAC - D - Platform SSO](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Platform_SSO.md) |
| iOS/iPadOS | [IOS - D - Enterprise SSO](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Enterprise_SSO.md) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Eindpuntapparatuur van gebruikers<br>A.5.15 Toegangsbeveiliging<br>A.8.3 Beperking toegang tot informatie |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.AA-05<br>PR.IR-01 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
