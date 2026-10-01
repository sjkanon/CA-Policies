<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__3030__SESSION__Register_Security_Info_Requirements.en.md) · [Français](CXNM__STANDARD__3030__SESSION__Register_Security_Info_Requirements.fr.md)

# CXNM - STANDARD - 3030 - SESSION - Register Security Info Requirements

Begrenst de sessie waarmee beveiligingsinfo wordt geregistreerd op 90 dagen: wie langer aangemeld is, meldt eerst opnieuw aan. `2180` regelt waarmee je mag registreren.

| | |
|---|---|
| Type | SESSION |
| State | enabled |
| Stage | 1 |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Op | beveiligingsinfo registreren |
| Voorwaarden | geen — alleen wie, op welke app |
| Eis | aanmelden elke 90 dagen |
| Bestand | [`CXNM__STANDARD__3030__SESSION__Register_Security_Info_Requirements.json`](CXNM__STANDARD__3030__SESSION__Register_Security_Info_Requirements.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.5.16 Identiteitsbeheer |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 6.1 Establish an Access Granting Process |
| NIST CSF 2.0 | PR.AA-02<br>PR.AA-01 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
