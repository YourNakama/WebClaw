# Créer un Skill

Guide complet pour créer et contribuer vos propres skills au Skill Hub de WebClaw.

## Structure d'un skill

Chaque skill vit dans son propre dossier à la racine du dépôt. Le nom du dossier **doit** correspondre à l'`id` dans le manifest.

```
mon-skill/
├── skill.json     # Manifest (requis)
└── prompt.md      # Instructions IA (optionnel)
```

## Le Manifest (`skill.json`)

Le manifest décrit votre skill au système. C'est le seul fichier strictement requis.

```json
{
  "id": "mon-skill",
  "name": "Mon Skill",
  "description": "Une phrase claire décrivant ce que fait le skill.",
  "version": "1.0.0",
  "author": "VotreNom",
  "category": "tool",
  "icon": "FileText",
  "tags": ["documentation", "productivité"],
  "hasPrompt": true
}
```

### Champs requis

| Champ | Type | Règles |
|-------|------|--------|
| `id` | string | Lowercase kebab-case (`a-z0-9-` uniquement), max 64 caractères. **Doit correspondre au nom du dossier.** |
| `name` | string | Nom lisible par un humain, max 100 caractères |
| `description` | string | Une phrase claire et spécifique, max 500 caractères |
| `version` | string | Format semver (`1.0.0`), max 20 caractères |
| `author` | string | Votre nom ou organisation, max 100 caractères |
| `category` | string | `"tool"`, `"template"`, ou `"agent"` |

### Champs optionnels

| Champ | Type | Description |
|-------|------|-------------|
| `icon` | string | Nom d'icône [Lucide](https://lucide.dev/icons) (ex: `"FileText"`, `"Wand2"`, `"Bot"`), max 50 caractères |
| `tags` | string[] | Jusqu'à 10 tags, chacun max 30 caractères |
| `hasPrompt` | boolean | `true` si vous incluez un `prompt.md` |
| `maxToolLoops` | number | Appels d'outils max par step de workflow (1-5, défaut 5) |
| `maxSteps` | number | Steps max du workflow (1-10, défaut 10) |
| `workflow` | object | Définition du workflow — **type agent uniquement** |

## Le Prompt (`prompt.md`)

Pour les skills **tool** et **template**, `prompt.md` contient les instructions injectées dans le system prompt de l'IA. Écrivez-le comme des directives claires pour un LLM.

### Limites

- Maximum **8 000 caractères**
- Pas de HTML ni de `<script>` (supprimés automatiquement)
- Le formatage Markdown est préservé

### Conseils pour écrire un bon prompt

**Soyez directif** — L'IA répond mieux aux instructions claires.

```markdown
# Mauvais
Vous pourriez envisager d'ajouter un frontmatter YAML...

# Bon
Chaque document DOIT commencer par un frontmatter YAML contenant : type, title, status, date, tags.
```

**Donnez des exemples concrets** — Montrez exactement ce que vous attendez.

```markdown
# Mauvais
Écrivez de manière professionnelle.

# Bon
## Voix
- Utilisez des contractions naturelles : "it's", "don't", "we'll"
- Variez la longueur des phrases — alternez phrases courtes et explicatives
- Adressez le lecteur directement : "Vous voudrez..." pas "Il convient de..."

### Interdit (patterns IA détectables) :
- "Il est important de noter que..."
- "Dans le paysage actuel..."
- "Plongeons dans..."
- "Robuste", "Seamless", "Cutting-edge"
```

**Structurez avec des headings** — Le LLM suit mieux les instructions bien organisées.

**Incluez des règles DO / DO NOT** — Listes explicites de ce qu'il faut faire et ne pas faire.

## Créer un skill Tool

Un skill Tool injecte son prompt dans l'assistant IA. L'utilisateur discute normalement et l'IA applique automatiquement vos instructions.

### Exemple minimal

**`meeting-notes/skill.json`** :

```json
{
  "id": "meeting-notes",
  "name": "Meeting Notes",
  "description": "Formate les notes de réunion avec participants, décisions et actions.",
  "version": "1.0.0",
  "author": "VotreNom",
  "category": "tool",
  "icon": "ClipboardList",
  "tags": ["meeting", "notes", "productivity"],
  "hasPrompt": true
}
```

**`meeting-notes/prompt.md`** :

```markdown
# Meeting Notes — Formatage structuré

Quand l'utilisateur demande de créer ou formater des notes de réunion, applique ces règles :

## Structure obligatoire

Chaque compte-rendu DOIT contenir :

1. **Frontmatter YAML** : type: meeting, date, participants (liste)
2. **Contexte** : 1 paragraphe résumant l'objet de la réunion
3. **Points discutés** : un `##` par sujet avec résumé
4. **Décisions** : tableau Markdown (décision | responsable | deadline)
5. **Actions** : checklist `- [ ]` avec responsable et deadline
6. **Prochaine réunion** : date et ordre du jour provisoire

## Fichier

Place le fichier dans `meetings/YYYY-MM-DD-sujet.md`.
```

## Créer un skill Template

Un skill Template génère des documents complets à partir d'un prompt structuré.

La différence avec un Tool : le Template est conçu pour produire un document one-shot, pas pour modifier le comportement conversationnel de l'IA.

Le `prompt.md` d'un Template décrit la structure exacte du document à générer.

## Créer un skill Agent

Un skill Agent définit un workflow multi-étapes. C'est le type le plus puissant.

### Définition du workflow

Le workflow est défini directement dans `skill.json` :

```json
{
  "id": "vault-audit",
  "name": "Vault Audit",
  "description": "Audite le vault et propose des améliorations de structure.",
  "version": "1.0.0",
  "author": "VotreNom",
  "category": "agent",
  "icon": "Search",
  "tags": ["audit", "organization"],
  "workflow": {
    "steps": [
      {
        "id": "scan",
        "name": "Scanner les fichiers",
        "description": "Lire tous les fichiers et analyser leur structure",
        "instruction": "Utilise list_files pour lister tous les fichiers du vault. Puis utilise read_file pour lire chaque fichier .md. Analyse : présence de frontmatter, qualité des titres, longueur, liens internes.",
        "requiresApproval": false,
        "allowedTools": ["list_files", "read_file", "search_content"]
      },
      {
        "id": "report",
        "name": "Rapport d'audit",
        "description": "Générer un rapport avec les problèmes identifiés",
        "instruction": "Crée un fichier reports/vault-audit.md avec un tableau résumant chaque fichier audité : nom, problèmes trouvés, score de qualité (1-5). Ajoute des recommandations globales.",
        "requiresApproval": true,
        "allowedTools": ["create_file"]
      },
      {
        "id": "fix",
        "name": "Appliquer les corrections",
        "description": "Corriger les problèmes identifiés fichier par fichier",
        "instruction": "Pour chaque fichier avec des problèmes identifiés dans le rapport, utilise edit_file pour corriger : ajouter le frontmatter manquant, corriger les niveaux de heading, ajouter une introduction aux sections qui en manquent.",
        "requiresApproval": true,
        "allowedTools": ["read_file", "edit_file"]
      }
    ]
  }
}
```

### Champs d'une étape

| Champ | Requis | Description |
|-------|--------|-------------|
| `id` | Oui | Identifiant unique dans le workflow, max 50 caractères |
| `name` | Oui | Nom affiché à l'utilisateur, max 100 caractères |
| `description` | Oui | Ce que fait cette étape, max 500 caractères |
| `instruction` | Oui | Directive pour l'IA, max 2 000 caractères |
| `requiresApproval` | Non | Si `true` (défaut), pause avant exécution |
| `allowedTools` | Non | Restreint l'étape à certains outils |

### Bonnes pratiques pour les workflows

1. **Commencez par de la lecture** — Les premières étapes doivent scanner et analyser sans modifier.
2. **Rapport avant action** — Montrez à l'utilisateur ce que vous avez trouvé avant de modifier quoi que ce soit.
3. **Granularité des étapes** — Chaque étape = une action logique. Ne mélangez pas scan et correction dans la même étape.
4. **Restreignez les outils** — Les étapes de lecture ne devraient avoir accès qu'à `list_files`, `read_file`, `search_content`.

## Publier votre skill

### 1. Ajoutez au registre

Éditez `registry.json` à la racine du dépôt et ajoutez votre skill :

```json
{
  "skills": [
    {
      "id": "mon-skill",
      "name": "Mon Skill",
      "description": "Ce que fait le skill.",
      "version": "1.0.0",
      "author": "VotreNom",
      "category": "tool",
      "icon": "FileText",
      "tags": ["documentation"]
    }
  ]
}
```

### 2. Ouvrez une Pull Request

1. Forkez le dépôt
2. Créez votre dossier de skill
3. Ajoutez l'entrée dans `registry.json`
4. Ouvrez une PR avec :
   - Description de ce que fait le skill
   - Exemples de cas d'usage
   - Captures d'écran si pertinent

### 3. Revue

Votre skill sera revu selon ces critères :
- **Utilité** — Résout un vrai problème
- **Qualité** — Prompt bien écrit et spécifique
- **Sécurité** — Pas d'injection, pas d'exfiltration
- **Portée** — Un skill = un job clair
- **Nommage** — ID et nom descriptifs

## Validation et limites

Votre skill sera rejeté si :
- Les champs requis sont absents ou dépassent les limites de taille
- L'`id` du manifest ne correspond pas au nom du dossier
- La catégorie n'est pas `tool`, `template`, ou `agent`
- Les étapes du workflow référencent des outils non autorisés
- Les IDs d'étapes contiennent des doublons
- Le prompt dépasse 8 000 caractères

---

**Retour** : [README principal](../README.md)
