# Project Context

## Project

TenTrix game using:

* React
* TypeScript
* Deno
* Vite

## Architecture

* UI components in frontend/src/components
* Business logic in frontend/src/game
* Hooks in frontend/src/hooks
* Shared types in frontend/src/types

## Rules

* Single-player
* 10x10 board
* 3 shapes at a time
* Clear rows and columns
* Generate new shapes after all 3 are used

## Technical Rules

* Keep game logic separate from UI
* Keep files focused
* Use Deno-compatible imports
* Add tests for business logic
* Avoid unnecessary complexity

# Current Task

Update scoring system.

## New Scoring Rules

* Keep existing placement score
* Add +10 for each cleared row
* Add +10 for each cleared column

Examples:

* 1 row cleared = +10
* 1 column cleared = +10
* 2 rows + 1 column = +30

## Requirements

* Update scoring logic
* Keep logic in business layer
* Update tests
* Ensure simultaneous clears work correctly

## Deliverables

1. Files modified
2. Design decisions
3. Tests added or updated
4. Confirmation all tests pass
