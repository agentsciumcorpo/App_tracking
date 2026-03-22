## ADDED Requirements

### Requirement: Edit task duration
The system SHALL allow the user to edit the duration of a completed task from the history view.

#### Scenario: Edit duration inline
- **WHEN** the user clicks on the duration of a task
- **THEN** an input field appears allowing the user to enter a new duration in minutes

#### Scenario: Save edited duration
- **WHEN** the user confirms the new duration (Enter or blur)
- **THEN** the duration is updated in the database and the display refreshes

#### Scenario: Invalid duration rejected
- **WHEN** the user enters a non-numeric or negative value
- **THEN** the edit is cancelled and the original value is restored

### Requirement: Delete task
The system SHALL allow the user to delete a completed task from the history view.

#### Scenario: Delete with confirmation
- **WHEN** the user clicks the delete button on a task
- **THEN** a confirmation dialog appears asking to confirm the deletion

#### Scenario: Confirm deletion
- **WHEN** the user confirms the deletion
- **THEN** the task is removed from the database and disappears from the list

#### Scenario: Cancel deletion
- **WHEN** the user cancels the deletion dialog
- **THEN** the task remains unchanged

### Requirement: Edit task rating
The system SHALL continue to allow inline rating editing as previously implemented.

#### Scenario: Rating edit in enhanced history
- **WHEN** the user clicks the rating area on a task
- **THEN** a star selector appears allowing the user to change the rating
