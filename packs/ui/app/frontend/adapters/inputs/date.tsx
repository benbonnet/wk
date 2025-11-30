import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { cn } from "@ui/lib/utils";
import type { InputComponentProps } from "./types";

export function InputDate({
  field,
  meta,
  name,
  label,
  disabled,
  className,
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
        type="date"
        disabled={disabled}
        className={cn(error && "border-destructive", className)}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
