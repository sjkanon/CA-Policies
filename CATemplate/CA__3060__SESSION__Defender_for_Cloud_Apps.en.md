<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CA__3060__SESSION__Defender_for_Cloud_Apps.md) · **English** · [Français](CA__3060__SESSION__Defender_for_Cloud_Apps.fr.md)

# CA - 3060 - SESSION - Defender for Cloud Apps

Routes browser sessions through Defender for Cloud Apps, in monitor-only. Requires a Defender for Cloud Apps licence.

| | |
|---|---|
| Type | SESSION |
| State | enabled |
| Stage | 3* |
| Who | everyone |
| Excluded | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, `Conditional Access Service Accounts` |
| On | all apps |
| Conditions | Clients: browser |
| Requirement | Defender for Cloud Apps |
| File | [`CA__3060__SESSION__Defender_for_Cloud_Apps.json`](CA__3060__SESSION__Defender_for_Cloud_Apps.json) |

Groups, named locations and authentication strengths in the table must exist in the tenant: see [`prerequisites/`](../prerequisites/README.en.md). An exclusion group that does not exist excludes nobody.

> **Optional** — sessiecontrole via Defender for Cloud Apps vereist een MDCA-licentie.

## Watch out

- Without a Defender for Cloud Apps licence the session control cannot be selected and the policy does nothing.

## Touches Intune

No Intune policy this policy depends on.

## Standards

| Framework | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.16 Monitoringactiviteiten<br>A.8.15 Logging<br>A.5.23 Informatiebeveiliging voor het gebruik van clouddiensten |
| NIS2 art. 21(2) | art. 21(2)(b) incidentbehandeling<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 8.2 Collect Audit Logs<br>13.1 Centralize Security Event Alerting |
| NIST CSF 2.0 | DE.CM-09<br>DE.CM-03 |

From [`controls/ca-controls.json`](../controls/README.en.md); the labels are kept in Dutch, as in the vocabulary. What this means per standard and what is needed organisationally: [COMPLIANCE.en.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.en.md) in the IntuneBackup repo.

---

Back to the [overview](README.en.md) · [main README](../README.en.md)
