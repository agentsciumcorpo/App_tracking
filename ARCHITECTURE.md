# Architecture — Productivity Tracker

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Vite + React)              │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌────────┐  ┌──────────┐ │
│  │  Timer   │  │ History  │  │Projects│  │ Analysis │ │
│  │  Page    │  │  Page    │  │  Page  │  │   Page   │ │
│  └────┬─────┘  └────┬─────┘  └───┬────┘  └────┬─────┘ │
│       │              │            │             │       │
│  ┌────┴──────────────┴────────────┴─────────────┴────┐ │
│  │              Custom Hooks Layer                    │ │
│  │  useTimer  useProjects  useTasks  useAnalysis     │ │
│  └────────────────────┬──────────────────────────────┘ │
│                       │                                 │
│  ┌────────────────────┴──────────────────────────────┐ │
│  │              Supabase Client (lib/supabase.ts)     │ │
│  └────────────────────┬──────────────────────────────┘ │
└───────────────────────┼─────────────────────────────────┘
                        │ HTTPS
┌───────────────────────┼─────────────────────────────────┐
│                  Supabase                               │
│                       │                                 │
│  ┌────────────────────┴──────────────────────────────┐ │
│  │                   Auth                             │ │
│  │            (email/password ou magic link)          │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │              PostgreSQL + RLS                      │ │
│  │                                                    │ │
│  │  ┌──────────┐ ┌──────┐ ┌────────────┐ ┌────────┐│ │
│  │  │ projects │ │tasks │ │weekly_     │ │active_ ││ │
│  │  │          │ │      │ │analyses    │ │timers  ││ │
│  │  └──────────┘ └──────┘ └────────────┘ └────────┘│ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │           Edge Functions                           │ │
│  │                                                    │ │
│  │  ┌─────────────────────────────────────────────┐  │ │
│  │  │  analyze-week                               │  │ │
│  │  │  - Reçoit: user_id, week_start, week_end    │  │ │
│  │  │  - Récupère les tâches de la semaine        │  │ │
│  │  │  - Appelle API Anthropic                    │  │ │
│  │  │  - Sauvegarde l'analyse dans weekly_analyses│  │ │
│  │  │  - Retourne le markdown                     │  │ │
│  │  └─────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                        │
                        │ HTTPS
                        ▼
┌─────────────────────────────────────────────────────────┐
│              API Anthropic                              │
│              claude-sonnet-4-20250514                        │
└─────────────────────────────────────────────────────────┘
```

## Couches applicatives

### 1. Pages (Vues)

4 vues accessibles par navigation (tabs ou sidebar) :

| Vue         | Route        | Responsabilité                                    |
|-------------|--------------|---------------------------------------------------|
| Timer       | `/`          | Chronomètre, saisie tâche, sélection projet, note |
| Historique  | `/history`   | Liste des tâches, filtres, édition inline          |
| Projets     | `/projects`  | CRUD des projets avec couleurs                     |
| Analyse     | `/analysis`  | Déclenchement analyse IA, historique analyses      |

### 2. Custom Hooks

Chaque domaine est encapsulé dans un hook dédié :

| Hook            | Responsabilité                                              |
|-----------------|-------------------------------------------------------------|
| `useTimer`      | Start/stop chrono, état du timer, persistance active_timers |
| `useProjects`   | CRUD projets, liste, couleurs                               |
| `useTasks`      | Lecture/écriture tâches, filtrage, édition                   |
| `useAnalysis`   | Appel edge function, lecture analyses passées                |
| `useAuth`       | Login/logout, session utilisateur                            |

### 3. Supabase Client

Fichier unique `lib/supabase.ts` initialisant le client avec les variables d'environnement.

## Flux de données clés

### Timer start → stop → save

```
1. User clique Start
2. useTimer: insert dans active_timers (persistance)
3. setInterval: mise à jour du chrono toutes les secondes
4. User clique Stop
5. Modal de notation (1-5 étoiles, optionnel)
6. useTimer: insert dans tasks (nom, projet, start, end, durée, note)
7. useTimer: delete de active_timers
```

### Reprise après refresh

```
1. App monte
2. useTimer: select active_timers WHERE user_id = current
3. Si timer trouvé → reprend le chrono depuis start_time
4. Affichage du temps écoulé calculé depuis start_time
```

### Analyse IA hebdomadaire

```
1. User clique "Analyse de la semaine"
2. useAnalysis: appelle edge function analyze-week
3. Edge function:
   a. Récupère les tâches de la semaine (start_time BETWEEN week_start AND week_end)
   b. Construit le prompt avec les données structurées
   c. Appelle API Anthropic
   d. Sauvegarde le résultat dans weekly_analyses
   e. Retourne le markdown
4. useAnalysis: affiche le résultat rendu en markdown
```

## Sécurité

- **Auth** : Supabase Auth gère les sessions (JWT)
- **RLS** : Toutes les tables ont des politiques `auth.uid() = user_id`
- **API Key Anthropic** : Stockée uniquement dans les secrets Supabase Edge Functions, jamais côté client
- **Validation** : Durées entre 1 min et 24h, notes entre 1 et 5

## Palette de couleurs des projets

10 couleurs prédéfinies :

```
#EF4444  Rouge
#F97316  Orange
#EAB308  Jaune
#22C55E  Vert
#06B6D4  Cyan
#3B82F6  Bleu
#8B5CF6  Violet
#EC4899  Rose
#6B7280  Gris
#F59E0B  Ambre
```

## Dépendances principales

| Package                 | Usage                          |
|-------------------------|--------------------------------|
| `react` + `react-dom`   | Framework UI                   |
| `react-router-dom`      | Navigation SPA                 |
| `@supabase/supabase-js` | Client Supabase                |
| `tailwindcss`           | Styling                        |
| `react-markdown`        | Rendu markdown (analyses IA)   |
| `lucide-react`          | Icônes                         |
