[Nederlands](ANALYSE.md) · [English](ANALYSE.en.md) · **Français**

# Analyse des écarts — ce qui manque à la baseline CA, et ce qui doit changer

Rédigé à la main. Ce document consigne d'où viennent les
33 modèles, à quoi ils ont été confrontés et — plus important — ce qui n'y figure délibérément
**pas** et pourquoi. Sans ce dernier point, la prochaine itération réévalue les mêmes stratégies.

Date : 3 septembre 2026. L'ensemble comptait alors 33 modèles. Après les itérations suivantes (en bas),
il y en a 44 ; les chiffres dans le reste de ce document sont ceux de l'itération où ils figurent et
n'ont délibérément pas été réécrits.

## La question

L'ensemble Intune a été confronté à IntuneAdmin en août 2026 (874 profils, voir
`docs/ANALYSE.md` dans le dépôt IntuneBackup).
Pour CA, quelque chose de comparable a eu lieu, mais le résultat se trouve ailleurs et est
désormais périmé. Cette itération répond à deux questions qui n'y figuraient pas :

1. Comment l'ensemble se situe-t-il par rapport aux sources **normatives** — MCSB, CIS Microsoft 365
   Foundations et les propres modèles CA de Microsoft — plutôt qu'aux frameworks communautaires ?
2. Qu'est-ce qui cloche dans l'ensemble **en tant que tel**, indépendamment des mesures qu'il contient ?

Cette deuxième question est apparue en confrontant l'ensemble à un vrai tenant (septembre
2026). Il s'est avéré que trois propriétés de l'ensemble font obstacle au déploiement, et celles-ci
ne se trouvent par aucune comparaison de stratégies.

## Ce qui existait déjà

Un rapport d'écarts du 13 août 2026, généré en dehors de ce dépôt. Ce rapport confrontait l'ensemble
à trois frameworks basés sur des personas ou sur une numérotation :

| Framework | Stratégies | Couvertes alors |
|---|---:|---:|
| Daniel Chronlund — CA policy design baseline | 21 | 20 (95 %) |
| Kenneth van Surksum — CA baseline v2025-10 | 49 | 28 (57 %) |
| Joey Verlinden — CA Framework 2026.6.1 | 36 | 24 (67 %) |

Il consignait aussi l'origine, et c'est toujours l'élément de contexte le plus important de ce
dépôt : **notre numérotation *est* la baseline de Chronlund.** La série `1010`–`3040`, la répartition
BLOCK/GRANT/SESSION et la forme de nom `GLOBAL - nnnn - ACTIE - Omschrijving` viennent telles quelles
de sa conception. Cela explique pourquoi tout porte un seul préfixe — depuis le 30 septembre 2026
`CXNM - STANDARD` au lieu du `GLOBAL` de Chronlund — alors que les deux autres
frameworks sont basés sur des personas — voir *Pourquoi il n'y a pas de personas* ci-dessous.

**Ce rapport est périmé.** Il décrit 20 modèles ; il y en a 33. Et ce n'est pas un
retard mais le contraire : **chaque candidat qu'il proposait a depuis été construit.**

| Liste de candidats du 13 août | Maintenant |
|---|---|
| MFA lors de l'enregistrement/la jonction d'un appareil | `2080` |
| Invités uniquement vers des applications approuvées (liste d'autorisation) | `1120` |
| MFA sur les portails d'administration pour *tous* les utilisateurs | `2100` |
| Condition sur l'accès navigateur depuis un appareil non géré | `2090` |
| Token protection | `2110` |
| Bloquer les comptes sans licence | `1110` |
| *optional* — sessions via Defender for Cloud Apps | `3060` |
| *optional* — managed identities en cas de risque élevé | `1140` |
| *optional* — accès Cloud PC depuis un mobile | `2150` |
| *décision par tenant* — Terms of Use | pas de modèle — à l'époque un contrôle isolé sans déploiement, supprimé en septembre 2026 |
| *décision par tenant* — MFA résistante au phishing pour tous | `2120` |
| *décision par tenant* — administrateurs uniquement depuis un appareil conforme | `2130` |
| *décision par tenant* — administrateurs pas depuis des emplacements non approuvés | `1130` |
| *décision par tenant* — imposer explicitement CAE | `3050` |
| *pas encore* — identités d'agent | **toujours pas** — voir ci-dessous |

Quatorze sur quinze traités ; Terms of Use n'est jamais devenu un modèle et ne figure plus
nulle part depuis septembre 2026. La comparaison avec les frameworks communautaires est ainsi
épuisée ; ce qui reste doit venir d'un autre angle.

## Sources de cette itération

| Source | Ce que c'est | Utilisation |
|---|---|---|
| [Microsoft cloud security benchmark — Identity Management](https://learn.microsoft.com/en-us/security/benchmark/azure/mcsb-identity-management) | IM-1 à IM-9 ; IM-7 énumère sept applications de CA | les sept passées en revue |
| [CIS Microsoft 365 Foundations Benchmark](https://www.cisecurity.org/benchmark/microsoft_365), section 5.2.2 | controls v4/v5 1–12, plus les cinq ajoutés par v7.0.0 | les cinq nouveaux vérifiés séparément |
| [Les propres modèles CA de Microsoft](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-policy-common) | six catégories, dont la nouvelle **AI Agents** | comparés par catégorie |
| Comparaison avec un vrai tenant, septembre 2026 | 33 modèles face à 16 stratégies réelles | a fourni les constats structurels |

Les frameworks de Chronlund, van Surksum et Verlinden n'ont **pas** été repassés ; le
rapport du 13 août suffisait pour cela.

## Résultat en chiffres

| | |
|---|---:|
| Modèles | 33 |
| Dont `state: enabled` | 21 |
| Dont `state: disabled` | **11** |
| Dont report-only | **1** |
| Applications MCSB IM-7 couvertes | 7 sur 7 |
| CIS 5.2.2 nouveaux dans v7.0.0 couverts | 3 sur 5 (1 à moitié) |
| Catégories de modèles Microsoft couvertes | 5 sur 6 |

## Ce qui nous manque

### À ajouter

| Mesure | Source | Pourquoi elle atteint le seuil |
|---|---|---|
| **Réauthentification périodique pour tous les utilisateurs** | CIS 5.2.2.13 (L1) ; Microsoft *No persistent browser session* | Nous ne fixons la durée de session que pour les administrateurs (`3010`) et le BYOD (`3020`). Un utilisateur ordinaire sur un appareil géré garde sa session indéfiniment. C'est précisément le jeton volé lors d'une attaque AiTM, et contre lequel `2110` n'agit que sur Windows/Exchange/SharePoint. Un nouveau modèle SESSION, sign-in frequency à la valeur de l'ensemble du tenant, `persistentBrowser` laissé tel quel (il concerne les appareils non gérés, pas tous). |
| **Named locations comme partie du dépôt** | CIS 5.2.2.14 (L2) | Voir *Ce qui est cassé*, point 1. Ce n'est pas une stratégie mais une condition préalable, et son absence est la plus dangereuse de tout ce qui figure ici. |

### À ajouter (`optional`)

| Mesure | Source | Licence | Pourquoi |
|---|---|---|---|
| **Insider risk** | Microsoft, catégorie Zero Trust — *Block access for users with insider risk* | Microsoft Purview | `insiderRiskLevels` n'apparaît dans aucun modèle. Nos stratégies de risque (`1090`/`1100`/`2010`/`2020`) examinent les signaux de connexion ; insider risk examine le comportement dans les données — exfiltration juste avant un départ, téléchargements inhabituels. Une autre question, pas un doublon. Exige Purview, donc `optional`. |

### À reconsidérer : identités d'agent

Le rapport du 13 août plaçait ceci sur *pas encore*, avec un bon argument : Entra Agent ID
n'était pas largement disponible, et une règle de baseline pour une fonctionnalité que le tenant ne
connaît pas produit du bruit chez tout le monde.

Quelque chose a changé depuis. **Microsoft fournit désormais lui-même une catégorie de modèles AI Agents**
avec trois stratégies (*Block high-risk agent identities*, *Configure policy for autonomous agent
access*, *Configure policy for on-behalf-of agent access*), et la condition `agents` figure dans
le schéma Graph de *chaque* stratégie — elle se trouve dans les 33 de nos modèles, à `null`.

Cela change la pondération mais pas la réponse. L'argument contre n'a jamais été « la mesure
ne vaut rien » mais « la fonctionnalité n'existe pas ». Dès que `agents` sera réellement
configurable dans les tenants, ce sera un modèle `optional` du même type que `1140` — et le
mécanisme `optional` existe justement pour éviter ce bruit. **Action : réévaluer
dès qu'Entra Agent ID sera en disponibilité générale, et l'ajouter alors comme `optional`, pas comme
modèle ordinaire.**

### Ce qui s'est avéré couvert

- **MCSB IM-7** énumère sept applications de CA : MFA pour les administrateurs (`2055`, `2100`), MFA pour
  la gestion Azure (`2100` contient `797f4846-…`, l'API Azure Service Management), blocage de
  l'authentification héritée (`1010`), emplacements approuvés pour l'enregistrement MFA (`3030`), accès par emplacement
  (`1040`, `1050`), comportement de connexion à risque (`1090`, `2010`), appareils gérés pour
  des applications spécifiques (`2060`, `2130`). Les sept présentes.
- **CIS 5.2.2.15** (exclusion géographique) — `1040` et `1050`.
- **CIS 5.2.2.16** (token protection) — `2110`.
- **CIS 5.2.2.17** (bloquer authentication transfer) — `1020` le couvre, avec
  `authenticationFlows.transferMethods = "deviceCodeFlow,authenticationTransfer"`. **Mais ce
  modèle est sur `disabled`** et n'impose donc rien. Voir ci-dessous.

## Ce qui est cassé dans l'ensemble lui-même

Quatre propriétés qu'aucune comparaison de stratégies ne permet de trouver, mais qui font obstacle
au déploiement. Toutes les quatre trouvées en confrontant l'ensemble à un vrai tenant.

### 1. Les conditions préalables ne sont pas fournies — et c'est dangereux

Les modèles font référence à six groupes et quatre named locations que le dépôt ne
définit nulle part et ne mentionne nulle part comme condition :

```
Excluded from Conditional Access                  Allowed Countries
Conditional Access Service Accounts               High-Risk Countries
Licensed Users                                    Service Accounts Trusted IPs
Excluded from Legacy Authentication Block         AllTrusted
Excluded from Device Code Auth Flow Block
Excluded from Country Block List
```

Dans le tenant examiné, **aucun des six groupes n'existait**, et les named locations y portaient d'autres noms.
Le problème n'est pas que le déploiement échoue alors. Le problème est qu'il *réussit* : un
groupe d'exclusion qui n'existe pas n'exclut personne, donc la stratégie devient plus stricte que
prévu. `Excluded from Conditional Access` est l'exclusion break-glass. Déployer un ensemble de 33
stratégies dont le groupe break-glass n'existe pas est la manière classique de verrouiller
complètement un tenant — et ce, causé par nos propres modèles.

**Ce qui doit changer :** le dépôt fournit les groupes et named locations sous forme de script de création,
et le générateur échoue sur un modèle qui fait référence à un groupe ou un emplacement qui
ne figure pas dans cette liste. Tout comme `check-scope.js` dans IntuneBackup veille à ce que chaque fichier soit à
sa place, il faut veiller ici à ce que chaque référence ait une contrepartie
définie.

### 2. Douze des 33 modèles n'imposent rien

Onze modèles sont sur `disabled`, un sur report-only. Ils sont fournis, mais un tenant
qui reprend l'ensemble ne se voit rien imposer par ces douze.

```
disabled    1020  Device Code Auth Flow            <- dekt CIS 5.2.2.17 (L1)
disabled    1030  Unsupported Device Platforms
disabled    1040  Countries not Allowed            <- dekt CIS 5.2.2.15 (L1)
disabled    1060  Service Accounts
disabled    1070  Explicitly Blocked Cloud Apps
disabled    1080  Guest Access to Sensitive Apps
disabled    1100  High-Risk Users
disabled    2055  Phishing Resistant MFA for Admins
disabled    2060  Mobile Apps and Desktop Clients
disabled    2070  Mobile Device Access Requirements
disabled    3040  Block File Downloads On Unmanaged Devices
report-only 3020  BYOD Persistence
```

C'est un tiers de l'ensemble qui, par définition, ne fait rien. Nulle part il n'est indiqué *lesquels*, ni pourquoi.
Deux cas sont en outre contradictoires entre eux :

- **`2055` est désactivé, `2120` est activé.** 2055 est la MFA résistante au phishing pour les administrateurs,
  2120 pour *tous* les utilisateurs. La liste des modèles optionnels (désormais `CATemplate/_manifest.json`) qualifie 2120 d'*« het einddoel waar de
  admin-variant (2055) de eerste stap van is… een uitrolproject en geen instelling »*. L'ensemble
  livre donc la première étape désactivée et l'objectif final activé. À l'envers.
- **`1090` est activé, `1100` est désactivé.** Deux stratégies de risque, toutes deux Entra ID P2. Aucune raison
  documentée pour laquelle le risque de connexion oui et le risque utilisateur non.

**Ce qui doit changer :** un champ par modèle qui dit pourquoi il est désactivé, comme
`faseWaarom` le fait dans IntuneBackup — et un générateur qui échoue sur un modèle non `enabled`
sans cette raison. Ensuite activer 2055 et rectifier le choix 1090/1100.

### 3. Le marquage de licence est incomplet

La liste optionnelle existe précisément pour éviter qu'un tenant se voie imposer quelque chose
qu'il ne *peut* pas avoir sans licence. Six modèles y figurent. **Cinq qui exigent Entra ID P2
n'y figurent pas :**

| Modèle | Exige | Optionnel |
|---|---|---|
| `1090` High-Risk Sign-Ins | Entra ID P2 | non |
| `1100` High-Risk Users | Entra ID P2 | non |
| `2010` Medium-Risk Sign-ins | Entra ID P2 | non |
| `2020` Medium-Risk Users | Entra ID P2 | non |
| `2110` Token Protection | Entra ID P2 | non |
| `1140` Managed Identities At Risk | Workload ID Premium | oui |
| `3060` Defender for Cloud Apps | MDCA | oui |

L'incohérence est démontrable et non voulue : les contrôles isolés plus anciens que ces
modèles ont remplacés portaient *bien* le marquage P2. Les modèles (`1090`, `1100`, `2010`,
`2020`) n'ont pas repris ce marquage.

**Ce qui doit changer :** ces cinq en optionnel, avec la licence comme raison. Dans un tenant sans P2,
ce sont actuellement cinq stratégies dans le noyau qui ne peuvent pas y fonctionner — et un noyau dont une partie
ne fonctionne jamais apprend à tout le monde à ne pas prendre le reste au sérieux non plus.

### 4. L'analyse des écarts se trouvait en dehors de ce dépôt

Le rapport du 13 août décrivait les modèles de ce dépôt, mais se trouvait ailleurs. Le
README d'ici ne disait rien, sous *Een policy toevoegen*, sur sa mise à jour, de sorte que le rapport a pris
trois semaines de retard sans que personne ne le remarque — 20 modèles décrits, 33 présents.

**Ce qui doit changer :** l'analyse a sa place à côté des modèles, et chaque modification de fond
dans `CATemplate/` ajoute une itération. C'est ce document.

## Pourquoi il n'y a pas de personas

Chaque modèle porte le même préfixe, alors que van Surksum et Verlinden répartissent par persona — Admins,
Internals, Externals, Guests, ServiceAccounts, Agents. Ce n'est pas une omission et cela n'a pas à être
réévalué.

L'ensemble est la conception de Chronlund, et celle-ci est délibérément globale : un seul ensemble de règles qui
s'applique à tous, avec des filtres de rôle et de groupe *au sein de* la stratégie là où c'est nécessaire. C'est aussi ce que nous faisons —
`1130`, `2055`, `2130` et `3010` ciblent tous les quatre les mêmes onze rôles d'annuaire via
`includeRoles`. La distinction existe donc bel et bien, elle figure simplement dans la condition plutôt
que dans le nom.

Ajouter des personas signifierait : découper la même mesure en deux stratégies dès qu'elle se traduit
différemment pour deux groupes. C'est précisément ce que le rapport du 13 août rejette
explicitement — *« één regel per maatregel, niet per policy »* — parce que cela produit
deux stratégies pour une seule question.

**Le préfixe.** Jusqu'au 30 septembre 2026, tout s'appelait `GLOBAL`, d'après Chronlund. Cela
suggérait une deuxième dimension qui n'existe pas et ne viendra pas. C'est désormais
`CXNM - STANDARD` dans le tenant et `CXNM__STANDARD__` comme nom de fichier : il dit à qui
appartient l'ensemble et que c'est le standard, pas à qui il s'adresse. La numérotation est
inchangée. Si une deuxième persona s'ajoute un jour, ce sera une refonte et non un ajout.

## Ce que nous ne faisons délibérément pas

| Mesure | Pourquoi pas |
|---|---|
| **Découpage par persona** | Voir ci-dessus. Une règle par mesure ; la distinction se trouve dans `includeRoles`. |
| **MFA pour les comptes de service** (Verlinden `CA300`) | Se contredit : `1060` limite les comptes de service aux IP approuvées et `2050` les exclut justement de l'exigence MFA. Un compte non interactif ne peut pas faire de MFA. |
| **Autoriser Linux depuis un appareil conforme** (van Surksum `CAD011`) | Contredit `1030`, qui bloque tout ce qui est en dehors d'Android/iOS/Windows/macOS. Qui veut prendre en charge Linux adapte `1030` — une modification, pas une deuxième stratégie. |
| **Les modèles de Microsoft directement via Graph** (`/identity/conditionalAccess/templates`) | La pierre de touche la moins exigeante en maintenance, et toujours pas étudié quelles permissions cela requiert. Cette itération a utilisé la liste de modèles de la documentation plutôt que de l'API. Reste ouvert. |
| **[AlexFilipin/ConditionalAccess](https://github.com/AlexFilipin/ConditionalAccess)** | Quatrième ensemble basé sur des personas. Non pris en compte — les trois du rapport du 13 août n'ont fourni aucune nouvelle mesure qui ne venait pas déjà de CIS ou de Microsoft. À réexaminer dès que ces trois n'apportent plus rien. |

## Ce qui doit changer — la liste

Par ordre. Les trois premiers sont plus urgents que tout nouveau modèle, car ils touchent l'ensemble qui
existe déjà.

1. **Fournir les conditions préalables.** Groupes et named locations sous forme de script de création, plus un
   contrôle qui échoue sur une référence sans définition. Sans
   cela, chaque déploiement est un risque de verrouillage.
2. **Compléter la liste optionnelle** avec `1090`, `1100`, `2010`, `2020` et `2110`, raison
   Entra ID P2.
3. **Rendre une raison obligatoire pour chaque `state` non `enabled`,** et passer en revue les douze
   cas. Commencer par activer `2055` et résoudre la contradiction `1090`/`1100`.
4. **Nouveau modèle :** réauthentification périodique pour tous les utilisateurs (CIS 5.2.2.13).
5. **Nouveau modèle (`optional`) :** insider risk, licence Microsoft Purview.
6. **Garder l'analyse des écarts à côté des modèles**, afin qu'elle ne prenne plus trois semaines de retard.
7. **Réévaluer les identités d'agent** dès qu'Entra Agent ID sera en disponibilité générale —
   alors comme `optional`.
8. **Étudier les modèles de Microsoft via Graph** en remplacement de la comparaison manuelle
   avec la documentation.

Les points 1 à 3 sont de la maintenance de l'existant et ne changent aucune mesure. Les points 4 et 5
ajoutent deux modèles. Les points 6 à 8 relèvent du processus.

---

# Itération 2 — j0eyv Conditional Access Baseline 2026.6.1

Date : 4 septembre 2026. La première itération a confronté l'ensemble à MCSB, CIS et aux propres modèles
de Microsoft et a délibérément écarté les frameworks communautaires. Cette itération en traite malgré tout un à la main, à savoir le seul qui a été
mis à jour depuis août : [`j0eyv/ConditionalAccessBaseline`](https://github.com/j0eyv/ConditionalAccessBaseline),
version **2026.6.1** (12 juin 2026), 36 stratégies. À la main, car ce qu'il fallait faire ici, c'était
écrire des modèles au format CIPP de `CATemplate/`.

**Résultat : 26 de ses 36 étaient couvertes (72 %, contre 67 % en août).** Ce qui manquait se situait dans deux
domaines — identités d'agent et sessions invités — plus quatre erreurs dans des stratégies déjà en place.

## Ce qui a été ajouté

| Modèle | Source | Pourquoi |
|---|---|---|
| `3070 SESSION` Session Limits All Users | CA402/CA403 + CIS 5.2.2.13 | La durée de session ne valait que pour les administrateurs (`3010`) et le BYOD (`3020`), et `3020` excluait explicitement les invités. Un invité avait donc une **session illimitée sur un appareil non géré**. Désormais 12 heures pour tous sauf break-glass et comptes de service ; `3010` reste plus strict avec 9 heures pour les administrateurs. |
| `1150 BLOCK` Risky Agent Identities | CA501 | `agentIdRiskLevels: high` sur les service principals d'agent. `1140` ne couvre que `servicePrincipalRiskLevels` — une autre identité, pas un doublon. |
| `1160 BLOCK` Agent Identities To Agent Resources | CA502 | Liste d'autorisation sur `AllAgentIdResources`. |
| `2160 GRANT` Agent Users Compliant Device | CA503 | `agentContext: agentUserSessionsInitiatedFromEndpoints`. |
| `1170 BLOCK` Risky Agent Users | CA504 | `agentIdRiskLevels: medium,high` sur les *users* d'agent. |
| `1180 BLOCK` Agent Users Outside Compliant Network | CA505 | Seul endroit de l'ensemble avec une condition compliant network (Global Secure Access). |
| `2170 GRANT` MFA for Intune Enrollment | CA203 | `2080` couvre la user action `urn:user:registerdevice`, pas l'application `d4ebce55` (Intune Enrollment) avec `frequencyInterval: everyTime`. Autre chemin, même moment. |

Les cinq modèles d'agent sont optionnels (ils exigent Entra Agent ID, `1180` aussi
GSA). Quatre d'entre eux sont sur report-only, comme chez Verlinden — `1160` est une liste d'autorisation qui,
activée à l'aveugle, met à l'arrêt chaque agent existant, `2160` et `1170` bloquent sur quelque chose qui
n'est cartographié dans pratiquement aucun tenant. **La raison figure par modèle dans la liste optionnelle (désormais
`CATemplate/_manifest.json`) et arrive ainsi comme `optionalReason` dans `cipp/baseline-stages.json`.** C'est la variante sans mécanisme du point 3
ci-dessous (« rendre une raison obligatoire pour chaque state non `enabled` ») ; le champ n'existe pas encore,
c'est donc le meilleur endroit disponible aujourd'hui. Le compteur s'établit ainsi à **16 des 40
modèles qui n'imposent rien** — le problème de l'itération 1 n'est pas résolu,
simplement pas aggravé sans explication.

Le point 4 de la liste de l'itération 1 est ainsi traité (réauthentification périodique) et le point
7 rattrapé par la réalité : Microsoft fournit désormais les conditions d'agent dans Graph et
Verlinden les utilise, donc « réévaluer dès qu'Entra Agent ID est GA » est désormais chose faite —
comme `optional`, exactement comme l'itération 1 le prescrivait.

## Ce qui a été réparé

1. **La liste des rôles d'administration était trop courte : 11 rôles, désormais 28.** `1130`, `2055`, `2130` et `3010`
   ciblaient onze rôles ; Verlinden en utilise 24. Ont été ajoutés entre autres
   **Exchange-, SharePoint-, Intune-, Teams-, User-, Helpdesk-, Password- et Authentication
   Administrator** — tous des rôles permettant de prendre le contrôle du tenant — plus les rôles que
   2026.6.1 a ajoutés : **Agent ID, Agent Registry, AI, Windows 365, Entra Backup, Microsoft
   365 Backup et Dragon Administrator**. Nos quatre rôles propres (Authentication Policy,
   Compliance, Compliance Data, Hybrid Identity) restent en place ; il ne les a pas.
2. **`2050` excluait `AllTrusted`.** La MFA pour tous les utilisateurs tombait sur un emplacement
   approuvé — y compris pour les invités. Verlinden ne connaît pas cette exception (CA000/CA400) et CIS déconseille
   le contournement par IP approuvée. Exception supprimée.
3. **`2060` et `2090` n'excluaient pas les applications Intune.** « Exiger un appareil conforme »
   sans exception pour `0000000a` (Microsoft Intune) et `d4ebce55` (Intune Enrollment)
   est un problème de l'œuf et de la poule : on ne peut pas s'inscrire pour *devenir* conforme. `2070` le faisait à moitié. Les deux
   applications sont désormais exclues, comme dans CA205/CA208.
4. **`1120` bloquait My Apps pour les invités.** Sans `2793995e-…` dans les exceptions,
   un invité ne peut pas utiliser son invitation. Ajouté, comme dans CA401.
5. **`3020` excluait les invités.** La stratégie qui limite les appareils non gérés ne s'appliquait pas
   précisément au groupe qui, par définition, n'a pas d'appareil géré. Exclusion supprimée.

## Ce que nous ne reprenons pas de lui

| Sa stratégie | Pourquoi pas |
|---|---|
| CA300 — MFA pour les comptes de service | Déjà rejeté dans l'itération 1 : contredit `1060` et `2050`. |
| Découpage par persona (CA100-105 à côté de CA200-210) | Déjà rejeté dans l'itération 1 : une règle par mesure, la distinction se trouve dans `includeRoles`. Ses personas admins et internals sont en grande partie la même mesure deux fois. |
| CA104 `continuousAccessEvaluation: strictLocation` | Notre `3050` est sur `strictEnforcement` et est plus strict. |
| CA005/CA006 isolément | Couverts par `2070`, `2090` et `3040` ensemble. |

À l'inverse, il n'a pas dix mesures que nous avons : `1050`, `1110`, `1140`, `2110`,
`2120`, `2130`, `1130`, `3030`, `3040`, `3060` et `2150`. Ce n'était pas une opération de rattrapage.

## Ce qui reste ouvert ensuite

Les points 1, 2, 3, 6 et 8 de la liste de l'itération 1 restent ouverts sans changement — et le point 1
(fournir les conditions préalables) est devenu plus urgent avec cette itération : `1180` fait référence à la
named location **All Compliant Network locations**, et les nouveaux modèles d'agent viennent d'un
tenant où Entra Agent ID est activé. S'y ajoute une chose :

- **Vérifier si le déploiement CA de CIPP transmet les champs beta** (`agents`, `agentContext`,
  `agentIdRiskLevels`, `includeAgentIdServicePrincipals`, `AllAgentIdResources`). Sinon, les
  cinq modèles d'agent se déploient bien, mais sans leur condition distinctive — et c'est
  plus dangereux que de ne pas les déployer, car `1160` devient alors un blocage sur tout.

# Itération 3 — enregistrement de méthodes MFA derrière un TAP (7 septembre 2026)

## Le déclencheur

Le fil r/msp *"Block new PassKey registrations"* décrit une brèche que cet ensemble ne
comblait pas : quiconque s'empare d'une session — phishing AiTM, une extension de navigateur malveillante, ou simplement
la persuasion — y enregistre *lui-même* une passkey et dispose ensuite de sa propre clé
résistante au phishing vers le tenant. Une réinitialisation du mot de passe ne la touche pas, et le
journal de connexion montre une connexion propre et forte.

Le fil cite trois pistes ; seule la première est une mesure de Conditional Access :

1. placer la page d'enregistrement derrière une authentication strength qui n'accepte qu'un TAP
   — l'enregistrement n'est alors plus possible depuis une session existante ;
2. imposer l'attestation et restreindre les AAGUID, afin que les synced passkeys des gestionnaires de mots de passe
   ne s'enregistrent plus — cela relève de l'**authentication methods policy**, pas de CA,
   et sort donc du périmètre de ce dépôt ;
3. gérer les extensions de navigateur via Intune — idem, autre dépôt.

Ce que l'ensemble avait déjà, c'est `3030` : il cible la même user action (`urn:user:registersecurityinfo`)
mais n'y applique qu'une sign-in frequency de 90 jours, *sans* `grantControls`. L'enregistrement
lui-même restait ainsi ouvert à précisément la session dont un attaquant dispose déjà.

## Ce qui a été ajouté

| Modèle | Pourquoi |
|---|---|
| `2180 GRANT` Register Security Info TAP Only | `grantControls` sur la user action que `3030` ne limite qu'en durée : seul un Temporary Access Pass à usage unique convient. Une session détournée ne peut pas y ajouter de méthode ; le helpdesk délivre un TAP, sinon cela ne se fait pas. |

**Pourquoi séparément et pas *dans* 3030.** Ce sont deux mesures au cycle de vie
différent : `3030` est une limitation de session qui peut être activée partout, `2180` est un grant qui ne peut l'être
que lorsque le tenant dispose d'une custom authentication strength *et* d'un processus TAP.

`2180` est optionnel (stage 3, report-only) : il requiert une condition préalable
par tenant, et il déplace la surface d'attaque vers le service desk. Sans vérification
d'identité lors de la demande de TAP, le gain est moindre qu'il n'y paraît.

## Ce qui reste ouvert ensuite

- **La custom strength est une condition préalable que le validateur ne voit pas.**
  `prerequisites/ca-prerequisites.json` ne connaît que les groupes et les named locations, donc
  `scripts/prerequisites.js` reste muet ici. L'id dans le modèle est un placeholder
  (`00000000-0000-0000-0000-000000000000`) ; lors du déploiement, il faut y mettre l'id de la
  strength créée dans ce tenant. Tant que c'est du travail manuel, `2180` n'a pas sa place dans le stage 1.
- **Vérifier si le déploiement CA de CIPP transmet une custom authentication strength ou se contente de
  la lier.** Sinon, `2180` se déploie sans grant control — ce n'est pas une stratégie plus stricte mais
  une stratégie vide.

# Itération 4 — j0eyv après 2026.6.1, et l'ensemble rendu générique (14 septembre 2026)

## Le déclencheur

[`j0eyv/ConditionalAccessBaseline`](https://github.com/j0eyv/ConditionalAccessBaseline) a encore été mis à jour
après le tag 2026.6.1 (que l'itération 2 suivait), sans nouveau tag. Sur le fond, une seule chose compte :
CA005 et CA006 sont passés de *Require app protection policy* à
**app enforced restrictions** comme contrôle de session. Le reste est un README, des images et une
coquille dans les noms de CA403/CA404.

| Sa stratégie (après le 13 juillet 2026) | Ce qu'elle fait | Dans cet ensemble |
|---|---|---|
| CA005 — iOS/Android, navigateur *et* applications, Office 365, non géré | `compliantApplication` comme grant **plus** app enforced restrictions ; exclus : appareils conformes *et* appartenant à l'entreprise | `2070` (application conforme sur iOS/Android). `2090` exige déjà un appareil conforme dans le navigateur, donc ajouter le navigateur à `2070` n'apporte rien. |
| CA006 — toute plateforme, navigateur, **SharePoint et Exchange Online**, non géré | uniquement app enforced restrictions | `3040` — mais celui-ci ne valait que pour SharePoint Online |

## Ce qui a été adapté

**`3040` couvre désormais aussi Exchange Online** (`00000002-0000-0ff1-ce00-000000000000`). L'itération 2 écrivait
« CA005/CA006 isolément : couverts par `2070`, `2090` et `3040` ensemble » ; c'était exact pour SharePoint et
OneDrive, mais télécharger une pièce jointe via Outlook sur le web sur un appareil non géré passait
à côté. Une réserve :

- Pour Exchange, le contrôle de session n'agit que si la stratégie de boîte aux lettres OWA coopère :
  `Set-OwaMailboxPolicy -Identity OwaMailboxPolicy-Default -ConditionalAccessPolicy ReadOnly` (ou
  `ReadOnlyPlusAttachmentsBlocked`). Sans cette étape, la stratégie est muette pour Exchange. Ce paramètre
  ne figure pas dans ce dépôt ; il relève des conditions préalables par tenant.

Le filtre d'appareil de j0eyv (conforme **et** `deviceOwnership -eq "Company"`) n'a pas été
repris. Il placerait aussi sous la restriction un appareil personnel inscrit et conforme ;
c'est un choix par tenant concernant le BYOD, pas une mesure de baseline.

**`1060` ne porte plus de plage IP.** Le modèle contenait une IP publique du tenant depuis lequel
il avait jadis été exporté. Le générateur l'en retirait déjà lors de l'export CIPP et
`New-CaPrerequisites.ps1` ne l'utilisait pas, mais elle figurait bien dans `CATemplate/` et dans les
fichiers générés. Désormais la named location du modèle est vide,
identique à `prerequisites/ca-prerequisites.json` ; la valeur arrive par tenant via
`-ServiceAccountIpRange`. L'IP figure toujours dans l'historique git.

**`1040` ne porte plus de pays par défaut.** Le modèle et `prerequisites/` mentionnaient BE et NL —
les pays d'une seule organisation. Désormais `Allowed Countries` est vide et marqué comme `requiresCountries` :
l'export CIPP fige `1040` sur Report jusqu'à ce que les pays du tenant soient connus, et
`New-CaPrerequisites.ps1` ne crée l'emplacement qu'avec `-AllowedCountry`. Déployer une liste de pays
vide bloquerait *chaque* connexion en dehors d'« aucun pays ».

# Itération 5 — le mapping normatif qui n'existait que comme chemin (15 septembre 2026)

## Le déclencheur

`scripts/generate-compliance.js` dans le dépôt IntuneBackup lit depuis août
`../CA-Policies/controls/ca-controls.json`. Le chemin figurait dans l'en-tête du script, la fonction de lecture
`readConditionalAccess()` existait, COMPLIANCE.md avait une colonne **CA actief** pour cela — seul le
fichier n'a jamais vu le jour. Tout le monde lançait donc `--no-ca`, et ce document disait ensuite
littéralement que Conditional Access n'était « délibérément pas pris en compte ».

Ce n'est pas une ligne manquante mais une image faussée. La justification affirmait que NIS2 (j),
l'authentification multifacteur, est couverte par trois stratégies Intune. Les dix stratégies CA qui font le
vrai travail étaient dans le tenant depuis des années, mais dans aucun document qu'un auditeur lit.

## Ce qui a été ajouté

**`controls/ca-controls.json`** — les 41 modèles mappés sur ISO/IEC 27001:2022 Annexe A, NIS2
art. 21, par. 2, CIS Controls v8.1 et NIST CSF 2.0, dans exactement le même vocabulaire que
`IntuneTemplate/_controls.json` dans l'autre dépôt. La phase ne vient pas d'un manifeste mais de
`state` dans le modèle lui-même : `enabled` compte comme imposé, report-only comme préparé,
`disabled` comme non déployé.

**`scripts/check-controls.js`** et son test — surveillent les deux côtés par lesquels cela dérive
silencieusement. Un modèle sans mapping disparaît sans bruit de la justification ; un mapping
sans modèle y couvre un control avec une stratégie qui n'existe pas, et seul le remarque
l'auditeur qui suit la référence. Les libellés eux-mêmes ne sont vérifiés que localement — le vocabulaire
réside dans l'autre dépôt, donc en CI c'est `generate-compliance.js --strict` qui s'en charge.

## Ce que cela apporte

| NIS2 art. 21(2) | sans CA | avec CA |
|---|---:|---:|
| (j) authentification multifacteur et communications sécurisées | 3 | 13 |
| (i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs | 22 | 39 |
| (b) gestion des incidents | 8 | 15 |

## Ce qui reste ouvert ensuite

- **Ce qui est dans git est toujours la version `--no-ca`**, car c'est ce que le workflow y
  régénère ; la CI ne voit pas ce dépôt. Faire entrer la version CA dans git requiert un secret
  `CA_POLICIES_TOKEN` et l'activation du checkout CA dans le workflow du dépôt
  IntuneBackup — les deux étapes figurent au point ouvert 3 de son `docs/ANALYSE.md`.
- **Le mapping est un jugement, pas une norme.** Il n'existe aucune source faisant autorité qui relie les stratégies CA aux
  controls de l'Annexe A ; celui-ci a été établi à la main par analogie avec le côté Intune. Lors d'un
  audit, c'est défendable, pas démontrable.
- **Six stratégies sont sur report-only** et ne comptent donc pas comme couvertes. C'est juste — elles ne font
  rien — mais cela signifie que la matrice s'améliore dès que quelqu'un active ces six, sans qu'une
  seule stratégie ne s'ajoute.

# Itération 6 — trois templates issus d'un tenant, et le préfixe CXNM - STANDARD (30 septembre 2026)

## Le déclencheur

Trois templates sont arrivés directement d'un export CIPP d'un tenant client dans `CATemplate/` :
`CACUSTOMWHfBPasskeys`, `GRANT__MFA_PHISHING_RESISTENT__Benelux_` et
`MFA__Phishing_Resistent__Rollout`. Ensemble, ils forment un déploiement de passkeys par groupe.
Mais les scripts ne lisaient que `GLOBAL__*.json` : ils échappaient donc à tout contrôle et à
l'export CIPP — et ils portaient ce que l'ensemble exclut délibérément : de vrais ids de strength,
les plages IP de deux emplacements AVD, et un nom de client dans le displayName.

En même temps, le préfixe a changé : `GLOBAL` devient `CXNM - STANDARD` dans le tenant et
`CXNM__STANDARD__` comme nom de fichier. Voir *Pourquoi il n'y a pas de personas*.

## Ce qui a été modifié

| Avant | Devient | Ce qui a changé |
|---|---|---|
| `GRANT \| MFA PHISHING RESISTENT \| Benelux` | `2125 GRANT` Phishing Resistant MFA for Rollout Groups | Exclusions AVD retirées (IP spécifiques au tenant ; le test sur les fuites d'IP échouait). Persistent browser `always` retiré : un contrôle de session n'a pas sa place dans un grant, et `always` sur tout appareil contredit `3020`. Break-glass et comptes de service exclus. |
| `MFA \| Phishing Resistent \| Rollout` | `2185 GRANT` Register Security Info Passkey Rollout | Id de strength remplacé par le GUID nul ; SMS et voix retirés de la strength, car `authentication-methods/` les désactive. Break-glass et comptes de service exclus. |
| `CA-CUSTOM-WHfB-Passkeys` | `2190 GRANT` Windows Hello Passkeys | Ciblait `includeApplications: None` et n'imposait donc rien — un support pour amener la strength dans le tenant via CIPP. Ici, c'est `New-CaPrerequisites.ps1` qui s'en charge : c'est désormais une vraie stratégie sur toutes les apps, en report-only. |

Les trois sont optionnels (stage 3). Leurs quatre groupes et deux strengths sont dans `prerequisites/`.

**La restriction AAGUID n'était pas surveillée.** La strength de `2190` est FIDO2 restreint aux
AAGUID Windows Hello — cette restriction se trouve dans `combinationConfigurations`, que personne
ne regardait : `prerequisites.js` ne comparait que `allowedCombinations`, et
`New-CaPrerequisites.ps1` créait la strength sans restriction. N'importe quelle passkey suffit
alors. Les deux la gèrent désormais.

## Ce qui reste ouvert

- **`2190` ne compte pas WHfB.** Une credential Windows Hello for Business est la combinaison
  `windowsHelloForBusiness`, pas `fido2`. Un utilisateur sur un appareil joint avec WHfB n'y
  satisfait pas — et ne peut souvent pas y enregistrer de passkey Windows Hello (voir
  `authentication-methods/`, `windowsHelloPasskeys`). Si WHfB doit compter,
  `windowsHelloForBusiness` a sa place dans la strength. C'est un choix pour qui a conçu la stratégie.
- **L'AAGUID logiciel.** La strength autorise `6028b017…` (Windows Hello logiciel) ;
  `authentication-methods/` limite le profil au matériel et au VBS. L'enregistrement avec la
  variante logicielle échoue donc de toute façon, mais les deux listes se contredisent.
- **`2185` à côté de `2180`.** Si les deux sont activées, la seule combinaison qui satisfait les
  deux est un TAP à usage unique. Le groupe de déploiement perd alors l'avantage pour lequel
  `2185` existe.
- **Les groupes portent les noms du tenant source** (`CA-…`, `U-WHfB-Passkeys`), pas la
  convention SG-U. Les renommer rompt le lien avec ce tenant.
- **Le côté IntuneBackup** lit les clés de `controls/ca-controls.json` ; son `COMPLIANCE.md`
  affiche les anciens noms `GLOBAL__` jusqu'à sa régénération.
