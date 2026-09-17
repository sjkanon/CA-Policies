#Requires -Modules Microsoft.Graph.Identity.SignIns, Microsoft.Graph.Groups
<#
.SYNOPSIS
    Vergelijkt het authentication methods policy van een klanttenant met
    authentication-methods/authentication-methods.json, en zet het desgevraagd goed.

.DESCRIPTION
    Dit is de enige toetsing die deze kant van de baseline heeft. De platform-engine kent de
    categorie 'authentication-methods' niet, dus er is geen checkId en geen automatische
    vergelijking - wat dit script niet meldt, ziet niemand.

    De volgorde in het JSON-bestand is de uitrolvolgorde en is niet vrij:

      1. Temporary Access Pass    zonder TAP heeft een nieuwe medewerker niets om zijn eerste
                                  passkey mee te registreren, en geen terugval als hij zijn
                                  apparaat kwijt is.
      2. Passkey (FIDO2)          de methode waar GLOBAL__2120 op steunt.
      3. Microsoft Authenticator  blijft aan naast passkeys.
      4/5. SMS en spraak          gaan UIT - en alleen als 2 en 3 staan.

    Draai dit standaard zonder -Apply. Dan vergelijkt het alleen en verandert er niets.

    WAT DIT SCRIPT NIET DOET

    Passkey profiles. Die vragen een eenmalige, onomkeerbare opt-in in het portaal en zijn via
    Graph niet volledig te beheren; het script leest ze wel uit en meldt het verschil met de
    profielen in het JSON-bestand, zodat je weet wat er met de hand moet. Zie de README in
    authentication-methods/.

    De uitschakel-volgorde bewaakt het wel actief: SMS of spraak uitzetten terwijl gebruikers
    nog geen phishing-bestendige methode hebben, sluit die gebruikers buiten. Met
    -CheckRegistrationFirst telt het script eerst hoeveel gebruikers alleen op een af te
    schakelen methode zitten, en weigert de wijziging zolang dat er meer dan nul zijn.

.PARAMETER TenantId
    De klanttenant. Wordt doorgegeven aan Connect-MgGraph.

.PARAMETER Apply
    Zet de methodes daadwerkelijk. Zonder deze schakelaar vergelijkt het script alleen.

.PARAMETER CheckRegistrationFirst
    Weiger een methode uit te zetten zolang er gebruikers zijn die geen phishing-bestendige
    methode geregistreerd hebben. Vraagt AuditLog.Read.All / Reports.Read.All.

.PARAMETER MethodsPath
    Pad naar authentication-methods.json. Standaard die in deze repo.

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

$gewenst = Get-Content -Path $MethodsPath -Raw | ConvertFrom-Json
Write-Host "Gewenste stand uit $($gewenst.version) (herzien $($gewenst.reviewedAt))" -ForegroundColor Cyan
if (-not $Apply) {
    Write-Host 'Vergelijkingsmodus: er wordt niets gewijzigd. Gebruik -Apply om te zetten.' -ForegroundColor Cyan
}

$scopes = @('Policy.ReadWrite.AuthenticationMethod', 'Group.Read.All')
if ($CheckRegistrationFirst) { $scopes += 'AuditLog.Read.All' }
Connect-MgGraph -TenantId $TenantId -Scopes $scopes -NoWelcome

$resultaat = [System.Collections.Generic.List[object]]::new()
$blokkerend = [System.Collections.Generic.List[string]]::new()

# ----------------------------------------------- registratie eerst tellen ----

# Alleen relevant als er iets uitgezet wordt. Een methode uitzetten is de enige handeling hier
# die iets wegneemt, en dus de enige die mensen buiten kan sluiten.
$zonderSterkeMethode = $null
if ($CheckRegistrationFirst -and ($gewenst.methods | Where-Object state -eq 'disabled')) {
    try {
        $registraties = @(Get-MgReportAuthenticationMethodUserRegistrationDetail -All)
        $zonderSterkeMethode = @($registraties | Where-Object { -not $_.IsMfaCapable }).Count
        Write-Host "  $zonderSterkeMethode gebruiker(s) zonder MFA-methode" -ForegroundColor $(if ($zonderSterkeMethode -gt 0) { 'Yellow' } else { 'Green' })
    }
    catch {
        Write-Warning "Registratierapportage niet op te halen: $($_.Exception.Message). Zonder dat cijfer is uitzetten een gok."
        $blokkerend.Add('registratierapportage niet beschikbaar - zet geen methode uit')
    }
}

# --------------------------------------------------------------- methodes ----

foreach ($methode in ($gewenst.methods | Sort-Object order)) {
    $huidig = $null
    try {
        $huidig = Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId $methode.id
    }
    catch {
        Write-Warning "Methode '$($methode.id)' niet gevonden in deze tenant: $($_.Exception.Message)"
        $resultaat.Add([pscustomobject]@{ Volgorde = $methode.order; Methode = $methode.displayName; Nu = 'onbekend'; Gewenst = $methode.state; Actie = 'overgeslagen'; Gevaar = $methode.danger })
        continue
    }

    $nu = $huidig.State

    if ($nu -eq $methode.state) {
        Write-Host "  = $($methode.displayName): $nu"
        $resultaat.Add([pscustomobject]@{ Volgorde = $methode.order; Methode = $methode.displayName; Nu = $nu; Gewenst = $methode.state; Actie = 'staat goed'; Gevaar = $methode.danger })
        continue
    }

    Write-Host "  ! $($methode.displayName): staat op $nu, hoort op $($methode.state)" -ForegroundColor Yellow

    # Uitzetten terwijl mensen er nog op zitten is het enige onomkeerbare in dit script.
    if ($methode.state -eq 'disabled' -and $null -ne $zonderSterkeMethode -and $zonderSterkeMethode -gt 0) {
        Write-Warning "'$($methode.displayName)' NIET uitgezet: er zijn $zonderSterkeMethode gebruiker(s) zonder MFA-methode. $($methode.note)"
        $blokkerend.Add("'$($methode.displayName)' kan niet uit zolang $zonderSterkeMethode gebruiker(s) geen andere methode hebben")
        $resultaat.Add([pscustomobject]@{ Volgorde = $methode.order; Methode = $methode.displayName; Nu = $nu; Gewenst = $methode.state; Actie = 'geweigerd (registratie)'; Gevaar = $methode.danger })
        continue
    }

    if (-not $Apply) {
        $resultaat.Add([pscustomobject]@{ Volgorde = $methode.order; Methode = $methode.displayName; Nu = $nu; Gewenst = $methode.state; Actie = 'zou wijzigen'; Gevaar = $methode.danger })
        continue
    }

    $body = @{ '@odata.type' = $huidig.AdditionalProperties['@odata.type']; id = $methode.id; state = $methode.state }
    foreach ($sleutel in $methode.configuration.PSObject.Properties.Name) {
        $body[$sleutel] = $methode.configuration.$sleutel
    }

    if ($PSCmdlet.ShouldProcess($methode.displayName, "State op $($methode.state) zetten")) {
        Update-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId $methode.id -BodyParameter $body
        Write-Host "  + $($methode.displayName) op $($methode.state) gezet" -ForegroundColor Green
        $resultaat.Add([pscustomobject]@{ Volgorde = $methode.order; Methode = $methode.displayName; Nu = $nu; Gewenst = $methode.state; Actie = 'gewijzigd'; Gevaar = $methode.danger })
    }
    else {
        $resultaat.Add([pscustomobject]@{ Volgorde = $methode.order; Methode = $methode.displayName; Nu = $nu; Gewenst = $methode.state; Actie = 'overgeslagen (WhatIf)'; Gevaar = $methode.danger })
    }
}

# -------------------------------------------------------- passkey profiles ----

# Alleen lezen en melden. De opt-in is onomkeerbaar en het beheer van profielen loopt via het
# portaal; een script dat dit half doet is gevaarlijker dan een script dat het niet doet.
$fido = $gewenst.methods | Where-Object id -eq 'Fido2'
if ($fido -and $fido.profiles) {
    Write-Host ''
    Write-Host 'Passkey profiles (handwerk in het portaal):' -ForegroundColor Cyan
    foreach ($profiel in $fido.profiles) {
        $types = $profiel.passkeyTypes -join ', '
        Write-Host "  - $($profiel.displayName)"
        Write-Host "      doelgroep : $($profiel.target)"
        Write-Host "      types     : $types"
        Write-Host "      attestation: $($profiel.enforceAttestation)"
    }
    Write-Host "  $($fido.tenantSpecific)" -ForegroundColor Yellow
}

# ------------------------------------------------------------- afsluiting ----

Write-Host ''
$resultaat | Sort-Object Volgorde | Format-Table -AutoSize

if ($blokkerend.Count -gt 0) {
    Write-Host 'NIET AF:' -ForegroundColor Yellow
    $blokkerend | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    Write-Host ''
    Write-Host 'Los dit op voordat je verder gaat. Een methode uitzetten terwijl gebruikers er nog op zitten is geen verscherping maar een lock-out.' -ForegroundColor Yellow
}
elseif ($Apply) {
    Write-Host 'Het authentication methods policy staat zoals afgesproken.' -ForegroundColor Green
}
else {
    Write-Host 'Vergelijking klaar. Draai met -Apply om de afwijkingen te zetten.' -ForegroundColor Green
}
