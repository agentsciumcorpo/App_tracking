## 1. Base de données

- [x] 1.1 Migration Supabase : table `weekly_analyses` (id, user_id, week_start, week_end, content, created_at) avec RLS et contrainte UNIQUE (user_id, week_start)

## 2. Edge Function

- [x] 2.1 Créer `supabase/functions/analyze-week/index.ts` : authentification JWT, récupération tâches + projets de la semaine
- [x] 2.2 Construire le prompt structuré avec données agrégées par projet
- [x] 2.3 Appeler l'API Anthropic (`claude-sonnet-4-20250514`) et UPSERT le résultat dans `weekly_analyses`
- [x] 2.4 Déployer l'Edge Function via Supabase CLI

## 3. Types et utilitaires

- [x] 3.1 Ajouter l'interface `WeeklyAnalysis` dans `src/types/index.ts`
- [x] 3.2 Ajouter helpers `getWeekRange(offset)` dans `src/lib/utils.ts` pour calculer lundi-dimanche

## 4. Hook useAnalyses

- [x] 4.1 Créer `src/hooks/useAnalyses.ts` : fetch historique, générer analyse (appel Edge Function), état loading/error

## 5. Page Analyse

- [x] 5.1 Installer `react-markdown` et créer `src/components/analysis/MarkdownRenderer.tsx` avec styles Tailwind dark mode
- [x] 5.2 Créer `src/components/analysis/WeekSelector.tsx` : "Cette semaine" / "Semaine dernière"
- [x] 5.3 Créer `src/components/analysis/AnalysisPanel.tsx` : affichage du résultat markdown, loading spinner, état d'erreur
- [x] 5.4 Créer `src/components/analysis/PastAnalysesList.tsx` : liste des analyses passées cliquables
- [x] 5.5 Créer `src/pages/AnalysisPage.tsx` assemblant tous les composants
- [x] 5.6 Ajouter la route `/analysis` et le lien "Analyse" dans NavBar

## 6. Tests

- [x] 6.1 Tests pour `getWeekRange`
- [x] 6.2 Tests pour `WeekSelector` (sélection, highlight)
- [x] 6.3 Tests pour `AnalysisPanel` (loading, contenu, erreur)
