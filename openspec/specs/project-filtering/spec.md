## ADDED Requirements

### Requirement: Filter tasks by project in history
The system SHALL allow the user to filter the task history by one or more projects.

#### Scenario: Filter by single project
- **WHEN** the user selects a project in the history filter
- **THEN** only tasks associated with that project are displayed

#### Scenario: Clear project filter
- **WHEN** the user clears the project filter
- **THEN** all tasks are displayed regardless of project

#### Scenario: Filter shows project colors
- **WHEN** the task list is displayed
- **THEN** each task shows its project name and color indicator
