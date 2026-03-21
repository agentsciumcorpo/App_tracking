## 1. Setup projet

- [x] 1.1 Initialiser le projet Vite + React + TypeScript + Tailwind CSS
- [x] 1.2 Installer et configurer le client Supabase (`@supabase/supabase-js`)
- [x] 1.3 Créer la structure de dossiers (`src/components/timer/`, `src/hooks/`, `src/lib/`, `src/types/`, `src/pages/`)

## 2. Base de données Supabase

- [x] 2.1 Créer la table `active_timers` (id, user_id, task_name, started_at) avec contrainte unique sur user_id
- [x] 2.2 Créer la table `tasks` (id, user_id, task_name, started_at, ended_at, duration_minutes)
- [x] 2.3 Configurer les politiques RLS sur `active_timers` (SELECT, INSERT, DELETE scopés par user_id)
- [x] 2.4 Configurer les politiques RLS sur `tasks` (SELECT, INSERT scopés par user_id)

## 3. Types TypeScript

- [x] 3.1 Définir les types `Task`, `ActiveTimer` et les types liés au timer dans `src/types/`

## 4. Hook useTimer

- [x] 4.1 Créer le hook `useTimer` avec état local (taskName, isRunning, startedAt, elapsedSeconds)
- [x] 4.2 Implémenter `startTimer()` : validation du nom, insertion dans `active_timers`, démarrage de l'intervalle
- [x] 4.3 Implémenter `stopTimer()` : calcul de la durée, insertion dans `tasks`, suppression de `active_timers`, reset de l'état
- [x] 4.4 Implémenter la restauration du timer au montage (lecture de `active_timers`, reprise du chrono)

## 5. Composants UI

- [x] 5.1 Créer `TimerDisplay` : affichage HH:MM:SS du temps écoulé
- [x] 5.2 Créer `TimerControls` : champ texte pour le nom + bouton Start/Stop
- [x] 5.3 Créer `TimerPage` : composition de TimerDisplay et TimerControls

## 6. Intégration

- [x] 6.1 Brancher `TimerPage` dans `App.tsx` avec le routing
- [x] 6.2 Tester le flux complet : saisie nom → Start → chrono temps réel → Stop → enregistrement → reset
- [x] 6.3 Tester la persistance : refresh pendant un timer actif → restauration correcte
