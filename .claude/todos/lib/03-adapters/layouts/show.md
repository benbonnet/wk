# SHOW Adapter

## Purpose

Display-only layout for viewing record details. Renders fields in read-only mode.

## Registry Interface

```ts
export interface ShowProps extends BaseRendererProps {
  data?: Record<string, unknown>;
}
```

## shadcn Components Used

- `Card`, `CardHeader`, `CardContent` (optional wrapper)
- `Separator`
- Display components via child adapters

## Implementation

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@ui-components/ui/card";
import type { ShowProps } from "@ui/registry";

interface ShowContextValue {
  data: Record<string, unknown>;
}

export const ShowContext = createContext<ShowContextValue | null>(null);

export function ShowAdapter({ schema, data = {}, children }: ShowProps) {
  return (
    <ShowContext.Provider value={{ data }}>
      <div className={cn("space-y-6", schema.className)}>
        {children}
      </div>
    </ShowContext.Provider>
  );
}

// Hook for child components to access show data
export function useShowData() {
  const ctx = useContext(ShowContext);
  if (!ctx) throw new Error("useShowData must be used within ShowAdapter");
  return ctx.data;
}
```

## With Card Wrapper

```tsx
export function ShowAdapter({ schema, data = {}, children }: ShowProps) {
  return (
    <ShowContext.Provider value={{ data }}>
      <Card className={schema.className}>
        {schema.title && (
          <CardHeader>
            <CardTitle>{schema.title}</CardTitle>
          </CardHeader>
        )}
        <CardContent className="space-y-4">
          {children}
        </CardContent>
      </Card>
    </ShowContext.Provider>
  );
}
```

## Schema Example

```json
{
  "type": "SHOW",
  "elements": [
    { "type": "GROUP", "label": "Basic Info", "elements": [
      { "type": "COMPONENT", "name": "email", "kind": "DISPLAY_TEXT", "label": "Email" },
      { "type": "COMPONENT", "name": "status", "kind": "DISPLAY_BADGE", "label": "Status" }
    ]},
    { "type": "GROUP", "label": "Metadata", "elements": [
      { "type": "COMPONENT", "name": "created_at", "kind": "DISPLAY_DATETIME", "label": "Created" },
      { "type": "COMPONENT", "name": "updated_at", "kind": "DISPLAY_DATETIME", "label": "Updated" }
    ]}
  ]
}
```

## Notes

- ShowContext provides data to all child DISPLAY_* components
- Works well with GROUP adapter for organized sections
- Read-only mode - no form state needed
