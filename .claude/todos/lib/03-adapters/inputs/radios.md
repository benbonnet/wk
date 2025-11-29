# INPUT_RADIOS Adapter

## Purpose

Radio button group for single selection from options.

## Registry Interface

```ts
export interface RadiosProps extends InputBaseProps {
  options: Option[];
}
```

## shadcn Components Used

- `RadioGroup`
- `RadioGroupItem`
- `Label`

## Implementation

```tsx
import { useField } from "formik";
import { RadioGroup, RadioGroupItem } from "@ui-components/radio-group";
import { Label } from "@ui-components/label";
import type { RadiosProps } from "@ui/registry";

export function RadiosAdapter({
  name,
  label,
  helperText,
  options,
  disabled,
}: RadiosProps) {
  const [field, meta, helpers] = useField(name);

  const hasError = meta.touched && meta.error;

  return (
    <div className="space-y-3">
      {label && <Label className="text-base">{label}</Label>}

      <RadioGroup
        value={field.value as string}
        onValueChange={(value) => helpers.setValue(value)}
        disabled={disabled}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-3">
            <RadioGroupItem
              value={option.value}
              id={`${name}-${option.value}`}
            />
            <Label
              htmlFor={`${name}-${option.value}`}
              className="text-sm font-normal"
            >
              {option.label}
              {option.description && (
                <span className="block text-muted-foreground">
                  {option.description}
                </span>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>

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

## Card Radio Variant

```tsx
export function CardRadiosAdapter({
  name,
  label,
  options,
}: RadiosProps) {
  const [field, , helpers] = useField(name);

  return (
    <div className="space-y-3">
      {label && <Label className="text-base">{label}</Label>}

      <RadioGroup
        value={field.value as string}
        onValueChange={(value) => helpers.setValue(value)}
        className="grid gap-3"
      >
        {options.map((option) => (
          <Label
            key={option.value}
            htmlFor={`${name}-${option.value}`}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-lg border p-4",
              "hover:bg-accent/50 transition-colors",
              field.value === option.value && "border-primary bg-primary/5"
            )}
          >
            <RadioGroupItem
              value={option.value}
              id={`${name}-${option.value}`}
              className="mt-0.5"
            />
            <div className="grid gap-1">
              <span className="text-sm font-medium">{option.label}</span>
              {option.description && (
                <span className="text-sm text-muted-foreground">
                  {option.description}
                </span>
              )}
            </div>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}
```

## Schema Example

```json
{
  "type": "COMPONENT",
  "name": "plan",
  "kind": "INPUT_RADIOS",
  "label": "Choose a Plan",
  "options": [
    { "value": "free", "label": "Free", "description": "Basic features" },
    { "value": "pro", "label": "Pro", "description": "All features + support" },
    { "value": "enterprise", "label": "Enterprise", "description": "Custom solutions" }
  ]
}
```

## Notes

- Stores single selected value (string)
- Only one option can be selected at a time
- Card variant good for plan selection, settings
