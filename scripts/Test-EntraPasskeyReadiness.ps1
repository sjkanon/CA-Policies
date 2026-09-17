#Requires -Modules Microsoft.Graph.Identity.SignIns, Microsoft.Graph.Users, Microsoft.Graph.Groups
<#
.SYNOPSIS
    Zegt vóór de uitrol of een gebruiker een passkey kán registreren, en zo niet: waarom.
    Leest alleen; wijzigt niets.

.DESCRIPTION
    Op 16 september 2026 kostte dit bij tejo.be dertien mislukte pogingen over tachtig minuten,
    met in het auditlog niets anders dan "User started the registration for Passkey" zonder
    afloop. De oorzaak stond in de documentatie maar niet in de foutmelding:

        Op een Entra joined of registered toestel blokkeert een BESTAANDE
        Windows Hello for Business-credential de registratie van een passkey voor
        datzelfde account in dezelfde Windows Hello-container.

    Dit script controleert die blokkade en de vijf andere die stil falen, en geeft per punt een
    verdict met wat je eraan doet. Dertig seconden in plaats van tachtig minuten.

    WAT HET CONTROLEERT

      1. Staat Passkey (FIDO2) aan, en mag de gebruiker self-service registreren?
      2. Heeft de gebruiker al een WHfB-credential? (blokkeert Entra passkey on Windows)
      3. Heeft de gebruiker een TAP, en is die EENMALIG? (GLOBAL__2180 eist temporaryAccessPassOneTime)
      4. Is de gebruiker een gast? (gasten kunnen helemaal geen passkey registreren)
      5. Dwingt het beleid attestation af? (sluit synced passkeys en Windows Hello uit)
      6. Is er een AAGUID-beperking die Windows Hello uitsluit?

    WAT HET NIET KAN

    De vijf-minutenregel - de gebruiker moet binnen de laatste vijf minuten MFA hebben gedaan
    voordat hij mag registreren - is niet uit te lezen. Die staat daarom als herinnering in de
    uitvoer, niet als check.

.PARAMETER TenantId
    De klanttenant.

.PARAMETER UserPrincipalName
    De gebruiker(s) die je wilt controleren.

.PARAMETER Scenario
    Waar je naartoe wilt. Bepaalt hoe een bestaande WHfB-credential beoordeeld wordt:

      WindowsHelloPasskey  Een passkey in de Windows Hello-container (Entra passkey on Windows).
                           Een bestaande WHfB-credential is dan een BLOKKADE.
      SecurityKey          Een passkey op een losse FIDO2-sleutel of in Authenticator.
                           Een bestaande WHfB-credential maakt dan niets uit.
      WindowsHelloForBusiness  Aanmelden op het toestel zelf. Dan is een bestaande
                           WHfB-credential juist wat je wílt zien.

    Standaard SecurityKey: dat is het scenario waarin niets elkaar in de weg zit.

.EXAMPLE
    ./scripts/Test-EntraPasskeyReadiness.ps1 -TenantId tejo.be -UserPrincipalName info.kalmthout@tejo.be

.EXAMPLE
    ./scripts/Test-EntraPasskeyReadiness.ps1 -TenantId tejo.be -UserPrincipalName info.kalmthout@tejo.be -Scenario WindowsHelloPasskey
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

$gewenst = Get-Content -Path $MethodsPath -Raw | ConvertFrom-Json
$helloAaGuids = @(
    $gewenst.knownAaGuids.windowsHelloHardware
    $gewenst.knownAaGuids.windowsHelloVbsHardware
    $gewenst.knownAaGuids.windowsHelloSoftware
) | Where-Object { $_ }

Connect-MgGraph -TenantId $TenantId -Scopes 'Policy.Read.All', 'UserAuthenticationMethod.Read.All', 'User.Read.All' -NoWelcome

Write-Host "Scenario: $Scenario" -ForegroundColor Cyan
Write-Host ''

# ------------------------------------------------------ tenantbreed ----

$tenantBevindingen = [System.Collections.Generic.List[object]]::new()
$voegToe = { param($lijst, $punt, $verdict, $uitleg)
    $lijst.Add([pscustomobject]@{ Punt = $punt; Verdict = $verdict; Wat = $uitleg })
}

$fido = $null
try {
    $fido = Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId 'Fido2'
}
catch {
    & $voegToe $tenantBevindingen 'Passkey (FIDO2)' 'ONBEKEND' "Niet uit te lezen: $($_.Exception.Message)"
}

if ($fido) {
    if ($fido.State -eq 'enabled') {
        & $voegToe $tenantBevindingen 'Passkey (FIDO2)' 'OK' 'Methode staat aan'
    }
    else {
        & $voegToe $tenantBevindingen 'Passkey (FIDO2)' 'BLOKKEERT' "Methode staat op $($fido.State). Niemand kan registreren, en GLOBAL__2120 is dan onvervulbaar."
    }

    $extra = $fido.AdditionalProperties

    if ($extra.isSelfServiceRegistrationAllowed -eq $false) {
        & $voegToe $tenantBevindingen 'Self-service registratie' 'BLOKKEERT' 'Staat op No. Niemand kan via Security info registreren, ook niet met de methode aan.'
    }
    else {
        & $voegToe $tenantBevindingen 'Self-service registratie' 'OK' 'Toegestaan'
    }

    if ($extra.isAttestationEnforced -eq $true) {
        $verdict = if ($Scenario -eq 'WindowsHelloPasskey') { 'BLOKKEERT' } else { 'LET OP' }
        & $voegToe $tenantBevindingen 'Attestation' $verdict 'Wordt afgedwongen. Sluit gesynchroniseerde passkeys uit, en Windows Hello-passkeys kunnen er helemaal niet mee.'
    }
    else {
        & $voegToe $tenantBevindingen 'Attestation' 'OK' 'Wordt niet afgedwongen'
    }

    # Een allow-lijst zonder de Windows Hello-AAGUID's sluit Windows Hello uit; een block-lijst
    # met die AAGUID's erin doet hetzelfde. Allebei stil.
    $restricties = $extra.keyRestrictions
    if ($restricties -and $restricties.isEnforced) {
        $lijst = @($restricties.aaGuids)
        $heeftHello = @($lijst | Where-Object { $helloAaGuids -contains $_ }).Count -gt 0
        $type = $restricties.enforcementType
        $helloToegestaan = ($type -eq 'allow' -and $heeftHello) -or ($type -eq 'block' -and -not $heeftHello)

        if ($Scenario -eq 'WindowsHelloPasskey' -and -not $helloToegestaan) {
            & $voegToe $tenantBevindingen 'AAGUID-beperking' 'BLOKKEERT' "enforcementType=$type met $($lijst.Count) AAGUID('s); Windows Hello zit er niet bij. Voeg $($gewenst.knownAaGuids.windowsHelloHardware) toe."
        }
        else {
            & $voegToe $tenantBevindingen 'AAGUID-beperking' 'LET OP' "enforcementType=$type met $($lijst.Count) AAGUID('s). Controleer of de authenticator van de gebruiker erin past."
        }
    }
    else {
        & $voegToe $tenantBevindingen 'AAGUID-beperking' 'OK' 'Geen beperking'
    }
}

$tenantBevindingen | Format-Table -AutoSize

# ------------------------------------------------------ per gebruiker ----

$eindoordeel = [System.Collections.Generic.List[object]]::new()

foreach ($upn in $UserPrincipalName) {
    Write-Host "--- $upn ---" -ForegroundColor Cyan
    $bevindingen = [System.Collections.Generic.List[object]]::new()

    $gebruiker = $null
    try { $gebruiker = Get-MgUser -UserId $upn -Property 'id,userPrincipalName,userType,displayName' }
    catch {
        Write-Warning "Gebruiker niet gevonden: $($_.Exception.Message)"
        $eindoordeel.Add([pscustomobject]@{ Gebruiker = $upn; Oordeel = 'ONBEKEND'; Reden = 'gebruiker niet gevonden' })
        continue
    }

    # Gasten kunnen geen passkey registreren. Punt. Geen instelling die dat verandert.
    if ($gebruiker.UserType -eq 'Guest') {
        & $voegToe $bevindingen 'Gebruikerstype' 'BLOKKEERT' 'Gast. Registratie van passkeys wordt voor gasten niet ondersteund - ook niet met alles goed ingesteld.'
    }
    else {
        & $voegToe $bevindingen 'Gebruikerstype' 'OK' $gebruiker.UserType
    }

    # DE valkuil.
    $whfb = @()
    try { $whfb = @(Get-MgUserAuthenticationWindowsHelloForBusinessMethod -UserId $gebruiker.Id) } catch { }

    switch ($Scenario) {
        'WindowsHelloPasskey' {
            if ($whfb.Count -gt 0) {
                $namen = ($whfb | ForEach-Object { $_.DisplayName }) -join ', '
                & $voegToe $bevindingen 'Bestaande WHfB-credential' 'BLOKKEERT' "$($whfb.Count) gevonden ($namen). Een passkey in dezelfde Windows Hello-container kan hiernaast niet worden geregistreerd; de registratie faalt zonder bruikbare melding. Overweeg eerst of WHfB hier niet juist de bedoeling is - op een beheerd, Entra joined toestel is dat meestal zo."
            }
            else {
                & $voegToe $bevindingen 'Bestaande WHfB-credential' 'OK' 'Geen - de container is vrij'
            }
        }
        'WindowsHelloForBusiness' {
            if ($whfb.Count -gt 0) {
                & $voegToe $bevindingen 'WHfB-credential' 'OK' "$($whfb.Count) aanwezig - dit is wat je wilde"
            }
            else {
                & $voegToe $bevindingen 'WHfB-credential' 'LET OP' 'Geen. Controleer of het toestel een TPM heeft en of de Intune-WHfB-policy is toegewezen aan deze gebruiker.'
            }
        }
        default {
            & $voegToe $bevindingen 'WHfB-credential' 'OK' "$($whfb.Count) aanwezig - niet van invloed op dit scenario"
        }
    }

    $fido2 = @()
    try { $fido2 = @(Get-MgUserAuthenticationFido2Method -UserId $gebruiker.Id) } catch { }
    if ($fido2.Count -gt 0) {
        $regels = $fido2 | ForEach-Object { "$($_.DisplayName) [$($_.AaGuid)]" }
        & $voegToe $bevindingen 'Al geregistreerde passkeys' 'OK' ($regels -join '; ')
    }
    else {
        & $voegToe $bevindingen 'Al geregistreerde passkeys' 'OK' 'Geen'
    }

    # De TAP is het startpunt van de hele keten, en de eenmaligheid is wat 2180 eist.
    $tap = @()
    try { $tap = @(Get-MgUserAuthenticationTemporaryAccessPassMethod -UserId $gebruiker.Id) } catch { }
    if ($tap.Count -eq 0) {
        & $voegToe $bevindingen 'Temporary Access Pass' 'LET OP' 'Geen actieve TAP. Zonder bestaande methode kan de gebruiker niet beginnen.'
    }
    else {
        $meermalig = @($tap | Where-Object { -not $_.IsUsableOnce })
        if ($meermalig.Count -gt 0) {
            & $voegToe $bevindingen 'Temporary Access Pass' 'LET OP' "$($meermalig.Count) van $($tap.Count) is MEERMALIG bruikbaar. GLOBAL__2180 accepteert alleen temporaryAccessPassOneTime - zodra die policy afdwingt, voldoet deze TAP niet."
        }
        else {
            & $voegToe $bevindingen 'Temporary Access Pass' 'OK' "$($tap.Count) actief, eenmalig"
        }
    }

    $bevindingen | Format-Table -AutoSize

    $blokkades = @($bevindingen | Where-Object Verdict -eq 'BLOKKEERT') + @($tenantBevindingen | Where-Object Verdict -eq 'BLOKKEERT')
    if ($blokkades.Count -gt 0) {
        Write-Host "  GAAT FALEN - $($blokkades.Count) blokkade(s):" -ForegroundColor Red
        $blokkades | ForEach-Object { Write-Host "    - $($_.Punt): $($_.Wat)" -ForegroundColor Red }
        $eindoordeel.Add([pscustomobject]@{ Gebruiker = $upn; Oordeel = 'GAAT FALEN'; Reden = ($blokkades.Punt -join ', ') })
    }
    else {
        Write-Host '  Niets dat de registratie blokkeert.' -ForegroundColor Green
        $eindoordeel.Add([pscustomobject]@{ Gebruiker = $upn; Oordeel = 'KAN REGISTREREN'; Reden = '-' })
    }
    Write-Host ''
}

Write-Host '=== Samenvatting ===' -ForegroundColor Cyan
$eindoordeel | Format-Table -AutoSize

Write-Host 'Niet te controleren, wel te onthouden:' -ForegroundColor Yellow
Write-Host '  - De gebruiker moet binnen de laatste VIJF MINUTEN MFA hebben gedaan voordat hij een passkey mag registreren.'
Write-Host '  - Passkey profiles vragen een eenmalige, ONOMKEERBARE opt-in in het portaal.'
Write-Host '  - Entra passkey on Windows doet GEEN aanmelding op het Windows-scherm zelf; Windows Hello for Business wel.'
