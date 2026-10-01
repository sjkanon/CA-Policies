<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__1030__BLOCK__Unsupported_Device_Platforms.en.md) · [Français](CXNM__STANDARD__1030__BLOCK__Unsupported_Device_Platforms.fr.md)

# CXNM - STANDARD - 1030 - BLOCK - Unsupported Device Platforms

Blokkeert aanmelden vanaf elk platform behalve Windows, macOS, iOS en Android — de platforms die Intune beheert en waar de andere policies op rekenen. Het platform komt uit de user agent; dit is een drempel, geen grens.

| | |
|---|---|
| Type | BLOCK |
| State | disabled |
| Stage | 2 |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Excluded from Legacy Authentication Block` |
| Op | alle apps |
| Voorwaarden | Platform: alle behalve android, iOS, windows, macOS |
| Eis | blokkeren |
| Bestand | [`CXNM__STANDARD__1030__BLOCK__Unsupported_Device_Platforms.json`](CXNM__STANDARD__1030__BLOCK__Unsupported_Device_Platforms.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Let op

- De uitsluitingsgroep is `Excluded from Legacy Authentication Block`, niet een eigen groep. Wie daar voor legacy auth in staat, mag hier ook vanaf elk platform aanmelden.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.1 Eindpuntapparatuur van gebruikers |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 1.2 Address Unauthorized Assets |
| NIST CSF 2.0 | ID.AM-01<br>PR.AA-05 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
