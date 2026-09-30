#Requires -Modules Microsoft.Graph.Identity.SignIns, Microsoft.Graph.Users, Microsoft.Graph.Groups
<#
.SYNOPSIS
    Tells you before the rollout whether a user CAN register a passkey, and if not: why.
    Read-only; changes nothing.

.DESCRIPTION
    In one tenant this once cost thirteen failed attempts over eighty minutes, with nothing in
    the audit log but "User started the registration for Passkey" and no outcome. The cause was
    in the documentation but not in the error message:

        On an Entra joined or registered device, an EXISTING Windows Hello for Business
        credential blocks the registration of a passkey for that same account in the same
        Windows Hello container.

    This script checks that blocker and the five others that fail silently, and gives a verdict
    per item with what to do about it. Thirty seconds instead of eighty minutes.

    WHAT IT CHECKS

      1. Is Passkey (FIDO2) enabled, and may the user register self-service?
      2. Does the user already have a WHfB credential? (blocks Entra passkey on Windows)
      3. Does the user have a TAP, and is it ONE-TIME? (GLOBAL__2180 requires temporaryAccessPassOneTime)
      4. Is the user a guest? (guests cannot register a passkey at all)
      5. Does the policy enforce attestation? (excludes synced passkeys and Windows Hello)
      6. Is there an AAGUID restriction that excludes Windows Hello?

    WHAT IT CANNOT DO

    The five-minute rule - the user must have done MFA within the last five minutes before he
    may register - cannot be read. It is therefore a reminder in the output, not a check.

.PARAMETER TenantId
    The tenant.

.PARAMETER UserPrincipalName
    The user(s) you want to check.

.PARAMETER Scenario
    Where you want to end up. Determines how an existing WHfB credential is judged:

      WindowsHelloPasskey  A passkey in the Windows Hello container (Entra passkey on Windows).
                           An existing WHfB credential is then a BLOCKER.
      SecurityKey          A passkey on a separate FIDO2 key or in Authenticator.
                           An existing WHfB credential then makes no difference.
      WindowsHelloForBusiness  Signing in on the device itself. An existing WHfB credential
                           is then exactly what you want to see.

    Default SecurityKey: that is the scenario in which nothing gets in each other's way.

.PARAMETER MethodsPath
    Path to authentication-methods.json. Defaults to the one in this repo.

.EXAMPLE
    ./scripts/Test-EntraPasskeyReadiness.ps1 -TenantId contoso.onmicrosoft.com -UserPrincipalName adele.vance@contoso.com

.EXAMPLE
    ./scripts/Test-EntraPasskeyReadiness.ps1 -TenantId contoso.onmicrosoft.com -UserPrincipalName adele.vance@contoso.com -Scenario WindowsHelloPasskey
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string] $TenantId,

    [Parameter(Mandatory = $true)]
    [string[]] $UserPrincipalName,

    [ValidateSet('WindowsHelloPasskey', 'SecurityKey', 'WindowsHelloForBusiness')]
    [string] $Scenario = 'SecurityKey',

    [string] $MethodsPath = (Join-Path $PSScriptRoot '..' 'authentication-methods' 'authentication-methods.json')
)

$ErrorActionPreference = 'Stop'

$desired = Get-Content -Path $MethodsPath -Raw | ConvertFrom-Json
$helloAaGuids = @(
    $desired.knownAaGuids.windowsHelloHardware
    $desired.knownAaGuids.windowsHelloVbsHardware
    $desired.knownAaGuids.windowsHelloSoftware
) | Where-Object { $_ }

Connect-MgGraph -TenantId $TenantId -Scopes 'Policy.Read.All', 'UserAuthenticationMethod.Read.All', 'User.Read.All' -NoWelcome

Write-Host "Scenario: $Scenario" -ForegroundColor Cyan
Write-Host ''

# ------------------------------------------------------------ tenant-wide ----

$tenantFindings = [System.Collections.Generic.List[object]]::new()
$addFinding = { param($list, $item, $verdict, $explanation)
    $list.Add([pscustomobject]@{ Item = $item; Verdict = $verdict; Detail = $explanation })
}

$fido = $null
try {
    $fido = Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId 'Fido2'
}
catch {
    & $addFinding $tenantFindings 'Passkey (FIDO2)' 'UNKNOWN' "Cannot be read: $($_.Exception.Message)"
}

if ($fido) {
    if ($fido.State -eq 'enabled') {
        & $addFinding $tenantFindings 'Passkey (FIDO2)' 'OK' 'Method is enabled'
    }
    else {
        & $addFinding $tenantFindings 'Passkey (FIDO2)' 'BLOCKS' "Method is $($fido.State). Nobody can register, and GLOBAL__2120 then cannot be met."
    }

    $extra = $fido.AdditionalProperties

    if ($extra.isSelfServiceRegistrationAllowed -eq $false) {
        & $addFinding $tenantFindings 'Self-service registration' 'BLOCKS' 'Set to No. Nobody can register via Security info, even with the method enabled.'
    }
    else {
        & $addFinding $tenantFindings 'Self-service registration' 'OK' 'Allowed'
    }

    if ($extra.isAttestationEnforced -eq $true) {
        $verdict = if ($Scenario -eq 'WindowsHelloPasskey') { 'BLOCKS' } else { 'NOTE' }
        & $addFinding $tenantFindings 'Attestation' $verdict 'Enforced. Excludes synced passkeys, and Windows Hello passkeys cannot work with it at all.'
    }
    else {
        & $addFinding $tenantFindings 'Attestation' 'OK' 'Not enforced'
    }

    # An allow list without the Windows Hello AAGUIDs excludes Windows Hello; a block list with
    # those AAGUIDs in it does the same. Both silently.
    $restrictions = $extra.keyRestrictions
    if ($restrictions -and $restrictions.isEnforced) {
        $list = @($restrictions.aaGuids)
        $hasHello = @($list | Where-Object { $helloAaGuids -contains $_ }).Count -gt 0
        $type = $restrictions.enforcementType
        $helloAllowed = ($type -eq 'allow' -and $hasHello) -or ($type -eq 'block' -and -not $hasHello)

        if ($Scenario -eq 'WindowsHelloPasskey' -and -not $helloAllowed) {
            & $addFinding $tenantFindings 'AAGUID restriction' 'BLOCKS' "enforcementType=$type with $($list.Count) AAGUID(s); Windows Hello is not allowed. Add $($desired.knownAaGuids.windowsHelloHardware)."
        }
        else {
            & $addFinding $tenantFindings 'AAGUID restriction' 'NOTE' "enforcementType=$type with $($list.Count) AAGUID(s). Check that the user's authenticator fits."
        }
    }
    else {
        & $addFinding $tenantFindings 'AAGUID restriction' 'OK' 'No restriction'
    }
}

$tenantFindings | Format-Table -AutoSize

# --------------------------------------------------------------- per user ----

$verdicts = [System.Collections.Generic.List[object]]::new()

foreach ($upn in $UserPrincipalName) {
    Write-Host "--- $upn ---" -ForegroundColor Cyan
    $findings = [System.Collections.Generic.List[object]]::new()

    $user = $null
    try { $user = Get-MgUser -UserId $upn -Property 'id,userPrincipalName,userType,displayName' }
    catch {
        Write-Warning "User not found: $($_.Exception.Message)"
        $verdicts.Add([pscustomobject]@{ User = $upn; Verdict = 'UNKNOWN'; Reason = 'user not found' })
        continue
    }

    # Guests cannot register a passkey. Full stop. No setting changes that.
    if ($user.UserType -eq 'Guest') {
        & $addFinding $findings 'User type' 'BLOCKS' 'Guest. Passkey registration is not supported for guests - not even with everything configured correctly.'
    }
    else {
        & $addFinding $findings 'User type' 'OK' $user.UserType
    }

    # THE pitfall.
    $whfb = @()
    try { $whfb = @(Get-MgUserAuthenticationWindowsHelloForBusinessMethod -UserId $user.Id) } catch { }

    switch ($Scenario) {
        'WindowsHelloPasskey' {
            if ($whfb.Count -gt 0) {
                $names = ($whfb | ForEach-Object { $_.DisplayName }) -join ', '
                & $addFinding $findings 'Existing WHfB credential' 'BLOCKS' "$($whfb.Count) found ($names). A passkey in the same Windows Hello container cannot be registered next to it; the registration fails without a useful message. Consider first whether WHfB is not exactly what you want here - on a managed, Entra joined device it usually is."
            }
            else {
                & $addFinding $findings 'Existing WHfB credential' 'OK' 'None - the container is free'
            }
        }
        'WindowsHelloForBusiness' {
            if ($whfb.Count -gt 0) {
                & $addFinding $findings 'WHfB credential' 'OK' "$($whfb.Count) present - this is what you wanted"
            }
            else {
                & $addFinding $findings 'WHfB credential' 'NOTE' 'None. Check that the device has a TPM and that the Intune WHfB policy is assigned to this user.'
            }
        }
        default {
            & $addFinding $findings 'WHfB credential' 'OK' "$($whfb.Count) present - no effect on this scenario"
        }
    }

    $fido2 = @()
    try { $fido2 = @(Get-MgUserAuthenticationFido2Method -UserId $user.Id) } catch { }
    if ($fido2.Count -gt 0) {
        $lines = $fido2 | ForEach-Object { "$($_.DisplayName) [$($_.AaGuid)]" }
        & $addFinding $findings 'Passkeys already registered' 'OK' ($lines -join '; ')
    }
    else {
        & $addFinding $findings 'Passkeys already registered' 'OK' 'None'
    }

    # The TAP is the starting point of the whole chain, and one-time use is what 2180 requires.
    $tap = @()
    try { $tap = @(Get-MgUserAuthenticationTemporaryAccessPassMethod -UserId $user.Id) } catch { }
    if ($tap.Count -eq 0) {
        & $addFinding $findings 'Temporary Access Pass' 'NOTE' 'No active TAP. Without an existing method the user cannot get started.'
    }
    else {
        $multiUse = @($tap | Where-Object { -not $_.IsUsableOnce })
        if ($multiUse.Count -gt 0) {
            & $addFinding $findings 'Temporary Access Pass' 'NOTE' "$($multiUse.Count) of $($tap.Count) is usable MORE THAN ONCE. GLOBAL__2180 only accepts temporaryAccessPassOneTime - once that policy enforces, this TAP does not satisfy it."
        }
        else {
            & $addFinding $findings 'Temporary Access Pass' 'OK' "$($tap.Count) active, one-time"
        }
    }

    $findings | Format-Table -AutoSize

    $blockers = @($findings | Where-Object Verdict -eq 'BLOCKS') + @($tenantFindings | Where-Object Verdict -eq 'BLOCKS')
    if ($blockers.Count -gt 0) {
        Write-Host "  WILL FAIL - $($blockers.Count) blocker(s):" -ForegroundColor Red
        $blockers | ForEach-Object { Write-Host "    - $($_.Item): $($_.Detail)" -ForegroundColor Red }
        $verdicts.Add([pscustomobject]@{ User = $upn; Verdict = 'WILL FAIL'; Reason = ($blockers.Item -join ', ') })
    }
    else {
        Write-Host '  Nothing that blocks the registration.' -ForegroundColor Green
        $verdicts.Add([pscustomobject]@{ User = $upn; Verdict = 'CAN REGISTER'; Reason = '-' })
    }
    Write-Host ''
}

Write-Host '=== Summary ===' -ForegroundColor Cyan
$verdicts | Format-Table -AutoSize

Write-Host 'Cannot be checked, worth remembering:' -ForegroundColor Yellow
Write-Host '  - The user must have done MFA within the last FIVE MINUTES before he may register a passkey.'
Write-Host '  - Passkey profiles require a one-time, IRREVERSIBLE opt-in in the portal.'
Write-Host '  - Entra passkey on Windows does NOT sign in on the Windows screen itself; Windows Hello for Business does.'
