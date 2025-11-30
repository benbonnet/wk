# Frontend Routing

Two routing mechanisms:

1. **Backend-Driven Routes** — Schema-driven views defined in Ruby, rendered via `DynamicRenderer`
2. **Pack-Declared Routes** — Frontend-only views (React components) declared per-pack

---

# Backend-Driven Routes

Convention-based routing driven by backend view definitions.

## basename

React Router uses `basename="/app"`. All routes are relative to this.

- `frontend_route "/contacts"` → URL `/app/contacts`
- `<Link to="/contacts">` → navigates to `/app/contacts`

**Never prefix routes with `/app`.**

## How It Works

```
1. Backend View defines:     frontend_route "/contacts"

2. Frontend fetches:         GET /api/v1/routes
                             → [{ path: "/contacts", ... }]

3. Routes generated:         <Route path="/contacts" element={<ViewPage />} />

4. ViewPage fetches:         GET /api/v1/views/workspaces/contacts/index

5. DynamicRenderer:          Renders the schema
```

## No Manual Routes

Routes are **not** hardcoded in `main.tsx`. They're generated from the backend manifest.

**Before (manual):**

```tsx
<Route path="/contacts" element={<ContactsIndex />} />
<Route path="/rib-checks" element={<RibChecksIndex />} />
```

**After (convention):**

```tsx
<Route path="*" element={<DynamicViewLoader />} />;
// or
{
  routes.map((r) => <Route path={r.path} element={<ViewPage {...r} />} />);
}
```

---

## Key Files

```
packs/ui/app/frontend/
  hooks/
    use-routes.ts         ← route manifest hook
  lib/
    ui-renderer/
      view-page.tsx       ← generic view page component
```

### use-routes.ts

**Location:** `@ui/hooks/use-routes.ts`

```typescript
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface RouteEntry {
  path: string;
  namespace: string;
  feature: string;
  view: string;
}

export function useRoutes() {
  return useQuery({
    queryKey: ["routes"],
    queryFn: async () => {
      const { data } = await axios.get<{ routes: RouteEntry[] }>(
        "/api/v1/routes",
      );
      return data.routes;
    },
    staleTime: Infinity,
  });
}
```

### view-page.tsx

**Location:** `@ui/lib/ui-renderer/view-page.tsx`

```typescript
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DynamicRenderer } from "./renderer";

interface ViewPageProps {
  namespace: string;
  feature: string;
  view: string;
}

export function ViewPage({ namespace, feature, view }: ViewPageProps) {
  const params = useParams();

  const { data: schema, isLoading } = useQuery({
    queryKey: ["view", namespace, feature, view, params],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/v1/views/${namespace}/${feature}/${view}`,
        { params }
      );
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!schema) return <div>View not found</div>;

  return <DynamicRenderer schema={schema} />;
}
```

### main.tsx

**Location:** `app/frontend/entrypoints/main.tsx`

```typescript
import { useRoutes } from "@ui/hooks/use-routes";
import { ViewPage } from "@ui/lib/ui-renderer/view-page";

function AppRoutes() {
  const { data: routes, isLoading } = useRoutes();

  if (isLoading) return <LoadingScreen />;

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        {routes?.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ViewPage
                namespace={route.namespace}
                feature={route.feature}
                view={route.view}
              />
            }
          />
        ))}
      </Route>
    </Routes>
  );
}
```

---

## Route Params

Routes with params (e.g., `/contacts/:id`) pass params to the view.

**Backend:**

```ruby
frontend_route "/contacts/:id"
```

**Frontend:**

```typescript
const params = useParams(); // { id: "123" }
// Passed to API: GET /api/v1/views/workspaces/contacts/show?id=123
```

---

## Menu Alignment

Menu URLs use paths without `/app` prefix (basename handles it):

```typescript
// layout.tsx
const menuOptions = [
  {
    title: "Applications",
    items: [
      { title: "Contacts", url: "/contacts" },
      { title: "RIB Checks", url: "/rib-checks" },
    ],
  },
];
```

---

## Adding a New Route

1. **Backend:** Add `frontend_route` to view

   ```ruby
   # packs/my_service/views/index.rb
   view do
     frontend_route "/my-feature"
     # ...
   end
   ```

2. **Menu (optional):** Add to layout.tsx

   ```typescript
   items: [{ title: "My Feature", url: "/my-feature" }];
   ```

3. **Done.** No frontend route changes needed.

---

## API Endpoints

| Endpoint                               | Purpose                 |
| -------------------------------------- | ----------------------- |
| `GET /api/v1/routes`                   | List all routable views |
| `GET /api/v1/views/:ns/:feature/:view` | Fetch view schema       |

---

## Caching

- Routes manifest: `staleTime: Infinity` (doesn't change at runtime)
- View schemas: Standard query caching with params as key

---

# Pack-Declared Routes

Frontend-only views that don't use the schema-driven renderer. Used for custom pages like import wizards, dashboards, or any view that needs direct React control.

## Convention

Each pack can declare static routes in:

```
packs/{pack}/app/frontend/config/routes.ts
```

## Route Definition

**Location:** `packs/contacts_service/app/frontend/config/routes.ts`

```typescript
import { lazy } from "react";

const ContactsImport = lazy(
  () => import("../views/import")
);

export const routes = [
  {
    path: "/contacts/import",
    element: ContactsImport,
  },
];
```

## View Location

Frontend-only views live in the pack's `views/` directory:

```
packs/{pack}/app/frontend/
  config/
    routes.ts           ← route declarations
  views/
    import/
      index.tsx         ← the view component
      components/       ← view-specific components (optional)
```

## Main Router Integration

Pack routes are imported manually in `main.tsx`:

**Location:** `app/frontend/entrypoints/main.tsx`

```typescript
import { routes as contactsRoutes } from "@packs/contacts_service/app/frontend/config/routes";
// ... other pack routes

const packRoutes = [
  ...contactsRoutes,
  // ...other packs
];

function AppRoutes() {
  const { data: backendRoutes, isLoading } = useRoutes();

  if (isLoading) return <LoadingScreen />;

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />

        {/* Backend-driven routes */}
        {backendRoutes?.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ViewPage
                namespace={route.namespace}
                feature={route.feature}
                view={route.view}
              />
            }
          />
        ))}

        {/* Pack-declared routes */}
        {packRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.element />}
          />
        ))}
      </Route>
    </Routes>
  );
}
```

## Adding a Pack-Declared Route

1. **Create the view:**

   ```
   packs/my_service/app/frontend/views/my-feature/index.tsx
   ```

2. **Declare the route:**

   ```typescript
   // packs/my_service/app/frontend/config/routes.ts
   import { lazy } from "react";

   const MyFeature = lazy(() => import("../views/my-feature"));

   export const routes = [
     { path: "/my-feature", element: MyFeature },
   ];
   ```

3. **Import in main.tsx:**

   ```typescript
   import { routes as myServiceRoutes } from "@packs/my_service/app/frontend/config/routes";
   ```

4. **Menu (optional):** Add to layout.tsx

---

## When to Use Each Type

| Use Case | Route Type |
|----------|------------|
| CRUD list/detail pages | Backend-driven |
| Schema-driven forms | Backend-driven |
| Import wizards | Pack-declared |
| Custom dashboards | Pack-declared |
| Complex multi-step flows | Pack-declared |
| Static/marketing pages | Pack-declared |
