## Why

Les tâches chronométrées n'ont actuellement aucune organisation. Sans projets, l'utilisateur ne peut ni regrouper, ni filtrer, ni analyser sa productivité par contexte de travail. Associer chaque tâche à un projet est essentiel pour rendre le suivi de productivité réellement exploitable.

## What Changes

- Ajout d'un système CRUD de projets (nom, couleur) par utilisateur
- Chaque projet se voit assigner une couleur parmi une palette prédéfinie (8-10 couleurs)
- Le sélecteur de projet devient obligatoire avant/pendant le démarrage d'une tâche
- L'historique des tâches est filtrable par projet
- Les tâches existantes sans projet seront associées à un projet "Sans projet" par défaut

## Capabilities

### New Capabilities
- `project-crud`: Gestion complète des projets utilisateur (création, lecture, modification, suppression) avec nom et couleur assignée
- `task-project-association`: Association obligatoire d'un projet à chaque tâche, avec sélecteur intégré au flux du timer
- `project-filtering`: Filtrage des tâches par projet dans la vue historique

### Modified Capabilities
- `task-timer`: Le démarrage d'une tâche requiert désormais la sélection d'un projet

## Impact

- **Base de données** : Nouvelle table `projects`, ajout colonne `project_id` sur `tasks`, nouvelles politiques RLS
- **Frontend** : Nouveaux composants (gestion projets, sélecteur projet, filtres), modification du composant timer
- **Types** : Nouveaux types TypeScript pour Project, mise à jour du type Task
