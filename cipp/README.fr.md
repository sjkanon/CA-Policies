[Nederlands](README.md) · [English](README.en.md) · **Français**

# cipp/

Le côté déploiement : ce dont CIPP a besoin pour déployer les templates de [`CATemplate/`](../CATemplate/README.fr.md)
comme baseline. **Généré** par `scripts/export-cipp-baseline.js` — ne pas modifier à la main. Après
chaque modification de `CATemplate/`, `.github/workflows/generate-cipp.yml` ouvre une PR avec la
nouvelle version.

| Fichier | Contenu |
|---|---|
| [`ca-templates-import.json`](ca-templates-import.json) | les 44 templates au format de table CATemplate de CIPP, GUID inchangé, sans valeurs spécifiques au tenant (plages IP et pays retirés) |
| [`baseline-stages.json`](baseline-stages.json) | par template le stage, le state et l'action (Report ou Remediate), plus les templates bloqués sur Report tant que leur prérequis n'existe pas dans le tenant |

## Les stages

| Stage | Critère | Déployé comme | Nombre |
|---|---|---|---:|
| 1 — Socle | `state: enabled` dans le template, non optionnel | `enabled` | 17 |
| 2 — Renforcement | `disabled` ou report-only dans le template | report-only | 12 |
| 3 — Choix du tenant et licence | `optional: true` dans [`_manifest.json`](../CATemplate/_manifest.json) | report-only, reste sur Report | 15 |

Le stage de chaque template figure dans le [README de `CATemplate/`](../CATemplate/README.fr.md).
`1040`, `1060` et `1180` restent sur Report dans tous les cas : leur prérequis (pays, plages IP,
Global Secure Access) ne peut pas venir de ce dépôt.

## Tout est sur Report

Ce qui est dans git est entièrement sur `Report` ; un test le vérifie. Le stage 1 en `Remediate`
est une décision par tenant, après `New-CaPrerequisites.ps1` :

```bash
node scripts/export-cipp-baseline.js --remediate-stage1
```

Ce drapeau refuse tant que des templates sont nouveaux dans le stage 1 par rapport à l'export
précédent ; `--accept-new` les confirme. Ne recommitez pas le résultat.

`baseline-stages.json` est notre propre format, pas le schéma de l'écran Baselines de CIPP — celui-ci
dépend de la version. Qui construit la baseline dans CIPP reprend cette liste. Voir le
[README principal](../README.fr.md#déployer-via-cipp).
