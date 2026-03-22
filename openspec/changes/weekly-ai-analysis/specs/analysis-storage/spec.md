## ADDED Requirements

### Requirement: Save analysis to database
The system SHALL persist each generated analysis in the `weekly_analyses` table.

#### Scenario: New analysis saved
- **WHEN** an analysis is generated for a week without a prior analysis
- **THEN** a new record is inserted with user_id, week_start, week_end, and content

#### Scenario: Regenerate analysis
- **WHEN** an analysis is generated for a week that already has an analysis
- **THEN** the existing record is updated (UPSERT) with the new content

### Requirement: Data isolation
The system SHALL enforce RLS so users can only access their own analyses.

#### Scenario: User cannot see other users' analyses
- **WHEN** a user queries the weekly_analyses table
- **THEN** only analyses where `user_id` matches the authenticated user are returned

### Requirement: Unique analysis per week
The system SHALL enforce a unique constraint on `(user_id, week_start)`.

#### Scenario: Duplicate prevention
- **WHEN** an analysis for the same user and week_start exists
- **THEN** the UPSERT replaces the existing content
