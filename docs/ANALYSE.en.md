[Nederlands](ANALYSE.md) · **English** · [Français](ANALYSE.fr.md)

# Gap analysis — what the CA baseline is missing, and what needs to change

Hand-written. This records where the
33 templates come from, what they were tested against, and — more importantly — what is deliberately
**not** in them and why. Without that last part, the next round weighs the same policies
all over again.

Date: 3 September 2026. At that point the set had 33 templates. After the later rounds (below) there
are 41; the numbers in the rest of this document are those of the round they appear in and have
deliberately not been rewritten.

## The question

In August 2026 the Intune set was compared against IntuneAdmin (874 profiles, see
`docs/ANALYSE.md` in the IntuneBackup repo).
Something similar was done for CA, but the outcome lives elsewhere and has since gone
stale. This round answers two questions that were not part of it:

1. How does the set compare to the **normative** sources — MCSB, CIS Microsoft 365
   Foundations and Microsoft's own CA templates — rather than to community frameworks?
2. What is wrong with the set **as a whole**, regardless of which measures are in it?

That second question came up when the set was laid next to a real tenant (September
2026). It turned out that three properties of the set stand in the way of deployment, and no
policy comparison whatsoever would find them.

## What already existed

A gap report of 13 August 2026, generated outside this repo. That report compared the set
with three persona- or number-based frameworks:

| Framework | Policies | Covered then |
|---|---:|---:|
| Daniel Chronlund — CA policy design baseline | 21 | 20 (95%) |
| Kenneth van Surksum — CA baseline v2025-10 | 49 | 28 (57%) |
| Joey Verlinden — CA Framework 2026.6.1 | 36 | 24 (67%) |

It also recorded the origin, and that is still the most important piece of context in this
repo: **our numbering *is* Chronlund's baseline.** The range `1010`–`3040`, the split into
BLOCK/GRANT/SESSION and the naming pattern `GLOBAL - nnnn - ACTIE - Omschrijving` come straight
from his design. That explains why everything is called `GLOBAL__` while the other two
frameworks are persona-based — see *Why there are no personas* below.

**That report is stale.** It describes 20 templates; there are 33. And that is not a
backlog but the opposite: **every candidate it put forward has since been built.**

| Candidate list of 13 August | Now |
|---|---|
| MFA when registering/joining a device | `2080` |
| Guests only to approved apps (allow-list) | `1120` |
| MFA on admin portals for *all* users | `2100` |
| Condition on browser access from an unmanaged device | `2090` |
| Token protection | `2110` |
| Block accounts without a licence | `1110` |
| *optional* — sessions via Defender for Cloud Apps | `3060` |
| *optional* — managed identities at elevated risk | `1140` |
| *optional* — Cloud PC access from mobile | `2150` |
| *decision per tenant* — Terms of Use | no template — at the time a standalone check without deployment, dropped in September 2026 |
| *decision per tenant* — phishing-resistant MFA for everyone | `2120` |
| *decision per tenant* — admins only from a compliant device | `2130` |
| *decision per tenant* — admins not from untrusted locations | `1130` |
| *decision per tenant* — enforce CAE explicitly | `3050` |
| *not yet* — agent identities | **still not** — see below |

Fourteen of the fifteen handled; Terms of Use never became a template and has not appeared
anywhere since September 2026. The comparison with community frameworks is thereby
exhausted; whatever remains has to come from a different angle.

## Sources for this round

| Source | What it is | How it was used |
|---|---|---|
| [Microsoft cloud security benchmark — Identity Management](https://learn.microsoft.com/en-us/security/benchmark/azure/mcsb-identity-management) | IM-1 to IM-9; IM-7 lists seven CA use cases | all seven checked |
| [CIS Microsoft 365 Foundations Benchmark](https://www.cisecurity.org/benchmark/microsoft_365), section 5.2.2 | v4/v5 controls 1–12, plus the five that v7.0.0 added | the five new ones tested separately |
| [Microsoft's own CA templates](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-policy-common) | six categories, including the new **AI Agents** | compared per category |
| Comparison with a real tenant, September 2026 | 33 templates against 16 actual policies | produced the structural findings |

The frameworks of Chronlund, van Surksum and Verlinden were **not** run again; the
13 August report sufficed for that.

## Outcome in numbers

| | |
|---|---:|
| Templates | 33 |
| Of which `state: enabled` | 21 |
| Of which `state: disabled` | **11** |
| Of which report-only | **1** |
| MCSB IM-7 use cases covered | 7 of 7 |
| CIS 5.2.2 new in v7.0.0 covered | 3 of 5 (1 half) |
| Microsoft template categories covered | 5 of 6 |

## What we are missing

### Add

| Measure | Source | Why it clears the bar |
|---|---|---|
| **Periodic reauthentication for all users** | CIS 5.2.2.13 (L1); Microsoft *No persistent browser session* | We only set session lifetime for admins (`3010`) and BYOD (`3020`). A regular user on a managed device keeps their session indefinitely. That is exactly the token that gets stolen in AiTM and that `2110` only counters on Windows/Exchange/SharePoint. One new SESSION template, sign-in frequency at the tenant-wide value, `persistentBrowser` left alone (that belongs to unmanaged devices, not to all of them). |
| **Named locations as part of the repo** | CIS 5.2.2.14 (L2) | See *What is broken*, point 1. This is not a policy but a prerequisite, and its absence is the most dangerous of everything listed here. |

### Add (`optional`)

| Measure | Source | Licence | Why |
|---|---|---|---|
| **Insider risk** | Microsoft, Zero Trust category — *Block access for users with insider risk* | Microsoft Purview | `insiderRiskLevels` does not appear in any template. Our risk policies (`1090`/`1100`/`2010`/`2020`) look at sign-in signals; insider risk looks at behaviour in the data — exfiltration just before leaving, unusual downloads. A different question, not a duplicate. Requires Purview, hence `optional`. |

### Reconsider: agent identities

The 13 August report put this at *not yet*, with a good argument: Entra Agent ID
was not broadly available, and a baseline rule for a feature the tenant does not
have produces noise for everyone.

Something has changed since. **Microsoft now ships its own AI Agents template category**
with three policies (*Block high-risk agent identities*, *Configure policy for autonomous agent
access*, *Configure policy for on-behalf-of agent access*), and the `agents` condition is in
the Graph schema of *every* policy — it is in all 33 of our templates, set to `null`.

That changes the trade-off but not the answer. The argument against was never "the measure
is no good" but "the feature is not there". As soon as `agents` can actually be configured
in tenants, this is an `optional` template of the same kind as `1140` — and the
`optional` mechanism exists precisely to prevent that noise. **Action: reassess
once Entra Agent ID is generally available, and then add it as `optional`, not as a
regular template.**

### What turned out to be covered

- **MCSB IM-7** lists seven CA use cases: MFA for admins (`2055`, `2100`), MFA for
  Azure management (`2100` contains `797f4846-…`, the Azure Service Management API), blocking
  legacy auth (`1010`), trusted locations for MFA registration (`3030`), access by location
  (`1040`, `1050`), risky sign-in behaviour (`1090`, `2010`), managed devices for
  specific apps (`2060`, `2130`). All seven present.
- **CIS 5.2.2.15** (geographic exclusion) — `1040` and `1050`.
- **CIS 5.2.2.16** (token protection) — `2110`.
- **CIS 5.2.2.17** (block authentication transfer) — `1020` covers this, with
  `authenticationFlows.transferMethods = "deviceCodeFlow,authenticationTransfer"`. **But that
  template is set to `disabled`** and so enforces nothing. See below.

## What is broken about the set itself

Four properties that no policy comparison will find, but that stand in the way of
deployment. All four found by laying the set on a real tenant.

### 1. The prerequisites are not shipped — and that is dangerous

The templates refer to six groups and four named locations that the repo defines nowhere
and nowhere lists as a prerequisite:

```
Excluded from Conditional Access                  Allowed Countries
Conditional Access Service Accounts               High-Risk Countries
Licensed Users                                    Service Accounts Trusted IPs
Excluded from Legacy Authentication Block         AllTrusted
Excluded from Device Code Auth Flow Block
Excluded from Country Block List
```

In the tenant tested, **none of the six groups existed**, and the named locations had different names.
The problem is not that deployment then fails. The problem is that it *succeeds*: an
exclusion group that does not exist excludes nobody, so the policy becomes stricter than
intended. `Excluded from Conditional Access` is the break-glass exclusion. Deploying a set of 33
policies whose break-glass group does not exist is the classic way to lock yourself out of a
tenant completely — and in this case caused by our own templates.

**What needs to change:** the repo ships the groups and named locations as a creation script,
and the generator fails on a template that refers to a group or location that
is not on that list. Just as `check-scope.js` in IntuneBackup guards that every file is in
its place, here it must be guarded that every reference has a defined counterpart.

### 2. Twelve of the 33 templates enforce nothing

Eleven templates are set to `disabled`, one to report-only. They are shipped, but a tenant
that adopts the set gets nothing enforced by these twelve.

```
disabled    1020  Device Code Auth Flow            <- covers CIS 5.2.2.17 (L1)
disabled    1030  Unsupported Device Platforms
disabled    1040  Countries not Allowed            <- covers CIS 5.2.2.15 (L1)
disabled    1060  Service Accounts
disabled    1070  Explicitly Blocked Cloud Apps
disabled    1080  Guest Access to Sensitive Apps
disabled    1100  High-Risk Users
disabled    2055  Phishing Resistant MFA for Admins
disabled    2060  Mobile Apps and Desktop Clients
disabled    2070  Mobile Device Access Requirements
disabled    3040  Block File Downloads On Unmanaged Devices
report-only 3020  BYOD Persistence
```

That is a third of the set that by definition does nothing. Nowhere does it say *which*, or why.
Two cases are moreover contradictory:

- **`2055` is off, `2120` is on.** 2055 is phishing-resistant MFA for admins,
  2120 for *all* users. The list of optional templates (now `CATemplate/_manifest.json`) calls 2120 *"het einddoel waar de
  admin-variant (2055) de eerste stap van is… een uitrolproject en geen instelling"* (the end goal of
  which the admin variant (2055) is the first step… a deployment project, not a setting). So the set
  ships the first step off and the end goal on. Backwards.
- **`1090` is on, `1100` is off.** Both risk policies, both Entra ID P2. No reason
  documented for why sign-in risk yes and user risk no.

**What needs to change:** one field per template that says why it is off, as
`faseWaarom` does in IntuneBackup — and a generator that fails on a non-`enabled`
template without that reason. Then turn 2055 on and straighten out the 1090/1100 choice.

### 3. The licence marking is half done

The optional list exists precisely to prevent a tenant from having something enforced that it
*cannot* have without a licence. Six templates are on it. **Five that require Entra ID P2
are not:**

| Template | Requires | Optional |
|---|---|---|
| `1090` High-Risk Sign-Ins | Entra ID P2 | no |
| `1100` High-Risk Users | Entra ID P2 | no |
| `2010` Medium-Risk Sign-ins | Entra ID P2 | no |
| `2020` Medium-Risk Users | Entra ID P2 | no |
| `2110` Token Protection | Entra ID P2 | no |
| `1140` Managed Identities At Risk | Workload ID Premium | yes |
| `3060` Defender for Cloud Apps | MDCA | yes |

The inconsistency is demonstrable and not intended: the older, standalone checks that these
templates replaced *did* carry the P2 marking. The templates (`1090`, `1100`, `2010`,
`2020`) did not carry that marking over.

**What needs to change:** make those five optional, with the licence as the reason. In a tenant without P2
these are now five policies in the core that cannot work there — and a core of which part
never works teaches everyone not to take the rest seriously either.

### 4. The gap analysis lived outside this repo

The 13 August report described the templates of this repo, but lived somewhere else. The
README here said nothing under *Een policy toevoegen* about updating it, so the report fell
three weeks behind unnoticed — 20 templates described, 33 present.

**What needs to change:** the analysis belongs next to the templates, with a new round added for every
substantive change in `CATemplate/`. That is this document.

## Why there are no personas

Every template is called `GLOBAL__`, whereas van Surksum and Verlinden split by persona — Admins,
Internals, Externals, Guests, ServiceAccounts, Agents. That is not an omission and does not need
to be weighed again.

The set is Chronlund's design, and that is deliberately global: one set of rules that applies
to everyone, with role and group filters *inside* the policy where needed. We do that too —
`1130`, `2055`, `2130` and `3010` all four target the same eleven directory roles via
`includeRoles`. So the distinction does exist; it is just in the condition instead
of in the name.

Adding personas would mean: splitting the same measure into two policies as soon as it works
out differently for two groups. That is exactly what the 13 August report explicitly
rejects — *"één regel per maatregel, niet per policy"* (one rule per measure, not per policy) —
because it produces two policies for one question.

**What does need to happen:** the `GLOBAL__` prefix suggests a second dimension that does not exist and
is not coming. If a second persona is ever added, that is a redesign and not an addition.
Until then the prefix is a remnant of the origin — keep it, because the numbering depends
on it, but explain in the README that it is not a promise.

## What we deliberately do not do

| Measure | Why not |
|---|---|
| **Persona split** | See above. One rule per measure; the distinction lives in `includeRoles`. |
| **MFA for service accounts** (Verlinden `CA300`) | Contradicts ourselves: `1060` restricts service accounts to trusted IPs and `2050` specifically excludes them from the MFA requirement. A non-interactive account cannot do MFA. |
| **Allow Linux from a compliant device** (van Surksum `CAD011`) | Contradicts `1030`, which blocks everything outside Android/iOS/Windows/macOS. Anyone who wants to support Linux adjusts `1030` — one change, no second policy. |
| **Microsoft's templates directly via Graph** (`/identity/conditionalAccess/templates`) | The lowest-maintenance yardstick, and still not worked out which permissions it requires. This round used the template list from the documentation instead of from the API. Remains open. |
| **[AlexFilipin/ConditionalAccess](https://github.com/AlexFilipin/ConditionalAccess)** | Fourth persona-based set. Not included — the three from the 13 August report yielded zero new measures that did not already come from CIS or Microsoft. Revisit once those three yield nothing more. |

## What needs to change — the list

In order. The first three are more urgent than any new template, because they affect the set that
is already there.

1. **Ship the prerequisites.** Groups and named locations as a creation script, plus a
   check that fails on a reference without a definition. Without
   this, every deployment is a lock-out risk.
2. **Extend the optional list** with `1090`, `1100`, `2010`, `2020` and `2110`, reason
   Entra ID P2.
3. **Require a reason for every non-`enabled` `state`,** and go through the twelve cases.
   Start by turning `2055` on and resolving the `1090`/`1100` contradiction.
4. **New template:** periodic reauthentication for all users (CIS 5.2.2.13).
5. **New template (`optional`):** insider risk, licence Microsoft Purview.
6. **Keep the gap analysis next to the templates**, so it does not fall three weeks behind again.
7. **Reassess agent identities** once Entra Agent ID is generally available —
   then as `optional`.
8. **Work out Microsoft's templates via Graph** as a replacement for the manual
   documentation comparison.

Points 1 to 3 are maintenance of what exists and do not change a single measure. Points 4 and 5
add two templates. Points 6 to 8 are process.

---

# Round 2 — j0eyv Conditional Access Baseline 2026.6.1

Date: 4 September 2026. The first round compared the set with MCSB, CIS and Microsoft's own
templates and deliberately set the community frameworks aside. This round does one by hand after all, namely the only one that has been
updated since August: [`j0eyv/ConditionalAccessBaseline`](https://github.com/j0eyv/ConditionalAccessBaseline),
version **2026.6.1** (12 June 2026), 36 policies. By hand, because what needed to happen here was
writing templates in the CIPP format of `CATemplate/`.

**Outcome: 26 of his 36 were covered (72%, was 67% in August).** What was missing sat in two
corners — agent identities and guest sessions — plus four errors in policies that were already there.

## What was added

| Template | Source | Why |
|---|---|---|
| `3070 SESSION` Session Limits All Users | CA402/CA403 + CIS 5.2.2.13 | Session lifetime only applied to admins (`3010`) and BYOD (`3020`), and `3020` explicitly excluded guests. A guest therefore had an **unlimited session on an unmanaged device**. Now 12 hours for everyone except break-glass and service accounts; `3010` stays stricter for admins at 9 hours. |
| `1150 BLOCK` Risky Agent Identities | CA501 | `agentIdRiskLevels: high` on agent service principals. `1140` only covers `servicePrincipalRiskLevels` — a different identity, not a duplicate. |
| `1160 BLOCK` Agent Identities To Agent Resources | CA502 | Allow-list on `AllAgentIdResources`. |
| `2160 GRANT` Agent Users Compliant Device | CA503 | `agentContext: agentUserSessionsInitiatedFromEndpoints`. |
| `1170 BLOCK` Risky Agent Users | CA504 | `agentIdRiskLevels: medium,high` on agent *users*. |
| `1180 BLOCK` Agent Users Outside Compliant Network | CA505 | The only place in the set with a compliant network condition (Global Secure Access). |
| `2170 GRANT` MFA for Intune Enrollment | CA203 | `2080` covers the user action `urn:user:registerdevice`, not the app `d4ebce55` (Intune Enrollment) with `frequencyInterval: everyTime`. Different path, same moment. |

The five agent templates are optional (they require Entra Agent ID, `1180` also
GSA). Four of them are set to report-only, just as with Verlinden — `1160` is an allow-list that
would shut down every existing agent if blindly enabled, `2160` and `1170` block on something that
is mapped in virtually no tenant. **The reason is recorded per template in the optional list (now
`CATemplate/_manifest.json`) and thereby ends up as `optionalReason` in `cipp/baseline-stages.json`.** That is the mechanism-less variant of point 3
below ("require a reason for every non-`enabled` state"); the field does not exist yet,
so this is the best place there is today. That brings the count to **16 of the 40
templates that enforce nothing** — the problem from round 1 has not been solved,
just not made bigger without explanation.

This settles point 4 of the list from round 1 (periodic reauthentication), and point
7 has been overtaken by reality: Microsoft now ships the agent conditions in Graph and
Verlinden uses them, so "reassess once Entra Agent ID is GA" has now happened —
as `optional`, exactly as round 1 prescribed.

## What was fixed

1. **The admin role list was too short: 11 roles, now 28.** `1130`, `2055`, `2130` and `3010`
   targeted eleven roles; Verlinden uses 24. Added are, among others,
   **Exchange, SharePoint, Intune, Teams, User, Helpdesk, Password and Authentication
   Administrator** — all roles with which you can take over the tenant — plus the roles that
   2026.6.1 added: **Agent ID, Agent Registry, AI, Windows 365, Entra Backup, Microsoft
   365 Backup and Dragon Administrator**. Our own four roles (Authentication Policy,
   Compliance, Compliance Data, Hybrid Identity) stay; he does not have those.
2. **`2050` excluded `AllTrusted`.** MFA for all users lapsed at a trusted
   location — for guests too. Verlinden has no such exclusion (CA000/CA400) and CIS advises against
   trusted-IP bypass. Exclusion removed.
3. **`2060` and `2090` did not exclude the Intune apps.** "Require a compliant device"
   without an exclusion for `0000000a` (Microsoft Intune) and `d4ebce55` (Intune Enrollment)
   is a chicken-and-egg problem: you cannot enroll to *become* compliant. `2070` did it halfway. Both
   apps now excluded, as in CA205/CA208.
4. **`1120` blocked My Apps for guests.** Without `2793995e-…` in the exclusions, a
   guest cannot redeem their invitation. Added, as in CA401.
5. **`3020` excluded guests.** The policy that limits unmanaged devices did not apply
   to precisely the group that by definition has no managed device. Exclusion removed.

## What we do not adopt from him

| His policy | Why not |
|---|---|
| CA300 — MFA for service accounts | Already rejected in round 1: contradicts `1060` and `2050`. |
| Persona split (CA100-105 alongside CA200-210) | Already rejected in round 1: one rule per measure, the distinction lives in `includeRoles`. His admin and internals personas are largely the same measure twice. |
| CA104 `continuousAccessEvaluation: strictLocation` | Our `3050` is set to `strictEnforcement` and is stricter. |
| CA005/CA006 separately | Covered by `2070`, `2090` and `3040` together. |

Conversely, he lacks ten measures that we do have: `1050`, `1110`, `1140`, `2110`,
`2120`, `2130`, `1130`, `3030`, `3040`, `3060` and `2150`. This was not a catch-up exercise.

## What remains open after this

Points 1, 2, 3, 6 and 8 from the round 1 list remain open unchanged — and point 1
(ship the prerequisites) has become more urgent with this round: `1180` refers to the
named location **All Compliant Network locations**, and the new agent templates come from a
tenant where Entra Agent ID is enabled. One thing is added:

- **Check whether CIPP's CA deploy sends the beta fields** (`agents`, `agentContext`,
  `agentIdRiskLevels`, `includeAgentIdServicePrincipals`, `AllAgentIdResources`). If not, the
  five agent templates do deploy but without their distinguishing condition — and that is
  more dangerous than not deploying them, because `1160` then becomes a block on everything.

# Round 3 — registration of MFA methods behind a TAP (7 September 2026)

## The trigger

The r/msp thread *"Block new PassKey registrations"* describes a gap this set did not
close: whoever takes over a session — AiTM phishing, a rogue browser extension, or plain
persuasion — registers a passkey *themselves* and from then on has their own
phishing-resistant key to the tenant. A password reset does not touch it, and the
sign-in log shows a clean, strong sign-in.

The thread names three directions; only the first is a Conditional Access measure:

1. putting the registration page behind an authentication strength that only accepts a TAP
   — registering is then no longer possible from an existing session;
2. enforcing attestation and restricting AAGUIDs, so that synced passkeys from password managers
   no longer register — that lives in the **authentication methods policy**, not in CA,
   and therefore falls outside this repo;
3. managing browser extensions via Intune — likewise, a different repo.

What the set already had is `3030`: it targets the same user action (`urn:user:registersecurityinfo`)
but only puts a 90-day sign-in frequency on it, *without* `grantControls`. The
registration itself was therefore open to exactly the session an attacker already has.

## What was added

| Template | Why |
|---|---|
| `2180 GRANT` Register Security Info TAP Only | `grantControls` on the user action that `3030` only limits in duration: only a one-time Temporary Access Pass satisfies it. A hijacked session cannot add a method; the helpdesk issues a TAP or it does not happen. |

**Why separate and not inside 3030.** They are two measures with a different
lifecycle: `3030` is a session limit that can be on everywhere, `2180` is a grant that only
becomes possible once the tenant has a custom authentication strength *and* a TAP process.

`2180` is optional (stage 3, report-only): it requires a prerequisite
per tenant, and it shifts the attack surface to the service desk. Without identity
verification on the TAP request, the gain is smaller than it looks.

## What remains open after this

- **The custom strength is a prerequisite the validator does not see.**
  `prerequisites/ca-prerequisites.json` only knows groups and named locations, so
  `scripts/prerequisites.js` is silent here. The id in the template is a placeholder
  (`00000000-0000-0000-0000-000000000000`); on deployment the id of the strength created
  in that tenant must go in. As long as that is manual work, `2180` does not belong in stage 1.
- **Check whether CIPP's CA deploy sends a custom authentication strength along or only
  links it.** If not, `2180` deploys without a grant control — that is not a stricter but
  an empty policy.

# Round 4 — j0eyv after 2026.6.1, and the set made generic (14 September 2026)

## The trigger

[`j0eyv/ConditionalAccessBaseline`](https://github.com/j0eyv/ConditionalAccessBaseline) was
updated further after the 2026.6.1 tag (which round 2 followed), without a new tag. In substance one thing counts:
CA005 and CA006 were rebuilt from *Require app protection policy* to
**app enforced restrictions** as a session control. The rest is a README, images and a
typo in the names of CA403/CA404.

| His policy (after 13 July 2026) | What it does | In this set |
|---|---|---|
| CA005 — iOS/Android, browser and apps, Office 365, unmanaged | `compliantApplication` as grant **plus** app enforced restrictions; excluded: compliant and company-owned devices | `2070` (compliant app on iOS/Android). `2090` already requires a compliant device in the browser, so adding browser to `2070` adds nothing. |
| CA006 — every platform, browser, **SharePoint and Exchange Online**, unmanaged | app enforced restrictions only | `3040` — but that only applied to SharePoint Online |

## What was changed

**`3040` now also covers Exchange Online** (`00000002-0000-0ff1-ce00-000000000000`). Round 2 wrote
"CA005/CA006 separately: covered by `2070`, `2090` and `3040` together"; that was true for SharePoint and
OneDrive, but downloading an attachment via Outlook on the web on an unmanaged device slipped
through. One caveat:

- For Exchange, the session control only does something if the OWA mailbox policy cooperates:
  `Set-OwaMailboxPolicy -Identity OwaMailboxPolicy-Default -ConditionalAccessPolicy ReadOnly` (or
  `ReadOnlyPlusAttachmentsBlocked`). Without that step the policy is silent for Exchange. That setting
  is not in this repo; it belongs in the per-tenant prerequisites.

j0eyv's device filter (compliant **and** `deviceOwnership -eq "Company"`) was not
adopted. That would also bring an enrolled, compliant personal device under the restriction;
that is a per-tenant choice about BYOD, not a baseline measure.

**`1060` no longer carries an IP range.** The template contained one public IP from the tenant it
was once exported from. The generator already stripped it on the CIPP export and
`New-CaPrerequisites.ps1` did not use it, but it was still in `CATemplate/` and in the
generated files. Now the named location in the template is empty,
matching `prerequisites/ca-prerequisites.json`; the value comes in per tenant via
`-ServiceAccountIpRange`. The IP is still in the git history.

**`1040` no longer carries default countries.** The template and `prerequisites/` listed BE and NL —
the countries of one organisation. Now `Allowed Countries` is empty and marked as `requiresCountries`:
the CIPP export pins `1040` to Report until the tenant's countries are known, and
`New-CaPrerequisites.ps1` only creates the location with `-AllowedCountry`. Deploying an empty
country list would block *every* sign-in outside "no country at all".

# Round 5 — the standards mapping that existed only as a path (15 September 2026)

## The trigger

`scripts/generate-compliance.js` in the IntuneBackup repo has read
`../CA-Policies/controls/ca-controls.json` since August. The path was in the script header, the read function
`readConditionalAccess()` existed, COMPLIANCE.md had a **CA actief** column for it — only the
file never materialised. Everyone therefore ran `--no-ca`, and that document then said
literally that Conditional Access had been "bewust niet meegenomen" (deliberately left out).

That is not a missing line but a wrong picture. The justification claimed that NIS2 (j),
multi-factor authentication, is fulfilled by three Intune policies. The ten CA policies doing the
real work had been in the tenant for years, but in no document an auditor reads.

## What was added

**`controls/ca-controls.json`** — all 41 templates mapped to ISO/IEC 27001:2022 Annex A, NIS2
art. 21(2), CIS Controls v8.1 and NIST CSF 2.0, in exactly the same vocabulary as
`IntuneTemplate/_controls.json` in the other repo. The phase does not come from a manifest but from
`state` in the template itself: `enabled` counts as enforced, report-only as prepared,
`disabled` as not deployed.

**`scripts/check-controls.js`** and its test — guard the two sides on which this silently
drifts. A template without a mapping disappears quietly from the justification; a mapping
without a template covers a control there with a policy that does not exist, and only the
auditor who follows the reference notices. The labels themselves are only checked locally — the vocabulary
lives in the other repo, so in CI `generate-compliance.js --strict` does that.

## What it yields

| NIS2 art. 21(2) | without CA | with CA |
|---|---:|---:|
| (j) multi-factor authentication and secured communications | 3 | 13 |
| (i) human resources security, access control policies and asset management | 22 | 39 |
| (b) incident handling | 8 | 15 |

## What remains open after this

- **What is in git is still the `--no-ca` version**, because that is what the workflow there
  regenerates; CI does not see this repo. Getting the CA version into git requires a
  `CA_POLICIES_TOKEN` secret and enabling the CA checkout in the workflow of the
  IntuneBackup repo — the two steps are in open point 3 of its `docs/ANALYSE.md`.
- **The mapping is a judgement, not a standard.** There is no authoritative source that links CA policies to
  Annex A controls; this one was laid by hand by analogy with the Intune side. In an
  audit that is defensible, not provable.
- **Six policies are set to report-only** and therefore do not count as covered. That is correct — they do
  nothing — but it does mean the matrix improves as soon as someone turns those six on, without a
  single policy being added.
