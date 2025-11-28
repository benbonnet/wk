# DISPLAY_TEXT Adapter

## Purpose

Display plain text value.

## Registry Interface

```ts
export interface TextDisplayProps extends DisplayBaseProps {}
```

## shadcn Components Used

- `Label` (for field label)

## Implementation

```tsx
import { Label } from "@ui-components/ui/label";
import { useShowData } from "../layouts/show";
import type { TextDisplayProps } from "@ui/registry";

export function TextDisplayAdapter({
  name,
  label,
  value,
  className,
}: TextDisplayProps) {
  const showData = useShowData();
  const displayValue = value ?? (name ? showData[name] : undefined);

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <Label className="text-sm text-muted-foreground">{label}</Label>
      )}
      <p className="text-sm font-medium">
        {displayValue != null ? String(displayValue) : "—"}
      </p>
    </div>
  );
}
```

## Inline Variant

```tsx
export function InlineTextDisplayAdapter({
  label,
  value,
  name,
}: TextDisplayProps) {
  const showData = useShowData();
  const displayValue = value ?? (name ? showData[name] : undefined);

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-muted-foreground">{label}:</span>}
      <span className="text-sm">{displayValue ?? "—"}</span>
    </div>
  );
}
```

## Table Cell Variant

```tsx
export function TextCellAdapter({ value }: { value: unknown }) {
  return <span>{value != null ? String(value) : "—"}</span>;
}
```

## Schema Example

```json
{
  "type": "COMPONENT",
  "name": "email",
  "kind": "DISPLAY_TEXT",
  "label": "Email"
}
```

## Notes

- Used in SHOW layouts and table cells
- Gets value from ShowContext if `value` not provided
- Empty values display as em-dash (—)
