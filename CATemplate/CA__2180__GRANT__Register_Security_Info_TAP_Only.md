<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CA__2180__GRANT__Register_Security_Info_TAP_Only.en.md) · [Français](CA__2180__GRANT__Register_Security_Info_TAP_Only.fr.md)

# CA - 2180 - GRANT - Register Security Info TAP Only

Laat beveiligingsinfo (MFA-methodes, passkeys) alleen registreren met een Temporary Access Pass. Een overgenomen sessie kan er dan geen eigen methode bij zetten. Report-only: vraagt een TAP-proces bij de servicedesk.

| | |
|---|---|
| Type | GRANT |
| State | report-only |
| Stage | 3* |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Op | beveiligingsinfo registreren |
| Voorwaarden | geen — alleen wie, op welke app |
| Eis | `Temporary Access Pass only` |
| Bestand | [`CA__2180__GRANT__Register_Security_Info_TAP_Only.json`](CA__2180__GRANT__Register_Security_Info_TAP_Only.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

> **Optioneel** — vraagt een custom authentication strength ('Temporary Access Pass only') die per tenant wordt aangemaakt: Entra kent daar zelf een id aan toe, dus het id in het template is een placeholder die bij de uitrol per tenant wordt vervangen. En het is een procesbesluit — zonder helpdesk die TAPs uitgeeft en de aanvrager verifieert kan niemand nog zelf een methode registreren, ook niet zijn eerste.

## Let op

- Het strength-id in het template is een placeholder (nul-GUID); bij uitrol moet het id van de aangemaakte strength erin. Controleer ook dat CIPP de custom strength meestuurt, anders rolt een lege policy uit.
- Verlegt het aanvalsoppervlak naar de servicedesk: zonder identiteitsverificatie bij de TAP-aanvraag is de winst kleiner dan hij lijkt.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.5.16 Identiteitsbeheer |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 6.1 Establish an Access Granting Process |
| NIST CSF 2.0 | PR.AA-02<br>PR.AA-01 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
