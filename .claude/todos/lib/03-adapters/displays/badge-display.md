# DISPLAY_BADGE Adapter

## Purpose

Display value as a colored badge (for status, category, etc.).

## Registry Interface

```ts
export interface BadgeDisplayProps extends DisplayBaseProps {
  options?: Option[];
}
```

## shadcn Components Used

- `Badge`
- `Label`

## Implementation

```tsx
import { Badge } from "@ui-components/badge";
import { Label } from "@ui-components/label";
import { useShowData } from "../layouts/show";
import type { BadgeDisplayProps } from "@ui/registry";

// Color mapping for common status values
const statusColors: Record<string, string> = {
  // Status
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  failed: "bg-red-100 text-red-800 border-red-200",
  cancelled: "bg-gray-100 text-gray-800 border-gray-200",

  // Priority
  low: "bg-gray-100 text-gray-800 border-gray-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  critical: "bg-red-100 text-red-800 border-red-200",

  // Boolean
  true: "bg-green-100 text-green-800 border-green-200",
  false: "bg-gray-100 text-gray-800 border-gray-200",
};

export function BadgeDisplayAdapter({
  name,
  label,
  value,
  options,
  className,
}: BadgeDisplayProps) {
  const showData = useShowData();
  const rawValue = value ?? (name ? showData[name] : undefined);

  if (rawValue == null) {
    return (
      <div className={cn("space-y-1", className)}>
        {label && <Label className="text-sm text-muted-foreground">{label}</Label>}
        <span className="text-sm">—</span>
      </div>
    );
  }

  const stringValue = String(rawValue).toLowerCase();

  // Find label from options if available
  const displayLabel =
    options?.find((o) => o.value === rawValue)?.label || String(rawValue);

  // Get color class
  const colorClass = statusColors[stringValue] || "bg-gray-100 text-gray-800";

  return (
    <div className={cn("space-y-1", className)}>
      {label && <Label className="text-sm text-muted-foreground">{label}</Label>}
      <Badge variant="outline" className={colorClass}>
        {displayLabel}
      </Badge>
    </div>
  );
}
```

## With Custom Colors from Options

```tsx
interface ColoredOption {
  value: string;
  label: string;
  color?: "default" | "red" | "green" | "blue" | "yellow" | "purple";
}

const colorMap = {
  default: "bg-gray-100 text-gray-800",
  red: "bg-red-100 text-red-800",
  green: "bg-green-100 text-green-800",
  blue: "bg-blue-100 text-blue-800",
  yellow: "bg-yellow-100 text-yellow-800",
  purple: "bg-purple-100 text-purple-800",
};

export function CustomBadgeAdapter({
  name,
  value,
  options,
}: BadgeDisplayProps & { options: ColoredOption[] }) {
  const showData = useShowData();
  const rawValue = value ?? (name ? showData[name] : undefined);

  const option = options.find((o) => o.value === rawValue);
  const colorClass = colorMap[option?.color || "default"];

  return (
    <Badge variant="outline" className={colorClass}>
      {option?.label || String(rawValue)}
    </Badge>
  );
}
```

## Table Cell Variant

```tsx
export function BadgeCellAdapter({
  value,
  options,
}: {
  value: unknown;
  options?: Option[];
}) {
  if (value == null) return <span>—</span>;

  const stringValue = String(value).toLowerCase();
  const label = options?.find((o) => o.value === value)?.label || String(value);
  const colorClass = statusColors[stringValue] || "bg-gray-100 text-gray-800";

  return (
    <Badge variant="outline" className={colorClass}>
      {label}
    </Badge>
  );
}
```

## Schema Example

```json
{
  "type": "COMPONENT",
  "name": "status",
  "kind": "DISPLAY_BADGE",
  "label": "Status",
  "options": [
    { "value": "active", "label": "Active" },
    { "value": "inactive", "label": "Inactive" },
    { "value": "pending", "label": "Pending" }
  ]
}
```

## Notes

- Auto-colors common status values
- Options provide label mapping
- Custom colors can be defined per option
