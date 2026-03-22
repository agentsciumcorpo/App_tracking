## Why

La page historique actuelle est basique : elle affiche les tâches avec filtrage par projet et pagination, mais n'affiche ni la date, ni ne permet de filtrer par période. Il manque aussi les actions d'édition (durée, note) et de suppression. Pour exploiter pleinement les données de productivité, l'utilisateur a besoin d'une vue historique complète et actionnable.

## What Changes

- Affichage de la date (jour + heure) sur chaque entrée de tâche
- Filtre par période : jour, semaine, tout
- Actions sur chaque tâche : modifier la durée, modifier la note, supprimer avec confirmation
- Amélioration de la mise en page des entrées pour afficher toutes les informations

## Capabilities

### New Capabilities
- `task-history-filters`: Filtres temporels (aujourd'hui, cette semaine, tout) combinables avec le filtre projet existant
- `task-actions`: Actions CRUD sur les tâches depuis l'historique (modifier durée, modifier note, supprimer)

### Modified Capabilities
- `project-filtering`: Ajout de la combinaison avec les filtres temporels

## Impact

- **Frontend** : Modification de `HistoryPage`, `TaskList`, nouveau composant `DateFilter`, nouveau composant `TaskActions` (édition inline + suppression)
- **Hook** : Modification de `useTasks` pour supporter la suppression et la mise à jour de durée
- **Base de données** : Aucun changement de schéma (delete et update via RLS existant)
