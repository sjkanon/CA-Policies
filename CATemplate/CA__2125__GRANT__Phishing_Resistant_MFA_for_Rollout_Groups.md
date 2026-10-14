<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CA__2125__GRANT__Phishing_Resistant_MFA_for_Rollout_Groups.en.md) · [Français](CA__2125__GRANT__Phishing_Resistant_MFA_for_Rollout_Groups.fr.md)

# CA - 2125 - GRANT - Phishing Resistant MFA for Rollout Groups

Eist phishing-resistente MFA voor `SG-U-CA-Passkey-Forced` en de uitzonderingsgroepen `SG-U-CA-Exception-Passkey-*` (WHfB, FIDO2, Synced-iCloud, Synced-Google, Authenticator): de groepsgewijze weg naar `2120`. `SG-U-CA-Onboarding-Passkey` is uitgesloten.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 3* |
| Voor wie | `SG-U-CA-Passkey-Forced`, `SG-U-CA-Exception-Passkey-WHfB`, `SG-U-CA-Exception-Passkey-FIDO2`, `SG-U-CA-Exception-Passkey-Synced-iCloud`, `SG-U-CA-Exception-Passkey-Synced-Google`, `SG-U-CA-Exception-Passkey-Authenticator` |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts`, `SG-U-CA-Onboarding-Passkey`, gasten |
| Op | alle apps |
| Voorwaarden | geen — alleen wie, op welke app |
| Eis | `Phishing-resistant MFA` |
| Bestand | [`CA__2125__GRANT__Phishing_Resistant_MFA_for_Rollout_Groups.json`](CA__2125__GRANT__Phishing_Resistant_MFA_for_Rollout_Groups.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

> **Optioneel** — de groepsgewijze uitrol van 2120: alleen zinvol in een tenant die zijn passkey-uitrol per groep doet, en alleen veilig zolang er niemand in 'SG-U-CA-Passkey-Forced' of een 'SG-U-CA-Exception-Passkey-*'-groep staat die nog geen phishing-bestendige methode heeft. Wie nog onboardt staat in 'SG-U-CA-Onboarding-Passkey' en valt erbuiten.

## Let op

- Wie in `SG-U-CA-Onboarding-Passkey` staat valt buiten 2125, ook als hij al in een doelgroep zit: hij moet eerst via `2185` zijn passkey kunnen registreren, en 2125 geldt voor alle apps, dus ook voor de registratiepagina. Haal hem na de registratie uit de onboardinggroep, anders blijft de eis voor hem uit.

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
