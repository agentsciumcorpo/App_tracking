## MODIFIED Requirements

### Requirement: Timer can be started
The system SHALL allow the user to start a timer by entering a task name, selecting a project, and clicking the start button. The task name MUST be non-empty and at most 200 characters. A project MUST be selected. Only one timer can be active at a time per user.

#### Scenario: Successful start with project
- **WHEN** the user enters a valid task name, selects a project, and clicks start
- **THEN** the timer starts, the elapsed time display begins, and the active timer with project_id is persisted to survive refresh

#### Scenario: Start without project selected
- **WHEN** the user enters a valid task name but no project is selected
- **THEN** the start button is disabled or the system shows a validation error

#### Scenario: Timer restoration includes project
- **WHEN** the user reloads the page with an active timer
- **THEN** the timer resumes with the correct task name, elapsed time, and project association
