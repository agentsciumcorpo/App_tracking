## ADDED Requirements

### Requirement: Date display on task entries
The system SHALL display the date and time of each task in the history list.

#### Scenario: Date shown on each task
- **WHEN** a task is displayed in the history
- **THEN** the task entry shows the date in "DD/MM/YYYY HH:MM" format derived from `ended_at`

### Requirement: Time period filter
The system SHALL allow the user to filter the task history by time period: "Aujourd'hui", "Cette semaine", or "Tout".

#### Scenario: Filter by today
- **WHEN** the user selects "Aujourd'hui"
- **THEN** only tasks with `ended_at` on the current calendar day are displayed

#### Scenario: Filter by this week
- **WHEN** the user selects "Cette semaine"
- **THEN** only tasks with `ended_at` within the current calendar week (Monday to Sunday) are displayed

#### Scenario: Show all tasks
- **WHEN** the user selects "Tout" or no period filter is active
- **THEN** all tasks are displayed (default behavior)

### Requirement: Combined filters
The system SHALL allow time period and project filters to be applied simultaneously.

#### Scenario: Filter by project and time period
- **WHEN** the user selects a project filter AND a time period filter
- **THEN** only tasks matching both criteria are displayed
