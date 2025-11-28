# ACTIONS Adapter

## Purpose

Container for action buttons/links. Used in page headers, table toolbars, and form footers.

## Registry Interface

```ts
export interface ActionsProps extends BaseRendererProps {}
```

## shadcn Components Used

- None directly (flexbox container)
- Children are typically BUTTON, LINK, DROPDOWN adapters

## Implementation

```tsx
import type { ActionsProps } from "@ui/registry";

export function ActionsAdapter({ schema, children }: ActionsProps) {
  return (
    <div className={cn("flex items-center gap-2", schema.className)}>
      {children}
    </div>
  );
}
```

## Variants

### Right-aligned (default for page headers)

```tsx
<div className="flex items-center justify-end gap-2">
  {children}
</div>
```

### With separator groups

```tsx
import { Separator } from "@ui-components/ui/separator";

export function ActionsAdapter({ schema, children }: ActionsProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {/* Primary actions */}
      </div>
      <Separator orientation="vertical" className="h-6" />
      <div className="flex items-center gap-2">
        {/* Secondary actions */}
      </div>
    </div>
  );
}
```

## Schema Example

```json
{
  "type": "PAGE",
  "title": "Users",
  "actions": [
    { "type": "ACTIONS", "elements": [
      { "type": "BUTTON", "label": "Export", "variant": "ghost" },
      { "type": "BUTTON", "label": "Add User", "variant": "primary", "opens": "create-user" }
    ]}
  ]
}
```

## Notes

- Simple flex container for grouping action elements
- Primary action typically last (right-most)
- Can be nested within PAGE, TABLE toolbar, or FORM footer
