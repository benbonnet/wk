# Frontend Conventions

## Domain Packs (`packs/*_{service,workflow}/app/frontend/`)

Each domain pack (service or workflow) contains domain-specific frontend code.

```
packs/{name}_{service,workflow}/app/frontend/
├── api/              # API hooks (react-query)
│   └── index.ts      # useXxx() query hooks
├── views/            # Page components
│   └── index/        # Route-specific views
│       └── index.tsx
└── __tests__/        # Integration tests
```

### Example: `activities_service`

```typescript
// api/index.ts
import { useQuery } from "@tanstack/react-query";

export function useActivities(limit = 50) {
  return useQuery({
    queryKey: ["activities", limit],
    queryFn: () => fetchActivities(limit),
  });
}
```

```typescript
// views/index/index.tsx
import { useActivities } from "../api";

export default function ActivitiesIndex() {
  const { data } = useActivities();
  // ...
}
```

## UI Pack (`packs/ui/app/frontend/`)

Shared UI library - components, adapters, and rendering engine.

```
packs/ui/app/frontend/
├── adapters/           # UI renderer adapters (inputs, displays, layouts)
│   ├── text-input.tsx
│   ├── custom/         # Complex adapters (form, table, view)
│   └── index.ts
├── app-components/     # Shadcn blocks & custom app components
│   ├── app-sidebar.tsx
│   └── nav-*.tsx
├── components/         # Shadcn primitives ONLY
│   ├── button.tsx
│   ├── sidebar.tsx
│   └── ...
├── hooks/              # UI hooks
│   └── use-mobile.ts
└── lib/
    ├── index.ts        # Re-exports from ui-renderer
    ├── utils.ts        # cn() utility
    └── ui-renderer/    # Core rendering engine
        ├── provider.tsx
        ├── registry.ts
        ├── renderer.tsx
        ├── resolver.ts
        └── types.ts
```

### Key Rules

1. **`components/`** - Shadcn primitives only, no custom code
2. **`app-components/`** - Shadcn blocks + custom layout components
3. **`adapters/`** - UI renderer adapters that bridge schema to components
4. **`lib/ui-renderer/`** - Core rendering engine, provider, types

## Main App (`app/frontend/`)

Application shell - routing, providers, global config.

```
app/frontend/
├── api/              # Global API utilities
│   ├── auth.ts       # getCurrentUser, login/logout URLs
│   └── utils.ts
├── controllers/      # Stimulus controllers (if any)
├── entrypoints/      # Vite entry points
│   ├── application.css
│   └── main.tsx      # React root, routing
├── hooks/            # App-level hooks
│   └── use-auth.ts
├── lib/              # App utilities
│   └── utils.ts
├── providers/        # React context providers
│   └── ui-provider.tsx
├── types/            # TypeScript types
│   └── api/          # Auto-generated API types (Typelizer)
└── views/            # App shell views
    └── layout.tsx    # Main layout with sidebar
```

### Entry Point (`main.tsx`)

```typescript
import Layout from "@/views/layout";
import { AppUIProvider } from "@/providers/ui-provider";
import ActivitiesIndex from "@packs/activities_service/app/frontend/views/index";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter basename="/app">
      <AppUIProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<ActivitiesIndex />} />
          </Route>
        </Routes>
      </AppUIProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
```

## Import Aliases

| From              | Import As                                            |
| ----------------- | ---------------------------------------------------- |
| Main app          | `@/views/layout`                                     |
| Service pack      | `@packs/activities_service/app/frontend/views/index` |
| UI exports        | `@ui` or `@ui/lib/ui-renderer/...`                   |
| Shadcn primitives | `@ui-components/button`                              |
| UI hooks          | `@ui-hooks/use-mobile`                               |
