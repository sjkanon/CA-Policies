<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CA__1110__BLOCK__Unlicensed_Users.en.md) · [Français](CA__1110__BLOCK__Unlicensed_Users.fr.md)

# CA - 1110 - BLOCK - Unlicensed Users

Blokkeert gebruikers die niet in `Licensed Users` zitten, zodat een account zonder licentie — een vergeten testaccount, een gedeelde mailbox met een wachtwoord — niet kan aanmelden.

| | |
|---|---|
| Type | BLOCK |
| State | enabled |
| Stage | 1 |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts`, `Licensed Users` |
| Op | alle apps |
| Voorwaarden | geen — alleen wie, op welke app |
| Eis | blokkeren |
| Bestand | [`CA__1110__BLOCK__Unlicensed_Users.json`](CA__1110__BLOCK__Unlicensed_Users.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Let op

- `Licensed Users` moet iedereen met een licentie bevatten — in de praktijk een dynamische groep. Ontbreekt iemand, dan is die buitengesloten.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.16 Identiteitsbeheer<br>A.5.18 Toegangsrechten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 5.1 Establish and Maintain an Inventory of Accounts<br>5.3 Disable Dormant Accounts |
| NIST CSF 2.0 | PR.AA-01<br>PR.AA-05 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
