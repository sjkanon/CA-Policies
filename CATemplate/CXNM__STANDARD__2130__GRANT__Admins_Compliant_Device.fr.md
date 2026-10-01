<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__2130__GRANT__Admins_Compliant_Device.md) · [English](CXNM__STANDARD__2130__GRANT__Admins_Compliant_Device.en.md) · **Français**

# CXNM - STANDARD - 2130 - GRANT - Admins Compliant Device

Exige un appareil conforme ou hybrid joined pour les 28 rôles d'administration. Administrer depuis un ordinateur personnel n'est alors plus possible.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 3* |
| Pour qui | 28 rôles d'admin |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Sur | toutes les apps |
| Conditions | aucune — seulement qui, sur quelle app |
| Exigence | appareil conforme ou appareil hybrid joined |
| Fichier | [`CXNM__STANDARD__2130__GRANT__Admins_Compliant_Device.json`](CXNM__STANDARD__2130__GRANT__Admins_Compliant_Device.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

> **Optionnel** — eist dat élke beheerder een beheerd apparaat heeft — bij uitbesteed beheer dus ook elke engineer die in de tenant komt. Besluit per tenant.

## Points d'attention

- Les comptes break-glass n'ont pas non plus d'appareil conforme : vérifiez qu'ils figurent dans `SG-U-CA-Exclude-Breakglass` avant d'activer cette stratégie.

## Touche Intune

Cette stratégie dépend de stratégies Intune du [dépôt IntuneBackup](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Chaque stratégie y affiche le lien en sens inverse.

Contribue à déterminer si un appareil est conforme. Si un appareil n'y satisfait pas, il devient non conforme et l'exigence d'appareil conforme de Conditional Access le bloque.

| Plateforme | Stratégies Intune |
|---|---|
| Windows | [WIN - U - Compliance Antispyware](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antispyware.fr.md)<br>[WIN - U - Compliance Antivirus](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antivirus.fr.md)<br>[WIN - U - Compliance BitLocker](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_BitLocker.fr.md)<br>[WIN - U - Compliance Code Integrity](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Code_Integrity.fr.md)<br>[WIN - U - Compliance Defender Real Time Protection](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Real_Time_Protection.fr.md)<br>[WIN - U - Compliance Defender Security Intelligence](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Security_Intelligence.fr.md)<br>[WIN - U - Compliance Defender for Endpoint Risk](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.fr.md)<br>[WIN - U - Compliance Firewall](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Firewall.fr.md)<br>[WIN - U - Compliance OS Version](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_OS_Version.fr.md)<br>[WIN - U - Compliance Secure Boot](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Secure_Boot.fr.md)<br>[WIN - U - Compliance TPM](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_TPM.fr.md) |
| macOS | [MAC - U - Compliance Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Health.fr.md)<br>[MAC - U - Compliance Device Security](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Security.fr.md)<br>[MAC - U - Compliance OS Version](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_OS_Version.fr.md)<br>[MAC - U - Compliance Password](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Password.fr.md) |
| iOS/iPadOS | [IOS - U - Compliance Defender for Endpoint](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Defender_for_Endpoint.fr.md)<br>[IOS - U - Compliance Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Device_Health.fr.md)<br>[IOS - U - Compliance Password](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Password.fr.md) |
| Android | [AND - D - Compliance Dedicated Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_D_Compliance_Dedicated_Device_Health.fr.md)<br>[AND - U - Compliance Block Device Administrator](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Block_Device_Administrator.fr.md)<br>[AND - U - Compliance Corporate Defender for Endpoint](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Defender_for_Endpoint.fr.md)<br>[AND - U - Compliance Corporate Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Device_Health.fr.md)<br>[AND - U - Compliance Corporate Password](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Password.fr.md)<br>[AND - U - Compliance Defender for Endpoint](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Defender_for_Endpoint.fr.md)<br>[AND - U - Compliance Device Health](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.fr.md)<br>[AND - U - Compliance Password](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Password.fr.md) |

Garantit que le navigateur transmet l'état de l'appareil. Edge ne le fait qu'avec un profil professionnel ; Safari sur Mac et iOS via le plug-in Microsoft Enterprise SSO. Sans cela, l'exigence d'appareil conforme échoue même sur un appareil géré.

| Plateforme | Stratégies Intune |
|---|---|
| Windows | [WIN - U - Microsoft Edge Profiles and Sync](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Profiles_and_Sync.fr.md) |
| macOS | [MAC - D - Platform SSO](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Platform_SSO.fr.md) |
| iOS/iPadOS | [IOS - D - Enterprise SSO](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Enterprise_SSO.fr.md) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.2 Speciale toegangsrechten<br>A.8.1 Eindpuntapparatuur van gebruikers |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 12.8 Establish and Maintain Dedicated Computing Resources for All Administrative Work<br>13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.AA-05<br>PR.PS-01 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
