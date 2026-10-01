<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CXNM__STANDARD__1180__BLOCK__Agent_Users_Outside_Compliant_Network.en.md) · [Français](CXNM__STANDARD__1180__BLOCK__Agent_Users_Outside_Compliant_Network.fr.md)

# CXNM - STANDARD - 1180 - BLOCK - Agent Users Outside Compliant Network

Blokkeert agent-users buiten een compliant netwerk van Global Secure Access. Report-only; vraagt Microsoft Entra Agent ID en Global Secure Access.

| | |
|---|---|
| Type | BLOCK |
| State | report-only |
| Stage | 3* (vast op Report) |
| Voor wie | agent- en workload-identiteiten |
| Uitgesloten | — |
| Op | agent-resources |
| Voorwaarden | Locatie: alle locaties, behalve `All Compliant Network locations` |
| Eis | blokkeren |
| Bestand | [`CXNM__STANDARD__1180__BLOCK__Agent_Users_Outside_Compliant_Network.json`](CXNM__STANDARD__1180__BLOCK__Agent_Users_Outside_Compliant_Network.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

> **Optioneel** — vraagt Microsoft Entra Agent ID én Global Secure Access: de named location 'All Compliant Network locations' bestaat alleen in een tenant met GSA. Report-only tot beide er zijn.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.20 Netwerkbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.IR-01<br>PR.AA-05 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
