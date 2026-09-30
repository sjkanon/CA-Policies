[Nederlands](README.md) · **English** · [Français](README.fr.md)

# cipp/

The deployment side: what CIPP needs to roll out the templates from [`CATemplate/`](../CATemplate/README.en.md)
as a baseline. **Generated** by `scripts/export-cipp-baseline.js` — do not edit by hand. After every
change in `CATemplate/`, `.github/workflows/generate-cipp.yml` opens a PR with the new version.

| File | What it contains |
|---|---|
| [`ca-templates-import.json`](ca-templates-import.json) | the 44 templates in CIPP's CATemplate table format, GUID unchanged, without tenant-specific values (IP ranges and countries removed) |
| [`baseline-stages.json`](baseline-stages.json) | per template the stage, the state and the action (Report or Remediate), plus which templates are pinned to Report until their prerequisite exists in the tenant |

## The stages

| Stage | Criterion | Deployed as | Count |
|---|---|---|---:|
| 1 — Core | `state: enabled` in the template, not optional | `enabled` | 17 |
| 2 — Tightening | `disabled` or report-only in the template | report-only | 12 |
| 3 — Tenant choice and licence | `optional: true` in [`_manifest.json`](../CATemplate/_manifest.json) | report-only, stays on Report | 15 |

Which template is in which stage is listed per template in the [`CATemplate/` README](../CATemplate/README.en.md).
`1040`, `1060` and `1180` stay on Report regardless: their prerequisite (countries, IP ranges,
Global Secure Access) cannot come from this repo.

## Everything is on Report

What is in git is entirely on `Report`; a test guards that. Stage 1 on `Remediate` is a decision
per tenant, after `New-CaPrerequisites.ps1`:

```bash
node scripts/export-cipp-baseline.js --remediate-stage1
```

That flag refuses while templates are new in stage 1 compared with the previous export;
`--accept-new` confirms them. Do not commit the result back.

`baseline-stages.json` is our own format, not the schema of CIPP's Baselines screen — that one is
version-bound. Whoever builds the baseline in CIPP takes this list over. See the
[main README](../README.en.md#deploying-via-cipp).
