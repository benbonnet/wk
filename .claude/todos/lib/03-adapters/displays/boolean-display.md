# DISPLAY_BOOLEAN Adapter

## Purpose

Display boolean value as Yes/No, icon, or switch.

## Registry Interface

```ts
export interface BooleanDisplayProps extends DisplayBaseProps {}
```

## shadcn Components Used

- `Label`
- `Badge` (optional)

## Implementation

```tsx
import { Check, X } from "lucide-react";
import { Label } from "@ui-components/label";
import { useShowData } from "../layouts/show";
import type { BooleanDisplayProps } from "@ui/registry";

export function BooleanDisplayAdapter({
  name,
  label,
  value,
  className,
}: BooleanDisplayProps) {
  const showData = useShowData();
  const rawValue = value ?? (name ? showData[name] : undefined);

  const boolValue = Boolean(rawValue);

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <Label className="text-sm text-muted-foreground">{label}</Label>
      )}
      <p className="text-sm font-medium">{boolValue ? "Yes" : "No"}</p>
    </div>
  );
}
```

## Icon Variant

```tsx
export function BooleanIconAdapter({
  name,
  label,
  value,
}: BooleanDisplayProps) {
  const showData = useShowData();
  const rawValue = value ?? (name ? showData[name] : undefined);
  const boolValue = Boolean(rawValue);

  return (
    <div className="space-y-1">
      {label && <Label className="text-sm text-muted-foreground">{label}</Label>}
      {boolValue ? (
        <Check className="h-5 w-5 text-green-600" />
      ) : (
        <X className="h-5 w-5 text-red-600" />
      )}
    </div>
  );
}
```

## Badge Variant

```tsx
import { Badge } from "@ui-components/badge";

export function BooleanBadgeAdapter({
  name,
  label,
  value,
  trueLabel = "Active",
  falseLabel = "Inactive",
}: BooleanDisplayProps & { trueLabel?: string; falseLabel?: string }) {
  const showData = useShowData();
  const rawValue = value ?? (name ? showData[name] : undefined);
  const boolValue = Boolean(rawValue);

  return (
    <div className="space-y-1">
      {label && <Label className="text-sm text-muted-foreground">{label}</Label>}
      <Badge
        variant="outline"
        className={
          boolValue
            ? "bg-green-100 text-green-800 border-green-200"
            : "bg-gray-100 text-gray-800 border-gray-200"
        }
      >
        {boolValue ? trueLabel : falseLabel}
      </Badge>
    </div>
  );
}
```

## Table Cell Variants

```tsx
// Icon only
export function BooleanCellIconAdapter({ value }: { value: unknown }) {
  return Boolean(value) ? (
    <Check className="h-4 w-4 text-green-600" />
  ) : (
    <X className="h-4 w-4 text-muted-foreground" />
  );
}

// Text
export function BooleanCellTextAdapter({ value }: { value: unknown }) {
  return <span>{Boolean(value) ? "Yes" : "No"}</span>;
}

// Dot indicator
export function BooleanCellDotAdapter({ value }: { value: unknown }) {
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        Boolean(value) ? "bg-green-500" : "bg-gray-300"
      )}
    />
  );
}
```

## Schema Example

```json
{
  "type": "COMPONENT",
  "name": "is_verified",
  "kind": "DISPLAY_BOOLEAN",
  "label": "Verified"
}
```

## Notes

- Multiple display variants (text, icon, badge, dot)
- Handles truthy/falsy values
- Custom labels for true/false states
