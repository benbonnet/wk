# PAGE Adapter

## Purpose

Page layout with title, description, and actions area. Provides consistent page header structure.

## Registry Interface

```ts
export interface PageProps extends BaseRendererProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
}
```

## shadcn Components Used

- `Separator` (optional, for visual division)

## Implementation

```tsx
import { Separator } from "@ui-components/ui/separator";
import type { PageProps } from "@ui/registry";

export function PageAdapter({ schema, title, description, actions, children }: PageProps) {
  const pageTitle = title || schema.title;
  const pageDescription = description || schema.description;

  return (
    <div className={cn("space-y-6", schema.className)}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {pageTitle && (
            <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
          )}
          {pageDescription && (
            <p className="text-sm text-muted-foreground">{pageDescription}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      <Separator />

      {/* Page Content */}
      <div>{children}</div>
    </div>
  );
}
```

## Usage in Schema

```json
{
  "type": "PAGE",
  "title": "Users",
  "description": "Manage system users",
  "actions": [
    { "type": "BUTTON", "label": "Add User", "opens": "create-user" }
  ],
  "elements": [...]
}
```

## Notes

- Actions are rendered via DynamicRenderer before being passed to this adapter
- Title and description can come from schema or be overridden via props
