<p align="center">
  <img src="./assets/logo.png" alt="WebClaw by NakamaCyber" width="160" />
</p>

<h1 align="center">WebClaw</h1>

<p align="center">
  <strong>L'assistant IA documentaire qui tourne dans votre navigateur.</strong><br/>
  Donationware. Gratuit. Aucune installation. Amenez votre propre IA.
</p>

<p align="center">
  <a href="https://ko-fi.com/nakamacyber"><img src="https://img.shields.io/badge/Ko--fi-Soutenir%20le%20projet-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white" alt="Ko-fi"></a>
  <img src="https://img.shields.io/badge/mod%C3%A8le-donationware-brightgreen?style=flat-square" alt="Donationware">
  <img src="https://img.shields.io/badge/app-gratuite-blue?style=flat-square" alt="Gratuit">
</p>

---

**Imaginez un outil qui...**

- Transforme un PDF d'appel d'offres de 80 pages en synthèse + plan de réponse en 10 minutes
- Rédige un guide technique de 30 pages avec diagrammes, exemples de code et voix humaine
- Convertit vos notes de réunion brutes en compte-rendu pro avec actions et deadlines
- Organise des mois de documents éparpillés en base de connaissances structurée

**...le tout depuis un onglet de navigateur, sans rien installer, avec vos données qui restent chez vous.**

C'est WebClaw. Ouvrez le site, connectez-vous avec GitHub, et commencez à travailler.

---

## Ce que c'est

WebClaw est une **application web gratuite** pour créer, organiser et produire des documents professionnels assistés par IA. Pas un logiciel à installer, pas un SaaS à 20$/mois — une app dans votre navigateur, point final.

Vous y accédez via l'URL de l'application. Vous vous connectez avec votre compte GitHub. Vos documents sont stockés dans votre propre dépôt GitHub — pas sur nos serveurs. L'IA, c'est vous qui la choisissez (Claude, OpenAI, Ollama, etc.) et c'est votre clé API.

Ce dépôt que vous lisez en ce moment est le hub officiel de WebClaw : documentation de l'application, skills communautaires, et espace d'échange. Les skills de ce repo sont partagés sous licence MIT pour la communauté.

### Donationware : gratuit, financé par vous

WebClaw est un projet **donationware**. Ça veut dire :

- **Toutes les fonctionnalités sont accessibles à tout le monde, tout le temps.** Pas de version "Pro", pas de limites, pas de fonctionnalités cachées.
- **Le projet vit grâce aux dons de ses utilisateurs.** Si WebClaw vous fait gagner du temps, vous pouvez choisir de le soutenir — mais ce n'est jamais une obligation.
- **Votre don finance directement** le développement, les nouveaux skills, l'hébergement et la documentation.

C'est un modèle de confiance. On construit un outil de qualité, on le met à disposition de tous, et on fait confiance à ceux qui en bénéficient pour aider à le faire vivre.

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Soutenir%20WebClaw-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/nakamacyber)

Ko-fi prend **0% de commission** — 100% va au développeur.

## OpenClaw dans le navigateur, en plus simple et plus sûr

Vous connaissez peut-être [OpenClaw](https://github.com/openclaw/openclaw), l'agent IA open-source phénomène (191k+ stars) qui automatise tout sur votre machine : shell, fichiers, web, messagerie. C'est incroyablement puissant... mais il faut un terminal, des connaissances techniques, et vous donnez à l'IA un accès complet à votre système.

**WebClaw reprend les meilleures idées d'OpenClaw** — le BYOK (Bring Your Own Key), les skills communautaires, l'IA qui agit sur vos fichiers — **et les rend accessibles à tout le monde** :

| | OpenClaw | WebClaw |
|:--|:---------|:--------|
| **Pour commencer** | Terminal + Docker + config YAML | **Ouvrir un navigateur. C'est tout.** |
| **Qui l'utilise** | Développeurs, power users | **Tout le monde** — consultants, chercheurs, étudiants, managers, rédacteurs |
| **Ce que l'IA peut faire** | Tout (shell, web, système, API) | **Vos documents uniquement** — lire, écrire, organiser, rechercher |
| **Sécurité** | L'IA a accès à votre système entier | **Sandbox strict** — 8 outils, zéro accès système, approbation à chaque modification |
| **Vos clés API** | Fichier texte en clair | **Chiffrées AES-256-GCM** dans votre navigateur |
| **Vos données** | Sur votre machine locale | **Dans votre GitHub** — versionnées, portables, à vous pour toujours |
| **Modèle économique** | Open source | **Donationware** — gratuit, financé par la communauté |

WebClaw n'est pas "OpenClaw en moins bien". C'est OpenClaw **repensé pour les gens qui produisent des documents** — et qui n'ont pas envie de configurer un Docker Compose pour rédiger un rapport.

## Ce que WebClaw change au quotidien

### Vous êtes consultant ou freelance

Lundi matin. Un client vous envoie un appel d'offres de 80 pages. Avant, vous passiez la journée à le lire, surligner, copier-coller dans un tableau Excel. Avec WebClaw :

1. Glissez le PDF dans votre vault
2. *"Lis cet AO et extrais toutes les exigences sous forme de matrice de conformité"*
3. *"Rédige un plan de réponse structuré avec les sections du mémoire technique"*
4. *"Rédige la section Architecture en t'appuyant sur notre stack Next.js + microservices"*

En 2 heures, vous avez une synthèse, une matrice, un plan et un premier jet. Le reste de la journée, vous affinez. Votre concurrent est encore en train de lire la page 40.

### Vous êtes développeur ou tech lead

Votre équipe grandit. Les décisions d'architecture sont prises en réunion mais jamais documentées. Les nouveaux arrivants posent les mêmes questions. Avec WebClaw :

- *"Documente l'architecture de notre service d'auth avec les flux OAuth et les diagrammes de séquence"*
- *"Crée un guide de développement pour notre stack avec les conventions, le testing et le déploiement"*
- *"Transforme mes notes du post-mortem d'hier en rapport structuré avec timeline et actions correctives"*

Chaque document est un fichier Markdown dans votre GitHub. Versionné. Cherchable. Partageable.

### Vous êtes chercheur ou étudiant

Des dizaines de notes de lecture, d'articles annotés, de brouillons de chapitres. Avec WebClaw :

- *"Organise mes notes de lecture par thème et crée un index avec liens croisés"*
- *"Transforme mes notes brutes sur la méthodologie en section rédigée pour mon mémoire"*
- *"Crée une fiche de synthèse comparative de ces 3 articles que j'ai importés"*

### Vous gérez une équipe

Les comptes-rendus de réunion, les processus, les guides d'onboarding — tout est dans des emails et des Google Docs éparpillés. Avec WebClaw :

- *"Formate mes notes de standup en compte-rendu avec décisions et actions"*
- *"Crée un guide d'onboarding pour les nouveaux développeurs de l'équipe"*
- *"Fais un résumé hebdomadaire de tout ce qui a été documenté cette semaine dans le vault"*

## Comment ça marche

```
1. Allez sur WebClaw depuis votre navigateur
2. Connectez-vous avec GitHub (un clic)
3. Créez ou connectez un vault (= un repo GitHub pour vos documents)
4. Branchez votre IA dans les paramètres (Claude, OpenAI, Ollama...)
5. Installez des skills depuis le hub
6. Travaillez.
```

Pas de terminal. Pas de Docker. Pas de `npm install`. Pas d'abonnement. Un navigateur et un compte GitHub, c'est tout.

### Les skills : des super-pouvoirs pour votre IA

Les skills sont ce qui rend WebClaw unique. Ce sont des **instructions spécialisées** que la communauté crée et partage pour rendre l'assistant IA meilleur dans des tâches précises.

**Exemple : le skill `doc-writer`** transforme l'IA en rédacteur de niveau consultant. Sans lui, demandez à l'IA d'écrire un guide et vous obtenez un article de blog générique. Avec lui, vous obtenez un vrai livrable professionnel : frontmatter structuré, table des matières, diagrammes Mermaid, voix naturelle, ratio prose/code maîtrisé.

Il existe 3 types de skills :

| Type | En une phrase | Exemple |
|------|--------------|---------|
| **Tool** | Change la manière dont l'IA écrit et réfléchit | `doc-writer` — rédaction de grade consultant |
| **Template** | Génère un document complet en un clic | Proposition commerciale, rapport d'audit, CR de réunion |
| **Agent** | Workflow automatisé en plusieurs étapes | Scan du vault → rapport des problèmes → corrections |

Les skills sont **pure data** (JSON + Markdown). Pas de code, pas de plugins, pas de npm install. L'IA ne peut agir que sur vos fichiers, et chaque modification vous demande votre accord.

**Installer un skill :**
Settings > Skills > Install > Activer. 10 secondes.

### Skills disponibles

| Skill | Type | Description |
|-------|------|-------------|
| [doc-writer](./doc-writer/) | Tool | Rédaction de grade consultant — profondeur pédagogique, diagrammes Mermaid, scénarios d'attaque, voix naturelle. Méthodologie DocLifecycle + Consultant Voice + QualityGate. |

*D'autres arrivent. Vous pouvez aussi [créer le vôtre](./documentation/06-creer-un-skill.md).*

## Sécurité : pas un argument marketing, une architecture

WebClaw est conçu pour les gens qui manipulent des documents sensibles — réponses à AO, données clients, architecture technique. La sécurité n'est pas une option qu'on coche, c'est la fondation.

**Vos secrets ne quittent jamais votre navigateur.** Token GitHub, clés API : tout est chiffré AES-256-GCM via l'API WebCrypto native de votre navigateur et stocké dans IndexedDB. Aucun serveur ne les voit en clair. Le serveur ne fait qu'une seule chose : l'échange OAuth. Zéro donnée de vault ne le traverse.

**L'IA ne peut pas faire n'importe quoi.** Elle a accès à 8 outils. Pas de shell, pas de réseau, pas d'accès système. Et chaque fois qu'elle veut créer, modifier ou supprimer un fichier : elle vous demande. Pas de raccourci.

**Les skills ne peuvent pas être malveillants.** Ils sont de la pure data — du JSON et du Markdown. Pas de `eval()`, pas de `import()`, pas de code exécutable. Ils viennent d'une source unique de confiance (ce repo). Ils sont validés avant d'atteindre votre navigateur.

<details>
<summary><strong>Détails techniques de sécurité</strong></summary>

### Architecture

```
Navigateur (100% côté client)
├── GitHub OAuth
├── Token chiffré AES-256-GCM → IndexedDB
├── Clés API chiffrées AES-256-GCM → IndexedDB
├── Octokit.js — appels GitHub API directs
├── CodeMirror 6 — éditeur
├── DOMPurify — protection XSS
└── marked.js — rendu Markdown

Serveur (minimal)
├── Pages statiques (Next.js)
└── /api/auth/* — échange OAuth uniquement
```

### Couches de protection

| Couche | Protection |
|--------|-----------|
| Tokens & clés API | AES-256-GCM via WebCrypto + IndexedDB |
| XSS (HTML) | DOMPurify avec allowlist stricte |
| XSS (Liens) | `target="_blank"` + `rel="noopener noreferrer"` |
| CSP | `script-src 'self'`, `connect-src` whitelist GitHub, `frame-src 'none'` |
| Headers | HSTS, X-Frame-Options DENY, nosniff, Permissions-Policy |
| OAuth | Protection CSRF via state |
| Transit | Zéro donnée du vault côté serveur |

### Limites des skills

| Contrainte | Limite |
|------------|--------|
| Exécution de code | **Aucune** |
| Accès réseau | **Aucun** |
| Outils autorisés | 8 outils sandboxés uniquement |
| Manifest | 10 KB max |
| Prompt | 8 000 caractères max |
| Steps par workflow | 10 max |
| Appels d'outils par step | 5 max |
| Total par workflow | 50 max |

</details>

## Apportez votre propre IA

WebClaw ne vous impose pas un modèle. Vous choisissez, vous payez (ou pas), vous changez quand vous voulez.

| Fournisseur | Ce qu'il faut | Prix |
|-------------|--------------|------|
| **Claude** (Anthropic) | Clé API | Pay-per-use |
| **OpenAI** (GPT-4o) | Clé API | Pay-per-use |
| **OpenRouter** | Clé API (accès à 200+ modèles) | Pay-per-use |
| **Ollama** | Installé sur votre machine | **Gratuit, 100% local** |
| **Custom** | N'importe quelle API compatible OpenAI | Variable |

Avec **Ollama**, aucune donnée ne quitte votre machine. Zéro coût, zéro tracking, zéro dépendance cloud.

Configuration : Settings > General > choisir le fournisseur > entrer la clé > Save. 30 secondes.

Guide complet : [Connecter son IA](./documentation/03-connecter-son-ia.md)

## Documentation

Tout est documenté, pas à pas, pour utiliser l'application :

| Guide | Description |
|-------|-------------|
| [Premiers pas](./documentation/01-demarrage-rapide.md) | Créer son compte, configurer son vault, premiers documents |
| [Connexion & authentification](./documentation/02-connexion-authentification.md) | Comprendre le flux de connexion et la sécurité |
| [Connecter son IA](./documentation/03-connecter-son-ia.md) | Configurer Claude, OpenAI, OpenRouter, Ollama ou un endpoint custom |
| [Installer un skill](./documentation/04-installer-utiliser-skill.md) | Parcourir le hub, installer, activer et utiliser les skills |
| [Exemples concrets](./documentation/05-exemples-concrets.md) | Pas-à-pas détaillés : AO, guides techniques, rapports, bases de connaissances |
| [Créer un skill](./documentation/06-creer-un-skill.md) | Contribuez vos propres skills à la communauté |

## Ce dépôt

Ce repo est le **coeur public de WebClaw**. Il a deux rôles :

1. **Documentation** — Tout ce qu'il faut pour prendre en main l'application, comprendre ses fonctionnalités, et l'utiliser efficacement
2. **Hub de skills** — Le registre central des skills communautaires que l'application charge automatiquement

```
WebClaw/
├── README.md                  vous êtes ici
├── assets/
│   └── logo.png
├── registry.json              registre des skills
├── documentation/             guides utilisateur
│   ├── 01-demarrage-rapide.md
│   ├── 02-connexion-authentification.md
│   ├── 03-connecter-son-ia.md
│   ├── 04-installer-utiliser-skill.md
│   ├── 05-exemples-concrets.md
│   └── 06-creer-un-skill.md
├── doc-writer/                skill "Doc Writer"
│   ├── skill.json
│   └── prompt.md
└── ...                        futurs skills
```

## La roadmap — et vos idées

### Skills qui arrivent

| Skill | Ce qu'il fera |
|-------|--------------|
| **Meeting Notes** | Notes de réunion → CR structuré avec décisions et actions en un prompt |
| **AO Response Writer** | Digestion d'AO + matrice de conformité + plan de réponse |
| **Vault Cleanup Agent** | Scan automatique des fichiers vides, frontmatter manquant, liens cassés |
| **Translation Agent** | Traduction de documents en préservant le formatage |
| **Zettelkasten Builder** | Note-taking atomique avec `[[wiki-links]]` et index |
| **Weekly Review Agent** | Résumé hebdomadaire de votre activité dans le vault |
| **API Doc Generator** | Documentation REST API structurée à partir d'entrées libres |
| **Audit Report** | Rapport d'audit avec matrice de risques et recommandations |
| **Onboarding Guide** | Guide d'accueil pour nouveaux membres d'équipe |
| **Changelog Writer** | Maintenance automatique d'un CHANGELOG.md propre |

### Améliorations de l'application

- **Variables dans les prompts** — `{{projet}}`, `{{stack}}`, `{{client}}` pour personnaliser les skills
- **Skills composables** — Combiner plusieurs skills dans un même workflow
- **Versioning de skills** — Notification de mise à jour disponible
- **Historique des conversations IA** — Retrouver et reprendre des sessions passées
- **Mode collaboratif** — Édition à plusieurs via GitHub branches + merge assisté par IA
- **Support Obsidian** — Compatibilité bidirectionnelle avec les vaults Obsidian existants
- **Import/export de skills** — Partager vos skills personnalisés sans passer par le hub
- **Marketplace communautaire** — Interface web pour parcourir, noter et découvrir des skills

**Vous avez une idée ?** [Ouvrez une issue](https://github.com/YourNakama/WebClaw/issues). On construit WebClaw avec sa communauté.

## Contribuer

Deux façons de participer :

**Créer un skill** — Forkez ce repo, créez votre dossier avec `skill.json` + `prompt.md`, ajoutez-le dans `registry.json`, ouvrez une PR. [Guide complet ici](./documentation/06-creer-un-skill.md).

**Proposer une idée** — Pas envie d'écrire le manifest ? [Ouvrez une issue](https://github.com/YourNakama/WebClaw/issues) et décrivez le skill ou la fonctionnalité que vous aimeriez voir.

Les contributions sont revues sur : utilité, qualité du prompt, sécurité, et clarté du nommage.

## Soutenir le projet

WebClaw est un **donationware**. Le modèle est simple : tout est gratuit, tout est accessible, et ceux qui en bénéficient peuvent choisir de soutenir le projet.

Pas de version Pro à débloquer. Pas de compteur de documents. Pas de "votre essai expire dans 7 jours". Jamais.

On croit qu'un consultant freelance, un étudiant en thèse, une asso avec trois bénévoles — tout le monde mérite des outils pros pour travailler avec l'IA. Pas seulement ceux qui peuvent se payer un abonnement.

Si WebClaw vous fait gagner du temps, vous pouvez aider le projet à vivre et grandir :

<p align="center">
  <a href="https://ko-fi.com/nakamacyber">
    <img src="https://img.shields.io/badge/Ko--fi-Soutenir%20WebClaw-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white" alt="Soutenir sur Ko-fi">
  </a>
</p>

Ko-fi prend **0% de commission** — 100% va au développeur.

**Vos dons financent :**
- Le développement de l'application et des nouveaux skills
- L'hébergement et l'infrastructure
- La documentation et le support communautaire
- Le temps passé à répondre aux issues et aux PRs

**Aucune fonctionnalité ne sera jamais verrouillée derrière un don. C'est une promesse.**

## Stack technique

| Couche | Technologie |
|--------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 + shadcn/ui |
| Auth | GitHub OAuth + CSRF |
| Éditeur | CodeMirror 6 |
| Preview | marked.js + DOMPurify |
| Diagrammes | Mermaid |
| Fichiers | GitHub Contents API via Octokit |
| Chiffrement | WebCrypto AES-256-GCM + IndexedDB |
| Animations | Framer Motion |
| IA | Claude, OpenAI, OpenRouter, Ollama, Custom |

## Licence

L'application WebClaw est gratuite (propriétaire — free to use). Les **skills** de ce dépôt sont partagés sous licence MIT pour un usage communautaire libre.

---

<p align="center">
  Fait avec soin par <a href="https://github.com/YourNakama"><strong>NakamaCyber</strong></a><br/>
  <a href="./documentation/">Documentation</a> · <a href="https://ko-fi.com/nakamacyber">Soutenir</a> · <a href="https://github.com/YourNakama/WebClaw/issues">Signaler un bug</a>
</p>
