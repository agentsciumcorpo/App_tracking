## Why

L'utilisateur accumule des données de productivité (tâches, durées, projets, notes) mais n'a aucun moyen d'en tirer des insights. Une analyse IA hebdomadaire transforme ces données brutes en recommandations actionnables, donnant une vraie valeur ajoutée au suivi quotidien.

## What Changes

- Nouvelle page "Analyse" avec bouton pour déclencher l'analyse de la semaine courante
- Supabase Edge Function appelant l'API Anthropic (`claude-sonnet-4-20250514`) avec les données hebdomadaires
- Prompt structuré envoyant tâches, durées, projets et notes de la semaine
- Résultat IA affiché en markdown rendu : résumé par projet, tendances, points forts, axes d'amélioration, recommandations
- Table `weekly_analyses` pour sauvegarder les analyses passées
- Historique des analyses consultable depuis la page Analyse

## Capabilities

### New Capabilities
- `weekly-analysis-generation`: Déclenchement et génération de l'analyse IA via Edge Function
- `analysis-display`: Affichage du résultat en markdown et consultation de l'historique des analyses
- `analysis-storage`: Persistance des analyses dans une table dédiée

### Modified Capabilities
_(aucune)_

## Impact

- **Base de données** : Nouvelle table `weekly_analyses` (id, user_id, week_start, week_end, content, created_at) avec RLS
- **Backend** : Nouvelle Supabase Edge Function `analyze-week` appelant l'API Anthropic
- **Frontend** : Nouvelle page `AnalysisPage`, composants d'affichage markdown, hook `useAnalyses`
- **Routing** : Nouvelle route `/analysis` dans App.tsx
- **Dépendances** : `react-markdown` pour le rendu markdown côté client
