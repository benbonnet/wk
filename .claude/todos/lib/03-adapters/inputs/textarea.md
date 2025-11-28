# INPUT_TEXTAREA Adapter

## Purpose

Multi-line text input for longer content.

## Registry Interface

```ts
export interface TextareaProps extends InputBaseProps {
  rows?: number;
}
```

## shadcn Components Used

- `Textarea`
- `Label`

## Implementation

```tsx
import { useField } from "formik";
import { Textarea } from "@ui-components/ui/textarea";
import { Label } from "@ui-components/ui/label";
import type { TextareaProps } from "@ui/registry";

export function TextareaAdapter({
  name,
  label,
  helperText,
  placeholder,
  rows = 4,
  disabled,
}: TextareaProps) {
  const [field, meta] = useField(name);

  const hasError = meta.touched && meta.error;

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Textarea
        id={name}
        placeholder={placeholder}
        rows={rows}
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

## With Character Count

```tsx
export function TextareaWithCountAdapter({
  name,
  label,
  maxLength = 500,
  ...props
}: TextareaProps & { maxLength?: number }) {
  const [field, meta] = useField(name);
  const charCount = (field.value as string)?.length || 0;

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Textarea id={name} {...field} {...props} />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{meta.error}</span>
        <span>{charCount} / {maxLength}</span>
      </div>
    </div>
  );
}
```

## Schema Example

```json
{
  "type": "COMPONENT",
  "name": "description",
  "kind": "INPUT_TEXTAREA",
  "label": "Description",
  "placeholder": "Enter a detailed description...",
  "rows": 6,
  "helperText": "Markdown is supported"
}
```

## Notes

- Default rows: 4
- Can be resized by user (unless CSS disabled)
- Same error handling pattern as text input
