<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2180__GRANT__Register_Security_Info_TAP_Only.md) · **English** · [Français](CA__2180__GRANT__Register_Security_Info_TAP_Only.fr.md)

# CA - 2180 - GRANT - Register Security Info TAP Only

Only allows members of `SG-U-IAM-Register-TAP-Key` to register security info (MFA methods, passkeys) with a Temporary Access Pass. A hijacked session can then not add its own method. Report-only: requires a TAP process at the service desk.

| | |
|---|---|
| Type | GRANT |
| State | report-only |
| Stage | 3* |
| Who | `SG-U-IAM-Register-TAP-Key` |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `SG-U-CA-Onboarding-Passkey` |
| On | register security info |
| Conditions | none — only who, on which app |
| Requirement | `Temporary Access Pass only` |
| File | [`CA__2180__GRANT__Register_Security_Info_TAP_Only.json`](CA__2180__GRANT__Register_Security_Info_TAP_Only.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

> **Optional** — vraagt een custom authentication strength ('Temporary Access Pass only') die per tenant wordt aangemaakt: Entra kent daar zelf een id aan toe, dus het id in het template is een placeholder die bij de uitrol per tenant wordt vervangen. En het is een procesbesluit — zonder helpdesk die TAPs uitgeeft en de aanvrager verifieert kan niemand in 'SG-U-IAM-Register-TAP-Key' nog zelf een methode registreren, ook niet zijn eerste.

## Watch out

- `SG-U-CA-Onboarding-Passkey` is excluded. Grant controls of separate policies add up: without that exclusion only a TAP satisfies a member of both groups, and they cannot register with their own MFA via `2185`.
- The strength id in the template is a placeholder (zero GUID); on deployment the id of the created strength must go in. Also check that CIPP sends the custom strength, or an empty policy is deployed.
- Moves the attack surface to the service desk: without identity verification when a TAP is requested, the gain is smaller than it looks.

## Touches Intune

No Intune policy this policy depends on.

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.5.16 Identiteitsbeheer |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 6.1 Establish an Access Granting Process |
| NIST CSF 2.0 | PR.AA-02<br>PR.AA-01 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
