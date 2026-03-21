## Why

Les tâches chronométrées n'ont actuellement aucune dimension qualitative. Sans note de productivité, l'utilisateur ne peut pas évaluer l'efficacité de ses sessions de travail ni identifier des tendances. Cette donnée est aussi essentielle pour l'analyse IA hebdomadaire prévue.

## What Changes

- Ajout d'un sélecteur de note (1-5 étoiles) affiché dans une modale au moment de l'arrêt du chrono
- La note est optionnelle : l'utilisateur peut la passer (défaut : non renseignée)
- La note est modifiable après coup depuis la vue historique
- Colonne `rating` ajoutée à la table `tasks`

## Capabilities

### New Capabilities
- `productivity-rating`: Sélecteur de note 1-5 étoiles au stop du timer, modification depuis l'historique, stockage optionnel en BDD

### Modified Capabilities
- `task-timer`: L'arrêt du chronomètre déclenche désormais une étape intermédiaire (modale de notation) avant la finalisation

## Impact

- **Base de données** : Ajout colonne `rating` (integer, nullable, 1-5) sur `tasks`, mise à jour de la RPC `complete_timer`
- **Frontend** : Nouveau composant `RatingModal`, modification du flux stop dans `useTimer`, ajout d'un bouton d'édition de note dans l'historique
- **Types** : Mise à jour du type `Task` avec `rating`
