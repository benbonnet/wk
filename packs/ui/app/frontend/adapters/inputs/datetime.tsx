import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { cn } from "@ui/lib/utils";
import type { InputComponentProps } from "./types";

// Convert RFC3339 to datetime-local format (for display)
function toLocalFormat(value: string | undefined): string {
  if (!value) return "";
  // RFC3339: 2024-01-15T10:30:00Z or 2024-01-15T10:30:00+00:00
  // datetime-local needs: 2024-01-15T10:30
  return value.slice(0, 16);
}

// Convert datetime-local to RFC3339 format (for API)
function toRFC3339(value: string): string {
  if (!value) return "";
  // datetime-local gives: 2024-01-15T10:30
  // RFC3339 needs: 2024-01-15T10:30:00Z
  return `${value}:00Z`;
}

export function InputDatetime({
  field,
  meta,
  helpers,
  name,
  label,
  disabled,
  className,
  t,
}: InputComponentProps) {
  const error = meta.touched && meta.error ? meta.error : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const localValue = e.target.value;
    helpers.setValue(toRFC3339(localValue));
  };

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{t(label)}</Label>}
      <Input
        name={field.name}
        onBlur={field.onBlur}
        value={toLocalFormat(field.value)}
        onChange={handleChange}
        id={name}
        type="datetime-local"
        disabled={disabled}
        className={cn(error && "border-destructive", className)}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
