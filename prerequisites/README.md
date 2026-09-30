**Nederlands** · [English](README.en.md) · [Français](README.fr.md)

# prerequisites/

[`ca-prerequisites.json`](ca-prerequisites.json) beschrijft wat een tenant moet hebben vóór de
templates in [`CATemplate/`](../CATemplate/README.md) iets goeds doen: de groepen, named
locations en custom authentication strengths waar ze naar verwijzen.

**Waarom dit apart staat.** Een template verwijst naar een groep of locatie op naam; bestaat die
niet, dan faalt dat de verkeerde kant op. Een uitzonderingsgroep die er niet is sluit niemand
uit, dus de policy wordt strenger dan bedoeld en niets slaat alarm. Een custom strength die er
niet is maakt de grant onvoorspelbaar.

| Soort | Aantal | Aangemaakt door |
|---|---:|---|
| Groepen | 12 (11 voor CA, 1 voor [`authentication-methods/`](../authentication-methods/README.md)) | `New-CaPrerequisites.ps1` |
| Named locations | 4 | `New-CaPrerequisites.ps1`, behalve *All Compliant Network locations* (die levert Entra bij Global Secure Access) |
| Custom authentication strengths | 3 | `New-CaPrerequisites.ps1`, inclusief een AAGUID-beperking |
| Authentication contexts | 0 | — een keuze per tenant, geen baseline |

## Wat elke regel vastlegt

| Veld | Betekenis |
|---|---|
| `purpose` | waarvoor hij dient, voor wie deze repo leest (Nederlands) |
| `description` | wat in de tenant als omschrijving op het object komt (Engels) |
| `danger` / `dangerReason` | `low` tot `critical`: wat er misgaat als hij ontbreekt, leeg is of verkeerd staat |
| `requiresMembers` | de groep mag niet leeg zijn vóór stage 1 op Remediate gaat — de break-glass-groepen en `Licensed Users` |
| `tenantSpecific` | de waarde komt per tenant binnen (landen, IP-ranges, het id van een strength) en staat bewust niet in de templates |
| `placeholderId` | de nul-GUID die een template draagt in plaats van het echte strength-id |

Welke templates een groep gebruiken staat er bewust níet in: dat leidt de validator live af uit
`CATemplate/`, zodat er geen tweede lijst is die kan verouderen.

## Wat dit bewaakt

| | Doet |
|---|---|
| `node scripts/prerequisites.js` | faalt op elke verwijzing in een template zonder definitie hier, op een named location die in template en definitie verschilt, op een strength met andere combinaties of AAGUID's, en op een echt strength-id in een template. Blokkerend in CI; `export-cipp-baseline.js` roept hem ook aan |
| `./scripts/New-CaPrerequisites.ps1 -TenantId <tenant> -WhatIf` | toont wat hij in de tenant zou aanmaken |
| `./scripts/New-CaPrerequisites.ps1 -TenantId <tenant> -AllowedCountry … -ServiceAccountIpRange … -BreakGlassUserId … -RequireSafeToDeploy` | maakt het aan, idempotent, en sluit met een fout af zolang de kritieke groepen leeg zijn |

Het id van een aangemaakte custom strength meldt het script; dat moet met de hand in de
CIPP-uitrol in plaats van de nul-GUID. Zie de [hoofd-README](../README.md#eerst-de-randvoorwaarden-dan-pas-remediate).
