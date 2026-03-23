## Context

L'application impose actuellement un unique timer actif par utilisateur via une contrainte unique sur `user_id` dans `active_timers`. Le hook `useTimer` gère un seul état de timer (scalaires). En pratique, les utilisateurs multitaskent — ils lancent une tâche longue (ex: attente Claude Code) et travaillent sur autre chose en parallèle.

## Goals / Non-Goals

**Goals:**
- Permettre plusieurs timers actifs simultanément par utilisateur
- Chaque timer est indépendant : démarrage, arrêt, notation séparés
- Le formulaire de création reste toujours accessible
- Tous les timers actifs survivent au refresh de la page
- UX claire pour visualiser et gérer plusieurs timers en cours

**Non-Goals:**
- Pas de limite configurable du nombre de timers (on fait confiance à l'utilisateur)
- Pas de regroupement ou de liens entre timers parallèles
- Pas de modification du système de notation ou de l'historique des tâches
- Pas de réorganisation de la page Timer au-delà de ce qui est nécessaire

## Decisions

### 1. Base de données : supprimer la contrainte unique sur `user_id`

**Choix** : Migration pour supprimer la contrainte unique sur `active_timers.user_id`. La table garde sa structure (id, user_id, task_name, started_at, project_id) mais accepte plusieurs lignes par utilisateur.

**Alternative rejetée** : Créer une nouvelle table `parallel_timers` — inutile, `active_timers` est déjà bien structurée, il suffit de lever la contrainte.

**Rationale** : Changement minimal en BDD, la RLS existante fonctionne déjà car elle filtre par `user_id`, pas par unicité.

### 2. RPC `complete_timer` : identifier par `id` au lieu du `user_id` implicite

**Choix** : Modifier la RPC pour prendre un `p_timer_id` (UUID) au lieu de trouver le timer unique de l'utilisateur. La RPC supprime l'entrée `active_timers` correspondant à cet ID et insère dans `tasks`.

**Rationale** : Avec plusieurs timers, on ne peut plus identifier "le" timer actif — il faut l'ID spécifique.

### 3. Hook `useTimers` (pluriel) : tableau de timers

**Choix** : Nouveau hook `useTimers` qui retourne un tableau de timers actifs + la fonction `startTimer` + `stopTimer(timerId)` + `confirmStop(timerId, rating)`. Chaque timer dans le tableau a son propre `elapsedSeconds` mis à jour via un seul `setInterval` partagé.

**Alternative rejetée** : Un `setInterval` par timer — trop de timers = trop d'intervals. Un seul interval de 1s met à jour tous les `elapsedSeconds` en un seul batch.

**Rationale** : Un seul interval est plus performant et évite les dérives entre timers.

### 4. UI : liste de timers actifs sous le formulaire

**Choix** : Nouveau composant `ActiveTimersList` affiché sous le formulaire. Chaque timer actif est une carte compacte avec : nom de tâche, projet (couleur + nom), temps écoulé, bouton Stop. Le `TimerDisplay` actuel (gros chronomètre central) est supprimé au profit de cette liste.

**Alternative rejetée** : Garder le gros chronomètre pour "le timer principal" et mettre les autres en petit — crée une hiérarchie artificielle entre tâches qui sont toutes égales.

### 5. Modale de notation : une par timer

**Choix** : Quand on stoppe un timer, la modale de notation s'ouvre pour ce timer spécifique. Un seul `pendingStop` à la fois (on ne peut pas noter deux tâches en même temps). Si un timer est en `pendingStop`, les autres continuent de tourner.

## Risks / Trade-offs

- **[Beaucoup de timers actifs]** → L'UI pourrait devenir encombrée. Mitigation : design compact des cartes timer, scroll si nécessaire. En pratique, peu d'utilisateurs auront plus de 3-4 timers simultanés.
- **[Migration BDD]** → Supprimer la contrainte unique est irréversible dans le sens où on perd la garantie. Mitigation : la nouvelle logique applicative n'en a plus besoin, et c'est un changement simple.
- **[Breaking change hook API]** → `useTimer` (singulier) est remplacé par `useTimers` (pluriel) avec une API différente. Mitigation : changement interne, pas d'API publique exposée.
