# DISPLAY_SELECT Adapter

## Purpose

Display selected option's label from options list.

## Registry Interface

```ts
export interface SelectDisplayProps extends DisplayBaseProps {
  options?: Option[];
}
```

## shadcn Components Used

- `Label`

## Implementation

```tsx
import { Label } from "@ui-components/label";
import { useShowData } from "../layouts/show";
import type { SelectDisplayProps } from "@ui/registry";

export function SelectDisplayAdapter({
  name,
  label,
  value,
  options = [],
  className,
}: SelectDisplayProps) {
  const showData = useShowData();
  const rawValue = value ?? (name ? showData[name] : undefined);

  // Find the label for the selected value
  const selectedOption = options.find((opt) => opt.value === rawValue);
  const displayValue = selectedOption?.label || String(rawValue || "—");

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <Label className="text-sm text-muted-foreground">{label}</Label>
      )}
      <p className="text-sm font-medium">{displayValue}</p>
    </div>
  );
}
```

## With Description

```tsx
export function SelectWithDescriptionAdapter({
  name,
  label,
  value,
  options = [],
}: SelectDisplayProps) {
  const showData = useShowData();
  const rawValue = value ?? (name ? showData[name] : undefined);

  const selectedOption = options.find((opt) => opt.value === rawValue);

  return (
    <div className="space-y-1">
      {label && <Label className="text-sm text-muted-foreground">{label}</Label>}
      <div>
        <p className="text-sm font-medium">
          {selectedOption?.label || String(rawValue || "—")}
        </p>
        {selectedOption?.description && (
          <p className="text-xs text-muted-foreground">
            {selectedOption.description}
          </p>
        )}
      </div>
    </div>
  );
}
```

## Table Cell Variant

```tsx
export function SelectCellAdapter({
  value,
  options = [],
}: {
  value: unknown;
  options?: Option[];
}) {
  const selectedOption = options.find((opt) => opt.value === value);
  return <span>{selectedOption?.label || String(value || "—")}</span>;
}
```

## Schema Example

```json
{
  "type": "COMPONENT",
  "name": "country",
  "kind": "DISPLAY_SELECT",
  "label": "Country",
  "options": [
    { "value": "us", "label": "United States" },
    { "value": "uk", "label": "United Kingdom" },
    { "value": "ca", "label": "Canada" }
  ]
}
```

## Notes

- Looks up value in options to display label
- Falls back to raw value if option not found
- Options typically come from schema or API
