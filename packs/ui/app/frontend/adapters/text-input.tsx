import { Input } from "@ui-components/input";
import { Label } from "@ui-components/label";
import { cn } from "@ui/utils";
import { useTranslate } from "@ui/provider";
import { useField } from "./custom/form";
import type { InputProps } from "@ui/registry";

export function TextInput({
  name,
  label,
  placeholder,
  disabled,
  helperText,
}: InputProps) {
  const t = useTranslate();
  const field = useField(name);

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{t(label)}</Label>}
      <Input
        id={name}
        name={name}
        type="text"
        placeholder={placeholder ? t(placeholder) : undefined}
        disabled={disabled}
        value={(field.value as string) ?? ""}
        onChange={(e) => field.onChange(e.target.value)}
        className={cn(field.error && "border-destructive")}
      />
      {helperText && !field.error && (
        <p className="text-sm text-muted-foreground">{t(helperText)}</p>
      )}
      {field.error && <p className="text-sm text-destructive">{field.error}</p>}
    </div>
  );
}
