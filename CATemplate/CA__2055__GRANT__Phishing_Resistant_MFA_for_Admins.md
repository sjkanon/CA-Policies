<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CA__2055__GRANT__Phishing_Resistant_MFA_for_Admins.en.md) · [Français](CA__2055__GRANT__Phishing_Resistant_MFA_for_Admins.fr.md)

# CA - 2055 - GRANT - Phishing Resistant MFA for Admins

Eist phishing-resistente MFA — Windows Hello for Business, een passkey of een certificaat — voor de 28 beheerrollen. De eerste stap richting `2120`.

| | |
|---|---|
| Type | GRANT |
| State | disabled |
| Stage | 2 |
| Voor wie | 28 beheerrollen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Op | alle apps |
| Voorwaarden | geen — alleen wie, op welke app |
| Eis | `Phishing-resistant MFA` |
| Bestand | [`CA__2055__GRANT__Phishing_Resistant_MFA_for_Admins.json`](CA__2055__GRANT__Phishing_Resistant_MFA_for_Admins.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Let op

- Zet hem pas aan als elke beheerder een phishing-resistente methode geregistreerd heeft, anders sluit je beheerders buiten. Controleer break-glass vooraf.

## Raakt Intune

Deze policy hangt af van Intune-policies in de [IntuneBackup-repo](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Bij elke policy daar staat de koppeling omgekeerd.

Richt Windows Hello for Business in: op Windows de gewone manier om aan phishing-resistente MFA te voldoen. Zonder WHfB blijft daar alleen een losse passkey of beveiligingssleutel over.

| Platform | Intune-policies |
|---|---|
| Windows | [WIN - D - Windows Hello for Business](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.md)<br>[WIN - D - Windows Hello for Business Multi User](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.md)<br>[WIN - U - Windows Hello for Business](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Hello_for_Business.md) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.2 Speciale toegangsrechten<br>A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 6.5 Require MFA for Administrative Access |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-05 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
