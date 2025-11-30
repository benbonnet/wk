import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { cn } from "@ui/lib/utils";
import type { InputComponentProps } from "./types";

export function InputText({
  field,
  meta,
  name,
  label,
  helperText,
  placeholder,
  className,
  inputType = "text",
  disabled,
  t,
}: InputComponentProps) {
  const error = meta.touched && meta.error ? meta.error : undefined;

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{t(label)}</Label>}
      <Input
        {...field}
        value={field.value ?? ""}
        id={name}
        type={inputType}
        placeholder={placeholder ? t(placeholder) : undefined}
        disabled={disabled}
        className={cn(error && "border-destructive", className)}
      />
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{t(helperText)}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
