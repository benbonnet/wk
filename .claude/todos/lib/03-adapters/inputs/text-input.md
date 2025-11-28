# INPUT_TEXT Adapter

## Purpose

Text input field for single-line text entry.

## Registry Interface

```ts
export interface TextInputProps extends InputBaseProps {
  inputType?: "text" | "email" | "tel" | "url" | "password";
}
```

## shadcn Components Used

- `Input`
- `Label`

## Implementation (Formik)

```tsx
import { useField } from "formik";
import { Input } from "@ui-components/ui/input";
import { Label } from "@ui-components/ui/label";
import type { TextInputProps } from "@ui/registry";

export function TextInputAdapter({
  name,
  label,
  helperText,
  placeholder,
  inputType = "text",
  disabled,
}: TextInputProps) {
  const [field, meta] = useField(name);

  const hasError = meta.touched && meta.error;

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        id={name}
        type={inputType}
        placeholder={placeholder}
        disabled={disabled}
        {...field}
        className={hasError ? "border-destructive" : ""}
      />
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

## Implementation (React Hook Form)

```tsx
import { useFormContext } from "react-hook-form";
import { Input } from "@ui-components/ui/input";
import { Label } from "@ui-components/ui/label";
import type { TextInputProps } from "@ui/registry";

export function TextInputAdapter({
  name,
  label,
  helperText,
  placeholder,
  inputType = "text",
  disabled,
}: TextInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        id={name}
        type={inputType}
        placeholder={placeholder}
        disabled={disabled}
        {...register(name)}
        className={error ? "border-destructive" : ""}
      />
      {error && (
        <p className="text-sm text-destructive">{error.message as string}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
```

## Schema Example

```json
{
  "type": "COMPONENT",
  "name": "email",
  "kind": "INPUT_TEXT",
  "label": "Email Address",
  "placeholder": "you@example.com",
  "inputType": "email",
  "helperText": "We'll never share your email"
}
```

## Input Types

| inputType | HTML Type | Use Case |
|-----------|-----------|----------|
| text | text | Default text input |
| email | email | Email validation |
| tel | tel | Phone numbers |
| url | url | URLs |
| password | password | Hidden text |

## Notes

- Wraps shadcn Input with form integration
- Shows validation errors from form context
- Helper text hidden when error shown
