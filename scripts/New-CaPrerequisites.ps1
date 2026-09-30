#Requires -Modules Microsoft.Graph.Groups, Microsoft.Graph.Identity.SignIns
<#
.SYNOPSIS
    Creates in a tenant the groups, named locations, custom authentication strengths and
    authentication contexts that the CA templates in CATemplate/ refer to. Run this BEFORE the
    baseline is deployed.

.DESCRIPTION
    The templates refer to eight groups and four named locations that no tenant has out of the
    box. If they are missing, that fails in the wrong direction: an exclusion group that does
    not exist excludes nobody, so the policy becomes stricter than intended. Two cases are not
    "stricter" but "closed":

      Excluded from Conditional Access  both are in 35 of the 41 templates and are one
      SG-U-CA-Exclude-Breakglass        mechanism under two names. Both empty = no account
                                        falls outside the baseline = no break-glass. One of
                                        the two empty is more treacherous: the exclusion
                                        then looks as if it is in place.
      Licensed Users                    1110 (state: enabled) blocks All except this group.
                                        Empty or static = every user blocked.

    That is why this script checks those explicitly and, with -RequireSafeToDeploy, refuses to
    finish while they are empty.

    A custom authentication strength fails in a third way. Entra assigns its id only on
    creation, so the template in CATemplate/ carries a zero GUID - it is the source for all
    tenants and cannot carry the id of one of them. This script creates the strength and
    reports the real id; until that id is in the CIPP deployment, the grant of 2180 points at
    an id that does not exist in that tenant.

    The script is idempotent: existing objects are recognised by displayName (a context by its
    id) and not overwritten - only reported, with what differs. For an existing authentication
    strength it does compare the allowed combinations: the same name with different
    combinations is more dangerous than no strength, because it looks right.

.PARAMETER TenantId
    The tenant. Passed to Connect-MgGraph.

.PARAMETER ServiceAccountIpRange
    The public IP range(s) from which the service accounts of THIS tenant may sign in, as CIDR.
    Required as soon as you want to deploy 1060. The template in CATemplate/ deliberately
    carries no IP range: it belongs to one tenant and therefore only comes in via this
    parameter.

.PARAMETER AllowedCountry
    The countries in which sign-in is allowed, as ISO 3166-1 alpha-2 (e.g. 'NL','BE'). Required
    as soon as you want to deploy 1040: the repo deliberately carries no default countries,
    because the list depends on the offices, remote workers and travellers of this tenant.

.PARAMETER BreakGlassUserId
    Object id(s) of the emergency access accounts. They go into every group that carries
    breakGlassTarget in ca-prerequisites.json - today 'Excluded from Conditional Access' and
    'SG-U-CA-Exclude-Breakglass', both. If you leave this empty, the groups are created but stay
    empty - and then the baseline must not go to Remediate.

.PARAMETER RequireSafeToDeploy
    Ends with an error while the critical groups have no members. Use this in a deployment
    pipeline, so the CA step does not run after a half-successful preparation.

.PARAMETER PrerequisitesPath
    Path to ca-prerequisites.json. Defaults to the one in this repo.

.EXAMPLE
    ./scripts/New-CaPrerequisites.ps1 -TenantId contoso.onmicrosoft.com -WhatIf

.EXAMPLE
    ./scripts/New-CaPrerequisites.ps1 -TenantId contoso.onmicrosoft.com -ServiceAccountIpRange '203.0.113.10/32' -AllowedCountry 'NL','BE' -BreakGlassUserId '00000000-1111-2222-3333-444444444444' -RequireSafeToDeploy
#>
[CmdletBinding(SupportsShouldProcess = $true, ConfirmImpact = 'Medium')]
param(
    [Parameter(Mandatory = $true)]
    [string] $TenantId,

    [string[]] $ServiceAccountIpRange,

    [string[]] $AllowedCountry,

    [string[]] $BreakGlassUserId,

    [switch] $RequireSafeToDeploy,

    [string] $PrerequisitesPath = (Join-Path $PSScriptRoot '..' 'prerequisites' 'ca-prerequisites.json')
)

$ErrorActionPreference = 'Stop'

$prereq = Get-Content -Path $PrerequisitesPath -Raw | ConvertFrom-Json
Write-Host "Prerequisites from $($prereq.version) (reviewed $($prereq.reviewedAt))" -ForegroundColor Cyan

Connect-MgGraph -TenantId $TenantId -Scopes 'Group.ReadWrite.All', 'Policy.ReadWrite.ConditionalAccess', 'Policy.ReadWrite.AuthenticationMethod', 'User.Read.All' -NoWelcome

$result = [System.Collections.Generic.List[object]]::new()
$blocking = [System.Collections.Generic.List[string]]::new()

# ----------------------------------------------------------------- groups ----

foreach ($group in $prereq.groups) {
    $existing = @(Get-MgGroup -Filter "displayName eq '$($group.displayName)'" -All)

    if ($existing.Count -gt 1) {
        Write-Warning "Several groups are named '$($group.displayName)'. The CA templates match by name, so this is ambiguous - clean that up first."
        $blocking.Add("duplicate group '$($group.displayName)'")
        continue
    }

    $groupObject = $null

    if ($existing.Count -eq 1) {
        $groupObject = $existing[0]
        Write-Host "  = $($group.displayName) already exists ($($groupObject.Id))"

        # A 'Licensed Users' that turns out to be static is more dangerous than no group:
        # 1110 then blocks everyone who has not been added by hand.
        if ($group.membershipType -eq 'dynamic' -and $groupObject.GroupTypes -notcontains 'DynamicMembership') {
            Write-Warning "'$($group.displayName)' exists but is NOT dynamic. $($group.dangerReason)"
            $blocking.Add("'$($group.displayName)' is static while it must be dynamic")
        }
    }
    else {
        # description is what an admin sees on the group in the tenant; purpose is the
        # explanation for whoever reads the repo.
        $description = if ($group.description) { $group.description } else { $group.purpose }
        $body = @{
            displayName     = $group.displayName
            mailNickname    = $group.mailNickname
            description     = $description
            securityEnabled = $true
            mailEnabled     = $false
            groupTypes      = @()
        }
        if ($group.membershipType -eq 'dynamic') {
            $body.groupTypes = @('DynamicMembership')
            $body.membershipRule = $group.membershipRule
            $body.membershipRuleProcessingState = $group.membershipRuleProcessingState
        }

        if ($PSCmdlet.ShouldProcess($group.displayName, 'Create group')) {
            $groupObject = New-MgGroup -BodyParameter $body
            Write-Host "  + $($group.displayName) created ($($groupObject.Id))" -ForegroundColor Green
        }
    }

    # Break-glass members. Only for the groups that ask for it - which ones is in
    # ca-prerequisites.json (breakGlassTarget), not here, so a second break-glass name does not
    # cost a script change. The admin fills the rest: who belongs there is a judgement per
    # tenant, not a script.
    if ($groupObject -and $group.breakGlassTarget -and $BreakGlassUserId) {
        $currentMembers = @(Get-MgGroupMember -GroupId $groupObject.Id -All).Id
        foreach ($userId in $BreakGlassUserId) {
            if ($currentMembers -contains $userId) {
                Write-Host "    = $userId is already a member"
                continue
            }
            if ($PSCmdlet.ShouldProcess("$userId -> $($group.displayName)", 'Add member')) {
                New-MgGroupMember -GroupId $groupObject.Id -DirectoryObjectId $userId
                Write-Host "    + $userId added" -ForegroundColor Green
            }
        }
    }

    # The critical groups must have members before the baseline may enforce. For a dynamic
    # group the first evaluation can take a few minutes - empty there means 'not ready yet',
    # not necessarily 'wrong'.
    if ($groupObject -and $group.requiresMembers) {
        $members = @(Get-MgGroupMember -GroupId $groupObject.Id -Top 1)
        if ($members.Count -eq 0) {
            $text = "'$($group.displayName)' has no members. $($group.dangerReason)"
            if ($group.membershipType -eq 'dynamic') {
                $text += " The dynamic rule has just been set; wait for the first evaluation and check again before you deploy 1110."
            }
            Write-Warning $text
            $blocking.Add("'$($group.displayName)' is empty")
        }
    }

    $status = if ($existing.Count -eq 1) { 'already existed' } elseif ($groupObject) { 'created' } else { 'skipped (WhatIf)' }
    $result.Add([pscustomobject]@{
            Kind   = 'Group'
            Name   = $group.displayName
            Id     = $groupObject.Id
            Status = $status
            Danger = $group.danger
        })
}

# -------------------------------------------------------- named locations ----

$existingLocations = @(Get-MgIdentityConditionalAccessNamedLocation -All)

foreach ($location in $prereq.namedLocations) {
    $existing = @($existingLocations | Where-Object DisplayName -eq $location.displayName)

    if ($existing.Count -ge 1) {
        Write-Host "  = $($location.displayName) already exists ($($existing[0].Id))"
        Write-Host "    note: the content is NOT updated. Check country codes / IP ranges by hand against prerequisites/ca-prerequisites.json."
        $result.Add([pscustomobject]@{ Kind = 'Location'; Name = $location.displayName; Id = $existing[0].Id; Status = 'already existed'; Danger = $location.danger })
        continue
    }

    # Entra provides a compliantNetworkNamedLocation itself once Global Secure Access is set
    # up; it cannot be created. If it is missing, that is not a step this script can take but a
    # blocker for the templates that refer to it (1180).
    if ($location.notCreatable) {
        Write-Warning "'$($location.displayName)' does not exist in this tenant and cannot be created. $($location.notCreatable)"
        $blocking.Add("'$($location.displayName)' is missing - do not deploy the templates that refer to it")
        $result.Add([pscustomobject]@{ Kind = 'Location'; Name = $location.displayName; Id = $null; Status = 'missing (cannot be created)'; Danger = $location.danger })
        continue
    }

    $body = $location.definition | ConvertTo-Json -Depth 10 | ConvertFrom-Json -AsHashtable

    # This script does not guess the country list either: an empty list in 1040 blocks every
    # sign-in, and a default list fits no tenant exactly.
    if ($location.requiresCountries) {
        if (-not $AllowedCountry) {
            Write-Warning "'$($location.displayName)' skipped: no -AllowedCountry given. $($location.tenantSpecific)"
            $blocking.Add("'$($location.displayName)' is missing (no countries given) - do not deploy 1040")
            $result.Add([pscustomobject]@{ Kind = 'Location'; Name = $location.displayName; Id = $null; Status = 'skipped (no countries)'; Danger = $location.danger })
            continue
        }
        $body.countriesAndRegions = @($AllowedCountry)
    }

    # The IP location is the one thing this script refuses to guess. An empty trusted-IP
    # location in 1060 pins the service accounts to zero addresses; someone else's IP is worse.
    if ($location.requiresIpRanges) {
        if (-not $ServiceAccountIpRange) {
            Write-Warning "'$($location.displayName)' skipped: no -ServiceAccountIpRange given. $($location.tenantSpecific)"
            $blocking.Add("'$($location.displayName)' is missing (no IP range given) - do not deploy 1060")
            $result.Add([pscustomobject]@{ Kind = 'Location'; Name = $location.displayName; Id = $null; Status = 'skipped (no IP range)'; Danger = $location.danger })
            continue
        }
        $body.ipRanges = @($ServiceAccountIpRange | ForEach-Object {
                @{ '@odata.type' = '#microsoft.graph.iPv4CidrRange'; cidrAddress = $_ }
            })
    }

    if ($PSCmdlet.ShouldProcess($location.displayName, 'Create named location')) {
        $new = New-MgIdentityConditionalAccessNamedLocation -BodyParameter $body
        Write-Host "  + $($location.displayName) created ($($new.Id))" -ForegroundColor Green
        $result.Add([pscustomobject]@{ Kind = 'Location'; Name = $location.displayName; Id = $new.Id; Status = 'created'; Danger = $location.danger })
    }
    else {
        $result.Add([pscustomobject]@{ Kind = 'Location'; Name = $location.displayName; Id = $null; Status = 'skipped (WhatIf)'; Danger = $location.danger })
    }
}

# ----------------------------------------------- authentication strengths ----

# A custom authentication strength gets its id only on creation. The template in CATemplate/
# therefore carries a zero GUID: it is the source for all tenants and cannot carry the id of
# one of them. This script creates the strength and reports the real id, so it ends up in the
# CIPP deployment. Until that has happened, the grant points at nothing.

$existingStrengths = @(Get-MgPolicyAuthenticationStrengthPolicy -All)

foreach ($strength in $prereq.authenticationStrengths) {
    $existing = @($existingStrengths | Where-Object DisplayName -eq $strength.displayName)

    if ($existing.Count -gt 1) {
        Write-Warning "Several authentication strengths are named '$($strength.displayName)'. Which one the grant picks cannot be told - clean that up first."
        $blocking.Add("duplicate authentication strength '$($strength.displayName)'")
        continue
    }

    if ($existing.Count -eq 1) {
        $current = $existing[0]
        Write-Host "  = $($strength.displayName) already exists ($($current.Id))"

        # The combinations are the measure itself. A strength with the same name that allows
        # other combinations is more dangerous than no strength: it looks right.
        $expected = @($strength.definition.allowedCombinations | Sort-Object)
        $found = @($current.AllowedCombinations | Sort-Object)
        if (Compare-Object $expected $found) {
            Write-Warning "'$($strength.displayName)' is set to [$($found -join ', ')] but should be [$($expected -join ', ')]."
            $blocking.Add("'$($strength.displayName)' allows other combinations than the baseline prescribes")
        }

        Write-Host "    id for the deployment: $($current.Id)  (replace $($strength.placeholderId) with it in the CIPP deployment)" -ForegroundColor Cyan
        $result.Add([pscustomobject]@{ Kind = 'Strength'; Name = $strength.displayName; Id = $current.Id; Status = 'already existed'; Danger = $strength.danger })
        continue
    }

    $body = @{
        displayName         = $strength.definition.displayName
        description         = $strength.definition.description
        allowedCombinations = @($strength.definition.allowedCombinations)
    }

    if ($PSCmdlet.ShouldProcess($strength.displayName, 'Create authentication strength')) {
        $newStrength = New-MgPolicyAuthenticationStrengthPolicy -BodyParameter $body
        Write-Host "  + $($strength.displayName) created ($($newStrength.Id))" -ForegroundColor Green
        Write-Host "    id for the deployment: $($newStrength.Id)  (replace $($strength.placeholderId) with it in the CIPP deployment)" -ForegroundColor Cyan
        $result.Add([pscustomobject]@{ Kind = 'Strength'; Name = $strength.displayName; Id = $newStrength.Id; Status = 'created'; Danger = $strength.danger })
    }
    else {
        $result.Add([pscustomobject]@{ Kind = 'Strength'; Name = $strength.displayName; Id = $null; Status = 'skipped (WhatIf)'; Danger = $strength.danger })
    }
}

# ------------------------------------------------ authentication contexts ----

# Empty today: no template refers to a context, because a context is a choice per tenant (a
# SharePoint site with a label, a PIM activation) and not a baseline measure. The loop is here
# so that creating one is already handled when one does come along.

if ($prereq.authenticationContexts -and $prereq.authenticationContexts.Count -gt 0) {
    $existingContexts = @(Get-MgIdentityConditionalAccessAuthenticationContextClassReference -All)

    foreach ($context in $prereq.authenticationContexts) {
        $existing = @($existingContexts | Where-Object Id -eq $context.id)

        if ($existing.Count -eq 1) {
            Write-Host "  = $($context.id) ($($context.displayName)) already exists"
            # Not published is the silent failure: the context exists, the CA policy targets
            # it, but no app can select it - so it is never invoked.
            if (-not $existing[0].IsAvailable) {
                Write-Warning "'$($context.id)' has isAvailable false: no app can select it, so the policy that targets it protects nothing."
                $blocking.Add("'$($context.id)' is not published to apps")
            }
            $result.Add([pscustomobject]@{ Kind = 'Context'; Name = "$($context.id) $($context.displayName)"; Id = $context.id; Status = 'already existed'; Danger = $context.danger })
            continue
        }

        $body = @{
            id          = $context.id
            displayName = $context.displayName
            description = $context.description
            isAvailable = $true
        }

        if ($PSCmdlet.ShouldProcess("$($context.id) ($($context.displayName))", 'Create authentication context')) {
            $newContext = New-MgIdentityConditionalAccessAuthenticationContextClassReference -BodyParameter $body
            Write-Host "  + $($context.id) ($($context.displayName)) created" -ForegroundColor Green
            $result.Add([pscustomobject]@{ Kind = 'Context'; Name = "$($context.id) $($context.displayName)"; Id = $newContext.Id; Status = 'created'; Danger = $context.danger })
        }
        else {
            $result.Add([pscustomobject]@{ Kind = 'Context'; Name = "$($context.id) $($context.displayName)"; Id = $null; Status = 'skipped (WhatIf)'; Danger = $context.danger })
        }
    }
}

# ---------------------------------------------------------------- summary ----

$result | Format-Table -AutoSize

if ($blocking.Count -gt 0) {
    Write-Host ''
    Write-Host 'NOT READY FOR DEPLOYMENT:' -ForegroundColor Yellow
    $blocking | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    Write-Host ''
    Write-Host 'Only set the CA baseline to Remediate once this list is empty. Until then: Report only.' -ForegroundColor Yellow
    if ($RequireSafeToDeploy) {
        throw "Prerequisites incomplete ($($blocking.Count) item(s)) - do not deploy the CA baseline."
    }
}
else {
    Write-Host ''
    Write-Host 'All prerequisites are in place. The CA baseline can be deployed.' -ForegroundColor Green
}
