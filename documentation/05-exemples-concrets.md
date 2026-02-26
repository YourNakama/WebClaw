# Exemples concrets

Des cas d'usage réels et détaillés pour exploiter WebClaw et ses skills dans un contexte professionnel.

---

## 1. Créer un guide de développement pour une stack client

**Contexte** : Vous êtes consultant et devez rédiger un guide de développement pour une équipe client qui démarre un projet React 19 + Next.js 16 + Tailwind CSS 4.

**Skill utilisé** : `doc-writer`

### Étapes

1. Activez le skill **doc-writer** dans Settings > Skills
2. Ouvrez le panneau IA (`Ctrl+K`)
3. Envoyez le prompt suivant :

```
Crée un guide de développement complet pour une stack React 19 + Next.js 16 + Tailwind CSS 4.

Le guide doit couvrir :
- Architecture du projet (App Router, structure des dossiers)
- Conventions de nommage et organisation du code
- Gestion du state (Server Components vs Client Components)
- Styling avec Tailwind CSS 4 (nouvelles fonctionnalités, tokens CSS)
- Testing (Vitest + Testing Library)
- Déploiement sur Vercel
- Bonnes pratiques de performance

Cible : développeurs juniors à mid-level. Le guide doit être autonome — quelqu'un
qui le lit doit pouvoir démarrer le projet sans aide externe.
```

### Résultat attendu

L'IA (avec doc-writer actif) produit un document de 25-40 pages avec :
- Frontmatter YAML complet (`type: guide`, `status: draft`, tags pertinents)
- Table des matières avec liens d'ancrage
- Diagramme Mermaid de l'architecture (App Router, flux de données)
- Chaque section introduite par un paragraphe contextuel
- Ratio 60% prose / 40% code — pas un listing de commandes
- Voix naturelle de consultant, pas de jargon IA
- Section "Next Steps" à la fin

4. Confirmez la création du fichier quand l'IA vous le propose
5. Relisez et ajustez avec des commandes comme :

```
Dans la section Testing, ajoute un exemple concret de test d'un Server Component
avec le pattern act() et les mocks de fetch.
```

---

## 2. Digestion d'un appel d'offres (AO)

**Contexte** : Vous avez reçu un AO de 80 pages en PDF pour un projet de refonte d'un portail web institutionnel. Vous devez produire une synthèse, une matrice de conformité, et un plan de réponse.

### Étapes

#### Phase 1 — Importer et analyser l'AO

1. Glissez-déposez le PDF de l'AO dans votre vault (ou utilisez l'import de fichier)
2. Ouvrez le panneau IA et envoyez :

```
Lis le fichier ao-portail-web-2026.pdf et produis une synthèse structurée de l'AO.

Structure la synthèse comme suit :
- Contexte et objet du marché
- Exigences fonctionnelles (liste numérotée)
- Exigences techniques (architecture, techno, performance)
- Exigences administratives (délais, budget, livrables)
- Critères de notation et pondération
- Points d'attention et risques identifiés
```

#### Phase 2 — Matrice de conformité

```
À partir de la synthèse, crée une matrice de conformité sous forme de tableau Markdown.

Colonnes :
- Ref (numéro de l'exigence)
- Exigence (résumé en une phrase)
- Catégorie (fonctionnelle / technique / administrative)
- Notre réponse (Conforme / Conforme avec réserve / Non conforme)
- Commentaire (notre positionnement en 1-2 phrases)

Laisse la colonne "Notre réponse" et "Commentaire" avec des placeholders [À COMPLÉTER]
pour les exigences que tu ne peux pas évaluer.
```

#### Phase 3 — Plan de réponse

```
Crée un plan de réponse au mémoire technique structuré en sections.

Pour chaque section :
- Titre de la section
- Exigences de l'AO couvertes (références)
- Points clés à développer
- Livrables à inclure (schémas, tableaux, captures)
- Volume estimé (nombre de pages)
```

#### Phase 4 — Rédaction

```
Rédige la section "Architecture technique proposée" du mémoire technique.

Contexte : nous proposons une architecture Next.js + API microservices sur Kubernetes.
Inclus un diagramme Mermaid de l'architecture, les choix techniques justifiés,
et une matrice des composants.
```

### Résultat

Vous obtenez 4 documents dans votre vault :
- `ao/synthese-ao-portail-2026.md` — Synthèse complète
- `ao/matrice-conformite.md` — Tableau de conformité
- `ao/plan-reponse.md` — Structure du mémoire technique
- `ao/sections/architecture-technique.md` — Première section rédigée

Tous versionnés dans GitHub, partageables avec votre équipe.

---

## 3. Documentation d'architecture

**Contexte** : Vous documentez l'architecture d'un système de microservices pour votre équipe.

### Prompt

```
Crée un document d'architecture pour notre système de microservices d'authentification.

Le système comprend :
- Un API Gateway (Kong)
- Un service Auth (Node.js, JWT + refresh tokens)
- Un service Users (Go, PostgreSQL)
- Un service Notifications (Python, Redis pub/sub)
- Un message broker (RabbitMQ)

Inclus :
- Diagramme d'architecture globale (flowchart Mermaid)
- Diagramme de séquence pour le flux d'authentification
- Diagramme de séquence pour le refresh token
- Matrice de communication entre services
- Considérations de sécurité (injection, MITM, token theft)
- Plan de disaster recovery
```

### Résultat attendu

Un document de type `architecture` avec 3+ diagrammes Mermaid, des scénarios d'attaque concrets pour chaque vulnérabilité, et une voix technique mais accessible.

---

## 4. Compte-rendu de réunion

**Contexte** : Vous sortez d'une réunion de 2 heures et avez pris des notes brutes.

### Étapes

1. Créez un fichier `meetings/2026-02-26-brut.md` avec vos notes brutes
2. Ouvrez le panneau IA et envoyez :

```
Lis le fichier meetings/2026-02-26-brut.md et transforme ces notes brutes en
un compte-rendu professionnel structuré.

Format :
- Frontmatter (type: meeting, date, participants)
- Contexte de la réunion (1 paragraphe)
- Points discutés (sections avec résumé de chaque sujet)
- Décisions prises (tableau : décision | responsable | deadline)
- Actions à suivre (checklist Markdown)
- Prochaine réunion (date, ordre du jour provisoire)
```

---

## 5. Base de connaissances d'équipe

**Contexte** : Votre équipe de 8 développeurs a accumulé des centaines de documents non organisés dans un vault partagé.

### Étapes

1. Demandez à l'IA de scanner votre vault :

```
Liste tous les fichiers du vault et analyse leur contenu. Propose une
réorganisation en catégories avec une structure de dossiers claire.
```

2. Validez la structure proposée, puis :

```
Crée un fichier INDEX.md à la racine du vault avec :
- Une table des matières par domaine
- Des liens vers chaque document
- Un résumé d'une ligne par document
- Les tags les plus fréquents
```

3. Pour enrichir la base :

```
Crée un glossaire technique pour notre équipe basé sur les termes techniques
trouvés dans les documents du vault. Format : tableau avec terme, définition,
et liens vers les documents qui l'utilisent.
```

---

## 6. Veille technologique structurée

**Contexte** : Vous maintenez une veille techno pour votre équipe.

### Prompt

```
Crée une fiche de veille sur les Server Components de React 19.

Structure :
- Résumé exécutif (3 phrases pour un décideur non-technique)
- Qu'est-ce que c'est (explication accessible)
- Comparaison avant/après (tableau avec code)
- Impact sur notre stack actuelle
- Migration : effort estimé et risques
- Recommandation (adopter / attendre / ignorer)
- Sources et liens de référence
```

---

## 7. Rapport d'audit de sécurité

**Contexte** : Vous avez réalisé un audit de sécurité et devez produire un rapport structuré.

### Prompt

```
Crée un rapport d'audit de sécurité pour notre application web.

Vulnérabilités identifiées :
1. XSS stored dans les commentaires (criticité haute)
2. IDOR sur les endpoints /api/users/:id (criticité haute)
3. Absence de rate limiting sur /api/auth/login (criticité moyenne)
4. Headers de sécurité manquants (criticité basse)
5. Dépendances npm avec CVE connues (criticité moyenne)

Pour chaque vulnérabilité, inclus :
- Description technique
- Scénario d'exploitation concret
- Code vulnérable (anonymisé) vs code corrigé
- Recommandation de remédiation
- Effort estimé (en jours)

Termine par une matrice de risques et un plan de remédiation priorisé.
```

---

## Conseils pour de meilleurs résultats

1. **Soyez spécifique** — Plus votre prompt est détaillé, meilleur est le résultat. Indiquez le contexte, la cible, le format souhaité.

2. **Itérez** — Ne cherchez pas la perfection en un seul prompt. Demandez un premier jet, puis affinez section par section.

3. **Utilisez le contexte du vault** — L'IA a accès à tous vos fichiers. Référencez-les : *"En t'inspirant du style de docs/guide-api.md..."*

4. **Combinez les skills** — Activez `doc-writer` pour la qualité rédactionnelle + un skill template spécifique pour la structure.

5. **Pensez workflow** — Pour des tâches complexes (AO, audit), découpez en phases : analyse → synthèse → plan → rédaction.

---

**Prochaine étape** : [Créer un skill](./06-creer-un-skill.md)
