# Installer et utiliser un Skill

Les skills étendent les capacités de l'assistant IA de WebClaw. Ce guide couvre l'installation, l'activation et l'utilisation des trois types de skills.

## Prérequis

- Un compte WebClaw connecté (voir [Premiers pas](./01-demarrage-rapide.md))
- Un fournisseur IA configuré (voir [Connecter son IA](./03-connecter-son-ia.md))

Le hub de skills est déjà intégré dans WebClaw — rien de plus à configurer.

## Parcourir les skills disponibles

1. Ouvrez votre vault dans le navigateur
2. Cliquez sur l'**icône engrenage** (Settings)
3. Allez dans l'onglet **Skills**
4. Le registre se charge automatiquement depuis le Skill Hub

Vous verrez la liste de tous les skills disponibles avec leur nom, description, type (Tool / Template / Agent), et auteur.

## Installer un skill

1. Trouvez le skill qui vous intéresse
2. Cliquez **Install**
3. Le skill est téléchargé et stocké dans votre navigateur (IndexedDB, chiffré)

Le skill persiste entre les recharges de page. Vous n'avez pas besoin de le réinstaller à chaque session.

## Activer / Désactiver un skill

Après installation, un switch **enable/disable** apparaît à côté du skill. Activez-le pour que le skill soit pris en compte par l'assistant IA.

Vous pouvez activer **plusieurs skills simultanément**. Leurs prompts sont injectés dans l'ordre dans le système.

## Utiliser un skill de type Tool

Les skills Tool modifient le comportement de l'assistant IA en injectant des instructions dans son prompt système.

### Exemple : doc-writer

Le skill **doc-writer** transforme l'assistant en rédacteur de documentation de grade consultant.

**Sans doc-writer activé** :
> "Écris un guide sur l'authentification OAuth"
> → L'IA produit une réponse générique, style StackOverflow

**Avec doc-writer activé** :
> "Écris un guide sur l'authentification OAuth"
> → L'IA produit un document structuré avec :
> - Frontmatter YAML (type, title, status, date, tags)
> - Paragraphe de synthèse en ouverture
> - Table des matières avec ancres
> - Introduction contextuelle à chaque section
> - Ratio 60% prose / 40% code
> - Diagrammes Mermaid (flux OAuth, architecture)
> - Scénarios d'attaque concrets pour les aspects sécurité
> - Voix naturelle de consultant (pas de jargon IA)

### Activation

1. Installez et activez le skill dans Settings > Skills
2. Ouvrez le panneau IA (`Ctrl+K`)
3. Discutez normalement — l'IA applique automatiquement les instructions du skill

## Utiliser un skill de type Template

Les skills Template génèrent des documents à partir d'un prompt structuré. Ils sont conçus pour du one-click : vous décrivez ce que vous voulez, l'IA produit un document complet.

### Utilisation typique

1. Activez le skill Template souhaité
2. Ouvrez le panneau IA
3. Décrivez votre besoin : *"Crée un compte-rendu de réunion pour le standup de ce matin avec Alice, Bob et Charlie"*
4. L'IA génère un document structuré selon le template du skill
5. Confirmez la création du fichier

## Utiliser un skill de type Agent

Les skills Agent sont les plus puissants. Ils exécutent des workflows multi-étapes avec des checkpoints et votre approbation à chaque phase.

### Comment lancer un workflow Agent

1. Installez et activez le skill Agent
2. Ouvrez le panneau IA
3. Cliquez sur l'**icône Bot** (robot) dans l'en-tête du panneau
4. Sélectionnez le workflow dans le dropdown
5. Le workflow démarre et progresse étape par étape

### Fonctionnement des étapes

Chaque étape d'un workflow Agent a un comportement défini :

- **Étapes avec auto-approval** (`requiresApproval: false`) : s'exécutent immédiatement. Typiquement utilisées pour la lecture et l'analyse (scan de fichiers, recherche de contenu).

- **Étapes avec approbation manuelle** (`requiresApproval: true`) : se mettent en pause et affichent les boutons **Continue** / **Stop**. Vous pouvez examiner les résultats avant de décider de continuer.

- **Mutations de fichiers** : même dans une étape auto-approved, chaque `create_file`, `edit_file`, ou `delete_file` vous demande une confirmation individuelle.

### Exemple de workflow : Vault Cleanup

```
Étape 1 — Scan (auto) : L'agent lit tous les fichiers .md du vault
Étape 2 — Analyse (auto) : Identifie les fichiers vides, frontmatter manquant, liens cassés
Étape 3 — Rapport (pause) : Affiche un résumé des problèmes trouvés
    → Vous : [Continue] ou [Stop]
Étape 4 — Corrections (pause) : Propose des corrections fichier par fichier
    → Chaque edit_file demande votre confirmation
```

## Désinstaller un skill

1. Allez dans Settings > Skills
2. Cliquez **Uninstall** à côté du skill
3. Le skill est supprimé de votre navigateur

La désinstallation n'affecte pas vos fichiers. Seul le prompt du skill est supprimé.

## FAQ

**Q : Les skills peuvent-ils accéder à Internet ?**
R : Non. Les skills ne peuvent pas faire de requêtes réseau. Ils n'ont accès qu'aux 8 outils sandboxés du vault.

**Q : Un skill peut-il modifier mes fichiers sans me le demander ?**
R : Non. Toute mutation (create, edit, delete) nécessite votre confirmation explicite, même dans les workflows Agent.

**Q : Puis-je activer plusieurs skills Tool en même temps ?**
R : Oui. Leurs prompts sont combinés dans le système. Attention toutefois à ne pas activer des skills avec des instructions contradictoires.

**Q : Combien de skills puis-je installer ?**
R : Pas de limite. Installez autant que vous voulez, activez/désactivez selon vos besoins du moment.

---

**Prochaine étape** : [Exemples concrets](./05-exemples-concrets.md)
