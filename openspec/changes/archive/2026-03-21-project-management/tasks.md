## 1. Base de données

- [x] 1.1 Créer la migration Supabase : table `projects` (id, user_id, name, color, created_at) avec RLS
- [x] 1.2 Ajouter la colonne `project_id` (FK NOT NULL) à la table `tasks` avec projet par défaut "Sans projet"
- [x] 1.3 Ajouter la colonne `project_id` (FK NOT NULL) à la table `active_timers`
- [x] 1.4 Modifier la RPC `complete_timer` pour propager `project_id` de `active_timers` vers `tasks`

## 2. Types et utilitaires

- [x] 2.1 Ajouter l'interface `Project` dans `src/types/index.ts`
- [x] 2.2 Mettre à jour les interfaces `Task` et `ActiveTimer` avec `project_id`
- [x] 2.3 Définir la constante de palette de couleurs (10 couleurs avec mapping Tailwind)

## 3. Hook useProjects

- [x] 3.1 Créer `src/hooks/useProjects.ts` : fetch, create, update, delete projets
- [x] 3.2 Ajouter la gestion d'erreurs (suppression refusée si tâches associées, validation nom)

## 4. Modification du timer

- [x] 4.1 Créer le composant `ProjectSelector` (dropdown avec couleurs)
- [x] 4.2 Modifier `useTimer` pour accepter et persister `project_id` au démarrage
- [x] 4.3 Modifier `TimerControls` pour intégrer le sélecteur de projet (obligatoire)
- [x] 4.4 Modifier `TimerDisplay` pour afficher le projet actif (nom + badge couleur)

## 5. Page Projets

- [x] 5.1 Créer la page `ProjectsPage` avec liste des projets
- [x] 5.2 Créer le formulaire de création/édition de projet (nom + sélecteur couleur)
- [x] 5.3 Ajouter la suppression de projet avec message d'erreur si tâches associées
- [x] 5.4 Ajouter la route `/projects` dans `App.tsx`

## 6. Filtrage historique

- [x] 6.1 Créer le composant `ProjectFilter` pour la vue historique
- [x] 6.2 Afficher le badge projet (nom + couleur) sur chaque tâche dans l'historique

## 7. Tests

- [x] 7.1 Tests unitaires pour `useProjects`
- [x] 7.2 Tests pour le `ProjectSelector` et l'intégration dans `TimerControls`
- [x] 7.3 Tests pour le filtrage par projet dans l'historique
