<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__3040__SESSION__Block_File_Downloads_On_Unmanaged_Devices.en.md) · [Français](CXNM__STANDARD__3040__SESSION__Block_File_Downloads_On_Unmanaged_Devices.fr.md)

# CXNM - STANDARD - 3040 - SESSION - Block File Downloads On Unmanaged Devices

Op een apparaat dat niet compliant is: SharePoint, OneDrive en Exchange Online alleen in de browser en zonder downloaden. Voor Exchange werkt dit pas met de OWA-mailboxpolicy erbij.

| | |
|---|---|
| Type | SESSION |
| State | disabled |
| Stage | 2 |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Op | 2 apps: SharePoint Online (`00000003-0000-0ff1-ce00-000000000000`), Exchange Online (`00000002-0000-0ff1-ce00-000000000000`) |
| Voorwaarden | Apparaatfilter: niet op `device.isCompliant -eq True` |
| Eis | app-afgedwongen beperkingen |
| Bestand | [`CXNM__STANDARD__3040__SESSION__Block_File_Downloads_On_Unmanaged_Devices.json`](CXNM__STANDARD__3040__SESSION__Block_File_Downloads_On_Unmanaged_Devices.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Let op

- Voor Exchange per tenant: `Set-OwaMailboxPolicy -Identity OwaMailboxPolicy-Default -ConditionalAccessPolicy ReadOnly`. Zonder die stap is de policy voor Exchange stil.

## Raakt Intune

Deze policy hangt af van Intune-policies in de [IntuneBackup-repo](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Bij elke policy daar staat de koppeling omgekeerd.

Bepaalt welk apparaat als compliant telt en dus mag downloaden. Een beheerd apparaat dat niet-compliant wordt, krijgt alleen nog de browser zonder downloads.

| Platform | Intune-policies |
|---|---|
| Windows | [WIN - U - Compliance Antispyware](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antispyware.md)<br>[WIN - U - Compliance Antivirus](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antivirus.md)<br>[WIN - U - Compliance BitLocker](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_BitLocker.md)<br>[WIN - U - Compliance Code Integrity](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Code_Integrity.md)<br>[WIN - U - Compliance Defender Real Time Protection](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Real_Time_Protection.md)<br>[WIN - U - Compliance Defender Security Intelligence](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Security_Intelligence.md)<br>[WIN - U - Compliance Defender for Endpoint Risk](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.md)<br>[WIN - U - Compliance Firewall](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Firewall.md)<br>[WIN - U - Compliance OS Version](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_OS_Version.md)<br>[WIN - U - Compliance Secure Boot](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Secure_Boot.md)<br>[WIN - U - Compliance TPM](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_TPM.md) |
| macOS | [MAC - U - Compliance Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Health.md)<br>[MAC - U - Compliance Device Security](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Security.md)<br>[MAC - U - Compliance OS Version](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_OS_Version.md)<br>[MAC - U - Compliance Password](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Password.md) |
| iOS/iPadOS | [IOS - U - Compliance Defender for Endpoint](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Defender_for_Endpoint.md)<br>[IOS - U - Compliance Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Device_Health.md)<br>[IOS - U - Compliance Password](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Password.md) |
| Android | [AND - D - Compliance Dedicated Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_D_Compliance_Dedicated_Device_Health.md)<br>[AND - U - Compliance Block Device Administrator](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Block_Device_Administrator.md)<br>[AND - U - Compliance Corporate Defender for Endpoint](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Defender_for_Endpoint.md)<br>[AND - U - Compliance Corporate Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Device_Health.md)<br>[AND - U - Compliance Corporate Password](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Password.md)<br>[AND - U - Compliance Defender for Endpoint](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Defender_for_Endpoint.md)<br>[AND - U - Compliance Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.md)<br>[AND - U - Compliance Password](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Password.md) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.12 Voorkomen van datalekken<br>A.8.3 Beperking toegang tot informatie<br>A.5.14 Informatieoverdracht |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 3.3 Configure Data Access Control Lists<br>3.13 Deploy a Data Loss Prevention Solution |
| NIST CSF 2.0 | PR.DS-01<br>PR.AA-05 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
