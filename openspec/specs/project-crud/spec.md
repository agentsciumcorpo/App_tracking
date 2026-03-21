## ADDED Requirements

### Requirement: User can create a project
The system SHALL allow a user to create a project with a name and a color chosen from the predefined palette.

#### Scenario: Successful project creation
- **WHEN** the user submits a project name and selects a color
- **THEN** the system creates the project and it appears in the project list

#### Scenario: Project name is required
- **WHEN** the user attempts to create a project with an empty name
- **THEN** the system rejects the creation and displays a validation error

#### Scenario: Project name max length
- **WHEN** the user enters a project name longer than 100 characters
- **THEN** the system rejects the creation and displays a validation error

### Requirement: User can view their projects
The system SHALL display a list of all projects belonging to the authenticated user, showing name and color for each.

#### Scenario: Project list display
- **WHEN** the user navigates to the projects page
- **THEN** the system displays all their projects with name and color indicator

#### Scenario: No projects yet
- **WHEN** the user has no projects besides the default "Sans projet"
- **THEN** the system displays an empty state encouraging project creation

### Requirement: User can update a project
The system SHALL allow a user to update the name and color of an existing project.

#### Scenario: Rename a project
- **WHEN** the user changes a project's name and saves
- **THEN** the project name is updated everywhere it appears

#### Scenario: Change project color
- **WHEN** the user selects a different color for a project
- **THEN** the project color is updated everywhere it appears

### Requirement: User can delete a project
The system SHALL allow a user to delete a project only if no tasks are associated with it.

#### Scenario: Delete project with no tasks
- **WHEN** the user deletes a project that has no associated tasks
- **THEN** the project is removed from the list

#### Scenario: Delete project with tasks
- **WHEN** the user attempts to delete a project that has associated tasks
- **THEN** the system rejects the deletion and informs the user to reassign tasks first

#### Scenario: Default project cannot be deleted
- **WHEN** the user attempts to delete the "Sans projet" default project
- **THEN** the system rejects the deletion

### Requirement: Predefined color palette
The system SHALL offer exactly 10 predefined colors: blue, purple, pink, red, orange, yellow, green, teal, indigo, gray.

#### Scenario: Color selection
- **WHEN** the user creates or edits a project
- **THEN** the system presents exactly 10 color options to choose from

### Requirement: Project data isolation
The system SHALL enforce RLS so that users can only access their own projects.

#### Scenario: User cannot see other users' projects
- **WHEN** a user queries the projects table
- **THEN** only projects where `user_id` matches the authenticated user are returned
