## 1. Base de données

- [x] 1.1 Migration Supabase : ajouter colonne `rating` (smallint, nullable, CHECK 1-5) sur `tasks`
- [x] 1.2 Modifier la RPC `complete_timer` pour accepter `p_rating` (smallint, nullable)

## 2. Types

- [x] 2.1 Mettre à jour l'interface `Task` avec `rating: number | null`

## 3. Composant StarRating

- [x] 3.1 Créer `src/components/ui/StarRating.tsx` : sélecteur 1-5 étoiles cliquable
- [x] 3.2 Créer `src/components/ui/RatingModal.tsx` : modale avec StarRating + boutons "Enregistrer" / "Passer"

## 4. Modification du flux timer

- [x] 4.1 Modifier `useTimer` : séparer l'arrêt visuel de la finalisation, exposer `confirmStop(rating?)` et `pendingStop`
- [x] 4.2 Modifier `TimerPage` : afficher la `RatingModal` quand `pendingStop` est actif, appeler `confirmStop` au submit

## 5. Édition dans l'historique

- [x] 5.1 Ajouter un hook `useUpdateRating` pour mettre à jour le rating d'une tâche
- [x] 5.2 Modifier `TaskList` : afficher les étoiles (ou "Non noté"), rendre le rating cliquable pour édition inline

## 6. Tests

- [x] 6.1 Tests pour `StarRating` (sélection, changement de valeur)
- [x] 6.2 Tests pour `RatingModal` (submit avec note, passer sans note)
- [x] 6.3 Tests pour l'édition de rating dans l'historique
