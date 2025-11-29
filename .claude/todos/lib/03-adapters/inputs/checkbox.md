# INPUT_CHECKBOX Adapter

## Purpose

Single checkbox for boolean values.

## Registry Interface

```ts
export interface CheckboxProps extends InputBaseProps {
  checked?: boolean;
}
```

## shadcn Components Used

- `Checkbox`
- `Label`

## Implementation

```tsx
import { useField } from "formik";
import { Checkbox } from "@ui-components/checkbox";
import { Label } from "@ui-components/label";
import type { CheckboxProps } from "@ui/registry";

export function CheckboxAdapter({
  name,
  label,
  helperText,
  disabled,
}: CheckboxProps) {
  const [field, meta, helpers] = useField({ name, type: "checkbox" });

  const hasError = meta.touched && meta.error;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Checkbox
          id={name}
          checked={field.value as boolean}
          onCheckedChange={(checked) => helpers.setValue(checked)}
          disabled={disabled}
        />
        {label && (
          <Label
            htmlFor={name}
            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </Label>
        )}
      </div>
      {hasError && (
        <p className="text-sm text-destructive">{meta.error}</p>
      )}
      {helperText && !hasError && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
```

## Card Checkbox Variant

```tsx
export function CardCheckboxAdapter({
  name,
  label,
  helperText,
}: CheckboxProps) {
  const [field, , helpers] = useField({ name, type: "checkbox" });

  return (
    <Label
      htmlFor={name}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border p-4",
        "hover:bg-accent/50 transition-colors",
        field.value && "border-primary bg-primary/5"
      )}
    >
      <Checkbox
        id={name}
        checked={field.value as boolean}
        onCheckedChange={(checked) => helpers.setValue(checked)}
      />
      <div className="grid gap-1.5">
        <span className="text-sm font-medium leading-none">{label}</span>
        {helperText && (
          <span className="text-sm text-muted-foreground">{helperText}</span>
        )}
      </div>
    </Label>
  );
}
```

## Schema Example

```json
{
  "type": "COMPONENT",
  "name": "accept_terms",
  "kind": "INPUT_CHECKBOX",
  "label": "I accept the terms and conditions"
}
```

## Notes

- For single boolean value
- Label clickable to toggle
- Card variant good for feature toggles
