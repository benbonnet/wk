# Core Pack - Execution Blueprint

## Overview

Self-contained pack extending `ruby_llm-schema` with:
- Schema DSL (relationships, translations, registry)
- Relationship management (registry, service, auto-inverse)
- Tool abstraction (base, routing DSL, registry)
- Feature registry (discovery, routing integration)

## Directory Structure

```
packs/core/
├── package.yml
├── lib/
│   └── core.rb
├── app/
│   └── lib/core/
│       ├── schema/
│       │   ├── base.rb
│       │   ├── relationships.rb
│       │   ├── translations.rb
│       │   └── registry.rb
│       ├── relationships/
│       │   ├── registry.rb
│       │   └── service.rb
│       ├── tools/
│       │   ├── base.rb
│       │   ├── routing.rb
│       │   └── registry.rb
│       └── features/
│           └── registry.rb
├── app/models/core/concerns/
│   └── has_relationships.rb
├── app/controllers/core/
│   └── resources_controller.rb
└── spec/
    ├── spec_helper.rb
    ├── lib/core/
    │   ├── schema/
    │   │   ├── base_spec.rb
    │   │   ├── relationships_spec.rb
    │   │   ├── translations_spec.rb
    │   │   └── registry_spec.rb
    │   ├── relationships/
    │   │   ├── registry_spec.rb
    │   │   └── service_spec.rb
    │   ├── tools/
    │   │   ├── base_spec.rb
    │   │   ├── routing_spec.rb
    │   │   └── registry_spec.rb
    │   └── features/
    │       └── registry_spec.rb
    └── models/core/concerns/
        └── has_relationships_spec.rb
```

## Execution Order

1. `01-package-setup.md` - Package configuration
2. `02-schema-translations.md` - Translations module
3. `03-schema-relationships.md` - Relationships DSL
4. `04-schema-base.md` - Extended Schema base class
5. `05-schema-registry.md` - Schema discovery/registry
6. `06-relationships-registry.md` - Relationship type registry
7. `07-relationships-service.md` - Relationship CRUD service
8. `08-tools-routing.md` - Tool routing DSL
9. `09-tools-base.md` - Base tool class
10. `10-tools-registry.md` - Tool discovery/registry
11. `11-features-registry.md` - Feature registry
12. `12-has-relationships-concern.md` - Model concern
13. `13-resources-controller.md` - Dynamic controller
14. `14-entrypoint.md` - Main lib/core.rb
15. `15-integration.md` - Rails integration (routes, initializer)

## Dependencies

- `ruby_llm-schema` gem (already in Gemfile)
- `ui` pack (for view integration)
