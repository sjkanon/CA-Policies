**Nederlands** · [English](README.en.md) · [Français](README.fr.md)

# cipp/

De uitrolkant: wat CIPP nodig heeft om de templates uit [`CATemplate/`](../CATemplate/README.md)
als baseline uit te rollen. **Gegenereerd** door `scripts/export-cipp-baseline.js` — niet met de
hand bewerken. Na elke wijziging in `CATemplate/` opent `.github/workflows/generate-cipp.yml` een PR
met de nieuwe versie.

| Bestand | Wat erin staat |
|---|---|
| [`ca-templates-import.json`](ca-templates-import.json) | de 44 templates in CIPP's CATemplate-tabelvorm, GUID ongewijzigd, zonder tenant-specifieke waarden (IP-ranges en landen eruit) |
| [`baseline-stages.json`](baseline-stages.json) | per template de stage, de state en de actie (Report of Remediate), plus welke templates op Report vastzitten tot hun randvoorwaarde in de tenant staat |

## De stages

| Stage | Criterium | Uitgerold als | Aantal |
|---|---|---|---:|
| 1 — Kern | `state: enabled` in het template, niet optioneel | `enabled` | 17 |
| 2 — Aanscherping | `disabled` of report-only in het template | report-only | 12 |
| 3 — Tenantkeuze en licentie | `optional: true` in [`_manifest.json`](../CATemplate/_manifest.json) | report-only, blijft op Report | 15 |

Welk template in welke stage zit staat per template in de [`CATemplate/`-README](../CATemplate/README.md).
`1040`, `1060` en `1180` blijven hoe dan ook op Report: hun randvoorwaarde (landen, IP-ranges,
Global Secure Access) kan niet uit deze repo komen.

## Alles staat op Report

Wat in git staat staat volledig op `Report`; een test bewaakt dat. Stage 1 op `Remediate` is een
besluit per tenant, ná `New-CaPrerequisites.ps1`:

```bash
node scripts/export-cipp-baseline.js --remediate-stage1
```

Die vlag weigert zolang er templates nieuw in stage 1 staan ten opzichte van de vorige export;
`--accept-new` bevestigt ze. Commit het resultaat niet terug.

`baseline-stages.json` is ons eigen formaat, niet het schema van CIPP's Baselines-scherm — dat is
versiegebonden. Wie de baseline in CIPP opbouwt, neemt deze lijst over. Zie de
[hoofd-README](../README.md#uitrollen-via-cipp).
