# GROUP Adapter

## Purpose

Groups related form fields or display elements with optional label and direction control.

## Registry Interface

```ts
export interface GroupProps extends BaseRendererProps {
  label?: string;
  subtitle?: string;
  direction?: "HORIZONTAL" | "VERTICAL";
}
```

## shadcn Components Used

- `Separator` (optional)
- `Label` (for group label)

## Implementation

```tsx
import { Separator } from "@ui-components/separator";
import type { GroupProps } from "@ui/registry";

export function GroupAdapter({
  schema,
  label,
  subtitle,
  direction = "VERTICAL",
  children,
}: GroupProps) {
  const groupLabel = label || schema.label;
  const groupSubtitle = subtitle || schema.subtitle;
  const groupDirection = direction || schema.direction || "VERTICAL";

  const isHorizontal = groupDirection === "HORIZONTAL";

  return (
    <div className={cn("space-y-3", schema.className)}>
      {/* Group Header */}
      {(groupLabel || groupSubtitle) && (
        <div className="space-y-1">
          {groupLabel && (
            <h3 className="text-sm font-medium leading-none">{groupLabel}</h3>
          )}
          {groupSubtitle && (
            <p className="text-sm text-muted-foreground">{groupSubtitle}</p>
          )}
        </div>
      )}

      {/* Group Content */}
      <div
        className={cn(
          isHorizontal
            ? "flex flex-wrap items-start gap-4"
            : "grid gap-4"
        )}
      >
        {children}
      </div>
    </div>
  );
}
```

## Horizontal with Grid

```tsx
// For more control over horizontal layouts
<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
  {children}
</div>
```

## Schema Example

```json
{
  "type": "FORM",
  "elements": [
    {
      "type": "GROUP",
      "label": "Personal Information",
      "subtitle": "Basic contact details",
      "elements": [
        { "type": "COMPONENT", "name": "first_name", "kind": "INPUT_TEXT" },
        { "type": "COMPONENT", "name": "last_name", "kind": "INPUT_TEXT" }
      ]
    },
    {
      "type": "GROUP",
      "label": "Address",
      "direction": "HORIZONTAL",
      "elements": [
        { "type": "COMPONENT", "name": "city", "kind": "INPUT_TEXT" },
        { "type": "COMPONENT", "name": "zip", "kind": "INPUT_TEXT" }
      ]
    }
  ]
}
```

## Notes

- VERTICAL is default (stacked fields)
- HORIZONTAL uses flexbox for side-by-side fields
- Useful for organizing long forms into logical sections
