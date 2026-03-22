## 1. Utilitaires date

- [x] 1.1 Ajouter `formatDate` et helpers `isToday`/`isThisWeek` dans `src/lib/utils.ts`

## 2. Hook useTasks

- [x] 2.1 Ajouter `updateDuration(taskId, minutes)` avec validation (0-9999) et update optimiste
- [x] 2.2 Ajouter `deleteTask(taskId)` avec suppression optimiste et rollback on error

## 3. Composant DateFilter

- [x] 3.1 Créer `src/components/history/DateFilter.tsx` : boutons "Aujourd'hui", "Cette semaine", "Tout"

## 4. Composant TaskRow

- [x] 4.1 Extraire `src/components/history/TaskRow.tsx` mémorisé depuis `TaskList`
- [x] 4.2 Afficher la date (DD/MM/YYYY HH:MM) sur chaque entrée
- [x] 4.3 Ajouter l'édition inline de la durée (clic → input minutes → Enter/blur)
- [x] 4.4 Ajouter le bouton supprimer avec `window.confirm`

## 5. Intégration HistoryPage

- [x] 5.1 Ajouter `DateFilter` dans `HistoryPage`
- [x] 5.2 Combiner filtres projet + période dans le `useMemo` de `filteredTasks`
- [x] 5.3 Passer les nouveaux callbacks (`updateDuration`, `deleteTask`) à `TaskList`

## 6. Tests

- [x] 6.1 Tests pour `formatDate`, `isToday`, `isThisWeek`
- [x] 6.2 Tests pour `DateFilter` (sélection, highlight)
- [x] 6.3 Tests pour `TaskRow` (affichage date, édition durée, suppression)
