## ADDED Requirements

### Requirement: Trigger weekly analysis
The system SHALL allow the user to trigger an AI analysis for a selected week via a button on the Analysis page.

#### Scenario: Generate analysis for current week
- **WHEN** the user clicks "Analyser cette semaine"
- **THEN** the system calls the Edge Function with the current week's date range
- **THEN** a loading spinner is displayed during generation

#### Scenario: Generate analysis for previous week
- **WHEN** the user selects "Semaine dernière" and clicks the analyze button
- **THEN** the system calls the Edge Function with the previous week's date range

### Requirement: Edge Function calls Anthropic API
The Edge Function SHALL query the user's tasks for the given week, build a structured prompt, and call `claude-sonnet-4-20250514`.

#### Scenario: Successful generation
- **WHEN** the Edge Function receives a valid request with tasks in the week
- **THEN** it builds a prompt with task data grouped by project
- **THEN** it calls the Anthropic API and returns the markdown response

#### Scenario: No tasks in week
- **WHEN** the Edge Function finds zero tasks for the given week
- **THEN** it returns an error: "Aucune tâche cette semaine"

### Requirement: Structured prompt
The prompt SHALL include: total tasks count, total duration, per-project breakdown (name, total duration, task count, average rating), and individual task details.

#### Scenario: Prompt content
- **WHEN** the prompt is built
- **THEN** it contains all task data structured as described
- **THEN** it instructs the AI to return markdown with sections: Résumé, Tendances, Points forts, Axes d'amélioration, Recommandations

### Requirement: Authentication
The Edge Function SHALL authenticate the user via the Supabase JWT and only access that user's data.

#### Scenario: Unauthenticated request
- **WHEN** a request without a valid JWT is sent
- **THEN** the Edge Function returns 401 Unauthorized
