## Context

Les tâches complétées stockent actuellement : nom, projet, durée, timestamps. Il manque une dimension qualitative. La RPC `complete_timer` finalise la tâche en un seul appel atomique (delete active_timer + insert task). Le flux actuel du stop est immédiat : clic Stop → RPC → reset formulaire.

## Goals / Non-Goals

**Goals:**
- Permettre à l'utilisateur de noter sa productivité (1-5) au moment du stop
- Rendre la note modifiable depuis l'historique
- Garder la note optionnelle (l'utilisateur peut passer)

**Non-Goals:**
- Calcul de moyennes ou statistiques par projet (sera dans le changement "analyse IA")
- Notes textuelles ou commentaires sur les tâches
- Notation automatique basée sur la durée

## Decisions

### 1. Modale de notation au stop du timer

Au clic sur Stop, le timer s'arrête visuellement mais la RPC n'est pas encore appelée. Une modale s'affiche avec un sélecteur 1-5 étoiles et deux boutons : "Enregistrer" et "Passer". Dans les deux cas, la RPC est appelée (avec ou sans rating).

**Rationale** : Séparer l'arrêt visuel de la persistance permet à l'utilisateur de noter sans pression temporelle. La modale est non-bloquante (on peut passer).

**Alternative considérée** : Ajouter le rating inline après le stop. Rejeté car le formulaire est déjà reset, ce serait une UX confuse.

### 2. Colonne `rating` nullable sur `tasks`

La colonne `rating` est de type `smallint`, nullable, avec contrainte CHECK (1-5). NULL signifie "non renseigné".

**Rationale** : Plus simple qu'une valeur sentinelle (0 ou -1). NULL est sémantiquement correct pour "non renseigné".

### 3. Ajout du paramètre `p_rating` à la RPC `complete_timer`

La RPC existante reçoit un paramètre supplémentaire `p_rating` (smallint, nullable).

**Rationale** : Conserver l'atomicité de la finalisation (delete + insert en une transaction).

### 4. Édition de la note via update direct sur `tasks`

L'édition depuis l'historique fait un simple `UPDATE tasks SET rating = X WHERE id = Y`. Pas de RPC dédiée nécessaire, les RLS protègent déjà l'accès.

**Rationale** : Simplicité maximale. La RLS garantit que l'utilisateur ne modifie que ses propres tâches.

## Risks / Trade-offs

- **[Modale interrompue par refresh]** → Si l'utilisateur refresh pendant la modale, le timer actif est toujours dans `active_timers`. Au prochain chargement, le timer reprend. Pas de perte de données.
- **[UX du "Passer"]** → L'utilisateur pourrait oublier de noter. C'est acceptable car la note est explicitement optionnelle.
