<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__1130__BLOCK__Admins_From_Untrusted_Locations.en.md) · [Français](CXNM__STANDARD__1130__BLOCK__Admins_From_Untrusted_Locations.fr.md)

# CXNM - STANDARD - 1130 - BLOCK - Admins From Untrusted Locations

Blokkeert de 28 beheerrollen buiten de vertrouwde locaties. Optioneel: een beheerder die thuis of onderweg werkt, kan dan niet meer beheren.

| | |
|---|---|
| Type | BLOCK |
| State | enabled |
| Stage | 3* |
| Voor wie | 28 beheerrollen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Op | alle apps |
| Voorwaarden | Locatie: alle locaties, behalve alle vertrouwde locaties |
| Eis | blokkeren |
| Bestand | [`CXNM__STANDARD__1130__BLOCK__Admins_From_Untrusted_Locations.json`](CXNM__STANDARD__1130__BLOCK__Admins_From_Untrusted_Locations.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

> **Optioneel** — beheerders vastzetten op vertrouwde locaties sluit ze buiten zodra ze thuis of onderweg werken. Alleen inschakelen na expliciete afstemming met de organisatie.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.2 Speciale toegangsrechten<br>A.5.15 Toegangsbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 12.8 Establish and Maintain Dedicated Computing Resources for All Administrative Work<br>13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.AA-05<br>PR.IR-01 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
