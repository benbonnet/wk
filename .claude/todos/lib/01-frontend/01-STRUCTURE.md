# Phase 1: Frontend Structure Setup

## Goal

Create `packs/ui` package with proper aliases and shadcn reconfiguration.

## Directory Structure

```
packs/
└── ui/
    └── app/
        └── frontend/
            ├── lib/                    # Core UI library (decoupled)
            │   ├── types.ts            # Pure TypeScript interfaces
            │   ├── inventory.json      # Field kind definitions
            │   ├── registry.ts         # Component registry types
            │   ├── provider.tsx        # UIProvider + context
            │   ├── renderer/           # DynamicRenderer logic
            │   └── hooks/              # useUI, useTranslations
            │
            └── components/             # shadcn components
                └── ui/                 # shadcn output dir
                    ├── button.tsx
                    ├── input.tsx
                    └── ...
```

## Tasks

### 1. Create directory structure

```bash
mkdir -p packs/ui/app/frontend/lib
mkdir -p packs/ui/app/frontend/components/ui
```

### 2. Update tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./app/frontend/*"],
      "@ui/*": ["./packs/ui/app/frontend/lib/*"],
      "@ui-components/*": ["./packs/ui/app/frontend/components/*"]
    }
  }
}
```

### 3. Update tsconfig.app.json

Add same paths to `compilerOptions.paths`.

### 4. Update vite.config.ts

```ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./app/frontend"),
    "@ui": path.resolve(__dirname, "./packs/ui/app/frontend/lib"),
    "@ui-components": path.resolve(__dirname, "./packs/ui/app/frontend/components"),
  },
},
```

### 5. Update components.json (shadcn)

```json
{
  "aliases": {
    "components": "@ui-components",
    "ui": "@ui-components/ui",
    "utils": "@ui/utils",
    "lib": "@ui",
    "hooks": "@/hooks"
  },
  "tailwind": {
    "css": "app/frontend/entrypoints/application.css"
  }
}
```

### 6. Move existing shadcn components

```bash
# If any exist in app/frontend/components/ui
mv app/frontend/components/ui/* packs/ui/app/frontend/components/ui/
```

### 7. Create lib/utils.ts for shadcn

```ts
// packs/ui/app/frontend/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Verification

```bash
# Reinstall a shadcn component to verify config
npx shadcn@latest add button --overwrite
# Should install to packs/ui/app/frontend/components/ui/button.tsx
```
