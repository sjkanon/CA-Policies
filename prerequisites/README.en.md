[Nederlands](README.md) · **English** · [Français](README.fr.md)

# prerequisites/

[`ca-prerequisites.json`](ca-prerequisites.json) describes what a tenant needs before the
templates in [`CATemplate/`](../CATemplate/README.en.md) do any good: the groups, named
locations and custom authentication strengths they refer to.

**Why this is separate.** A template refers to a group or location by name; if it does not
exist, that fails in the wrong direction. An exclusion group that is not there excludes nobody,
so the policy becomes stricter than intended and nothing raises an alarm. A custom strength that
is not there makes the grant unpredictable.

| Kind | Count | Created by |
|---|---:|---|
| Groups | 12 (11 for CA, 1 for [`authentication-methods/`](../authentication-methods/README.en.md)) | `New-CaPrerequisites.ps1` |
| Named locations | 4 | `New-CaPrerequisites.ps1`, except *All Compliant Network locations* (Entra provides it with Global Secure Access) |
| Custom authentication strengths | 3 | `New-CaPrerequisites.ps1`, including an AAGUID restriction |
| Authentication contexts | 0 | — a choice per tenant, not a baseline |

## What each entry records

| Field | Meaning |
|---|---|
| `purpose` | what it is for, for whoever reads this repo (Dutch) |
| `description` | what ends up as the object's description in the tenant (English) |
| `danger` / `dangerReason` | `low` to `critical`: what goes wrong if it is missing, empty or wrong |
| `requiresMembers` | the group must not be empty before stage 1 goes to Remediate — the break-glass groups and `Licensed Users` |
| `tenantSpecific` | the value comes in per tenant (countries, IP ranges, a strength's id) and is deliberately not in the templates |
| `placeholderId` | the zero GUID a template carries instead of the real strength id |

Which templates use a group is deliberately *not* recorded: the validator derives that live from
`CATemplate/`, so there is no second list that can go stale.

## What guards it

| | Does |
|---|---|
| `node scripts/prerequisites.js` | fails on every reference in a template without a definition here, on a named location that differs between template and definition, on a strength with other combinations or AAGUIDs, and on a real strength id in a template. Blocking in CI; `export-cipp-baseline.js` calls it too |
| `./scripts/New-CaPrerequisites.ps1 -TenantId <tenant> -WhatIf` | shows what it would create in the tenant |
| `./scripts/New-CaPrerequisites.ps1 -TenantId <tenant> -AllowedCountry … -ServiceAccountIpRange … -BreakGlassUserId … -RequireSafeToDeploy` | creates it, idempotently, and exits with an error while the critical groups are empty |

The script reports the id of a created custom strength; that has to go into the CIPP deployment
by hand, in place of the zero GUID. See the [main README](../README.en.md#prerequisites-first-only-then-remediate).
