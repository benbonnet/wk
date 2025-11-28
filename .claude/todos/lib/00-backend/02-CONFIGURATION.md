# Phase 2: Configuration Module

## Goal

None. There is no configuration.

## Why No Configuration?

The DSL is pure. It takes no external dependencies:

- ❌ `schema_finder` - Translations are inline
- ❌ `feature_finder` - API registry is inline
- ❌ `inventory_path` - Frontend validates kinds, not backend
- ❌ `validate_kinds` - Not needed

## Result

**Delete this phase.** No configuration module needed.

The DSL just produces JSON. No config. No validation. No external dependencies.
