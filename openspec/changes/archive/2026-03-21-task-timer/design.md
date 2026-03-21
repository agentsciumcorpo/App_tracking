## Context

L'application de productivité est un projet greenfield. Aucune infrastructure frontend ou backend n'existe encore. Le timer de tâche est la première fonctionnalité à implémenter. La stack est React 18+ (Vite, TypeScript, Tailwind CSS) avec Supabase comme backend.

## Goals / Non-Goals

**Goals:**
- Permettre à l'utilisateur de chronométrer une tâche avec nom, début et fin
- Persister le timer actif pour survivre aux rafraîchissements de page
- Enregistrer les tâches terminées en base de données
- Sécuriser les données par utilisateur via RLS

**Non-Goals:**
- Pas de système de projets (viendra plus tard)
- Pas de notation de productivité (feature séparée)
- Pas d'historique ou de liste des tâches passées (feature séparée)
- Pas d'authentification (pré-requis supposé existant via Supabase Auth)

## Decisions

### 1. Schéma de base de données

Deux tables Supabase :

**`active_timers`** — Timer en cours (0 ou 1 ligne par utilisateur)
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users)
- `task_name` (text, non vide)
- `started_at` (timestamptz)

**`tasks`** — Tâches terminées
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users)
- `task_name` (text)
- `started_at` (timestamptz)
- `ended_at` (timestamptz)
- `duration_minutes` (integer)

**Rationale** : Séparer `active_timers` de `tasks` simplifie la logique — le timer actif est un état transitoire, pas une tâche terminée. On évite un champ `status` et des requêtes conditionnelles.

### 2. Hook `useTimer`

Un custom hook React centralise toute la logique :
- État local : `taskName`, `isRunning`, `startedAt`, `elapsedSeconds`
- `setInterval` toutes les secondes pour mettre à jour l'affichage
- `startTimer()` : insère dans `active_timers`, démarre l'intervalle
- `stopTimer()` : calcule la durée, insère dans `tasks`, supprime de `active_timers`
- Au montage : vérifie `active_timers` et restaure le timer si existant

**Rationale** : Un hook unique évite la dispersion de la logique timer entre composants. Le calcul du temps écoulé se fait côté client à partir de `started_at` (pas d'état serveur à synchroniser chaque seconde).

### 3. Composants UI

- `TimerPage` : page principale, orchestre le layout
- `TimerDisplay` : affiche le chrono HH:MM:SS
- `TimerControls` : champ texte + bouton Start/Stop

**Rationale** : Découpage simple en 3 composants. Pas de sur-ingénierie pour une première feature.

### 4. Calcul du temps

Le temps écoulé est calculé côté client : `now - started_at`. Cela garantit un affichage correct même après un refresh (on relit `started_at` depuis Supabase).

La durée stockée dans `tasks.duration_minutes` est arrondie à l'entier (conformément aux conventions du projet).

## Risks / Trade-offs

- **[Décalage horloge client]** → Le calcul `now - started_at` dépend de l'horloge locale. Acceptable pour un outil de productivité personnel.
- **[Perte de données si suppression accidentelle de `active_timers`]** → Risque faible, une seule ligne par utilisateur. Pas de mitigation nécessaire à ce stade.
- **[Pas d'offline support]** → Le timer nécessite une connexion pour démarrer/arrêter. Acceptable pour la v1.
