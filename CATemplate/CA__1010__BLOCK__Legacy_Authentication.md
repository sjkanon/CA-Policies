<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CA__1010__BLOCK__Legacy_Authentication.en.md) · [Français](CA__1010__BLOCK__Legacy_Authentication.fr.md)

# CA - 1010 - BLOCK - Legacy Authentication

Blokkeert aanmelden via verouderde protocollen: Exchange ActiveSync en de andere legacy clients zoals POP, IMAP en SMTP AUTH. Die kennen geen MFA, dus zolang ze open staan is elke andere policy in deze set te omzeilen.

| | |
|---|---|
| Type | BLOCK |
| State | enabled |
| Stage | 1 |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Excluded from Legacy Authentication Block` |
| Op | alle apps |
| Voorwaarden | Clients: Exchange ActiveSync, overige legacy clients |
| Eis | blokkeren |
| Bestand | [`CA__1010__BLOCK__Legacy_Authentication.json`](CA__1010__BLOCK__Legacy_Authentication.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Let op

- Een apparaat of applicatie die nog via SMTP AUTH of IMAP mailt (scanner, oude app) stopt. Zet die tijdelijk in `Excluded from Legacy Authentication Block` en ruim de groep daarna op.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software<br>6.3 Require MFA for Externally-Exposed Applications |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-01 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
