<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CA__2155__GRANT__Virtual_Desktop_Phishing_Resistant_MFA.en.md) · [Français](CA__2155__GRANT__Virtual_Desktop_Phishing_Resistant_MFA.fr.md)

# CA - 2155 - GRANT - Virtual Desktop Phishing Resistant MFA

Eist phishing-resistente MFA — een passkey, Windows Hello for Business of een certificaat — voor Azure Virtual Desktop, Windows 365 en Windows Cloud Login vanaf een toestel dat niet compliant is. Waar de virtuele werkplek de route is voor persoonlijke toestellen en derden, is het toestel onbekend; dan is de aanmelding het enige wat je kunt eisen, en een gestolen wachtwoord met sms-code mag daar niet genoeg zijn.

| | |
|---|---|
| Type | GRANT |
| State | report-only |
| Stage | 3* |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| Op | 3 apps: Azure Virtual Desktop (`9cdead84-a844-4324-93f2-b2e6bb768d07`), Windows 365 (`0af06dc6-e4b5-4f28-818e-e78e62d137a5`), Windows Cloud Login (`270efc09-cd0d-444b-a71f-39af4910ec45`) |
| Voorwaarden | Apparaatfilter: niet op `device.isCompliant -eq True` |
| Eis | `Phishing-resistant MFA` |
| Bestand | [`CA__2155__GRANT__Virtual_Desktop_Phishing_Resistant_MFA.json`](CA__2155__GRANT__Virtual_Desktop_Phishing_Resistant_MFA.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

> **Optioneel** — vraagt dat elke gebruiker van Azure Virtual Desktop of Windows 365 een passkey, Windows Hello for Business of FIDO2-sleutel heeft. Zinvol waar de virtuele werkplek de route is voor persoonlijke toestellen en derden; daar is het toestel onbekend en is de aanmelding het enige wat je kunt eisen.

## Let op

- Zet hem pas aan als elke gebruiker van de virtuele werkplek een phishing-resistente methode heeft; controleer dat met scripts/Test-EntraPasskeyReadiness.ps1. Een compliant toestel valt er buiten: daar dekken 2050 en de compliance al de aanmelding.
- Wat er in de sessie gebeurt — klembord, schijven, printers, schermopname — regelt deze policy niet. Dat doen de Intune-policies op de sessiehost en de RDP-eigenschappen van de hostpool.

## Raakt Intune

Deze policy hangt af van Intune-policies in de [IntuneBackup-repo](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Bij elke policy daar staat de koppeling omgekeerd.

Richt Windows Hello for Business in: op Windows de gewone manier om aan phishing-resistente MFA te voldoen. Zonder WHfB blijft daar alleen een losse passkey of beveiligingssleutel over.

| Platform | Intune-policies |
|---|---|
| Windows | [WIN - D - Windows Hello for Business](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.md)<br>[WIN - D - Windows Hello for Business Multi User](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.md)<br>[WIN - U - Windows Hello for Business](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Hello_for_Business.md) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.6.7 Werken op afstand<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 6.4 Require MFA for Remote Network Access<br>13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-05 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
