import { Textarea as TextareaUI } from "@ui-components/textarea";
import { Label } from "@ui-components/label";
import { cn } from "@ui/utils";
import { useTranslate } from "@ui/provider";
import { useField } from "./custom/form";
import type { InputProps } from "@ui/registry";

export function Textarea({
  name,
  label,
  placeholder,
  disabled,
  helperText,
  rows = 3,
}: InputProps) {
  const t = useTranslate();
  const field = useField(name);

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{t(label)}</Label>}
      <TextareaUI
        id={name}
        name={name}
        placeholder={placeholder ? t(placeholder) : undefined}
        rows={rows}
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
