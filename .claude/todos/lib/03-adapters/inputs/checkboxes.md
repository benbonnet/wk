# INPUT_CHECKBOXES Adapter

## Purpose

Multiple checkboxes for multi-select from options.

## Registry Interface

```ts
export interface CheckboxesProps extends InputBaseProps {
  options: Option[];
}
```

## shadcn Components Used

- `Checkbox`
- `Label`

## Implementation

```tsx
import { useField } from "formik";
import { Checkbox } from "@ui-components/ui/checkbox";
import { Label } from "@ui-components/ui/label";
import type { CheckboxesProps } from "@ui/registry";

export function CheckboxesAdapter({
  name,
  label,
  helperText,
  options,
  disabled,
}: CheckboxesProps) {
  const [field, meta, helpers] = useField(name);

  const values = (field.value as string[]) || [];
  const hasError = meta.touched && meta.error;

  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      helpers.setValue([...values, optionValue]);
    } else {
      helpers.setValue(values.filter((v) => v !== optionValue));
    }
  };

  return (
    <div className="space-y-3">
      {label && <Label className="text-base">{label}</Label>}

      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-3">
            <Checkbox
              id={`${name}-${option.value}`}
              checked={values.includes(option.value)}
              onCheckedChange={(checked) =>
                handleChange(option.value, checked as boolean)
              }
              disabled={disabled}
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

## Horizontal Layout

```tsx
export function HorizontalCheckboxesAdapter({
  name,
  label,
  options,
}: CheckboxesProps) {
  const [field, , helpers] = useField(name);
  const values = (field.value as string[]) || [];

  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      helpers.setValue([...values, optionValue]);
    } else {
      helpers.setValue(values.filter((v) => v !== optionValue));
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <Checkbox
              id={`${name}-${option.value}`}
              checked={values.includes(option.value)}
              onCheckedChange={(checked) =>
                handleChange(option.value, checked as boolean)
              }
            />
            <Label htmlFor={`${name}-${option.value}`} className="font-normal">
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Schema Example

```json
{
  "type": "COMPONENT",
  "name": "notifications",
  "kind": "INPUT_CHECKBOXES",
  "label": "Notification Preferences",
  "options": [
    { "value": "email", "label": "Email", "description": "Get notified via email" },
    { "value": "sms", "label": "SMS", "description": "Get text messages" },
    { "value": "push", "label": "Push", "description": "Browser notifications" }
  ]
}
```

## Notes

- Stores array of selected values
- Each option has unique ID for accessibility
- Supports descriptions per option
