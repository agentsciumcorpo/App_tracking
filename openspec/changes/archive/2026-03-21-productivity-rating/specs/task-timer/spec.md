## MODIFIED Requirements

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
