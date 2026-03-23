# PRD — Productivity Tracker App

## Résumé

Application web React permettant de tracker sa productivité au quotidien : chronométrer des tâches, les classer par projet, les noter, et obtenir une analyse IA hebdomadaire.

**Stack** : React (Vite), Supabase (PostgreSQL + Auth), Tailwind CSS, API Anthropic pour l'analyse IA.

---

## Fonctionnalités

### 1. Timer de tâche

**Description** : L'utilisateur saisit le nom d'une tâche, démarre un chronomètre, et l'arrête une fois terminé.

**Exigences** :
- Champ texte pour nommer la tâche
- Bouton Start / Stop
- Affichage du chrono en temps réel (HH:MM:SS)
- Une seule tâche active à la fois
- Au stop, la tâche est enregistrée avec : nom, durée, timestamp début/fin

**Modification du temps** :
- L'utilisateur peut éditer manuellement la durée d'une tâche enregistrée (champ éditable HH:MM)
- Validation : durée minimum 1 min, maximum 24h

---

### 2. Gestion des projets

**Description** : Chaque tâche est associée à un projet.

**Exigences** :
- Liste de projets créés par l'utilisateur (CRUD)
- Sélecteur de projet obligatoire avant/pendant le démarrage d'une tâche
- Couleur assignée à chaque projet (palette prédéfinie de 8-10 couleurs)
- Filtrage des tâches par projet dans l'historique

---

### 3. Note de productivité

**Description** : L'utilisateur note sa productivité sur 5 pour chaque tâche.

**Exigences** :
- Sélecteur de note (1 à 5 étoiles ou score cliquable) affiché au moment du stop du chrono
- Note modifiable après coup dans l'historique
- Note optionnelle (défaut : non renseignée)

---

### 4. Historique des tâches

**Description** : Vue liste de toutes les tâches enregistrées.

**Exigences** :
- Liste triée par date (plus récent en haut)
- Chaque entrée affiche : nom de la tâche, projet (avec couleur), durée, note, date
- Filtres : par projet, par jour/semaine
- Actions : modifier durée, modifier note, supprimer

---

### 5. Analyse IA hebdomadaire

**Description** : À la fin de chaque semaine, l'utilisateur peut déclencher une analyse IA de sa productivité.

**Exigences** :
- Bouton "Analyse de la semaine"
- Appel API Anthropic (`claude-sonnet-4-20250514`) avec les données de la semaine en contexte
- Prompt structuré envoyant : liste des tâches, durées, projets, notes
- L'IA retourne :
  - Résumé du temps passé par projet
  - Tendances de productivité (notes moyennes, évolution)
  - Points forts identifiés
  - Axes d'amélioration concrets
  - Recommandations pour la semaine suivante
- Affichage du résultat dans un panneau dédié (markdown rendu)
- Possibilité de sauvegarder / consulter les analyses passées

---

## Modèle de données

### Task
| Champ            | Type             | Description                        |
|------------------|------------------|------------------------------------|
| id               | UUID             | Identifiant unique                 |
| name             | string           | Nom de la tâche                    |
| projectId        | UUID             | Référence au projet                |
| startTime        | ISO8601          | Timestamp de début                 |
| endTime          | ISO8601          | Timestamp de fin                   |
| durationMinutes  | number           | Durée en minutes                   |
| rating           | number \| null   | Note de productivité (1-5)         |
| createdAt        | ISO8601          | Date de création                   |

### Project
| Champ   | Type   | Description              |
|---------|--------|--------------------------|
| id      | UUID   | Identifiant unique       |
| name    | string | Nom du projet            |
| color   | string | Couleur en hexadécimal   |

### WeeklyAnalysis
| Champ       | Type    | Description                    |
|-------------|---------|--------------------------------|
| id          | UUID    | Identifiant unique             |
| weekStart   | ISO8601 | Début de la semaine            |
| weekEnd     | ISO8601 | Fin de la semaine              |
| content     | string  | Contenu markdown de l'analyse  |
| generatedAt | ISO8601 | Date de génération             |

---

## Stockage — Supabase

### Tables SQL

```sql
-- Projets
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tâches
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Analyses IA hebdomadaires
CREATE TABLE weekly_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  content TEXT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT now()
);

-- Timer actif (persistance en cas de refresh)
CREATE TABLE active_timers (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  project_id UUID REFERENCES projects(id),
  start_time TIMESTAMPTZ NOT NULL
);
```

### Row Level Security (RLS)

Activer RLS sur toutes les tables. Politique : chaque utilisateur ne voit que ses propres données.

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE weekly_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_analyses" ON weekly_analyses
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE active_timers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_timers" ON active_timers
  FOR ALL USING (auth.uid() = user_id);
```

### Stratégie d'accès aux données

- Lecture au montage via `supabase.from('table').select()`
- Écriture immédiate à chaque mutation (insert/update/delete)
- Timer actif persisté dans `active_timers` pour survivre aux refresh
- Auth Supabase (magic link ou email/password) pour identifier l'utilisateur

---

## UI / Navigation

**Layout** : Single-page app avec navigation par onglets ou sidebar.

**Vues** :
1. **Timer** (vue par défaut) — Chrono + saisie tâche + sélecteur projet + note au stop
2. **Historique** — Liste des tâches avec filtres et édition inline
3. **Projets** — Gestion des projets (ajout, édition, suppression)
4. **Analyse** — Déclenchement analyse IA + historique des analyses

**Design** :
- Dark mode par défaut
- UI minimaliste, focus sur le chrono au centre
- Couleurs des projets visibles partout (badges, bordures)
- Responsive (mobile-friendly)

---

## Contraintes techniques

- React fonctionnel (hooks uniquement), Vite
- Supabase JS client (`@supabase/supabase-js`) pour le stockage et l'auth
- API Anthropic appelée via edge function Supabase (sécurisation de la clé API)
- Tailwind CSS pour le styling
- Variables d'environnement : `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY` (côté edge function)

---

## Priorités de développement

| Phase  | Scope                                        | Détails                                                        |
|--------|----------------------------------------------|----------------------------------------------------------------|
| **P0** | Timer + projets + stockage persistant        | CRUD projets, timer start/stop, persistance Supabase, auth     |
| **P1** | Note de productivité + historique            | Notation 1-5 étoiles, liste filtrable, édition inline          |
| **P2** | Analyse IA hebdomadaire                      | Edge function Anthropic, prompt structuré, rendu markdown      |
| **P3** | Polish UI, animations, export données        | Transitions, export CSV, thème clair optionnel                 |
