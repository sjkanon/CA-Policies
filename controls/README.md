**Nederlands** · [English](README.en.md) · [Français](README.fr.md)

# controls/

[`ca-controls.json`](ca-controls.json) zegt per template in [`CATemplate/`](../CATemplate/README.md)
welke controls hij technisch invult, in vier kaders:

| Sleutel | Kader |
|---|---|
| `iso` | ISO/IEC 27001:2022 Annex A |
| `nis2` | richtlijn (EU) 2022/2555, art. 21 lid 2 |
| `cis` | CIS Controls v8.1 |
| `nistcsf` | NIST CSF 2.0 |

Elke sleutel is een bestandsnaam uit `CATemplate/` zonder `.json`. Een template hernoemen zonder de
sleutel mee te nemen breekt de koppeling; `check-controls.js` vangt dat af.

## Waar het naartoe gaat

Dit bestand is geen document op zichzelf. Het voedt `COMPLIANCE.md` in de IntuneBackup-repo
(gespiegeld als CIPP-Templates-Intune), die de Intune- en de CA-kant in één matrix zet:

```bash
cd ../IntuneBackup
node scripts/generate-compliance.js --strict --ca ../CA-Policies/controls/ca-controls.json
```

De labels moeten letterlijk overeenkomen met de vocabulaire in `IntuneTemplate/_controls.json` van
die repo. De fase komt niet uit dit bestand maar uit `state` in het template: een policy in
report-only telt niet als afgedekt.

## Wat dit bewaakt

| | Doet |
|---|---|
| `node scripts/check-controls.js` | elk template heeft een mapping, geen mapping noemt een template dat niet bestaat. Staat de Intune-repo ernaast (`../IntuneBackup` of `../CIPP-Templates-Intune`), dan toetst hij ook de labels. Blokkerend in CI |
| `node --test scripts/check-controls.test.js` | dezelfde controles, plus: elke policy vult alle vier de kaders |

Een nieuw template zonder regel hier laat CI falen. Dat is opzet: een CA-policy zonder
verantwoording is voor een auditor een policy die er niet is.
