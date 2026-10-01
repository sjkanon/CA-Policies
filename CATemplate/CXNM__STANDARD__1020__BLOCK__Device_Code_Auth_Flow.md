<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__1020__BLOCK__Device_Code_Auth_Flow.en.md) · [Français](CXNM__STANDARD__1020__BLOCK__Device_Code_Auth_Flow.fr.md)

# CXNM - STANDARD - 1020 - BLOCK - Device Code Auth Flow

Blokkeert de device code flow en authentication transfer: aanmelden door een code op een ander apparaat in te voeren. Bij phishing laat een aanvaller het slachtoffer zo zijn token goedkeuren.

| | |
|---|---|
| Type | BLOCK |
| State | disabled |
| Stage | 2 |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Excluded from Device Code Auth Flow Block` |
| Op | alle apps |
| Voorwaarden | Aanmeldflow: `deviceCodeFlow`, `authenticationTransfer` |
| Eis | blokkeren |
| Bestand | [`CXNM__STANDARD__1020__BLOCK__Device_Code_Auth_Flow.json`](CXNM__STANDARD__1020__BLOCK__Device_Code_Auth_Flow.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Let op

- Teams Rooms, sommige vergaderapparaten en CLI-tools melden zich met een device code aan. Zet ze in `Excluded from Device Code Auth Flow Block` vóór je deze policy aanzet.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(g) basispraktijken cyberhygiene en training |
| CIS Controls v8.1 | 6.3 Require MFA for Externally-Exposed Applications |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-04 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
