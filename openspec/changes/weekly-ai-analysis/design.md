## Context

L'app dispose de tâches avec : nom, projet (nom + couleur), durée (minutes), rating (1-5, nullable), timestamps. Le filtrage `isThisWeek` existe déjà côté client. Supabase Edge Functions (Deno) sont le mécanisme prévu pour les appels API côté serveur. `ANTHROPIC_API_KEY` est stocké dans les secrets Supabase, jamais exposé au client.

## Goals / Non-Goals

**Goals:**
- Permettre à l'utilisateur de générer une analyse IA de sa semaine en un clic
- Sauvegarder chaque analyse pour consultation ultérieure
- Rendre le résultat lisible (markdown structuré)
- Empêcher la génération multiple pour la même semaine (ou permettre de régénérer)

**Non-Goals:**
- Analyses automatiques (cron) — l'utilisateur déclenche manuellement
- Analyses sur des périodes personnalisées (seulement la semaine courante ou passée)
- Comparaison entre semaines
- Génération en streaming (le résultat est retourné en une fois)

## Decisions

### 1. Supabase Edge Function `analyze-week`

L'Edge Function reçoit `week_start` et `week_end` en paramètres. Elle :
1. Récupère les tâches de la semaine pour le `user_id` authentifié (via le JWT Supabase)
2. Joint les projets pour avoir les noms
3. Construit le prompt structuré
4. Appelle l'API Anthropic avec `claude-sonnet-4-20250514`
5. Sauvegarde le résultat dans `weekly_analyses`
6. Retourne le contenu markdown

**Rationale** : L'Edge Function isole la clé API Anthropic côté serveur. Le JWT Supabase authentifie l'utilisateur. La sauvegarde est atomique avec la génération.

**Alternative considérée** : Appel direct depuis le client via un proxy. Rejeté car expose le flow de l'API et complexifie la gestion de la clé.

### 2. Prompt structuré

Le prompt envoyé à Claude inclut :
- Nombre total de tâches et durée totale
- Répartition par projet (nom, durée totale, nombre de tâches, note moyenne)
- Liste détaillée des tâches (nom, projet, durée, note)
- Instruction de retourner un markdown structuré avec sections : Résumé, Tendances, Points forts, Axes d'amélioration, Recommandations

**Rationale** : Un prompt structuré produit des résultats cohérents et parsables. Les sections fixes permettent un affichage prévisible.

### 3. Table `weekly_analyses`

Colonnes : `id` (uuid), `user_id` (uuid FK), `week_start` (date), `week_end` (date), `content` (text, markdown), `created_at` (timestamptz). Contrainte UNIQUE sur `(user_id, week_start)` pour empêcher les doublons (régénérer remplace l'existant via UPSERT).

**Rationale** : Une analyse par semaine par utilisateur. L'UPSERT simplifie la logique de régénération.

### 4. `react-markdown` pour le rendu

Le contenu markdown est rendu via `react-markdown` avec un style Tailwind adapté au dark mode.

**Rationale** : Bibliothèque légère, largement adoptée, pas de risque XSS (pas de `dangerouslySetInnerHTML`).

### 5. Sélecteur de semaine simple

L'utilisateur peut choisir "Cette semaine" ou "Semaine dernière". Pas de date picker complexe.

**Rationale** : Couvre le cas d'usage principal (analyse en fin de semaine ou début de semaine suivante) sans complexité UI.

## Risks / Trade-offs

- **[Coût API]** → Chaque analyse coûte un appel Anthropic. Limité naturellement à 1-2 par semaine par utilisateur. Pas de rate limiting implémenté pour l'instant.
- **[Semaine sans tâches]** → L'Edge Function vérifie qu'il y a au moins une tâche et retourne une erreur claire sinon.
- **[Temps de réponse]** → L'appel Anthropic peut prendre 5-15s. Un état de chargement avec spinner est affiché.
