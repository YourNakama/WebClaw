# Premiers pas avec WebClaw

Commencez à utiliser WebClaw en 2 minutes. Rien à installer.

## Ce qu'il vous faut

- Un **navigateur web** (Chrome, Firefox, Safari, Edge — n'importe lequel)
- Un **compte GitHub** (gratuit sur [github.com](https://github.com))

C'est tout. Pas de terminal, pas de logiciel à télécharger, pas de configuration technique.

## Étape 1 — Accéder à WebClaw

Ouvrez WebClaw dans votre navigateur en vous rendant sur l'URL de l'application.

Vous arrivez sur la page d'accueil qui présente les fonctionnalités.

## Étape 2 — Se connecter avec GitHub

Cliquez sur **Connect with GitHub**. Vous serez redirigé vers GitHub pour autoriser l'application.

- WebClaw a besoin d'accéder à vos dépôts pour y stocker vos documents
- Votre token d'accès est chiffré et stocké uniquement dans votre navigateur
- Aucune donnée ne transite par nos serveurs

Cliquez **Authorize** sur la page GitHub. Vous êtes redirigé vers WebClaw, connecté.

Pour en savoir plus sur la sécurité de la connexion : [Connexion & authentification](./02-connexion-authentification.md)

## Étape 3 — Configurer votre vault

Un vault = un dépôt GitHub où vivent vos documents. Après connexion, WebClaw vous propose de :

- **Sélectionner un dépôt existant** si vous en avez déjà un avec des fichiers Markdown
- **Créer un nouveau dépôt** dédié à votre vault

Choisissez une option, sélectionnez la branche (par défaut `main`), et validez. Votre vault est prêt.

## Étape 4 — Découvrir l'interface

Votre vault s'ouvre avec :

- **L'arborescence de fichiers** à gauche — naviguez, créez des dossiers et des fichiers
- **L'éditeur Markdown** au centre — écrivez avec coloration syntaxique, autocomplétion
- **La prévisualisation** à droite — voyez le rendu de votre Markdown en temps réel (diagrammes Mermaid, tableaux, code)
- **La barre d'outils** en haut — recherche globale, paramètres, impression, thème clair/sombre

Chaque sauvegarde crée automatiquement un commit dans votre dépôt GitHub. Votre historique complet est préservé.

## Étape 5 (optionnel) — Connecter une IA

Pour utiliser l'assistant IA et les skills, configurez un fournisseur IA :

1. Cliquez sur l'**icône engrenage** (Settings)
2. Dans l'onglet **General**, choisissez un fournisseur (Claude, OpenAI, OpenRouter, Ollama, Custom)
3. Entrez votre clé API
4. Cliquez **Save**

Votre clé est chiffrée et stockée uniquement dans votre navigateur. Guide détaillé : [Connecter son IA](./03-connecter-son-ia.md)

## Étape 6 (optionnel) — Installer des skills

Les skills rendent l'assistant IA plus performant sur des tâches spécifiques :

1. Allez dans Settings > onglet **Skills**
2. Parcourez les skills disponibles
3. Cliquez **Install** puis activez le switch

Guide détaillé : [Installer et utiliser un skill](./04-installer-utiliser-skill.md)

## Résumé

| Étape | Temps |
|-------|-------|
| Accéder à WebClaw | 0 seconde — c'est un site web |
| Se connecter avec GitHub | 30 secondes |
| Configurer le vault | 30 secondes |
| Connecter une IA | 30 secondes |
| Installer un skill | 10 secondes |

**Temps total pour être opérationnel : ~2 minutes.**

## FAQ rapide

**Q : Est-ce que WebClaw est gratuit ?**
R : Oui. WebClaw est un donationware — toutes les fonctionnalités sont accessibles gratuitement. Si l'outil vous aide, vous pouvez choisir de soutenir le projet via [Ko-fi](https://ko-fi.com/nakamacyber).

**Q : Est-ce que mes données passent par vos serveurs ?**
R : Non. Vos documents sont stockés dans votre propre dépôt GitHub. La communication se fait directement entre votre navigateur et l'API GitHub. Notre serveur ne gère que l'authentification OAuth.

**Q : Est-ce que je peux utiliser WebClaw sans IA ?**
R : Absolument. WebClaw est un excellent éditeur Markdown avec GitHub sync, preview, impression et organisation de fichiers — même sans IA.

**Q : Est-ce que je perds mes données si WebClaw disparaît ?**
R : Non. Vos fichiers sont dans votre dépôt GitHub. Vous pouvez les lire, modifier et gérer avec n'importe quel outil Markdown, pour toujours.

---

**Prochaine étape** : [Connexion & authentification](./02-connexion-authentification.md)
