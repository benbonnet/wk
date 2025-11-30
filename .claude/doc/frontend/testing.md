# Frontend Testing

## Mock Generation

Frontend integration tests use JSON fixtures exported from backend definitions.

### Generate Mocks

```bash
rake core:export_mocks
```

**Output:** `packs/{pack}/app/frontend/__tests__/mocks/`

```
mocks/
  schemas.json        # Schema definitions
  relationships.json  # Relationship definitions
  features.json       # Feature registry (tools + routes)
  views/
    contacts_index.json
    contacts_show.json
    contacts_form.json
```

### When to Regenerate

Run after changing:

- Schema definitions (`*_schema.rb`)
- View definitions (`views/*.rb`)
- Tool definitions (`tools/*.rb`)
- Relationships

### Source Mapping

| Mock File            | Backend Source                             |
| -------------------- | ------------------------------------------ |
| `schemas.json`       | `Core::Schema::Registry.to_mock_data`      |
| `relationships.json` | `Core::Relationships::Registry.for_schema` |
| `features.json`      | `Core::Features::Registry.all`             |
| `views/*.json`       | `view_class.view_config`                   |

---

## Test Structure

```
packs/{pack}/app/frontend/__tests__/
  integrations/
    phase-01-resolver.test.ts
    phase-02-displays.test.tsx
    ...
    test-utils.tsx
  mocks/
    schemas.json
    views/
      {feature}_{view}.json
```

### Test Utils

```typescript
import { createMockServices, TestWrapper, schema, data } from "./test-utils";
```

---

## Workflow

1. **Build backend** - Define schemas, views, tools
2. **Export mocks** - `rake core:export_mocks`
3. **Write tests** - Import mocks, test with real components
4. **Iterate** - Change backend → re-export → tests update

---

## Running Tests

```bash
yarn test                    # All tests
yarn test --run              # Single run (no watch)
yarn test path/to/test.tsx   # Specific file
```
