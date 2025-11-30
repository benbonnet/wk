# DISPLAY_NUMBER Adapter

## Purpose

Display formatted numbers (with locale, currency, percentages).

## Registry Interface

```ts
export interface NumberDisplayProps extends DisplayBaseProps {}
```

## shadcn Components Used

- `Label`

## Implementation

```tsx
import { Label } from "@ui-components/label";
import { useShowData } from "../layouts/show";
import type { NumberDisplayProps } from "@ui/registry";

export function NumberDisplayAdapter({
  name,
  label,
  value,
  className,
}: NumberDisplayProps) {
  const showData = useShowData();
  const rawValue = value ?? (name ? showData[name] : undefined);

  const formattedValue =
    rawValue != null
      ? new Intl.NumberFormat().format(Number(rawValue))
      : "—";

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <Label className="text-sm text-muted-foreground">{label}</Label>
      )}
      <p className="text-sm font-medium tabular-nums">{formattedValue}</p>
    </div>
  );
}
```

## Currency Variant

```tsx
export function CurrencyDisplayAdapter({
  name,
  label,
  value,
  currency = "USD",
  locale = "en-US",
}: NumberDisplayProps & { currency?: string; locale?: string }) {
  const showData = useShowData();
  const rawValue = value ?? (name ? showData[name] : undefined);

  const formattedValue =
    rawValue != null
      ? new Intl.NumberFormat(locale, {
          style: "currency",
          currency,
        }).format(Number(rawValue))
      : "—";

  return (
    <div className="space-y-1">
      {label && (
        <Label className="text-sm text-muted-foreground">{label}</Label>
      )}
      <p className="text-sm font-medium tabular-nums">{formattedValue}</p>
    </div>
  );
}
```

## Percentage Variant

```tsx
export function PercentageDisplayAdapter({
  name,
  label,
  value,
}: NumberDisplayProps) {
  const showData = useShowData();
  const rawValue = value ?? (name ? showData[name] : undefined);

  const formattedValue =
    rawValue != null
      ? new Intl.NumberFormat("en-US", {
          style: "percent",
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(Number(rawValue))
      : "—";

  return (
    <div className="space-y-1">
      {label && (
        <Label className="text-sm text-muted-foreground">{label}</Label>
      )}
      <p className="text-sm font-medium tabular-nums">{formattedValue}</p>
    </div>
  );
}
```

## Table Cell Variant

```tsx
export function NumberCellAdapter({
  value,
  currency,
}: {
  value: unknown;
  currency?: string;
}) {
  if (value == null) return <span>—</span>;

  const formatted = currency
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
      }).format(Number(value))
    : new Intl.NumberFormat().format(Number(value));

  return <span className="tabular-nums">{formatted}</span>;
}
```

## Schema Example

```json
{
  "type": "COMPONENT",
  "name": "amount",
  "kind": "DISPLAY_NUMBER",
  "label": "Amount"
}
```

## Notes

- Uses `Intl.NumberFormat` for locale-aware formatting
- `tabular-nums` class for aligned digits in tables
- Currency and percentage variants available
