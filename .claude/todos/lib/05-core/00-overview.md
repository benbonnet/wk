# Core Pack - Execution Blueprint

## Overview

Self-contained pack extending `ruby_llm-schema` with:

- Schema DSL (relationships, translations, registry)
- Relationship management (registry, service, auto-inverse)
- Tool abstraction (base, routing DSL, registry)
- Feature registry (discovery, routing integration)
- Dynamic routing via `packs-rails` auto-loaded routes
- Rake tasks for per-pack frontend mock generation

## Key Insight

`packs-rails` automatically loads `config/routes.rb` from each pack:

- No manual route registration in main `config/routes.rb`
- `packs/core/config/routes.rb` defines dynamic resource routing
- Each feature pack can optionally define additional routes

## Per-Pack Frontend Mocks

Each pack owns its frontend test mocks:

```bash
bin/rails core:export_mocks[contacts_service]
```

Output:
```
packs/contacts_service/
└── app/frontend/
    ├── __tests__/mocks/
    │   ├── schemas.json
    │   ├── relationships.json
    │   ├── features.json
    │   └── views/
    └── types/generated/
        └── schemas.ts
```

## Directory Structure

```
packs/core/
├── package.yml
├── config/
│   └── routes.rb
├── lib/
│   ├── core.rb
│   └── tasks/
│       └── core.rake
├── app/
│   ├── controllers/core/
│   │   └── resources_controller.rb
│   ├── models/concerns/core/
│   │   └── has_relationships.rb
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
│       │   └── routing.rb
│       └── features/
│           └── registry.rb
└── spec/
    └── ...
```

## Execution Order

1. `01-package-setup.md` - Package configuration + directory structure
2. `02-schema-translations.md` - Translations module
3. `03-schema-relationships.md` - Relationships DSL
4. `04-schema-base.md` - Extended Schema base class
5. `05-schema-registry.md` - Schema discovery/registry
6. `06-relationships-registry.md` - Relationship type registry
7. `07-relationships-service.md` - Relationship CRUD service
8. `08-tools-routing.md` - Tool routing DSL
9. `09-tools-base.md` - Base tool class
10. `10-features-registry.md` - Feature registry
11. `11-has-relationships-concern.md` - Model concern
12. `12-resources-controller.md` - Dynamic controller
13. `13-routes.md` - Pack routes (auto-loaded)
14. `14-rake-tasks.md` - Per-pack mock generation
15. `15-example-usage.md` - contacts_service example
16. `16-spec-helper.md` - Shared examples, factories

## Notes

- Rails autoloading handles all requires
- Schemas auto-register on inheritance
- Mocks output to each pack's own `app/frontend/__tests__/mocks/`
