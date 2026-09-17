#Requires -Modules Microsoft.Graph.Groups, Microsoft.Graph.Identity.SignIns
<#
.SYNOPSIS
    Maakt in een klanttenant de groepen, named locations, custom authentication strengths en
    authentication contexts aan waar de CA-templates in CATemplate/ naar verwijzen. Draaien
    VOORDAT de baseline wordt uitgerold.

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

    Een custom authentication strength faalt op een derde manier. Entra kent zijn id pas toe
    bij aanmaken, dus het template in CATemplate/ draagt een nul-GUID - het is de bron voor
    alle tenants en kan het id van een van hen niet dragen. Dit script maakt de strength aan
    en meldt het echte id; zolang dat niet in de CIPP-uitrol staat, verwijst de grant van 2180
    naar een id dat in die tenant niet bestaat.

    Het script is idempotent: bestaande objecten worden herkend op displayName (een context op
    zijn id) en niet overschreven - alleen gerapporteerd. Wat er afwijkt zegt het erbij. Bij een
    bestaande authentication strength vergelijkt het wel de toegestane combinaties: dezelfde naam
    met andere combinaties is gevaarlijker dan geen strength, want die ziet er goed uit.

.PARAMETER TenantId
    De klanttenant. Wordt doorgegeven aan Connect-MgGraph.

.PARAMETER ServiceAccountIpRange
    De publieke IP-range(s) van waaraf de serviceaccounts van DEZE klant mogen aanmelden,
    als CIDR. Verplicht zodra je 1060 wilt uitrollen. Het template in CATemplate/ draagt hier
    bewust geen IP-range: die hoort bij één klant en komt dus alleen via deze parameter binnen.

.PARAMETER AllowedCountry
    De landen waarbinnen aanmelden mag, als ISO 3166-1 alpha-2 (bijv. 'NL','BE'). Verplicht
    zodra je 1040 wilt uitrollen: de repo draagt bewust geen standaardlanden, want de lijst
    hangt af van vestigingen, thuiswerkers en reizigers van deze klant.

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

Connect-MgGraph -TenantId $TenantId -Scopes 'Group.ReadWrite.All', 'Policy.ReadWrite.ConditionalAccess', 'Policy.ReadWrite.AuthenticationMethod', 'User.Read.All' -NoWelcome

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

    # Ook de landenlijst raadt dit script niet: een lege lijst in 1040 blokkeert elke
    # aanmelding, en een standaardlijst past bij geen enkele klant precies.
    if ($locatie.requiresCountries) {
        if (-not $AllowedCountry) {
            Write-Warning "'$($locatie.displayName)' overgeslagen: geen -AllowedCountry opgegeven. $($locatie.tenantSpecific)"
            $blokkerend.Add("'$($locatie.displayName)' ontbreekt (geen landen opgegeven) - rol 1040 niet uit")
            $resultaat.Add([pscustomobject]@{ Soort = 'Locatie'; Naam = $locatie.displayName; Id = $null; Status = 'overgeslagen (geen landen)'; Gevaar = $locatie.danger })
            continue
        }
        $body.countriesAndRegions = @($AllowedCountry)
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

# ------------------------------------------- authentication strengths ----

# Een custom authentication strength krijgt zijn id pas bij aanmaken. Het template in
# CATemplate/ draagt daarom een nul-GUID: het is de bron voor alle tenants en kan geen id van
# een van hen dragen. Dit script maakt de strength aan en meldt het echte id, zodat dat in de
# CIPP-uitrol terechtkomt. Zolang dat niet gebeurd is, wijst de grant naar niets.

$bestaandeStrengths = @(Get-MgPolicyAuthenticationStrengthPolicy -All)

foreach ($strength in $prereq.authenticationStrengths) {
    $bestaand = @($bestaandeStrengths | Where-Object DisplayName -eq $strength.displayName)

    if ($bestaand.Count -gt 1) {
        Write-Warning "Meerdere authentication strengths heten '$($strength.displayName)'. Welke de grant pakt is dan niet te zeggen - ruim dat eerst op."
        $blokkerend.Add("dubbele authentication strength '$($strength.displayName)'")
        continue
    }

    if ($bestaand.Count -eq 1) {
        $huidig = $bestaand[0]
        Write-Host "  = $($strength.displayName) bestaat al ($($huidig.Id))"

        # De combinaties zijn de maatregel zelf. Een strength die dezelfde naam draagt maar
        # andere combinaties toestaat is gevaarlijker dan geen strength: hij ziet er goed uit.
        $verwacht = @($strength.definition.allowedCombinations | Sort-Object)
        $gevonden = @($huidig.AllowedCombinations | Sort-Object)
        if (Compare-Object $verwacht $gevonden) {
            Write-Warning "'$($strength.displayName)' staat op [$($gevonden -join ', ')] maar hoort op [$($verwacht -join ', ')]."
            $blokkerend.Add("'$($strength.displayName)' laat andere combinaties toe dan de baseline voorschrijft")
        }

        Write-Host "    id voor de uitrol: $($huidig.Id)  (vervang hiermee $($strength.placeholderId) in de CIPP-uitrol)" -ForegroundColor Cyan
        $resultaat.Add([pscustomobject]@{ Soort = 'Strength'; Naam = $strength.displayName; Id = $huidig.Id; Status = 'bestond al'; Gevaar = $strength.danger })
        continue
    }

    $body = @{
        displayName         = $strength.definition.displayName
        description         = $strength.definition.description
        allowedCombinations = @($strength.definition.allowedCombinations)
    }

    if ($PSCmdlet.ShouldProcess($strength.displayName, 'Authentication strength aanmaken')) {
        $nieuwStrength = New-MgPolicyAuthenticationStrengthPolicy -BodyParameter $body
        Write-Host "  + $($strength.displayName) aangemaakt ($($nieuwStrength.Id))" -ForegroundColor Green
        Write-Host "    id voor de uitrol: $($nieuwStrength.Id)  (vervang hiermee $($strength.placeholderId) in de CIPP-uitrol)" -ForegroundColor Cyan
        $resultaat.Add([pscustomobject]@{ Soort = 'Strength'; Naam = $strength.displayName; Id = $nieuwStrength.Id; Status = 'aangemaakt'; Gevaar = $strength.danger })
    }
    else {
        $resultaat.Add([pscustomobject]@{ Soort = 'Strength'; Naam = $strength.displayName; Id = $null; Status = 'overgeslagen (WhatIf)'; Gevaar = $strength.danger })
    }
}

# -------------------------------------------- authentication contexts ----

# Vandaag leeg: geen enkel template verwijst naar een context, want een context is een
# klantkeuze (een SharePoint-site met een label, een PIM-activatie) en geen baselinemaatregel.
# De lus staat er zodat het aanmaken al geregeld is op het moment dat er wel een bij komt.

if ($prereq.authenticationContexts -and $prereq.authenticationContexts.Count -gt 0) {
    $bestaandeContexts = @(Get-MgIdentityConditionalAccessAuthenticationContextClassReference -All)

    foreach ($context in $prereq.authenticationContexts) {
        $bestaand = @($bestaandeContexts | Where-Object Id -eq $context.id)

        if ($bestaand.Count -eq 1) {
            Write-Host "  = $($context.id) ($($context.displayName)) bestaat al"
            # Niet-gepubliceerd is de stille fout: de context bestaat, de CA-policy pakt hem,
            # maar geen app kan hem kiezen - dus hij wordt nooit aangeroepen.
            if (-not $bestaand[0].IsAvailable) {
                Write-Warning "'$($context.id)' staat op isAvailable false: geen enkele app kan hem kiezen, dus de policy die hem als target heeft beschermt niets."
                $blokkerend.Add("'$($context.id)' is niet gepubliceerd naar apps")
            }
            $resultaat.Add([pscustomobject]@{ Soort = 'Context'; Naam = "$($context.id) $($context.displayName)"; Id = $context.id; Status = 'bestond al'; Gevaar = $context.danger })
            continue
        }

        $body = @{
            id          = $context.id
            displayName = $context.displayName
            description = $context.description
            isAvailable = $true
        }

        if ($PSCmdlet.ShouldProcess("$($context.id) ($($context.displayName))", 'Authentication context aanmaken')) {
            $nieuwContext = New-MgIdentityConditionalAccessAuthenticationContextClassReference -BodyParameter $body
            Write-Host "  + $($context.id) ($($context.displayName)) aangemaakt" -ForegroundColor Green
            $resultaat.Add([pscustomobject]@{ Soort = 'Context'; Naam = "$($context.id) $($context.displayName)"; Id = $nieuwContext.Id; Status = 'aangemaakt'; Gevaar = $context.danger })
        }
        else {
            $resultaat.Add([pscustomobject]@{ Soort = 'Context'; Naam = "$($context.id) $($context.displayName)"; Id = $null; Status = 'overgeslagen (WhatIf)'; Gevaar = $context.danger })
        }
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
