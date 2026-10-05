<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__1110__BLOCK__Unlicensed_Users.md) · **English** · [Français](CA__1110__BLOCK__Unlicensed_Users.fr.md)

# CA - 1110 - BLOCK - Unlicensed Users

Blocks users who are not in `Licensed Users`, so that an account without a licence — a forgotten test account, a shared mailbox with a password — cannot sign in.

| | |
|---|---|
| Type | BLOCK |
| State | enabled |
| Stage | 1 |
| Who | everyone |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts`, `Licensed Users` |
| On | all apps |
| Conditions | none — only who, on which app |
| Requirement | block |
| File | [`CA__1110__BLOCK__Unlicensed_Users.json`](CA__1110__BLOCK__Unlicensed_Users.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

## Watch out

- `Licensed Users` must contain everyone with a licence — in practice a dynamic group. Anyone missing from it is locked out.

## Touches Intune

No Intune policy this policy depends on.

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.16 Identiteitsbeheer<br>A.5.18 Toegangsrechten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 5.1 Establish and Maintain an Inventory of Accounts<br>5.3 Disable Dormant Accounts |
| NIST CSF 2.0 | PR.AA-01<br>PR.AA-05 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
