<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__2185__GRANT__Register_Security_Info_Passkey_Rollout.en.md) · [Français](CXNM__STANDARD__2185__GRANT__Register_Security_Info_Passkey_Rollout.fr.md)

# CXNM - STANDARD - 2185 - GRANT - Register Security Info Passkey Rollout

Eist voor de uitrolgroep `CA-Rollout-Phishing-MFA` de strength `Passkey Rollout` bij het registreren van beveiligingsinfo, en elke zeven dagen opnieuw aanmelden. Staan zowel deze als `2180` aan, dan voldoet alleen nog een TAP.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 3* |
| Voor wie | `CA-Rollout-Phishing-MFA` |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| Op | beveiligingsinfo registreren |
| Voorwaarden | geen — alleen wie, op welke app |
| Eis | `Passkey Rollout` + aanmelden elke 7 dagen |
| Bestand | [`CXNM__STANDARD__2185__GRANT__Register_Security_Info_Passkey_Rollout.json`](CXNM__STANDARD__2185__GRANT__Register_Security_Info_Passkey_Rollout.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

> **Optioneel** — hoort bij de passkey-uitrol per groep (2125) en vraagt de custom authentication strength 'Passkey Rollout', waarvan het id per tenant wordt vervangen. Naast 2180 op enabled wint de strengste: registreren kan dan alleen met een eenmalige TAP.

## Let op

- Het strength-id in het template is een placeholder (nul-GUID); bij uitrol moet het id van de aangemaakte strength erin.
- SMS en spraak zitten niet in `Passkey Rollout`, omdat `authentication-methods/` ze uitzet.

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
