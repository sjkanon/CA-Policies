<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](CA__2020__GRANT__MediumRisk_Users.en.md) · [Français](CA__2020__GRANT__MediumRisk_Users.fr.md)

# CA - 2020 - GRANT - Medium-Risk Users

Laat een gebruiker die Entra ID Protection als gemiddeld risico inschat het risico zelf oplossen (Require risk remediation): na MFA een veilige wachtwoordwijziging, of zonder wachtwoord het intrekken van alle sessies en opnieuw aanmelden. Daarna is het risico weg; met alleen MFA bleef het staan en kwam de vraag bij elke aanmelding terug. Vraagt Entra ID P2.

| | |
|---|---|
| Type | GRANT |
| State | enabled |
| Stage | 1 |
| Voor wie | iedereen |
| Uitgesloten | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass`, gasten |
| Op | alle apps |
| Voorwaarden | Gebruikersrisico: medium |
| Eis | riskRemediation + `Multifactor authentication` + elke keer opnieuw aanmelden |
| Bestand | [`CA__2020__GRANT__MediumRisk_Users.json`](CA__2020__GRANT__MediumRisk_Users.json) |

Groepen, named locations en authentication strengths in de tabel moeten in de tenant bestaan: zie [`prerequisites/`](../prerequisites/README.md). Een uitsluitingsgroep die niet bestaat sluit niemand uit.

## Let op

- B2B-gasten vallen erbuiten. Hun gebruikersrisico wordt in hun eigen tenant bepaald en kan hier niet worden opgelost; met deze eis zouden ze geblokkeerd raken (Microsoft Learn, ID Protection for B2B users). Het aanmeldrisico (1090, 2010) geldt wel voor hen.
- Met wachtwoord: de wachtwoordwijziging gaat naar on-premises AD alleen met password writeback. Zonder writeback in een hybride tenant kan een gebruiker het risico niet zelf oplossen.

## Raakt Intune

Geen Intune-policy waar deze policy van afhangt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.5 Veilige authenticatie<br>A.5.17 Authenticatie-informatie<br>A.8.16 Monitoringactiviteiten |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(b) incidentbehandeling |
| CIS Controls v8.1 | 6.3 Require MFA for Externally-Exposed Applications |
| NIST CSF 2.0 | PR.AA-03<br>DE.CM-03 |

Uit [`controls/ca-controls.json`](../controls/README.md). Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.md) in de IntuneBackup-repo.

---

Terug naar het [overzicht](README.md) · [hoofd-README](../README.md)
