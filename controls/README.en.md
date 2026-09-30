[Nederlands](README.md) · **English** · [Français](README.fr.md)

# controls/

[`ca-controls.json`](ca-controls.json) states, per template in [`CATemplate/`](../CATemplate/README.en.md),
which controls it technically fulfils, in four frameworks:

| Key | Framework |
|---|---|
| `iso` | ISO/IEC 27001:2022 Annex A |
| `nis2` | Directive (EU) 2022/2555, art. 21(2) |
| `cis` | CIS Controls v8.1 |
| `nistcsf` | NIST CSF 2.0 |

Each key is a file name from `CATemplate/` without `.json`. Renaming a template without taking the
key along breaks the link; `check-controls.js` catches that.

## Where it goes

This file is not a document in itself. It feeds `COMPLIANCE.md` in the IntuneBackup repo
(mirrored as CIPP-Templates-Intune), which puts the Intune and the CA side in one matrix:

```bash
cd ../IntuneBackup
node scripts/generate-compliance.js --strict --ca ../CA-Policies/controls/ca-controls.json
```

The labels must match the vocabulary in that repo's `IntuneTemplate/_controls.json` literally.
The phase does not come from this file but from `state` in the template: a policy in report-only
does not count as covered.

## What guards it

| | Does |
|---|---|
| `node scripts/check-controls.js` | every template has a mapping, no mapping names a template that does not exist. If the Intune repo sits next to this one (`../IntuneBackup` or `../CIPP-Templates-Intune`), it checks the labels too. Blocking in CI |
| `node --test scripts/check-controls.test.js` | the same checks, plus: every policy fills all four frameworks |

A new template without an entry here makes CI fail. That is deliberate: to an auditor, a CA
policy without accountability is a policy that does not exist.
