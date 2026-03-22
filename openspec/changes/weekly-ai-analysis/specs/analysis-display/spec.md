## ADDED Requirements

### Requirement: Analysis page
The system SHALL provide a dedicated Analysis page accessible from the navigation bar.

#### Scenario: Navigate to analysis
- **WHEN** the user clicks "Analyse" in the navigation
- **THEN** the Analysis page is displayed

### Requirement: Week selector
The system SHALL display a selector allowing the user to choose between "Cette semaine" and "Semaine dernière".

#### Scenario: Default selection
- **WHEN** the user opens the Analysis page
- **THEN** "Cette semaine" is selected by default

### Requirement: Display analysis result
The system SHALL render the AI analysis result as formatted markdown in a dedicated panel.

#### Scenario: Analysis displayed
- **WHEN** an analysis has been generated or loaded from history
- **THEN** the markdown content is rendered with proper formatting (headings, lists, bold)

#### Scenario: Loading state
- **WHEN** an analysis is being generated
- **THEN** a spinner with "Analyse en cours..." is displayed

#### Scenario: Error state
- **WHEN** the generation fails
- **THEN** an error message is displayed to the user

### Requirement: Past analyses list
The system SHALL display a list of previously generated analyses below the current analysis panel.

#### Scenario: View past analysis
- **WHEN** the user clicks on a past analysis entry
- **THEN** its content is displayed in the analysis panel

#### Scenario: No past analyses
- **WHEN** the user has no saved analyses
- **THEN** an empty state message is displayed
