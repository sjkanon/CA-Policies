<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__2190__GRANT__Windows_Hello_Passkeys.en.md) · [Français](CXNM__STANDARD__2190__GRANT__Windows_Hello_Passkeys.fr.md)

# CXNM - STANDARD - 2190 - GRANT - Windows Hello Passkeys

Eist voor `U-WHfB-Passkeys` een Windows Hello-passkey: FIDO2, beperkt tot de Windows Hello-AAGUID's. Report-only. Een gewone WHfB-credential telt hier niet mee.

| | |
|---|---|
| Type | GRANT |
| State | report-only |
| Stage | 3* |
| Voor wie | `U-WHfB-Passkeys` |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| Op | alle apps |
| Voorwaarden | geen — alleen wie, op welke app |
| Eis | `CA-WHfB-Passkeys` |
| Bestand | [`CXNM__STANDARD__2190__GRANT__Windows_Hello_Passkeys.json`](CXNM__STANDARD__2190__GRANT__Windows_Hello_Passkeys.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

> **Optioneel** — vraagt de custom authentication strength 'CA-WHfB-Passkeys' met AAGUID-beperking, per tenant aangemaakt. Staat op report-only: hij laat op álle apps alleen een Windows Hello-passkey toe, dus geen WHfB-credential, geen telefoon en geen beveiligingssleutel. Eerst de report-only-uitslag lezen.

## Let op

- Wie op een joined toestel met WHfB werkt voldoet niet, en kan daar vaak ook geen Windows Hello-passkey registreren. Moet WHfB wel tellen, dan hoort `windowsHelloForBusiness` in de strength.
- De strength staat de software-AAGUID van Windows Hello toe; `authentication-methods/` beperkt het profiel tot hardware en VBS. De twee lijsten spreken elkaar tegen.

## Raakt Intune

Deze policy hangt af van Intune-policies in de [IntuneBackup-repo](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Bij elke policy daar staat de koppeling omgekeerd.

Bepaalt de PIN van de Windows Hello-passkey die deze CA-policy eist. Strenger dan de gebruiker gewend is, en registreren gaat pas als de PIN aan de eis voldoet.

| Platform | Intune-policies |
|---|---|
| Windows | [WIN - D - Windows Hello Passkey PIN Complexity Alphanumeric](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Alphanumeric.md)<br>[WIN - D - Windows Hello Passkey PIN Complexity Numeric](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Numeric.md) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie<br>A.8.1 Eindpuntapparatuur van gebruikers |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 6.3 Require MFA for Externally-Exposed Applications<br>6.4 Require MFA for Remote Network Access |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-01 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
