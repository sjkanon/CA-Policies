<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CA__1060__BLOCK__Service_Accounts_Trusted_Locations_Excluded.en.md) · [Français](CA__1060__BLOCK__Service_Accounts_Trusted_Locations_Excluded.fr.md)

# CA - 1060 - BLOCK - Service Accounts (Trusted Locations Excluded)

Blokkeert de serviceaccounts in `Conditional Access Service Accounts` buiten de IP-adressen in `Service Accounts Trusted IPs`. Serviceaccounts zijn uitgezonderd van MFA; deze policy komt daarvoor in de plaats. Staat vast op Report tot de IP-range per tenant is ingevuld.

| | |
|---|---|
| Type | BLOCK |
| State | disabled |
| Stage | 2 (vast op Report) |
| Voor wie | `Conditional Access Service Accounts` |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Op | alle apps |
| Voorwaarden | Locatie: alle locaties, behalve `Service Accounts Trusted IPs` |
| Eis | blokkeren |
| Bestand | [`CA__1060__BLOCK__Service_Accounts_Trusted_Locations_Excluded.json`](CA__1060__BLOCK__Service_Accounts_Trusted_Locations_Excluded.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Let op

- Een serviceaccount in `Conditional Access Service Accounts` heeft geen MFA (zie `2050`). Staat deze policy niet aan, dan is zo'n account van overal met alleen een wachtwoord te gebruiken.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.2 Speciale toegangsrechten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 5.5 Establish and Maintain an Inventory of Service Accounts<br>13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.AA-05<br>PR.IR-01 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
