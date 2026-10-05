<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__1100__BLOCK__HighRisk_Users.md) · **English** · [Français](CA__1100__BLOCK__HighRisk_Users.fr.md)

# CA - 1100 - BLOCK - High-Risk Users

Blocks a user that Entra ID Protection rates as high risk, until the risk has been remediated. Requires Entra ID P2.

| | |
|---|---|
| Type | BLOCK |
| State | disabled |
| Stage | 2 |
| Who | everyone |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| On | all apps |
| Conditions | User risk: high |
| Requirement | block |
| File | [`CA__1100__BLOCK__HighRisk_Users.json`](CA__1100__BLOCK__HighRisk_Users.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

## Touches Intune

No Intune policy this policy depends on.

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.16 Monitoringactiviteiten<br>A.5.25 Beoordelen van en besluiten over informatiebeveiligingsgebeurtenissen |
| NIS2 art. 21(2) | art. 21(2)(b) incidentbehandeling<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 13.1 Centralize Security Event Alerting |
| NIST CSF 2.0 | DE.CM-03<br>RS.MI-01 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
