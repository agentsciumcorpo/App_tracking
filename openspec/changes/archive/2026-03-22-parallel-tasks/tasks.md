## 1. Migration base de données

- [x] 1.1 Créer une migration Supabase pour supprimer la contrainte unique sur `user_id` dans `active_timers`
- [x] 1.2 Modifier la RPC `complete_timer` pour accepter un `p_timer_id` (UUID) et supprimer/insérer par cet ID au lieu du `user_id` implicite

## 2. Hook useTimers

- [x] 2.1 Créer le hook `useTimers` qui retourne un tableau de timers actifs avec chacun son `id`, `taskName`, `projectId`, `startedAt`, `elapsedSeconds`
- [x] 2.2 Implémenter la restauration de tous les timers actifs au montage (query `active_timers` sans `.single()`)
- [x] 2.3 Implémenter `startTimer(taskName, projectId)` qui insère dans `active_timers` et ajoute le timer au tableau
- [x] 2.4 Implémenter un seul `setInterval` partagé qui met à jour tous les `elapsedSeconds` chaque seconde
- [x] 2.5 Implémenter `stopTimer(timerId)` qui passe un timer en état `pendingStop`
- [x] 2.6 Implémenter `confirmStop(timerId, rating)` qui appelle la RPC et retire le timer du tableau
- [x] 2.7 Implémenter `cancelStop(timerId)` qui reprend le timer
- [x] 2.8 Gérer la visibilité (recalcul des `elapsedSeconds` quand l'onglet redevient visible)

## 3. Composants UI

- [x] 3.1 Créer le composant `ActiveTimerCard` : carte compacte avec nom, projet (couleur + nom), temps écoulé HH:MM:SS, bouton Stop
- [x] 3.2 Créer le composant `ActiveTimersList` : liste de `ActiveTimerCard`, caché si aucun timer actif
- [x] 3.3 Modifier `TimerControls` : le formulaire reste toujours actif (supprimer le `disabled` quand `isRunning`), réinitialiser après chaque Start
- [x] 3.4 Modifier la page Timer : remplacer le `TimerDisplay` unique par le formulaire + `ActiveTimersList`, adapter l'intégration avec le nouveau hook `useTimers`

## 4. Modale de notation

- [x] 4.1 Adapter la modale de notation pour recevoir le `timerId` et les infos du timer spécifique (nom, durée)
- [x] 4.2 Bloquer les boutons Stop des autres timers quand une modale est ouverte

## 5. Tests et nettoyage

- [x] 5.1 Mettre à jour les tests existants du timer pour le nouveau hook `useTimers`
- [x] 5.2 Supprimer l'ancien hook `useTimer` (singulier) une fois la migration complète
