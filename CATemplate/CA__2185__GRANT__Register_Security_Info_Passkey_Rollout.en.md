<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__2185__GRANT__Register_Security_Info_Passkey_Rollout.md) · **English** · [Français](CA__2185__GRANT__Register_Security_Info_Passkey_Rollout.fr.md)

# CA - 2185 - GRANT - Register Security Info Passkey Rollout

Requires the `Passkey Rollout` strength for the rollout group `CA-Rollout-Phishing-MFA` when registering security info, and signing in again every seven days. With both this and `2180` on, only a TAP still qualifies.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 3* |
| Who | `CA-Rollout-Phishing-MFA` |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| On | register security info |
| Conditions | none — only who, on which app |
| Requirement | `Passkey Rollout` + sign in every 7 days |
| File | [`CA__2185__GRANT__Register_Security_Info_Passkey_Rollout.json`](CA__2185__GRANT__Register_Security_Info_Passkey_Rollout.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

> **Optional** — hoort bij de passkey-uitrol per groep (2125) en vraagt de custom authentication strength 'Passkey Rollout', waarvan het id per tenant wordt vervangen. Naast 2180 op enabled wint de strengste: registreren kan dan alleen met een eenmalige TAP.

## Watch out

- The strength id in the template is a placeholder (zero GUID); on deployment the id of the created strength must go in.
- SMS and voice are not in `Passkey Rollout`, because `authentication-methods/` turns them off.

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
