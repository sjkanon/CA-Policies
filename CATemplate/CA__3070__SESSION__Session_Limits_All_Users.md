<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CA__3070__SESSION__Session_Limits_All_Users.en.md) · [Français](CA__3070__SESSION__Session_Limits_All_Users.fr.md)

# CA - 3070 - SESSION - Session Limits All Users

Laat alle gebruikers elke 12 uur opnieuw aanmelden, ook gasten. Beheerders zitten met `3010` strenger op 9 uur.

| | |
|---|---|
| Type | SESSION |
| State | enabled |
| Stage | 1 |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| Op | alle apps |
| Voorwaarden | geen — alleen wie, op welke app |
| Eis | aanmelden elke 12 uur |
| Bestand | [`CA__3070__SESSION__Session_Limits_All_Users.json`](CA__3070__SESSION__Session_Limits_All_Users.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.7.7 Clear desk en clear screen<br>A.5.15 Toegangsbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.AA-05 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
