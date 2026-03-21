## ADDED Requirements

### Requirement: Project selection before starting timer
The system SHALL require the user to select a project before starting a task timer.

#### Scenario: Start timer with project selected
- **WHEN** the user has entered a task name and selected a project, then clicks Start
- **THEN** the timer starts and the selected project is persisted with the active timer

#### Scenario: Start timer without project
- **WHEN** the user attempts to start the timer without selecting a project
- **THEN** the system prevents the start and displays a validation message

### Requirement: Project persisted in active timer
The system SHALL store the selected `project_id` in the `active_timers` table so it survives page refresh.

#### Scenario: Timer restoration with project
- **WHEN** the user refreshes the page while a timer is running
- **THEN** the timer is restored with the correct project association displayed

### Requirement: Project propagated to completed task
The system SHALL copy the `project_id` from `active_timers` to the `tasks` table when a timer is completed.

#### Scenario: Task completion stores project
- **WHEN** the user stops the timer
- **THEN** the completed task record includes the `project_id` from the active timer

### Requirement: Project displayed on active timer
The system SHALL display the project name and color indicator alongside the running timer.

#### Scenario: Active timer shows project
- **WHEN** a timer is running
- **THEN** the project name and color badge are visible next to the task name
