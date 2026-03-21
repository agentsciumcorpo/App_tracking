## ADDED Requirements

### Requirement: Saisie du nom de tâche
L'utilisateur DOIT pouvoir saisir un nom de tâche dans un champ texte avant de démarrer le chronomètre.

#### Scenario: Champ texte vide au chargement
- **WHEN** l'utilisateur accède à la page Timer
- **THEN** un champ texte vide avec un placeholder est affiché

#### Scenario: Nom de tâche requis pour démarrer
- **WHEN** l'utilisateur clique sur Start sans avoir saisi de nom
- **THEN** le timer ne démarre pas et le champ est mis en évidence

### Requirement: Démarrage du chronomètre
L'utilisateur DOIT pouvoir démarrer un chronomètre en cliquant sur un bouton Start.

#### Scenario: Démarrage réussi
- **WHEN** l'utilisateur a saisi un nom de tâche et clique sur Start
- **THEN** le chronomètre démarre et affiche le temps écoulé en temps réel
- **THEN** le bouton Start devient un bouton Stop
- **THEN** le champ de saisie du nom est désactivé

#### Scenario: Timer persisté au démarrage
- **WHEN** le chronomètre démarre
- **THEN** une entrée est créée dans `active_timers` avec le nom, le `user_id` et le timestamp de début

### Requirement: Affichage du temps en temps réel
Le système DOIT afficher le temps écoulé au format HH:MM:SS, mis à jour chaque seconde.

#### Scenario: Mise à jour chaque seconde
- **WHEN** le chronomètre est en cours
- **THEN** l'affichage se met à jour toutes les secondes au format HH:MM:SS

#### Scenario: Affichage initial
- **WHEN** aucun chronomètre n'est actif
- **THEN** l'affichage montre 00:00:00

### Requirement: Arrêt du chronomètre
L'utilisateur DOIT pouvoir arrêter le chronomètre en cliquant sur un bouton Stop.

#### Scenario: Arrêt et enregistrement
- **WHEN** l'utilisateur clique sur Stop
- **THEN** le chronomètre s'arrête
- **THEN** la tâche est enregistrée dans `tasks` avec : nom, durée en minutes, timestamp début et fin
- **THEN** l'entrée dans `active_timers` est supprimée
- **THEN** le formulaire revient à l'état initial (champ vide, bouton Start)

### Requirement: Une seule tâche active à la fois
Le système DOIT garantir qu'un seul chronomètre est actif par utilisateur à tout moment.

#### Scenario: Tentative de double démarrage
- **WHEN** un chronomètre est déjà en cours
- **THEN** le bouton Start n'est pas disponible (remplacé par Stop)

#### Scenario: Contrainte en base de données
- **WHEN** une entrée existe dans `active_timers` pour un `user_id`
- **THEN** aucune autre entrée ne peut être insérée pour ce même `user_id`

### Requirement: Persistance du timer actif
Le timer actif DOIT survivre à un rafraîchissement de la page.

#### Scenario: Restauration après refresh
- **WHEN** l'utilisateur rafraîchit la page alors qu'un chronomètre est en cours
- **THEN** le chronomètre reprend automatiquement avec le temps écoulé correct calculé depuis `started_at`

#### Scenario: Pas de timer actif
- **WHEN** l'utilisateur charge la page sans timer actif dans `active_timers`
- **THEN** la page affiche l'état initial (champ vide, bouton Start, 00:00:00)

### Requirement: Sécurité par utilisateur
Chaque utilisateur DOIT uniquement voir et manipuler ses propres données.

#### Scenario: Isolation des données via RLS
- **WHEN** un utilisateur accède aux tables `tasks` ou `active_timers`
- **THEN** seules les lignes correspondant à son `user_id` sont visibles et modifiables
