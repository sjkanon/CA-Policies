<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

[Nederlands](CXNM__STANDARD__2180__GRANT__Register_Security_Info_TAP_Only.md) · [English](CXNM__STANDARD__2180__GRANT__Register_Security_Info_TAP_Only.en.md) · **Français**

# CXNM - STANDARD - 2180 - GRANT - Register Security Info TAP Only

N'autorise l'enregistrement des infos de sécurité (méthodes MFA, passkeys) qu'avec un Temporary Access Pass. Une session détournée ne peut alors pas ajouter sa propre méthode. Report-only : requiert un processus TAP au service desk.

| | |
|---|---|
| Type | GRANT |
| State | report-only |
| Stage | 3* |
| Pour qui | tout le monde |
| Exclus | `Excluded from Conditional Access`, `SG-U-CA-Exclude-Breakglass` |
| Sur | enregistrer les infos de sécurité |
| Conditions | aucune — seulement qui, sur quelle app |
| Exigence | `Temporary Access Pass only` |
| Fichier | [`CXNM__STANDARD__2180__GRANT__Register_Security_Info_TAP_Only.json`](CXNM__STANDARD__2180__GRANT__Register_Security_Info_TAP_Only.json) |

Les groupes, named locations et authentication strengths du tableau doivent exister dans le tenant : voir [`prerequisites/`](../prerequisites/README.fr.md). Un groupe d'exclusion qui n'existe pas n'exclut personne.

> **Optionnel** — vraagt een custom authentication strength ('Temporary Access Pass only') die per tenant wordt aangemaakt: Entra kent daar zelf een id aan toe, dus het id in het template is een placeholder die bij de uitrol per tenant wordt vervangen. En het is een procesbesluit — zonder helpdesk die TAPs uitgeeft en de aanvrager verifieert kan niemand nog zelf een methode registreren, ook niet zijn eerste.

## Points d'attention

- L'id de strength du template est un placeholder (GUID nul) ; au déploiement, l'id de la strength créée doit y figurer. Vérifiez aussi que CIPP transmet la strength personnalisée, sinon une stratégie vide est déployée.
- Déplace la surface d'attaque vers le service desk : sans vérification d'identité lors de la demande de TAP, le gain est plus faible qu'il n'y paraît.

## Touche Intune

Aucune stratégie Intune dont dépend cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.5.16 Identiteitsbeheer |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 6.1 Establish an Access Granting Process |
| NIST CSF 2.0 | PR.AA-02<br>PR.AA-01 |

Issu de [`controls/ca-controls.json`](../controls/README.fr.md) ; les libellés restent en néerlandais, comme dans le vocabulaire. Ce que cela signifie par norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](https://github.com/ConXioN-ITCE/CIPP-Templates-Intune/blob/main/docs/COMPLIANCE.fr.md) dans le dépôt IntuneBackup.

---

Retour à la [vue d'ensemble](README.fr.md) · [README principal](../README.fr.md)
