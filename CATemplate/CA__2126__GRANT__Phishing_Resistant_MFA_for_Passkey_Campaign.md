<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CA__2126__GRANT__Phishing_Resistant_MFA_for_Passkey_Campaign.en.md) · [Français](CA__2126__GRANT__Phishing_Resistant_MFA_for_Passkey_Campaign.fr.md)

# CA - 2126 - GRANT - Phishing Resistant MFA for Passkey Campaign

Eist phishing-resistente MFA voor `SG-U-CA-Campaign-Passkey`: de harde deadline van de registratiecampagne. De campagne vraagt bij het aanmelden om een passkey en laat na drie keer overslaan niet meer door, maar alleen bij een interactieve aanmelding met MFA; deze policy laat geen gat. `SG-U-CA-Onboarding-Passkey` is uitgesloten.

| | |
|---|---|
| Type | GRANT |
| State | report-only |
| Stage | 3* |
| Voor wie | `SG-U-CA-Campaign-Passkey` |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts`, `SG-U-CA-Onboarding-Passkey`, gasten |
| Op | alle apps |
| Voorwaarden | geen — alleen wie, op welke app |
| Eis | `Phishing-resistant MFA` |
| Bestand | [`CA__2126__GRANT__Phishing_Resistant_MFA_for_Passkey_Campaign.json`](CA__2126__GRANT__Phishing_Resistant_MFA_for_Passkey_Campaign.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

> **Optioneel** — de deadline van de passkey-campagne: eist phishing-bestendige MFA voor 'SG-U-CA-Campaign-Passkey'. Pas aanzetten als de campagne lang genoeg heeft gelopen; wie dan nog geen phishing-bestendige methode heeft, komt nergens meer in tot de servicedesk hem in 'SG-U-CA-Onboarding-Passkey' zet en hij via 2185 registreert.

## Let op

- Zet hem pas aan als de campagne lang genoeg heeft gelopen en de gebruikers zijn ingelicht. Wie dan nog geen phishing-bestendige methode heeft, komt nergens meer in: 2126 geldt voor alle apps, dus ook voor de registratiepagina. De servicedesk zet zo iemand tijdelijk in `SG-U-CA-Onboarding-Passkey` (registreren met eigen MFA via `2185`) en haalt hem er na de registratie weer uit.
- Zelfde eis als `2125`; het verschil is de groep en het moment. Leden van de campagnegroep hoeven niet meer met de hand naar `SG-U-CA-Passkey-Forced`: zodra 2126 aan staat, geldt de eis voor de hele campagnegroep.

## Raakt Intune

Deze policy hangt af van Intune-policies in de [IntuneBackup-repo](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Bij elke policy daar staat de koppeling omgekeerd.

Richt Windows Hello for Business in: op Windows de gewone manier om aan phishing-resistente MFA te voldoen. Zonder WHfB blijft daar alleen een losse passkey of beveiligingssleutel over.

| Platform | Intune-policies |
|---|---|
| Windows | [WIN - D - Windows Hello for Business](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.md)<br>[WIN - D - Windows Hello for Business Multi User](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.md)<br>[WIN - U - Windows Hello for Business](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Hello_for_Business.md) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie<br>A.5.15 Toegangsbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(g) basispraktijken cyberhygiene en training |
| CIS Controls v8.1 | 6.3 Require MFA for Externally-Exposed Applications<br>6.4 Require MFA for Remote Network Access |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-01 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
