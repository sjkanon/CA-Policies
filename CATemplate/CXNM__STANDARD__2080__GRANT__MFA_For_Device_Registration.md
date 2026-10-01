<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__2080__GRANT__MFA_For_Device_Registration.en.md) · [Français](CXNM__STANDARD__2080__GRANT__MFA_For_Device_Registration.fr.md)

# CXNM - STANDARD - 2080 - GRANT - MFA for Device Registration

Eist MFA bij het registreren of joinen van een apparaat in Entra ID, zodat een gestolen wachtwoord alleen geen apparaat aan de tenant kan hangen.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 1 |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Op | apparaat registreren |
| Voorwaarden | geen — alleen wie, op welke app |
| Eis | `Multifactor authentication` |
| Bestand | [`CXNM__STANDARD__2080__GRANT__MFA_For_Device_Registration.json`](CXNM__STANDARD__2080__GRANT__MFA_For_Device_Registration.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

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
