import { Textarea } from "@ui/components/textarea";
import { Label } from "@ui/components/label";
import { cn } from "@ui/lib/utils";
import type { InputComponentProps } from "./types";

export function InputTextarea({
  field,
  meta,
  name,
  label,
  helperText,
  placeholder,
  rows,
  disabled,
  className,
  t,
}: InputComponentProps) {
  const error = meta.touched && meta.error ? meta.error : undefined;

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{t(label)}</Label>}
      <Textarea
        {...field}
        value={field.value ?? ""}
        id={name}
        placeholder={placeholder ? t(placeholder) : undefined}
        rows={rows}
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
