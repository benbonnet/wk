import { Textarea } from "@ui/components/ui/textarea";
import { Label } from "@ui/components/ui/label";
import { cn } from "@ui/lib/utils";
import { useTranslate } from "@ui/lib/provider";
import type { InputProps } from "@ui/lib/registry";

export function INPUT_TEXTAREA({
  name,
  label,
  placeholder,
  helperText,
  rows = 3,
  disabled,
  value,
  onChange,
  error,
}: InputProps) {
  const t = useTranslate();

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{t(label)}</Label>}
      <Textarea
        id={name}
        name={name}
        placeholder={placeholder ? t(placeholder) : undefined}
        rows={rows}
        disabled={disabled}
        value={(value as string) ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(error && "border-destructive")}
      />
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{t(helperText)}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
