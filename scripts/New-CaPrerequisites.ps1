#Requires -Modules Microsoft.Graph.Groups, Microsoft.Graph.Identity.SignIns
<#
.SYNOPSIS
    Maakt in een klanttenant de groepen en named locations aan waar de CA-templates in
    CATemplate/ naar verwijzen. Draaien VOORDAT de baseline wordt uitgerold.

.DESCRIPTION
    De templates verwijzen naar zes groepen en drie named locations die geen enkele tenant
    vanzelf heeft. Ontbreken ze, dan faalt dat de verkeerde kant op: een uitzonderingsgroep
    die niet bestaat sluit niemand uit, dus de policy wordt strenger dan bedoeld. Twee
    gevallen zijn daarbij niet "strenger" maar "gesloten":

      Excluded from Conditional Access  staat in 32 van de 33 templates. Leeg = geen enkel
                                        account valt buiten de baseline = geen break-glass.
      Licensed Users                    1110 (state: enabled) blokkeert All behalve deze
                                        groep. Leeg of statisch = elke gebruiker geblokkeerd.

    Vandaar dat dit script die twee expliciet controleert en met -RequireSafeToDeploy zelfs
    weigert af te ronden zolang ze leeg zijn.

    Het script is idempotent: bestaande groepen en locaties worden herkend op displayName en
    niet overschreven - alleen gerapporteerd. Wat er afwijkt zegt het erbij.

.PARAMETER TenantId
    De klanttenant. Wordt doorgegeven aan Connect-MgGraph.

.PARAMETER ServiceAccountIpRange
    De publieke IP-range(s) van waaraf de serviceaccounts van DEZE klant mogen aanmelden,
    als CIDR. Verplicht zodra je 1060 wilt uitrollen. Het template in CATemplate/ draagt hier
    94.110.96.252/32 - een specifieke tenant, per ongeluk meegeexporteerd, en dit script
    gebruikt die waarde bewust niet.

.PARAMETER AllowedCountry
    Overschrijft de landenlijst van 'Allowed Countries' (standaard BE, NL uit
    prerequisites/ca-prerequisites.json). Een klant met een vestiging elders heeft een
    andere lijst; dat is een klantkeuze, geen baseline.

.PARAMETER BreakGlassUserId
    Object-id('s) van de noodaccounts die in 'Excluded from Conditional Access' moeten. Laat
    je dit leeg, dan wordt de groep wel aangemaakt maar blijft hij leeg - en dan mag de
    baseline niet op Remediate.

.PARAMETER RequireSafeToDeploy
    Sluit af met een fout zolang de kritieke groepen geen leden hebben. Gebruik dit in een
    uitrolpijplijn, zodat de CA-stap niet draait na een half geslaagde voorbereiding.

.EXAMPLE
    ./scripts/New-CaPrerequisites.ps1 -TenantId contoso.onmicrosoft.com -WhatIf

.EXAMPLE
    ./scripts/New-CaPrerequisites.ps1 -TenantId contoso.onmicrosoft.com -ServiceAccountIpRange '203.0.113.10/32' -BreakGlassUserId '00000000-1111-2222-3333-444444444444' -RequireSafeToDeploy
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
Write-Host "Randvoorwaarden uit $($prereq.version) (herzien $($prereq.reviewedAt))" -ForegroundColor Cyan

Connect-MgGraph -TenantId $TenantId -Scopes 'Group.ReadWrite.All', 'Policy.ReadWrite.ConditionalAccess', 'User.Read.All' -NoWelcome

$resultaat = [System.Collections.Generic.List[object]]::new()
$blokkerend = [System.Collections.Generic.List[string]]::new()

# ---------------------------------------------------------------- groepen ----

foreach ($groep in $prereq.groups) {
    $bestaand = @(Get-MgGroup -Filter "displayName eq '$($groep.displayName)'" -All)

    if ($bestaand.Count -gt 1) {
        Write-Warning "Meerdere groepen heten '$($groep.displayName)'. De CA-templates matchen op naam, dus dit is dubbelzinnig - ruim dat eerst op."
        $blokkerend.Add("dubbele groep '$($groep.displayName)'")
        continue
    }

    $groepObject = $null

    if ($bestaand.Count -eq 1) {
        $groepObject = $bestaand[0]
        Write-Host "  = $($groep.displayName) bestaat al ($($groepObject.Id))"

        # Een 'Licensed Users' die statisch blijkt te zijn is gevaarlijker dan geen groep:
        # 1110 blokkeert dan iedereen die er niet handmatig in staat.
        if ($groep.membershipType -eq 'dynamic' -and $groepObject.GroupTypes -notcontains 'DynamicMembership') {
            Write-Warning "'$($groep.displayName)' bestaat maar is NIET dynamisch. $($groep.dangerReason)"
            $blokkerend.Add("'$($groep.displayName)' is statisch terwijl hij dynamisch moet zijn")
        }
    }
    else {
        $body = @{
            displayName     = $groep.displayName
            mailNickname    = $groep.mailNickname
            description     = $groep.purpose
            securityEnabled = $true
            mailEnabled     = $false
            groupTypes      = @()
        }
        if ($groep.membershipType -eq 'dynamic') {
            $body.groupTypes = @('DynamicMembership')
            $body.membershipRule = $groep.membershipRule
            $body.membershipRuleProcessingState = $groep.membershipRuleProcessingState
        }

        if ($PSCmdlet.ShouldProcess($groep.displayName, 'Groep aanmaken')) {
            $groepObject = New-MgGroup -BodyParameter $body
            Write-Host "  + $($groep.displayName) aangemaakt ($($groepObject.Id))" -ForegroundColor Green
        }
    }

    # Break-glass-leden. Alleen voor de groep die daarom vraagt; de rest vult de beheerder
    # zelf, want wie daar in hoort is per klant een afweging en geen script.
    if ($groepObject -and $groep.displayName -eq 'Excluded from Conditional Access' -and $BreakGlassUserId) {
        $huidigeLeden = @(Get-MgGroupMember -GroupId $groepObject.Id -All).Id
        foreach ($userId in $BreakGlassUserId) {
            if ($huidigeLeden -contains $userId) {
                Write-Host "    = $userId zit er al in"
                continue
            }
            if ($PSCmdlet.ShouldProcess("$userId -> $($groep.displayName)", 'Lid toevoegen')) {
                New-MgGroupMember -GroupId $groepObject.Id -DirectoryObjectId $userId
                Write-Host "    + $userId toegevoegd" -ForegroundColor Green
            }
        }
    }

    # De kritieke groepen moeten leden hebben voordat de baseline mag afdwingen. Bij een
    # dynamische groep kan de eerste evaluatie een paar minuten duren - leeg betekent daar
    # dus 'nog niet klaar', niet per se 'fout'.
    if ($groepObject -and $groep.requiresMembers) {
        $leden = @(Get-MgGroupMember -GroupId $groepObject.Id -Top 1)
        if ($leden.Count -eq 0) {
            $tekst = "'$($groep.displayName)' heeft geen leden. $($groep.dangerReason)"
            if ($groep.membershipType -eq 'dynamic') {
                $tekst += " De dynamische regel is net gezet; wacht op de eerste evaluatie en controleer opnieuw voordat je 1110 uitrolt."
            }
            Write-Warning $tekst
            $blokkerend.Add("'$($groep.displayName)' is leeg")
        }
    }

    $status = if ($bestaand.Count -eq 1) { 'bestond al' } elseif ($groepObject) { 'aangemaakt' } else { 'overgeslagen (WhatIf)' }
    $resultaat.Add([pscustomobject]@{
            Soort  = 'Groep'
            Naam   = $groep.displayName
            Id     = $groepObject.Id
            Status = $status
            Gevaar = $groep.danger
        })
}

# -------------------------------------------------------- named locations ----

$bestaandeLocaties = @(Get-MgIdentityConditionalAccessNamedLocation -All)

foreach ($locatie in $prereq.namedLocations) {
    $bestaand = @($bestaandeLocaties | Where-Object DisplayName -eq $locatie.displayName)

    if ($bestaand.Count -ge 1) {
        Write-Host "  = $($locatie.displayName) bestaat al ($($bestaand[0].Id))"
        Write-Host "    let op: de inhoud wordt NIET bijgewerkt. De platform-engine vergelijkt named locations op volledige inhoud - controleer landcodes/IP-ranges met de hand."
        $resultaat.Add([pscustomobject]@{ Soort = 'Locatie'; Naam = $locatie.displayName; Id = $bestaand[0].Id; Status = 'bestond al'; Gevaar = $locatie.danger })
        continue
    }

    # Een compliantNetworkNamedLocation levert Entra zelf zodra Global Secure Access is
    # ingericht; aanmaken kan niet. Ontbreekt hij, dan is dat geen stap die dit script kan
    # zetten maar een blokkade voor de templates die ernaar verwijzen (1180).
    if ($locatie.notCreatable) {
        Write-Warning "'$($locatie.displayName)' bestaat niet in deze tenant en is niet aan te maken. $($locatie.notCreatable)"
        $blokkerend.Add("'$($locatie.displayName)' ontbreekt - rol de templates die ernaar verwijzen niet uit")
        $resultaat.Add([pscustomobject]@{ Soort = 'Locatie'; Naam = $locatie.displayName; Id = $null; Status = 'ontbreekt (niet aan te maken)'; Gevaar = $locatie.danger })
        continue
    }

    $body = $locatie.definition | ConvertTo-Json -Depth 10 | ConvertFrom-Json -AsHashtable

    if ($locatie.displayName -eq 'Allowed Countries' -and $AllowedCountry) {
        $body.countriesAndRegions = $AllowedCountry
    }

    # De IP-locatie is het enige dat dit script weigert te raden. Een lege trusted-IP-locatie
    # in 1060 zet de serviceaccounts vast op nul adressen; de IP van iemand anders is erger.
    if ($locatie.requiresIpRanges) {
        if (-not $ServiceAccountIpRange) {
            Write-Warning "'$($locatie.displayName)' overgeslagen: geen -ServiceAccountIpRange opgegeven. $($locatie.tenantSpecific)"
            $blokkerend.Add("'$($locatie.displayName)' ontbreekt (geen IP-range opgegeven) - rol 1060 niet uit")
            $resultaat.Add([pscustomobject]@{ Soort = 'Locatie'; Naam = $locatie.displayName; Id = $null; Status = 'overgeslagen (geen IP-range)'; Gevaar = $locatie.danger })
            continue
        }
        $body.ipRanges = @($ServiceAccountIpRange | ForEach-Object {
                @{ '@odata.type' = '#microsoft.graph.iPv4CidrRange'; cidrAddress = $_ }
            })
    }

    if ($PSCmdlet.ShouldProcess($locatie.displayName, 'Named location aanmaken')) {
        $nieuw = New-MgIdentityConditionalAccessNamedLocation -BodyParameter $body
        Write-Host "  + $($locatie.displayName) aangemaakt ($($nieuw.Id))" -ForegroundColor Green
        $resultaat.Add([pscustomobject]@{ Soort = 'Locatie'; Naam = $locatie.displayName; Id = $nieuw.Id; Status = 'aangemaakt'; Gevaar = $locatie.danger })
    }
    else {
        $resultaat.Add([pscustomobject]@{ Soort = 'Locatie'; Naam = $locatie.displayName; Id = $null; Status = 'overgeslagen (WhatIf)'; Gevaar = $locatie.danger })
    }
}

# ------------------------------------------------------------- afsluiting ----

$resultaat | Format-Table -AutoSize

if ($blokkerend.Count -gt 0) {
    Write-Host ''
    Write-Host 'NIET KLAAR VOOR UITROL:' -ForegroundColor Yellow
    $blokkerend | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    Write-Host ''
    Write-Host 'Zet de CA-baseline pas op Remediate als deze lijst leeg is. Tot die tijd: alleen Report.' -ForegroundColor Yellow
    if ($RequireSafeToDeploy) {
        throw "Randvoorwaarden niet compleet ($($blokkerend.Count) punt(en)) - CA-baseline niet uitrollen."
    }
}
else {
    Write-Host ''
    Write-Host 'Alle randvoorwaarden staan. De CA-baseline kan uitgerold worden.' -ForegroundColor Green
}
