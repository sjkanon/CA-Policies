[Nederlands](README.md) · **English** · [Français](README.fr.md)

# authentication-methods/

`authentication-methods.json` is the desired state of the **authentication methods policy** in
a tenant: which methods are enabled, and under which conditions a passkey may be
registered.

**This is not Conditional Access.** A CA policy says *when* you may access something; this says
*with what* you can sign in at all. The two do interlock, and that is exactly where it goes
wrong if you look at one in isolation:

| If this is disabled here | Then this happens on the CA side |
|---|---|
| Passkey (FIDO2) | `CA__2120` demands a phishing-resistant method that nobody has — the tenant is locked |
| Temporary Access Pass | `CA__2180` only allows registration behind a TAP; a new employee then cannot register anything |

`scripts/authentication-methods.js` checks those two links against the actual `state`
of those templates, and fails hard. That is not schema validation but the only place where this
dependency is guarded.

## What guards this file

Nothing compares this file with a tenant by itself. What is off here stays off until
someone notices — hence these four:

| | Does |
|---|---|
| `node scripts/authentication-methods.js` | Guards the file itself and the two links. Blocking in CI |
| `node --test scripts/authentication-methods.test.js` | Eight tests, including the disable order |
| `./scripts/Set-EntraAuthenticationMethods.ps1 -TenantId <tenant>` | Compares a real tenant with this file. Without `-Apply` it changes nothing |
| `./scripts/Test-EntraPasskeyReadiness.ps1 -TenantId <tenant> -UserPrincipalName <upn>` | Tells before deployment whether a user *can* register a passkey, and if not: why |

## The order is not free

`order` is the deployment order, and reversing it locks people out:

1. **Temporary Access Pass** — the only method with which someone *without* an existing method can
   get started. Also the fallback when someone loses their laptop: a WHfB passkey lived in the TPM of
   *that* device and does not come back.
2. **Passkey (FIDO2)** — the method the phishing-resistant CA policies rely on.
3. **Microsoft Authenticator** — stays enabled alongside passkeys. It is what most users already
   have, and the route by which they register a passkey in Authenticator.
4. **SMS** and 5. **voice** — get disabled, and only after 2 and 3 are in place.

Steps 4 and 5 are the only ones that take something *away*. `Set-EntraAuthenticationMethods.ps1` refuses them with
`-CheckRegistrationFirst` as long as there are users without an MFA method, and the test guards that
a method to be disabled never comes before a method to be enabled.

## Passkey profiles

The opt-in happens once in the portal (**Entra ID › Security › Authentication methods ›
Policies › Passkey (FIDO2)**, via the banner) and is **irreversible**. Your existing global
settings then move to a *Default passkey profile*; there is room for at most three, that
profile included. That is not a step a script should take for you.

`Set-EntraAuthenticationMethods.ps1` then reads the profiles and reports what differs from this
file, but does not set them — profiles determine who can still sign in, and a script that does that
halfway is more dangerous than a script that does not do it. Whether CIPP *can* set them, see
below.

The two profiles here:

| Profile | Target group | Types | Attestation |
|---|---|---|---|
| Administrators | `SEC-Passkey-Profile-Admins` | Device-bound only | On |
| All users | AllUsers | Device-bound and synced | Off |

`SEC-Passkey-Profile-Admins` is in [`../prerequisites/ca-prerequisites.json`](../prerequisites/ca-prerequisites.json)
and is created by `New-CaPrerequisites.ps1` — a passkey profile cannot target
directory roles the way a CA policy does, only groups.

## Deploying via CIPP

CIPP has an **Authentication Methods** standard that sets the methods above: per method
Enabled / Disabled / Not Configured, optionally with a target group. `Not Configured` leaves the
current tenant setting in place — that is the safe state for what you do not (yet) want to touch.

One detail from [CIPP's own documentation](https://docs.cipp.app/user-documentation/tenant/administration/authentication-methods)
that can cost you an afternoon:

> "Enabling FIDO2 with **Enable Policy** rather than **Configure** turns on attestation
> enforcement and self-service registration, as those are the defaults CIPP applies."

Attestation on means: no synced passkeys, and **no Windows Hello passkeys** —
Microsoft prescribes that a profile must *not* enforce attestation for those. So use
**Configure** and not **Enable Policy**, and set attestation explicitly to the value from this
file (`false` for the broad profile).

Whether CIPP can also set the passkey *profiles* with their AAGUID lists differs per version —
check that in your own CIPP before you assume it. If it does not work, that is the only
part that stays in the portal.

## Two things that go wrong silently

**Attestation only applies at registration.** If you turn it on later, passkeys that were
registered earlier without attestation simply keep working. You close off new registrations, not
existing keys.

**Removing something locks people out.** Disabling a passkey type or removing an AAGUID from an allow list
applies to registration *and* sign-in: whoever registered with it can no longer sign in.

## The pitfall that cost an evening

In September 2026, registering a passkey in one tenant failed thirteen times over
eighty minutes. The audit log only showed `User started the registration for Passkey` with no
outcome. The cause is documented by [Microsoft](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-authentication-entra-passkeys-on-windows)
but not in the error message:

> "If you then attempt to register a passkey on Windows for that same account, registration
> fails because the Windows Hello for Business credential already exists."

On an Entra joined or registered device, the WHfB credential occupies the Windows Hello container
for that account. A passkey next to it is not possible. After the credential was removed, the
registration succeeded 83 seconds later.

**The question that comes before that is more important:** on a managed, Entra joined device,
WHfB is the right choice, not Entra passkey on Windows. WHfB also handles the Windows sign-in screen;
Entra passkey on Windows does not. The latter is intended for non-joined, personal or shared
PCs.

`scripts/Test-EntraPasskeyReadiness.ps1` checks this in advance, together with five other blockers that
are just as silent: method disabled, self-service disabled, guest account, attestation enforced, and an
AAGUID list that excludes Windows Hello. Run it with `-Scenario WindowsHelloPasskey` if you
want a passkey in the Windows Hello container.
