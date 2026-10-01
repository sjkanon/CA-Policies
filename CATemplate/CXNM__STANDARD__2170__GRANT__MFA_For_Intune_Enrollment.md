<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__2170__GRANT__MFA_For_Intune_Enrollment.en.md) · [Français](CXNM__STANDARD__2170__GRANT__MFA_For_Intune_Enrollment.fr.md)

# CXNM - STANDARD - 2170 - GRANT - MFA for Intune Enrollment

Eist MFA, elke keer opnieuw, bij het inschrijven in Intune (de app Microsoft Intune Enrollment). Een ander pad dan `2080`, op hetzelfde moment.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 1 |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Op | 1 app: Microsoft Intune Enrollment (`d4ebce55-015a-49b5-a083-c84d1797ae8c`) |
| Voorwaarden | geen — alleen wie, op welke app |
| Eis | `Multifactor authentication` + elke keer opnieuw aanmelden |
| Bestand | [`CXNM__STANDARD__2170__GRANT__MFA_For_Intune_Enrollment.json`](CXNM__STANDARD__2170__GRANT__MFA_For_Intune_Enrollment.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Let op

- Een nieuwe medewerker zonder geregistreerde MFA-methode kan zijn eerste apparaat niet inschrijven. Geef bij indiensttreding een TAP uit.

## Raakt Intune

Deze policy hangt af van Intune-policies in de [IntuneBackup-repo](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/). Bij elke policy daar staat de koppeling omgekeerd.

Setup Assistant met moderne authenticatie meldt aan bij Microsoft Intune Enrollment, dus deze CA-policy vraagt daar MFA. Heeft de gebruiker op dat moment geen werkend MFA-middel, dan loopt de inschrijving vast.

| Platform | Intune-policies |
|---|---|
| macOS | [MAC - D - Enrollment Profile Administrator User Affinity](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Administrator_User_Affinity.md)<br>[MAC - D - Enrollment Profile Standard User Affinity](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Standard_User_Affinity.md) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.16 Identiteitsbeheer<br>A.8.5 Veilige authenticatie<br>A.8.1 Eindpuntapparatuur van gebruikers |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 1.1 Establish and Maintain Detailed Enterprise Asset Inventory<br>6.3 Require MFA for Externally-Exposed Applications |
| NIST CSF 2.0 | PR.AA-01<br>ID.AM-01 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
