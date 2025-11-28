# DISPLAY_DATETIME Adapter

## Purpose

Display formatted date and time.

## Registry Interface

```ts
export interface DateTimeDisplayProps extends DisplayBaseProps {}
```

## shadcn Components Used

- `Label`
- `Tooltip`

## Implementation

```tsx
import { format, parseISO } from "date-fns";
import { Label } from "@ui-components/ui/label";
import { useShowData } from "../layouts/show";
import type { DateTimeDisplayProps } from "@ui/registry";

export function DateTimeDisplayAdapter({
  name,
  label,
  value,
  className,
}: DateTimeDisplayProps) {
  const showData = useShowData();
  const rawValue = value ?? (name ? showData[name] : undefined);

  const formattedValue = rawValue
    ? format(parseISO(String(rawValue)), "PPP 'at' p") // "January 1, 2025 at 2:30 PM"
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

## With Relative Time

```tsx
import { formatDistanceToNow, parseISO } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui-components/ui/tooltip";

export function DateTimeWithRelativeAdapter({
  name,
  label,
  value,
}: DateTimeDisplayProps) {
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
  const formatted = format(date, "PPP 'at' p");
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

## Relative Only Variant

```tsx
export function RelativeDateTimeAdapter({
  name,
  label,
  value,
}: DateTimeDisplayProps) {
  const showData = useShowData();
  const rawValue = value ?? (name ? showData[name] : undefined);

  if (!rawValue) return <span>—</span>;

  const date = parseISO(String(rawValue));
  const relative = formatDistanceToNow(date, { addSuffix: true });
  const full = format(date, "PPP 'at' p");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="text-sm cursor-help">{relative}</span>
      </TooltipTrigger>
      <TooltipContent>{full}</TooltipContent>
    </Tooltip>
  );
}
```

## Table Cell Variant

```tsx
export function DateTimeCellAdapter({ value }: { value: unknown }) {
  if (!value) return <span>—</span>;

  const date = parseISO(String(value));
  return <span>{format(date, "PP p")}</span>; // "Jan 1, 2025, 2:30 PM"
}
```

## Schema Example

```json
{
  "type": "COMPONENT",
  "name": "updated_at",
  "kind": "DISPLAY_DATETIME",
  "label": "Last Updated"
}
```

## Notes

- Includes time in display
- Relative time shown on hover
- Uses date-fns for formatting
