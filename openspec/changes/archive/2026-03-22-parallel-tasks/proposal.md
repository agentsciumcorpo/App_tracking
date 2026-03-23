## Why

Actuellement, un seul timer peut être actif à la fois par utilisateur. En pratique, on fait souvent plusieurs choses en parallèle — par exemple, lancer une tâche Claude Code puis travailler sur autre chose en attendant. Sans timers parallèles, on ne peut pas tracker fidèlement ce multitasking et on perd du temps productif non comptabilisé.

## What Changes

- **BREAKING** : Suppression de la contrainte "un seul timer actif par utilisateur" — plusieurs timers peuvent tourner simultanément
- Nouveau composant de liste des timers actifs, chacun avec son propre chronomètre et bouton Stop
- Le formulaire de création de tâche reste toujours accessible même quand des timers tournent
- Chaque timer actif peut être arrêté indépendamment (avec sa propre modale de notation)
- Adaptation de la table `active_timers` pour supporter plusieurs entrées par `user_id`
- Refactoring du hook `useTimer` pour gérer un tableau de timers au lieu d'un seul

## Capabilities

### New Capabilities
- `parallel-timers`: Gestion de plusieurs timers actifs simultanément par utilisateur, avec affichage en liste, arrêt indépendant, et persistance multi-timer

### Modified Capabilities
- `task-timer`: Suppression de la contrainte "une seule tâche active à la fois" — le démarrage d'un nouveau timer ne bloque plus si d'autres sont déjà actifs

## Impact

- **Base de données** : Modifier la contrainte unique sur `active_timers` (passer de unique sur `user_id` à un index non-unique), adapter la RPC `complete_timer` pour identifier le timer par ID
- **Hook `useTimer`** : Refactoring majeur — gérer un tableau de timers avec chacun son état (nom, projet, startedAt, elapsedSeconds)
- **Composants UI** : Nouveau composant `ActiveTimerList`, modification du `TimerPage` pour afficher le formulaire + la liste des timers actifs
- **RLS** : Pas de changement — déjà scopé par `user_id`
