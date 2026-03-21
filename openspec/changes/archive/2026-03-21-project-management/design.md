## Context

L'application ne comporte actuellement que le timer. Les tâches complétées sont stockées dans la table `tasks` sans aucun mécanisme de regroupement. Pour que l'historique et l'analyse IA soient utiles, chaque tâche doit être associée à un projet.

Tables existantes : `active_timers` (timer en cours) et `tasks` (tâches complétées). Le hook `useTimer` gère le cycle de vie du timer et appelle la RPC `complete_timer` pour finaliser une tâche.

## Goals / Non-Goals

**Goals:**
- Permettre à l'utilisateur de créer et gérer ses projets (nom + couleur)
- Rendre l'association tâche-projet obligatoire au démarrage du timer
- Filtrer l'historique par projet
- Persister le projet sélectionné dans `active_timers` pour survivre aux refresh

**Non-Goals:**
- Sous-projets ou hiérarchie de projets
- Partage de projets entre utilisateurs
- Statistiques agrégées par projet (sera dans un changement futur "analyse")
- Archivage de projets

## Decisions

### 1. Table `projects` séparée avec FK sur `tasks`

La table `projects` contient `id`, `user_id`, `name`, `color`, `created_at`. La table `tasks` reçoit une colonne `project_id` (UUID, NOT NULL, FK → projects). La table `active_timers` reçoit aussi `project_id` pour persister le projet du timer actif.

**Rationale** : Normalisation standard. Permet de renommer un projet sans toucher aux tâches. La FK garantit l'intégrité référentielle.

**Alternative considérée** : Stocker le nom du projet directement sur la tâche (dénormalisé). Rejeté car les renommages créeraient des incohérences.

### 2. Palette de couleurs prédéfinie (10 couleurs)

Les couleurs sont stockées comme identifiants (ex: `"blue"`, `"red"`) et non comme hex codes. Le mapping vers les classes Tailwind est côté frontend.

**Rationale** : Simplifie la validation, garantit un rendu cohérent en dark mode, évite les couleurs illisibles choisies par l'utilisateur.

**Palette** : blue, purple, pink, red, orange, yellow, green, teal, indigo, gray.

### 3. Modification de la RPC `complete_timer`

La RPC `complete_timer` existante sera modifiée pour propager `project_id` depuis `active_timers` vers `tasks` lors de la complétion.

**Rationale** : Le project_id est déjà persisté dans `active_timers` au démarrage. La RPC doit simplement le copier dans la tâche finale.

### 4. Hook `useProjects` séparé

Un nouveau hook `useProjects` gère le CRUD des projets. Le hook `useTimer` est modifié pour accepter un `projectId` au démarrage.

**Rationale** : Séparation des responsabilités. `useProjects` est réutilisable dans la page Projets et dans le sélecteur.

### 5. Pas de migration des tâches existantes

Les tâches existantes sans projet ne seront pas migrées. La colonne `project_id` sur `tasks` est NOT NULL mais avec une valeur par défaut pointant vers un projet "Sans projet" créé automatiquement par la migration.

**Alternative considérée** : Colonne nullable. Rejeté car cela complexifie toutes les requêtes et le filtrage.

## Risks / Trade-offs

- **[Suppression de projet avec tâches]** → La FK empêche la suppression. On utilise `ON DELETE RESTRICT`. L'UI affiche un message d'erreur clair invitant à réassigner les tâches d'abord.
- **[Projet "Sans projet" supprimable]** → Ce projet par défaut n'est pas supprimable (contrainte applicative côté frontend, pas en BDD).
- **[Performance du sélecteur]** → Nombre de projets par utilisateur typiquement < 20. Une simple query suffit, pas besoin de pagination.
