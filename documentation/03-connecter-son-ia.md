# Connecter son IA — Bring Your Own Key

WebClaw intègre un assistant IA capable de lire, créer, éditer et organiser vos fichiers. Vous apportez votre propre clé API — WebClaw ne fournit aucun accès IA, et ne voit jamais votre clé en clair.

## Fournisseurs supportés

| Fournisseur | Modèles populaires | Ce qu'il faut |
|-------------|-------------------|---------------|
| **Anthropic (Claude)** | Claude Opus 4, Sonnet 4, Haiku 3.5 | Clé API Anthropic |
| **OpenAI** | GPT-4o, GPT-4o-mini, o1, o3 | Clé API OpenAI |
| **OpenRouter** | 200+ modèles (Claude, GPT, Llama, Mistral...) | Clé API OpenRouter |
| **Ollama** | Llama 3, Mistral, CodeLlama, Phi-3 | Ollama installé sur votre machine (gratuit) |
| **Custom** | Tout modèle compatible OpenAI API | URL d'endpoint + clé API optionnelle |

## Configuration pas à pas

### 1. Ouvrir les paramètres

Dans votre vault, cliquez sur l'**icône engrenage** (Settings) dans la barre du haut.

### 2. Onglet General

Allez dans l'onglet **General**. Vous y trouverez la section de configuration IA.

### 3. Choisir un fournisseur

Sélectionnez votre fournisseur dans le dropdown. Les champs à remplir dépendent de votre choix :

#### Anthropic (Claude)

| Champ | Valeur |
|-------|--------|
| API Key | Votre clé `sk-ant-...` depuis [console.anthropic.com](https://console.anthropic.com/) |
| Model | Choisissez dans la liste (Claude Opus 4, Sonnet 4, etc.) |

#### OpenAI

| Champ | Valeur |
|-------|--------|
| API Key | Votre clé `sk-...` depuis [platform.openai.com](https://platform.openai.com/) |
| Model | Choisissez dans la liste (GPT-4o, GPT-4o-mini, etc.) |

#### OpenRouter

| Champ | Valeur |
|-------|--------|
| API Key | Votre clé depuis [openrouter.ai/keys](https://openrouter.ai/keys) |
| Model | Choisissez parmi 200+ modèles disponibles |

OpenRouter est particulièrement intéressant : un seul compte donne accès à Claude, GPT-4, Llama, Mistral, et bien d'autres. Parfait pour comparer les modèles ou accéder à des modèles spécialisés.

#### Ollama (gratuit, 100% local)

| Champ | Valeur |
|-------|--------|
| Endpoint | `http://localhost:11434` (par défaut) |
| Model | Le nom du modèle installé localement |

Ollama nécessite une installation sur votre machine (c'est le seul prérequis technique de tout WebClaw). En échange, aucune donnée ne quitte votre ordinateur. Zéro coût, zéro tracking.

Pour installer Ollama : [ollama.ai](https://ollama.ai)

#### Custom (endpoint personnalisé)

| Champ | Valeur |
|-------|--------|
| Endpoint | L'URL de base de votre API |
| API Key | Optionnel, selon votre API |
| Model | Le nom du modèle à utiliser |

Compatible avec toute API qui respecte le format OpenAI Chat Completions.

### 4. Sauvegarder

Cliquez **Save**. Votre configuration est chiffrée et stockée localement dans votre navigateur.

## Sécurité des clés API

Votre clé API suit exactement le même modèle de sécurité que votre token GitHub :

- **Chiffrement AES-256-GCM** via l'API WebCrypto native du navigateur
- **Stockage dans IndexedDB** — jamais dans localStorage, sessionStorage, ou les cookies
- **Aucun stockage serveur** — la clé est utilisée uniquement pour relayer les requêtes vers le fournisseur IA

## Utiliser l'assistant IA

Une fois configuré, ouvrez le panneau IA avec `Ctrl+K` (ou `Cmd+K` sur Mac), ou cliquez sur l'icône IA dans la barre d'outils.

L'assistant peut :
- **Lire** n'importe quel fichier de votre vault (y compris les PDFs et DOCX importés)
- **Rechercher** du contenu dans tous vos fichiers
- **Créer** de nouveaux documents (avec votre approbation)
- **Éditer** des fichiers existants (avec votre approbation)
- **Organiser** votre vault (renommer, déplacer, supprimer — avec votre approbation)

Chaque action qui modifie un fichier demande votre confirmation avant exécution.

## Prompt système personnalisé

Dans les paramètres, vous pouvez ajouter un **prompt système personnalisé** qui sera injecté dans chaque conversation. Utile pour :

- Définir un contexte permanent (*"Ce vault concerne le projet X pour le client Y"*)
- Imposer des conventions (*"Tous les documents doivent avoir un frontmatter YAML"*)
- Définir votre ton (*"Réponds toujours en français, de manière concise et professionnelle"*)

## FAQ

**Q : Puis-je utiliser WebClaw sans IA ?**
R : Absolument. L'IA est optionnelle. WebClaw fonctionne comme un excellent éditeur Markdown avec GitHub sync, preview, impression et recherche — même sans IA.

**Q : Quel modèle recommandez-vous ?**
R : Pour du travail documentaire professionnel, **Claude Sonnet 4** offre le meilleur rapport qualité/prix. Pour du gratuit, **Ollama avec Llama 3.1** est excellent.

**Q : Puis-je changer de fournisseur IA à tout moment ?**
R : Oui. Settings > changez le fournisseur et le modèle > Save. La prochaine conversation utilisera la nouvelle configuration.

**Q : Ma clé API est-elle en sécurité ?**
R : Oui. Elle est chiffrée AES-256-GCM dans votre navigateur. Elle n'est jamais stockée en clair ni conservée côté serveur.

---

**Prochaine étape** : [Installer et utiliser un skill](./04-installer-utiliser-skill.md)
