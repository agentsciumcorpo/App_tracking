## Why

L'application de productivité n'a actuellement aucune fonctionnalité. Le timer de tâche est la brique fondamentale : sans lui, impossible de mesurer le temps passé sur une activité. C'est le point d'entrée naturel de l'utilisateur dans l'app.

## What Changes

- Ajout d'un composant Timer permettant de démarrer/arrêter un chronomètre
- Champ texte pour nommer la tâche avant de démarrer
- Affichage en temps réel du temps écoulé (HH:MM:SS)
- Contrainte : une seule tâche active à la fois par utilisateur
- Persistance du timer actif dans Supabase (`active_timers`) pour survivre aux refresh
- Enregistrement de la tâche terminée dans Supabase (`tasks`) avec nom, durée, timestamps début/fin
- Création des tables Supabase nécessaires avec RLS

## Capabilities

### New Capabilities
- `task-timer`: Chronomètre de tâche avec démarrage, arrêt, affichage temps réel et persistance

### Modified Capabilities
<!-- Aucune capability existante à modifier -->

## Impact

- **Base de données** : Création des tables `tasks` et `active_timers` avec politiques RLS
- **Frontend** : Nouveaux composants dans `src/components/timer/`, nouveau hook `useTimer`
- **Dépendances** : Supabase client (`@supabase/supabase-js`)
- **Auth** : Nécessite que l'utilisateur soit authentifié (scope par `user_id`)
