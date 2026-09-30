[Nederlands](README.md) · [English](README.en.md) · **Français**

# prerequisites/

[`ca-prerequisites.json`](ca-prerequisites.json) décrit ce qu'un tenant doit avoir avant que les
templates de [`CATemplate/`](../CATemplate/README.fr.md) servent à quelque chose : les groupes,
named locations et custom authentication strengths auxquels ils renvoient.

**Pourquoi c'est à part.** Un template renvoie à un groupe ou un emplacement par son nom ; s'il
n'existe pas, l'échec va dans le mauvais sens. Un groupe d'exclusion absent n'exclut personne :
la stratégie devient plus stricte que prévu et rien ne donne l'alerte. Une custom strength
absente rend le grant imprévisible.

| Type | Nombre | Créé par |
|---|---:|---|
| Groupes | 12 (11 pour CA, 1 pour [`authentication-methods/`](../authentication-methods/README.fr.md)) | `New-CaPrerequisites.ps1` |
| Named locations | 4 | `New-CaPrerequisites.ps1`, sauf *All Compliant Network locations* (fourni par Entra avec Global Secure Access) |
| Custom authentication strengths | 3 | `New-CaPrerequisites.ps1`, y compris une restriction AAGUID |
| Authentication contexts | 0 | — un choix par tenant, pas une baseline |

## Ce que chaque entrée consigne

| Champ | Signification |
|---|---|
| `purpose` | à quoi il sert, pour qui lit ce dépôt (néerlandais) |
| `description` | ce qui devient la description de l'objet dans le tenant (anglais) |
| `danger` / `dangerReason` | de `low` à `critical` : ce qui tourne mal s'il manque, est vide ou mal configuré |
| `requiresMembers` | le groupe ne doit pas être vide avant que le stage 1 passe en Remediate — les groupes break-glass et `Licensed Users` |
| `tenantSpecific` | la valeur arrive par tenant (pays, plages IP, l'id d'une strength) et ne figure délibérément pas dans les templates |
| `placeholderId` | le GUID nul qu'un template porte à la place du vrai id de strength |

Quels templates utilisent un groupe n'est délibérément *pas* consigné : le validateur le déduit en
direct de `CATemplate/`, pour qu'il n'y ait pas de seconde liste qui puisse vieillir.

## Ce qui le surveille

| | Fait |
|---|---|
| `node scripts/prerequisites.js` | échoue sur toute référence d'un template sans définition ici, sur une named location qui diffère entre template et définition, sur une strength avec d'autres combinaisons ou AAGUID, et sur un vrai id de strength dans un template. Bloquant en CI ; `export-cipp-baseline.js` l'appelle aussi |
| `./scripts/New-CaPrerequisites.ps1 -TenantId <tenant> -WhatIf` | montre ce qu'il créerait dans le tenant |
| `./scripts/New-CaPrerequisites.ps1 -TenantId <tenant> -AllowedCountry … -ServiceAccountIpRange … -BreakGlassUserId … -RequireSafeToDeploy` | le crée, de façon idempotente, et termine en erreur tant que les groupes critiques sont vides |

Le script indique l'id d'une custom strength créée ; il doit être reporté à la main dans le
déploiement CIPP, à la place du GUID nul. Voir le [README principal](../README.fr.md#dabord-les-prérequis-ensuite-seulement-remediate).
