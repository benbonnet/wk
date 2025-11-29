# Frontend Configuration

## Path Alias

**Single source of truth.** This alias MUST be identical in `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`.

```
@ui/ → ./packs/ui/app/frontend/
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@ui/*": ["./packs/ui/app/frontend/*"]
    }
  }
}
```

### vite.config.ts

```js
resolve: {
  alias: {
    "@ui/": `${path.resolve(__dirname, "./packs/ui/app/frontend/")}/`,
  }
}
```

### vitest.config.ts

```js
resolve: {
  alias: {
    "@ui/": `${path.resolve(dirname, "./packs/ui/app/frontend/")}/`,
  }
}
```

## Import Examples

| Import                         | Resolves To                                            |
| ------------------------------ | ------------------------------------------------------ |
| `@ui/lib/utils`                | `packs/ui/app/frontend/lib/utils.ts`                   |
| `@ui/lib/ui-renderer/provider` | `packs/ui/app/frontend/lib/ui-renderer/provider.tsx`   |
| `@ui/components/button`        | `packs/ui/app/frontend/components/button.tsx`          |
| `@ui/adapters`                 | `packs/ui/app/frontend/adapters/index.ts`              |
| `@ui/hooks/use-mobile`         | `packs/ui/app/frontend/hooks/use-mobile.ts`            |
| `@ui/app-components/layout`    | `packs/ui/app/frontend/app-components/layout/index.ts` |

## Shadcn Configuration

Shadcn uses `components.json` with **file paths** (not TS aliases):

```json
{
  "aliases": {
    "components": "packs/ui/app/frontend/app-components",
    "ui": "packs/ui/app/frontend/components",
    "utils": "packs/ui/app/frontend/lib/utils",
    "lib": "packs/ui/app/frontend/lib",
    "hooks": "packs/ui/app/frontend/hooks"
  }
}
```

Shadcn-generated files import using literal paths. Vite resolves them.

## Directory Structure

```
packs/ui/app/frontend/
├── adapters/           # UI renderer adapters
├── app-components/     # Shadcn blocks + custom components
├── components/         # Shadcn primitives ONLY
├── hooks/              # UI hooks
└── lib/
    ├── index.ts
    ├── utils.ts
    └── ui-renderer/
```

---

## TODO: Migration to Single Alias

### Config Files

- [ ] `tsconfig.json` - remove `@/`, `@packs/`, `@ui-components/`, keep only `@ui/*`
- [ ] `vite.config.ts` - remove all aliases except `@ui/`
- [ ] `vitest.config.ts` - remove all aliases except `@ui/`

### Import Changes: `@ui-components/` → `@ui/components/`

**packs/ui/app/frontend/adapters/**

- [ ] `textarea.tsx`
- [ ] `select.tsx`
- [ ] `boolean-display.tsx`
- [ ] `text-display.tsx`
- [ ] `button.tsx`
- [ ] `card-group.tsx`
- [ ] `tags-input.tsx`
- [ ] `rich-text-input.tsx`
- [ ] `alert.tsx`
- [ ] `datetime-display.tsx`
- [ ] `page.tsx`
- [ ] `datetime-input.tsx`
- [ ] `tags-display.tsx`
- [ ] `display-array.tsx`
- [ ] `checkbox.tsx`
- [ ] `radios.tsx`
- [ ] `drawer.tsx`
- [ ] `submit.tsx`
- [ ] `show.tsx`
- [ ] `longtext-display.tsx`
- [ ] `text-input.tsx`
- [ ] `dropdown.tsx`
- [ ] `number-display.tsx`
- [ ] `search.tsx`
- [ ] `date-display.tsx`
- [ ] `multistep.tsx`
- [ ] `date-input.tsx`
- [ ] `select-display.tsx`
- [ ] `option.tsx`
- [ ] `link.tsx`
- [ ] `checkboxes.tsx`
- [ ] `drawer.stories.tsx`
- [ ] `dropdown.stories.tsx`
- [ ] `actions.stories.tsx`
- [ ] `page.stories.tsx`

**packs/ui/app/frontend/adapters/custom/**

- [ ] `view/view.tsx`
- [ ] `table/table.tsx`
- [ ] `form/form-array.tsx`
- [ ] `relationship-picker/create-drawer.tsx`

**packs/ui/app/frontend/adapters/**tests**/**

- [ ] `test-utils.tsx`

**packs/ui/app/frontend/app-components/layout/**

- [ ] `sidebar-cta.tsx`
- [ ] `nav-main.tsx`
- [ ] `workspace-switcher.tsx`
- [ ] `nav-user.tsx`

**packs/ui/app/frontend/components/**

- [ ] `form.tsx`
- [ ] `command.tsx`
- [ ] `calendar.tsx`

**packs/ui/app/frontend/lib/ui-renderer/**tests**/**

- [ ] `renderer-rules.test.tsx`
- [ ] `renderer.test.tsx`

**packs/contacts_service/app/frontend/**tests**/integrations/**

- [ ] `phase-02-displays.test.tsx`
- [ ] `phase-03-inputs.test.tsx.skip`
- [ ] `phase-04-primitives.test.tsx`
- [ ] `phase-05-layouts.test.tsx.skip`
- [ ] `phase-06-renderer.test.tsx`
- [ ] `phase-07-page.test.tsx`
- [ ] `phase-08-table.test.tsx`
- [ ] `phase-09-form.test.tsx.skip`
- [ ] `phase-10-view.test.tsx`
- [ ] `phase-11-api.test.tsx`
- [ ] `phase-12-fullpage.test.tsx`
- [ ] `phase-13-relationshippicker.test.tsx`
- [ ] `phase-14-formarray.test.tsx.skip`
- [ ] `phase-15-displayarray.test.tsx`
- [ ] `phase-16-multistep.test.tsx`
- [ ] `test-utils.tsx`

**.storybook/**

- [ ] `decorators.tsx`

**app/frontend/**

- [ ] `views/layout.tsx`

### Import Changes: Remove `@packs/` usage

- [ ] `app/frontend/views/layout.tsx` - change `@packs/ui/...` to `@ui/...`
- [ ] `app/frontend/entrypoints/main.tsx` - use relative imports

### Import Changes: Remove `@/` usage

- [ ] `app/frontend/views/layout.tsx` - use relative imports
- [ ] `app/frontend/hooks/use-auth.ts` - use relative imports
- [ ] `app/frontend/views/__tests__/layout.test.tsx` - use relative imports
- [ ] `app/frontend/api/auth.ts` - use relative imports
- [ ] `app/frontend/entrypoints/main.tsx` - use relative imports
