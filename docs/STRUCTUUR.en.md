[Nederlands](STRUCTUUR.md) · **English** · [Français](STRUCTUUR.fr.md)

# Structure and connections

How this repo fits together and what it is connected to: what the source is, what is generated
from it, which systems read it and how it ends up in a tenant. For the *why* per
template: [ANALYSE.en.md](ANALYSE.en.md).

## In short

- **One source:** `CATemplate/` — 44 Conditional Access policies in CIPP template format:
  18 BLOCK, 16 GRANT, 7 SESSION.
- **One derivative:** `cipp/` — the templates as an import file and the layout in three stages for
  a CIPP baseline.
- **Three folders next to it** with what a CA policy needs but is not itself: the
  prerequisites in the tenant, the authentication methods policy and the standards mapping.
- **Two routes to the tenant:** CIPP deploys the policies; the prerequisites and the
  sign-in methods go through our own PowerShell scripts via Microsoft Graph.
- **One sister repo:** the IntuneBackup repo, cloned next to this one as `../IntuneBackup`, reads
  `controls/ca-controls.json` for its `COMPLIANCE.md` and `docs/policies.json` for the link back
  at every Intune policy, and supplies the vocabulary of the standards labels.
- **Nothing that is generated gets edited by hand.** A GitHub workflow regenerates
  `cipp/` after every change and opens a PR for it.

## How it fits together

```mermaid
flowchart LR
  T["<b>CATemplate/</b><br/>44 templates · _manifest.json"]
  P["prerequisites/<br/>ca-prerequisites.json"]
  A["authentication-methods/<br/>authentication-methods.json"]
  C["controls/<br/>ca-controls.json"]

  T -->|export-cipp-baseline.js| X["cipp/<br/>ca-templates-import.json<br/>baseline-stages.json"]
  P -.->|prerequisites.js| X
  X -.->|import · Baselines| CIPP["CIPP"]
  CIPP -->|Conditional Access Template| TEN[("Entra tenant")]
  P -->|New-CaPrerequisites.ps1| TEN
  A -->|Set-EntraAuthenticationMethods.ps1| TEN
  A -.->|Test-EntraPasskeyReadiness.ps1| TEN

  C -.->|--ca| IB["IntuneBackup repo<br/>COMPLIANCE.md"]
  IB -.->|_controls.json| C

  style T stroke-width:3px
```

Solid arrows write; dotted lines only read.

## Folders

| Folder | What it holds | Made by | Picked up by |
|---|---|---|---|
| [`CATemplate/`](../CATemplate/README.en.md) | The policies, one `CA__<number>__<BLOCK\|GRANT\|SESSION>__<Name>.json` each, plus `_manifest.json` | hand (export from CIPP) | all scripts, IntuneBackup's `generate-compliance.js` |
| [`cipp/`](../cipp/README.en.md) | Import file and stage layout for a CIPP baseline | `export-cipp-baseline.js` | CIPP (manual import) |
| [`prerequisites/`](../prerequisites/README.en.md) | Groups, named locations, custom authentication strengths and authentication contexts that templates refer to | hand | `prerequisites.js`, `export-cipp-baseline.js`, `New-CaPrerequisites.ps1` |
| [`authentication-methods/`](../authentication-methods/README.en.md) | Desired state of the authentication methods policy, with passkey profiles | hand | `authentication-methods.js`, the two Entra scripts |
| [`controls/`](../controls/README.en.md) | Standards mapping per template (ISO 27001, NIS2, CIS, NIST CSF) | hand | `check-controls.js`, IntuneBackup's `generate-compliance.js` |
| `docs/` | Documentation: this structure and the analysis, plus `policies.json` — per template the purpose, the pitfalls and the Intune dependencies | hand | readers; `policies.json` by `generate-docs.js` here and there |
| [`scripts/`](../scripts/README.en.md) | Validation, export, tenant scripts, mirror | hand | GitHub workflow |
| `local/` | Working copies with tenant-specific values | hand | **not in git** (`.gitignore`) |

## The files that drive everything

| File | Determines | Read by |
|---|---|---|
| `state` (field in every template) | Stage 1 (`enabled`) or stage 2 (`disabled`, report-only); also the phase in COMPLIANCE.md | `export-cipp-baseline.js`, `authentication-methods.js`, IntuneBackup's `generate-compliance.js` |
| `CATemplate/_manifest.json` | Which templates are optional (stage 3), with the reason | `export-cipp-baseline.js` |
| `CATemplate/_organisation.json` | The prefix of the policies (`CA - `, file name `CA__`) | every script via `scripts/lib/organisation.js`; change it with `set-organisation.js` |
| `prerequisites/ca-prerequisites.json` | What must exist in the tenant before deployment, and how dangerous it is if it is missing | `prerequisites.js`, `export-cipp-baseline.js`, `New-CaPrerequisites.ps1` |
| `controls/ca-controls.json` | Which standards labels each template fulfils | `check-controls.js`, `generate-docs.js`, IntuneBackup's `generate-compliance.js` |
| `docs/policies.json` | What each template does, what to watch out for, and which Intune policies it depends on | `generate-docs.js`, IntuneBackup's `generate-docs.js` |
| `authentication-methods/authentication-methods.json` | Which sign-in methods are enabled or disabled, in which order, and the passkey profiles | `authentication-methods.js`, `Set-EntraAuthenticationMethods.ps1`, `Test-EntraPasskeyReadiness.ps1` |

`_manifest.json` sits in `CATemplate/` like the `_` files in IntuneBackup's
`IntuneTemplate/`: next to the templates it describes. The scripts only read
`CA__*.json` as a template, and to CIPP it is a `.json` without `displayName` — no
policy comes out of it (see [below](#what-cipp-does-with-this-repo)).

## Stages

`export-cipp-baseline.js` assigns each template to one stage; the criteria are defined once, in
`STAGE_PLAN` in that script.

| Stage | Criterion | Templates | Deployed as | Action |
|---:|---|---:|---|---|
| 1 — Core | `state: enabled`, not optional | 17 | `enabled` | Report; Remediate with `--remediate-stage1` |
| 2 — Tightening | `disabled` or report-only in the template | 12 | report-only | Report |
| 3 — Tenant choice and licence | `optional: true` in `_manifest.json` | 12 | report-only | Report |

Three templates are fixed on Report until their prerequisite is in the tenant: `1040` (countries),
`1060` (IP ranges) and `1180` (Global Secure Access).

## Scripts and order

| Step | Script | Reads | Writes |
|---:|---|---|---|
| 1 | `prerequisites.js` | `CATemplate/`, `prerequisites/`, `authentication-methods/` | nothing — fails on errors |
| 2 | `check-controls.js` | `CATemplate/`, `controls/`, `../IntuneBackup/` (or `../CIPP-Templates-Intune/`) `IntuneTemplate/_controls.json` if present | nothing — fails on errors |
| 3 | `authentication-methods.js` | `authentication-methods/`, `CATemplate/` | nothing — fails on errors |
| 4 | `export-cipp-baseline.js` | `CATemplate/`, `_manifest.json`, `prerequisites/`, the previous `cipp/baseline-stages.json` | `cipp/` |
| 5 | `generate-docs.js` | `CATemplate/`, `_manifest.json`, `cipp/baseline-stages.json`, `docs/policies.json`, `controls/ca-controls.json`; the Intune paths against `../IntuneBackup/` if present | `CATemplate/README*.md` and a README per policy |
| 6 | `node --test scripts/*.test.js` | everything above, plus `cipp/` | nothing — fails on errors |
| – | `New-CaPrerequisites.ps1` | `prerequisites/` | groups, locations and strengths in the tenant |
| – | `Set-EntraAuthenticationMethods.ps1` | `authentication-methods/` | the authentication methods policy in the tenant (with `-Apply`) |
| – | `Test-EntraPasskeyReadiness.ps1` | `authentication-methods/` | nothing — only a report |
| – | `set-organisation.js` | `CATemplate/_organisation.json`, every text file | a different prefix in text and file names, then `cipp/` and the docs |
| – | `sync-mirror.js` | `git ls-files` | a second clone |

Steps 1 to 6 are run by [`.github/workflows/generate-cipp.yml`](../.github/workflows/generate-cipp.yml)
after every change. Details: [scripts/README.en.md](../scripts/README.en.md).

## External connections

| System | Direction | How | Watch out |
|---|---|---|---|
| IntuneBackup repo (`../IntuneBackup`, mirror `../CIPP-Templates-Intune`) | CA → Intune | `generate-compliance.js --ca ../CA-Policies/controls/ca-controls.json` there | Git there holds the `--no-ca` version; CI does not see this repo |
| IntuneBackup repo (`../IntuneBackup`, mirror `../CIPP-Templates-Intune`) | Intune → CA | `check-controls.js` reads `IntuneTemplate/_controls.json` | Local only; in CI it skips the label check |
| IntuneBackup repo | CA ↔ Intune per policy | `generate-docs.js` here links to the Intune policies; `generate-docs.js` there reads `docs/policies.json` and shows at every Intune policy which CA policies rely on it | Links go to the mirror on GitHub (ConXioN-ITCE). A copy is kept there in `IntuneTemplate/_ca.json`, for CI without this repo |
| CIPP | repo → CIPP | import `cipp/ca-templates-import.json`, build the baseline according to `cipp/baseline-stages.json` | The baseline in CIPP is a copy that is updated by hand |
| Microsoft Graph | repo → tenant | `New-CaPrerequisites.ps1`, `Set-EntraAuthenticationMethods.ps1` | `-WhatIf` first; the id of a custom strength goes into the CIPP deployment by hand |
| GitHub Actions | repo → repo | `generate-cipp.yml` opens a PR | the only workflow |
| Mirror clone | repo → mirror | `sync-mirror.js <target-dir> --push` | its own history on that side, no force push; run it *after* the pipeline. The mirror keeps its own prefix (`set-organisation.js` there) |

### What CIPP does with this repo

- **If the repo is linked in CIPP as a template repository,** the sync fetches every `.json`
  (except paths with `NativeImport`). The templates in `CATemplate/` then become Conditional
  Access templates.
- **Every other `.json` without `displayName`** — `_manifest.json`, `prerequisites/`, `controls/`,
  `authentication-methods/`, `docs/policies.json` — becomes at most one nameless template row. It does nothing and can be
  removed in CIPP; that is the same trade-off as with the `_` files in IntuneBackup's
  `IntuneTemplate/`.

## Conventions

- **Naming:** `CA - <number> - <BLOCK|GRANT|SESSION> - <Description>` in the tenant,
  `CA__<number>__<TYPE>__<Name>.json` as a file. The keys in `_manifest.json` and
  `ca-controls.json` are that file name without `.json`.
- **GUIDs stay the same**: the GUID identifies the CIPP template row; a new GUID results in
  a second template with the same name.
- **Nothing tenant-specific in a template.** Countries, IP ranges and the id of a custom
  authentication strength come in per tenant via `New-CaPrerequisites.ps1`; the export strips
  whatever is in there anyway, and the tests fail on it.
- **Report unless someone decides.** What is in git is entirely Report; Remediate is a
  per-tenant decision, *after* `New-CaPrerequisites.ps1`.
- **Generated, do not edit by hand:** `cipp/`.

## Further reading

| Document | For |
|---|---|
| [README.en.md](../README.en.md) | Full explanation: adding, deploying, prerequisites, standards |
| [ANALYSE.en.md](ANALYSE.en.md) | Why things are or are not in the set |
| [scripts/README.en.md](../scripts/README.en.md) | Every script, and the order |
| [CATemplate/README.en.md](../CATemplate/README.en.md) | Every policy: who, what, state and stage, with a link to the README per policy (generated) |
| [prerequisites/README.en.md](../prerequisites/README.en.md) | Groups, locations and strengths a tenant needs |
| [controls/README.en.md](../controls/README.en.md) | The standards mapping and where it goes |
| [cipp/README.en.md](../cipp/README.en.md) | The deployment files and the stages |
| [authentication-methods/README.en.md](../authentication-methods/README.en.md) | Sign-in methods and passkeys |
