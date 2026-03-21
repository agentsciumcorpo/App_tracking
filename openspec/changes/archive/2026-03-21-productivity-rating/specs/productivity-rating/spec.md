## ADDED Requirements

### Requirement: Rating modal on timer stop
The system SHALL display a rating modal when the user stops the timer, allowing them to rate their productivity from 1 to 5 stars before the task is saved.

#### Scenario: Modal appears on stop
- **WHEN** the user clicks Stop while the timer is running
- **THEN** the timer stops visually and a modal appears with a 1-5 star selector

#### Scenario: Submit rating
- **WHEN** the user selects a rating (1-5) and clicks "Enregistrer"
- **THEN** the task is saved with the selected rating and the modal closes

#### Scenario: Skip rating
- **WHEN** the user clicks "Passer" without selecting a rating
- **THEN** the task is saved with no rating (NULL) and the modal closes

### Requirement: Star selector component
The system SHALL provide a clickable star selector displaying 5 stars, where clicking a star selects that rating (1-5).

#### Scenario: Star selection
- **WHEN** the user clicks the 3rd star
- **THEN** stars 1-3 are highlighted and the rating value is 3

#### Scenario: Change selection
- **WHEN** the user has selected 3 stars and clicks the 5th star
- **THEN** stars 1-5 are highlighted and the rating value changes to 5

### Requirement: Edit rating in history
The system SHALL allow the user to modify the rating of a completed task from the history view.

#### Scenario: Add rating to unrated task
- **WHEN** the user clicks the rating area on a task with no rating
- **THEN** a star selector appears and the user can set a rating

#### Scenario: Change existing rating
- **WHEN** the user clicks the rating area on a task with an existing rating
- **THEN** a star selector appears pre-filled with the current rating, and the user can change it

#### Scenario: Rating persisted
- **WHEN** the user selects a new rating in the history
- **THEN** the rating is saved to the database and the display updates immediately

### Requirement: Rating is optional
The system SHALL NOT require a rating. Tasks without a rating MUST be stored with a NULL rating value.

#### Scenario: Task saved without rating
- **WHEN** a task is completed without a rating
- **THEN** the task record has `rating = NULL` in the database

### Requirement: Rating data validation
The system SHALL enforce that rating values are integers between 1 and 5 inclusive.

#### Scenario: Invalid rating rejected
- **WHEN** a rating value outside 1-5 is submitted
- **THEN** the database rejects the value via CHECK constraint
