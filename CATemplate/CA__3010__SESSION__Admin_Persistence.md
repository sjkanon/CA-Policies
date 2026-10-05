<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CA__3010__SESSION__Admin_Persistence.en.md) · [Français](CA__3010__SESSION__Admin_Persistence.fr.md)

# CA - 3010 - SESSION - Admin Persistence

Laat de 28 beheerrollen elke 9 uur opnieuw aanmelden en geeft hun geen blijvende browsersessie.

| | |
|---|---|
| Type | SESSION |
| State | enabled |
| Stage | 1 |
| Voor wie | 28 beheerrollen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Op | alle apps |
| Voorwaarden | geen — alleen wie, op welke app |
| Eis | aanmelden elke 9 uur + geen blijvende browsersessie |
| Bestand | [`CA__3010__SESSION__Admin_Persistence.json`](CA__3010__SESSION__Admin_Persistence.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.2 Speciale toegangsrechten<br>A.7.7 Clear desk en clear screen<br>A.5.15 Toegangsbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.AA-05 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
