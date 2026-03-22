## Context

La page historique affiche déjà les tâches triées par date décroissante, avec filtrage par projet, pagination (50/page), et édition inline du rating via `StarRating`. Le hook `useTasks` expose `tasks`, `updateRating`, `loadMore`, `refresh`. Les tâches ont : `task_name`, `project_id`, `duration_minutes`, `rating`, `started_at`, `ended_at`.

## Goals / Non-Goals

**Goals:**
- Afficher la date et l'heure sur chaque tâche
- Filtrer par période (aujourd'hui, cette semaine, tout) en combinaison avec le filtre projet
- Permettre la modification de la durée d'une tâche
- Permettre la suppression d'une tâche avec confirmation
- Garder l'édition de note existante

**Non-Goals:**
- Recherche textuelle sur les noms de tâches
- Export des tâches (CSV, etc.)
- Groupement visuel par jour (sera un changement futur)

## Decisions

### 1. Filtres temporels côté client

Les filtres "Aujourd'hui" et "Cette semaine" filtrent côté client sur les tâches déjà chargées. Le filtre par défaut est "Tout".

**Rationale** : Avec la pagination à 50, le volume est gérable côté client. Évite de complexifier les requêtes Supabase. Si le volume augmente, on pourra migrer vers un filtre serveur plus tard.

**Alternative considérée** : Filtre côté serveur avec paramètres de date. Rejeté pour la simplicité — le nombre de tâches affichées est déjà limité par la pagination.

### 2. Édition de durée inline

Un clic sur la durée affichée ouvre un input numérique inline (minutes). La validation accepte 0-9999 minutes. Le `useTasks` expose une nouvelle fonction `updateDuration`.

**Rationale** : Cohérent avec le pattern d'édition inline du rating. Pas besoin d'une modale pour une simple valeur numérique.

### 3. Suppression via `useTasks.deleteTask`

La suppression fait un `DELETE FROM tasks WHERE id = X` (protégé par RLS). Mise à jour optimiste de la liste locale avec rollback on error. Confirmation `window.confirm` avant suppression.

**Rationale** : Pattern identique à `deleteProject` dans `useProjects`. La RLS garantit que l'utilisateur ne peut supprimer que ses propres tâches.

### 4. Composant `TaskRow` extrait

Chaque tâche est rendue par un composant `TaskRow` mémorisé, recevant la tâche, le projet, et les callbacks d'action. Cela évite les re-renders de toute la liste quand une seule tâche est en cours d'édition.

**Rationale** : Correction du finding de performance identifié dans la code review (inline closures dans le map).

## Risks / Trade-offs

- **[Filtre client vs serveur]** → Si l'utilisateur a des centaines de tâches, le filtre "Aujourd'hui" peut afficher peu de résultats sur les 50 chargés. Mitigation : le bouton "Charger plus" reste disponible.
- **[Suppression irréversible]** → Pas de soft delete. `window.confirm` est la seule protection. Acceptable pour une app personnelle.
