[Nederlands](README.md) · [English](README.en.md) · **Français**

# controls/

[`ca-controls.json`](ca-controls.json) indique, pour chaque template de [`CATemplate/`](../CATemplate/README.fr.md),
quels contrôles il remplit techniquement, dans quatre référentiels :

| Clé | Référentiel |
|---|---|
| `iso` | ISO/IEC 27001:2022 Annexe A |
| `nis2` | directive (UE) 2022/2555, art. 21, § 2 |
| `cis` | CIS Controls v8.1 |
| `nistcsf` | NIST CSF 2.0 |

Chaque clé est un nom de fichier de `CATemplate/` sans `.json`. Renommer un template sans
emporter la clé rompt le lien ; `check-controls.js` le détecte.

## Où cela va

Ce fichier n'est pas un document en soi. Il alimente `COMPLIANCE.md` dans le dépôt IntuneBackup
(miroir : CIPP-Templates-Intune), qui réunit le côté Intune et le côté CA dans une seule matrice :

```bash
cd ../IntuneBackup
node scripts/generate-compliance.js --strict --ca ../CA-Policies/controls/ca-controls.json
```

Les libellés doivent correspondre littéralement au vocabulaire de `IntuneTemplate/_controls.json`
de ce dépôt. La phase ne vient pas de ce fichier mais du `state` du template : une stratégie en
report-only ne compte pas comme couverte.

## Ce qui le surveille

| | Fait |
|---|---|
| `node scripts/check-controls.js` | chaque template a un mapping, aucun mapping ne nomme un template inexistant. Si le dépôt Intune est à côté (`../IntuneBackup` ou `../CIPP-Templates-Intune`), il vérifie aussi les libellés. Bloquant en CI |
| `node --test scripts/check-controls.test.js` | les mêmes contrôles, plus : chaque stratégie remplit les quatre référentiels |

Un nouveau template sans entrée ici fait échouer la CI. C'est voulu : pour un auditeur, une
stratégie CA sans justification est une stratégie qui n'existe pas.
