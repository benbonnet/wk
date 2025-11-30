# UI Components

This directory contains **only** native shadcn/ui primitive components.

These are low-level, unstyled (or minimally styled) components installed via:

```bash
npx shadcn@latest add <component-name>
```

## Rules

1. **No custom components** - Only shadcn primitives belong here
2. **No business logic** - These are pure UI primitives
3. **No modifications** - Keep them as close to shadcn defaults as possible

## Where to put other components

- **Adapters** (UI renderer components): `packs/ui/app/frontend/adapters/`
- **App components** (layout, navigation, etc.): `packs/ui/app/frontend/app-components/`
