#Requires -Modules Microsoft.Graph.Identity.SignIns, Microsoft.Graph.Groups
<#
.SYNOPSIS
    Compares the authentication methods policy of a tenant with
    authentication-methods/authentication-methods.json, and sets it right on request.

.DESCRIPTION
    This is the only comparison against a tenant that this side of the baseline has. Nothing
    else checks the authentication methods policy automatically - what this script does not
    report, nobody sees.

    The order in the JSON file is the deployment order and is not arbitrary:

      1. Temporary Access Pass    without a TAP a new employee has nothing to register his
                                  first passkey with, and no fallback if he loses his
                                  device.
      2. Passkey (FIDO2)          the method CXNM__STANDARD__2120 relies on.
      3. Microsoft Authenticator  stays on next to passkeys.
      4/5. SMS and voice          go OFF - and only once 2 and 3 are in place.

    Run this without -Apply by default. It then only compares and changes nothing.

    WHAT THIS SCRIPT DOES NOT DO

    Passkey profiles. They require a one-time, irreversible opt-in in the portal and cannot be
    fully managed through Graph; the script does read them and reports the difference with the
    profiles in the JSON file, so you know what has to be done by hand. See the README in
    authentication-methods/.

    It does actively guard the disable order: turning off SMS or voice while users do not yet
    have a phishing-resistant method locks those users out. With -CheckRegistrationFirst the
    script first counts how many users rely only on a method that is about to be disabled, and
    refuses the change while that number is above zero.

.PARAMETER TenantId
    The tenant. Passed to Connect-MgGraph.

.PARAMETER Apply
    Actually sets the methods. Without this switch the script only compares.

.PARAMETER CheckRegistrationFirst
    Refuse to disable a method while there are users who have no MFA method registered.
    Requires AuditLog.Read.All / Reports.Read.All.

.PARAMETER MethodsPath
    Path to authentication-methods.json. Defaults to the one in this repo.

.EXAMPLE
    ./scripts/Set-EntraAuthenticationMethods.ps1 -TenantId contoso.onmicrosoft.com

.EXAMPLE
    ./scripts/Set-EntraAuthenticationMethods.ps1 -TenantId contoso.onmicrosoft.com -Apply -CheckRegistrationFirst -WhatIf
#>
[CmdletBinding(SupportsShouldProcess = $true, ConfirmImpact = 'High')]
param(
    [Parameter(Mandatory = $true)]
    [string] $TenantId,

    [switch] $Apply,

    [switch] $CheckRegistrationFirst,

    [string] $MethodsPath = (Join-Path $PSScriptRoot '..' 'authentication-methods' 'authentication-methods.json')
)

$ErrorActionPreference = 'Stop'

$desired = Get-Content -Path $MethodsPath -Raw | ConvertFrom-Json
Write-Host "Desired state from $($desired.version) (reviewed $($desired.reviewedAt))" -ForegroundColor Cyan
if (-not $Apply) {
    Write-Host 'Compare mode: nothing is changed. Use -Apply to set.' -ForegroundColor Cyan
}

$scopes = @('Policy.ReadWrite.AuthenticationMethod', 'Group.Read.All')
if ($CheckRegistrationFirst) { $scopes += 'AuditLog.Read.All' }
Connect-MgGraph -TenantId $TenantId -Scopes $scopes -NoWelcome

$result = [System.Collections.Generic.List[object]]::new()
$blocking = [System.Collections.Generic.List[string]]::new()

# -------------------------------------------------- count registrations first ----

# Only relevant if something is disabled. Disabling a method is the only action here that
# takes something away, and therefore the only one that can lock people out.
$withoutStrongMethod = $null
if ($CheckRegistrationFirst -and ($desired.methods | Where-Object state -eq 'disabled')) {
    try {
        $registrations = @(Get-MgReportAuthenticationMethodUserRegistrationDetail -All)
        $withoutStrongMethod = @($registrations | Where-Object { -not $_.IsMfaCapable }).Count
        Write-Host "  $withoutStrongMethod user(s) without an MFA method" -ForegroundColor $(if ($withoutStrongMethod -gt 0) { 'Yellow' } else { 'Green' })
    }
    catch {
        Write-Warning "Could not retrieve the registration report: $($_.Exception.Message). Without that number, disabling is a guess."
        $blocking.Add('registration report not available - do not disable any method')
    }
}

# ----------------------------------------------------------------- methods ----

foreach ($method in ($desired.methods | Sort-Object order)) {
    $current = $null
    try {
        $current = Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId $method.id
    }
    catch {
        Write-Warning "Method '$($method.id)' not found in this tenant: $($_.Exception.Message)"
        $result.Add([pscustomobject]@{ Order = $method.order; Method = $method.displayName; Now = 'unknown'; Desired = $method.state; Action = 'skipped'; Danger = $method.danger })
        continue
    }

    $now = $current.State

    if ($now -eq $method.state) {
        Write-Host "  = $($method.displayName): $now"
        $result.Add([pscustomobject]@{ Order = $method.order; Method = $method.displayName; Now = $now; Desired = $method.state; Action = 'correct'; Danger = $method.danger })
        continue
    }

    Write-Host "  ! $($method.displayName): is $now, should be $($method.state)" -ForegroundColor Yellow

    # Disabling while people still rely on it is the only irreversible thing in this script.
    if ($method.state -eq 'disabled' -and $null -ne $withoutStrongMethod -and $withoutStrongMethod -gt 0) {
        Write-Warning "'$($method.displayName)' NOT disabled: there are $withoutStrongMethod user(s) without an MFA method. $($method.note)"
        $blocking.Add("'$($method.displayName)' cannot be disabled while $withoutStrongMethod user(s) have no other method")
        $result.Add([pscustomobject]@{ Order = $method.order; Method = $method.displayName; Now = $now; Desired = $method.state; Action = 'refused (registration)'; Danger = $method.danger })
        continue
    }

    if (-not $Apply) {
        $result.Add([pscustomobject]@{ Order = $method.order; Method = $method.displayName; Now = $now; Desired = $method.state; Action = 'would change'; Danger = $method.danger })
        continue
    }

    $body = @{ '@odata.type' = $current.AdditionalProperties['@odata.type']; id = $method.id; state = $method.state }
    foreach ($key in $method.configuration.PSObject.Properties.Name) {
        $body[$key] = $method.configuration.$key
    }

    if ($PSCmdlet.ShouldProcess($method.displayName, "Set state to $($method.state)")) {
        Update-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId $method.id -BodyParameter $body
        Write-Host "  + $($method.displayName) set to $($method.state)" -ForegroundColor Green
        $result.Add([pscustomobject]@{ Order = $method.order; Method = $method.displayName; Now = $now; Desired = $method.state; Action = 'changed'; Danger = $method.danger })
    }
    else {
        $result.Add([pscustomobject]@{ Order = $method.order; Method = $method.displayName; Now = $now; Desired = $method.state; Action = 'skipped (WhatIf)'; Danger = $method.danger })
    }
}

# -------------------------------------------------------- passkey profiles ----

# Read and report only. The opt-in is irreversible and profiles are managed in the portal; a
# script that does this halfway is more dangerous than a script that does not do it.
$fido = $desired.methods | Where-Object id -eq 'Fido2'
if ($fido -and $fido.profiles) {
    Write-Host ''
    Write-Host 'Passkey profiles (manual work in the portal):' -ForegroundColor Cyan
    foreach ($passkeyProfile in $fido.profiles) {
        $types = $passkeyProfile.passkeyTypes -join ', '
        Write-Host "  - $($passkeyProfile.displayName)"
        Write-Host "      target     : $($passkeyProfile.target)"
        Write-Host "      types      : $types"
        Write-Host "      attestation: $($passkeyProfile.enforceAttestation)"
    }
    Write-Host "  $($fido.tenantSpecific)" -ForegroundColor Yellow
}

# ---------------------------------------------------------------- summary ----

Write-Host ''
$result | Sort-Object Order | Format-Table -AutoSize

if ($blocking.Count -gt 0) {
    Write-Host 'NOT DONE:' -ForegroundColor Yellow
    $blocking | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    Write-Host ''
    Write-Host 'Resolve this before you continue. Disabling a method while users still rely on it is not hardening but a lock-out.' -ForegroundColor Yellow
}
elseif ($Apply) {
    Write-Host 'The authentication methods policy is as agreed.' -ForegroundColor Green
}
else {
    Write-Host 'Comparison done. Run with -Apply to set the differences.' -ForegroundColor Green
}
