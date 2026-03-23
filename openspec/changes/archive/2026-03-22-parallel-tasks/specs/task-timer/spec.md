## MODIFIED Requirements

### Requirement: Démarrage du chronomètre
L'utilisateur DOIT pouvoir démarrer un chronomètre en saisissant un nom de tâche, sélectionnant un projet, et cliquant sur Start. Le nom DOIT être non vide et de 200 caractères maximum. Un projet DOIT être sélectionné. Plusieurs timers peuvent être actifs simultanément par utilisateur.

#### Scenario: Démarrage réussi avec projet
- **WHEN** l'utilisateur a saisi un nom de tâche, sélectionné un projet, et clique sur Start
- **THEN** le chronomètre démarre et s'ajoute à la liste des timers actifs
- **THEN** le formulaire revient à l'état initial (champ vide) pour permettre de démarrer un autre timer
- **THEN** le timer actif avec `project_id` est persisté dans `active_timers`

#### Scenario: Démarrage sans projet sélectionné
- **WHEN** l'utilisateur saisit un nom de tâche mais ne sélectionne pas de projet
- **THEN** le système affiche une erreur de validation et le timer ne démarre pas

## REMOVED Requirements

### Requirement: Une seule tâche active à la fois
**Reason**: Remplacé par le support des timers parallèles — les utilisateurs multitaskent et ont besoin de tracker plusieurs activités simultanées.
**Migration**: La contrainte unique sur `user_id` dans `active_timers` est supprimée. La logique applicative et la RPC `complete_timer` utilisent désormais l'`id` du timer au lieu de l'unicité par `user_id`.
