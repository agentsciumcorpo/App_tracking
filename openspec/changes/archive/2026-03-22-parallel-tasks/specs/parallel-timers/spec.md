## ADDED Requirements

### Requirement: Plusieurs timers actifs simultanément
L'utilisateur DOIT pouvoir démarrer plusieurs timers en parallèle. Chaque timer est indépendant et tourne simultanément.

#### Scenario: Démarrage d'un second timer
- **WHEN** un timer est déjà actif et l'utilisateur saisit un nouveau nom de tâche, sélectionne un projet, et clique Start
- **THEN** un second timer démarre sans affecter le premier
- **THEN** les deux timers affichent leur temps écoulé respectif en temps réel

#### Scenario: Démarrage de plusieurs timers
- **WHEN** l'utilisateur démarre 3 timers successivement
- **THEN** les 3 timers tournent simultanément et sont tous visibles dans la liste

### Requirement: Formulaire toujours accessible
Le formulaire de création de tâche (nom + projet + bouton Start) DOIT rester accessible même quand des timers sont déjà actifs.

#### Scenario: Formulaire disponible avec timers actifs
- **WHEN** un ou plusieurs timers sont en cours
- **THEN** le formulaire de création est affiché avec le champ nom vide et le sélecteur de projet
- **THEN** l'utilisateur peut saisir un nouveau nom et démarrer un nouveau timer

### Requirement: Liste des timers actifs
Le système DOIT afficher tous les timers actifs sous forme de liste compacte, chacun avec son nom, projet, temps écoulé et bouton Stop.

#### Scenario: Affichage de la liste
- **WHEN** plusieurs timers sont actifs
- **THEN** chaque timer est affiché dans une carte compacte avec : nom de la tâche, couleur et nom du projet, temps écoulé au format HH:MM:SS, bouton Stop

#### Scenario: Aucun timer actif
- **WHEN** aucun timer n'est actif
- **THEN** la liste n'est pas affichée (ou affiche un état vide)

### Requirement: Arrêt indépendant de chaque timer
Chaque timer actif DOIT pouvoir être arrêté indépendamment des autres.

#### Scenario: Arrêt d'un timer parmi plusieurs
- **WHEN** l'utilisateur clique Stop sur un timer spécifique
- **THEN** ce timer s'arrête et la modale de notation s'affiche pour ce timer
- **THEN** les autres timers continuent de tourner normalement

#### Scenario: Notation et enregistrement d'un timer
- **WHEN** l'utilisateur note (ou passe) la tâche du timer arrêté
- **THEN** la tâche est enregistrée dans `tasks` avec ses données
- **THEN** l'entrée correspondante dans `active_timers` est supprimée par son `id`
- **THEN** le timer disparaît de la liste

### Requirement: Persistance de tous les timers actifs
Tous les timers actifs DOIVENT survivre à un rafraîchissement de la page.

#### Scenario: Restauration de plusieurs timers après refresh
- **WHEN** l'utilisateur rafraîchit la page avec 3 timers actifs
- **THEN** les 3 timers sont restaurés avec leur temps écoulé correct calculé depuis leur `started_at` respectif

### Requirement: Un seul pendingStop à la fois
Le système DOIT permettre un seul timer en état de notation (pendingStop) à la fois.

#### Scenario: Tentative d'arrêt d'un second timer pendant notation
- **WHEN** un timer est en cours de notation (modale ouverte) et l'utilisateur clique Stop sur un autre timer
- **THEN** le second Stop est ignoré ou désactivé jusqu'à ce que la notation en cours soit terminée
