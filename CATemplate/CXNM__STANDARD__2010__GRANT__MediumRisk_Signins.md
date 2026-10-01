<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__2010__GRANT__MediumRisk_Signins.en.md) · [Français](CXNM__STANDARD__2010__GRANT__MediumRisk_Signins.fr.md)

# CXNM - STANDARD - 2010 - GRANT - Medium-Risk Sign-ins

Eist MFA, elke keer opnieuw, bij een aanmelding die Entra ID Protection als gemiddeld risico inschat. Vraagt Entra ID P2.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 1 |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Op | alle apps |
| Voorwaarden | Aanmeldrisico: medium |
| Eis | `Multifactor authentication` + elke keer opnieuw aanmelden |
| Bestand | [`CXNM__STANDARD__2010__GRANT__MediumRisk_Signins.json`](CXNM__STANDARD__2010__GRANT__MediumRisk_Signins.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.5 Veilige authenticatie<br>A.5.17 Authenticatie-informatie<br>A.8.16 Monitoringactiviteiten |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(b) incidentbehandeling |
| CIS Controls v8.1 | 6.3 Require MFA for Externally-Exposed Applications |
| NIST CSF 2.0 | PR.AA-03<br>DE.CM-03 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
