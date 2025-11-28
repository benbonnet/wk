# DISPLAY_DATE Adapter

## Purpose

Display formatted date.

## Registry Interface

```ts
export interface DateDisplayProps extends DisplayBaseProps {}
```

## shadcn Components Used

- `Label`
- `Tooltip` (for relative time)

## Implementation

```tsx
import { format, parseISO } from "date-fns";
import { Label } from "@ui-components/ui/label";
import { useShowData } from "../layouts/show";
import type { DateDisplayProps } from "@ui/registry";

export function DateDisplayAdapter({
  name,
  label,
  value,
  className,
}: DateDisplayProps) {
  const showData = useShowData();
  const rawValue = value ?? (name ? showData[name] : undefined);

  const formattedValue = rawValue
    ? format(parseISO(String(rawValue)), "PPP") // "January 1, 2025"
    : "—";

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <Label className="text-sm text-muted-foreground">{label}</Label>
      )}
      <p className="text-sm font-medium">{formattedValue}</p>
    </div>
  );
}
```

## With Relative Time Tooltip

```tsx
import { formatDistanceToNow, parseISO } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui-components/ui/tooltip";

export function DateWithRelativeAdapter({
  name,
  label,
  value,
}: DateDisplayProps) {
  const showData = useShowData();
  const rawValue = value ?? (name ? showData[name] : undefined);

  if (!rawValue) {
    return (
      <div className="space-y-1">
        {label && <Label className="text-sm text-muted-foreground">{label}</Label>}
        <p className="text-sm">—</p>
      </div>
    );
  }

  const date = parseISO(String(rawValue));
  const formatted = format(date, "PPP");
  const relative = formatDistanceToNow(date, { addSuffix: true });

  return (
    <div className="space-y-1">
      {label && <Label className="text-sm text-muted-foreground">{label}</Label>}
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="text-sm font-medium cursor-help">{formatted}</p>
        </TooltipTrigger>
        <TooltipContent>{relative}</TooltipContent>
      </Tooltip>
    </div>
  );
}
```

## Table Cell Variant

```tsx
export function DateCellAdapter({ value }: { value: unknown }) {
  if (!value) return <span>—</span>;

  const date = parseISO(String(value));
  return <span>{format(date, "PP")}</span>; // "Jan 1, 2025"
}
```

## Different Formats

```tsx
// Short: "1/1/25"
format(date, "P")

// Medium: "Jan 1, 2025"
format(date, "PP")

// Long: "January 1, 2025"
format(date, "PPP")

// Full: "Wednesday, January 1st, 2025"
format(date, "PPPP")

// Custom
format(date, "yyyy-MM-dd")
```

## Schema Example

```json
{
  "type": "COMPONENT",
  "name": "created_at",
  "kind": "DISPLAY_DATE",
  "label": "Created"
}
```

## Notes

- Uses date-fns for formatting
- Expects ISO date string from backend
- Tooltip shows relative time ("2 days ago")
