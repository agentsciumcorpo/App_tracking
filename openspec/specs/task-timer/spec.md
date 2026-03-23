### Requirement: Saisie du nom de tâche
L'utilisateur DOIT pouvoir saisir un nom de tâche dans un champ texte avant de démarrer le chronomètre.

#### Scenario: Champ texte vide au chargement
- **WHEN** l'utilisateur accède à la page Timer
- **THEN** un champ texte vide avec un placeholder est affiché

#### Scenario: Nom de tâche requis pour démarrer
- **WHEN** l'utilisateur clique sur Start sans avoir saisi de nom
- **THEN** le timer ne démarre pas et le champ est mis en évidence

### Requirement: Démarrage du chronomètre
L'utilisateur DOIT pouvoir démarrer un chronomètre en saisissant un nom de tâche, sélectionnant un projet, et cliquant sur Start. Le nom DOIT être non vide et de 200 caractères maximum. Un projet DOIT être sélectionné. Plusieurs timers peuvent être actifs simultanément par utilisateur.

#### Scenario: Démarrage réussi avec projet
- **WHEN** l'utilisateur a saisi un nom de tâche, sélectionné un projet, et clique sur Start
- **THEN** le chronomètre démarre et s'ajoute à la liste des timers actifs
- **THEN** le formulaire revient à l'état initial (champ vide) pour permettre de démarrer un autre timer
- **THEN** le timer actif avec `project_id` est persisté dans `active_timers`

#### Scenario: Démarrage sans projet sélectionné
- **WHEN** l'utilisateur saisit un nom de tâche mais ne sélectionne pas de projet
- **THEN** le système affiche une erreur de validation et le timer ne démarre pas

### Requirement: Affichage du temps en temps réel
Le système DOIT afficher le temps écoulé au format HH:MM:SS, mis à jour chaque seconde.

#### Scenario: Mise à jour chaque seconde
- **WHEN** le chronomètre est en cours
- **THEN** l'affichage se met à jour toutes les secondes au format HH:MM:SS

#### Scenario: Affichage initial
- **WHEN** aucun chronomètre n'est actif
- **THEN** l'affichage montre 00:00:00

### Requirement: Arrêt du chronomètre
L'utilisateur DOIT pouvoir arrêter le chronomètre en cliquant sur un bouton Stop. À l'arrêt, une modale de notation s'affiche avant la finalisation de la tâche. L'utilisateur peut noter sa productivité (1-5) ou passer. La tâche est enregistrée uniquement après cette étape.

#### Scenario: Arrêt et modale de notation
- **WHEN** l'utilisateur clique sur Stop
- **THEN** le chronomètre s'arrête visuellement
- **THEN** une modale de notation (1-5 étoiles) s'affiche
- **THEN** l'utilisateur peut noter ou passer

#### Scenario: Enregistrement après notation
- **WHEN** l'utilisateur soumet une note ou passe
- **THEN** la tâche est enregistrée dans `tasks` avec : nom, durée, timestamps, project_id, et rating (ou NULL)
- **THEN** l'entrée dans `active_timers` est supprimée
- **THEN** le formulaire revient à l'état initial (champ vide, bouton Start)

### Requirement: Persistance du timer actif
Le timer actif DOIT survivre à un rafraîchissement de la page.

#### Scenario: Restauration après refresh
- **WHEN** l'utilisateur rafraîchit la page alors qu'un chronomètre est en cours
- **THEN** le chronomètre reprend automatiquement avec le temps écoulé correct calculé depuis `started_at`
- **THEN** l'association au projet est également restaurée

#### Scenario: Pas de timer actif
- **WHEN** l'utilisateur charge la page sans timer actif dans `active_timers`
- **THEN** la page affiche l'état initial (champ vide, bouton Start, 00:00:00)

### Requirement: Sécurité par utilisateur
Chaque utilisateur DOIT uniquement voir et manipuler ses propres données.

#### Scenario: Isolation des données via RLS
- **WHEN** un utilisateur accède aux tables `tasks` ou `active_timers`
- **THEN** seules les lignes correspondant à son `user_id` sont visibles et modifiables
