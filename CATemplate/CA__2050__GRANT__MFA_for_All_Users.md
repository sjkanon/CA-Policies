<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CA__2050__GRANT__MFA_for_All_Users.en.md) · [Français](CA__2050__GRANT__MFA_for_All_Users.fr.md)

# CA - 2050 - GRANT - MFA for All Users

Eist MFA voor alle gebruikers op alle apps. Microsoft Intune zelf is uitgezonderd, zodat een apparaat kan inchecken; serviceaccounts vallen onder `1060`.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 1 |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts`, 1 beheerrollen |
| Op | alle apps, behalve Microsoft Intune (`0000000a-0000-0000-c000-000000000000`) |
| Voorwaarden | geen — alleen wie, op welke app |
| Eis | `Multifactor authentication` |
| Bestand | [`CA__2050__GRANT__MFA_for_All_Users.json`](CA__2050__GRANT__MFA_for_All_Users.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Let op

- Serviceaccounts zijn uitgesloten; `1060` moet aan staan om ze tot vertrouwde IP-adressen te beperken.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie<br>A.5.15 Toegangsbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 6.3 Require MFA for Externally-Exposed Applications<br>6.4 Require MFA for Remote Network Access |
| NIST CSF 2.0 | PR.AA-01<br>PR.AA-03 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
