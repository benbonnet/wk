import { Input } from "@ui/components/ui/input";
import { Label } from "@ui/components/ui/label";
import { cn } from "@ui/lib/utils";
import { useTranslate } from "@ui/lib/provider";
import type { InputProps } from "@ui/lib/registry";

export function INPUT_TEXT({
  name,
  label,
  placeholder,
  helperText,
  disabled,
  value,
  onChange,
  error,
}: InputProps) {
  const t = useTranslate();

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{t(label)}</Label>}
      <Input
        id={name}
        name={name}
        type="text"
        placeholder={placeholder ? t(placeholder) : undefined}
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
