[Nederlands](README.md) · [English](README.en.md) · **Français**

# authentication-methods/

`authentication-methods.json` est l'état souhaité de l'**authentication methods policy** d'un
tenant : quelles méthodes sont activées, et à quelles conditions une passkey peut être
enregistrée.

**Ceci n'est pas du Conditional Access.** Une stratégie CA dit *quand* vous pouvez accéder à quelque
chose ; ceci dit *avec quoi* vous pouvez vous connecter tout court. Les deux s'imbriquent toutefois,
et c'est précisément là que cela tourne mal si vous en examinez une isolément :

| Si ceci est désactivé ici | Alors voici ce qui se passe côté CA |
|---|---|
| Passkey (FIDO2) | `GLOBAL__2120` exige une méthode résistante au phishing que personne n'a — le tenant est fermé |
| Temporary Access Pass | `GLOBAL__2180` n'autorise l'enregistrement que derrière un TAP ; un nouveau collaborateur ne peut alors rien enregistrer |

`scripts/authentication-methods.js` contrôle ces deux liens par rapport au `state` réel de ces
templates, et échoue sans appel. Ce n'est pas une validation de schéma mais le seul endroit où cette
dépendance est surveillée.

## Ce qui surveille ce fichier

Rien ne compare automatiquement ce fichier à un tenant. Ce qui est de travers ici reste de travers
jusqu'à ce que quelqu'un le remarque — d'où ces quatre-là :

| | Fait |
|---|---|
| `node scripts/authentication-methods.js` | Surveille le fichier lui-même et les deux liens. Bloquant en CI |
| `node --test scripts/authentication-methods.test.js` | Huit tests, dont l'ordre de désactivation |
| `./scripts/Set-EntraAuthenticationMethods.ps1 -TenantId <tenant>` | Compare un tenant réel à ce fichier. Sans `-Apply`, il ne modifie rien |
| `./scripts/Test-EntraPasskeyReadiness.ps1 -TenantId <tenant> -UserPrincipalName <upn>` | Indique avant le déploiement si un utilisateur *peut* enregistrer une passkey, et sinon : pourquoi |

## L'ordre n'est pas libre

`order` est l'ordre de déploiement, et l'inverser enferme des gens dehors :

1. **Temporary Access Pass** — la seule méthode avec laquelle quelqu'un *sans* méthode existante peut
   commencer. C'est aussi le recours si quelqu'un a perdu son portable : une passkey WHfB se trouvait
   dans le TPM de *cet* appareil et ne revient pas.
2. **Passkey (FIDO2)** — la méthode sur laquelle s'appuient les stratégies CA résistantes au phishing.
3. **Microsoft Authenticator** — reste activé à côté des passkeys. C'est ce que la plupart des
   utilisateurs ont déjà, et le moyen par lequel ils enregistrent une passkey dans Authenticator.
4. **SMS** et 5. **appel vocal** — sont désactivés, et seulement une fois que 2 et 3 sont en place.

Les étapes 4 et 5 sont les seules qui *retirent* quelque chose. `Set-EntraAuthenticationMethods.ps1`
les refuse avec `-CheckRegistrationFirst` tant qu'il y a des utilisateurs sans méthode MFA, et le test
vérifie qu'une méthode à désactiver ne se trouve jamais avant une méthode à activer.

## Passkey profiles

L'opt-in se fait une seule fois dans le portail (**Entra ID › Security › Authentication methods ›
Policies › Passkey (FIDO2)**, via la bannière) et est **irréversible**. Vos paramètres globaux
existants migrent alors vers un *Default passkey profile* ; il peut y en avoir au maximum trois, ce
profil compris. Ce n'est pas une étape qu'un script devrait effectuer à votre place.

`Set-EntraAuthenticationMethods.ps1` lit ensuite les profils et signale ce qui diffère de ce fichier,
mais ne les définit pas — les profils déterminent qui peut encore se connecter, et un script qui le
fait à moitié est plus dangereux qu'un script qui ne le fait pas. Pour savoir si CIPP, lui, peut les
définir, voir ci-dessous.

Les deux profils ici :

| Profil | Groupe cible | Types | Attestation |
|---|---|---|---|
| Administrateurs | `SEC-Passkey-Profile-Admins` | Device-bound uniquement | Activée |
| Tous les utilisateurs | AllUsers | Device-bound et synced | Désactivée |

`SEC-Passkey-Profile-Admins` figure dans [`../prerequisites/ca-prerequisites.json`](../prerequisites/ca-prerequisites.json)
et est créé par `New-CaPrerequisites.ps1` — un passkey profile ne peut pas cibler des rôles
d'annuaire comme le fait une stratégie CA, uniquement des groupes.

## Déployer via CIPP

CIPP dispose d'un standard **Authentication Methods** qui définit les méthodes ci-dessus : par méthode
Enabled / Disabled / Not Configured, avec un groupe cible facultatif. `Not Configured` laisse en place
le paramètre actuel du tenant — c'est la position sûre pour ce que vous ne voulez pas (encore)
toucher.

Un détail tiré de [la propre documentation de CIPP](https://docs.cipp.app/user-documentation/tenant/administration/authentication-methods)
qui peut vous coûter un après-midi :

> "Enabling FIDO2 with **Enable Policy** rather than **Configure** turns on attestation
> enforcement and self-service registration, as those are the defaults CIPP applies."

Attestation activée signifie : pas de passkeys synchronisées, et **pas de passkeys Windows Hello** —
Microsoft prescrit qu'un profil ne doit *pas* imposer d'attestation pour cela. Utilisez donc
**Configure** et non **Enable Policy**, et réglez explicitement l'attestation sur la valeur de ce
fichier (`false` pour le profil large).

La capacité de CIPP à définir aussi les *profils* passkey avec leurs listes d'AAGUID varie selon la
version — vérifiez-le dans votre propre CIPP avant de le supposer. Si cela ne fonctionne pas, c'est
la seule partie qui reste dans le portail.

## Deux choses qui échouent en silence

**L'attestation ne s'applique qu'à l'enregistrement.** Si vous l'activez plus tard, les passkeys
enregistrées auparavant sans attestation continuent simplement de fonctionner. Vous fermez les
nouveaux enregistrements, pas les clés existantes.

**Retirer quelque chose enferme des gens dehors.** Désactiver un type de passkey ou retirer un AAGUID
d'une allow-list s'applique à l'enregistrement *et* à la connexion : qui s'est enregistré avec, ne
peut plus se connecter.

## Le piège qui a coûté une soirée

En septembre 2026, dans un tenant, l'enregistrement d'une passkey a échoué treize fois en quatre-vingts
minutes. Le journal d'audit n'affichait que `User started the registration for Passkey`, sans issue.
La cause est indiquée chez [Microsoft](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-authentication-entra-passkeys-on-windows)
mais pas dans le message d'erreur :

> "If you then attempt to register a passkey on Windows for that same account, registration
> fails because the Windows Hello for Business credential already exists."

Sur un appareil Entra joined ou registered, la credential WHfB occupe le conteneur Windows Hello pour
ce compte. Une passkey à côté n'est pas possible. Après suppression de la credential,
l'enregistrement a réussi 83 secondes plus tard.

**La question qui précède est plus importante :** sur un appareil géré et Entra joined, WHfB est le
bon choix, pas Entra passkey on Windows. WHfB gère aussi l'écran de connexion Windows ; Entra passkey
on Windows non. Ce dernier est destiné aux PC non joints, personnels ou partagés.

`scripts/Test-EntraPasskeyReadiness.ps1` le vérifie à l'avance, avec cinq autres blocages tout aussi
silencieux : méthode désactivée, self-service désactivé, compte invité, attestation imposée, et une
liste d'AAGUID qui exclut Windows Hello. Exécutez-le avec `-Scenario WindowsHelloPasskey` si vous
voulez une passkey dans le conteneur Windows Hello.
