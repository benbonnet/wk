import {
  Select as SelectUI,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/select";
import { Label } from "@ui/components/label";
import { cn } from "@ui/lib/utils";
import { useTranslate } from "@ui/lib/ui-renderer/provider";
import { useField } from "./custom/form";
import type { InputProps } from "@ui/lib/ui-renderer/registry";

export function Select({
  name,
  label,
  placeholder,
  disabled,
  helperText,
  options = [],
}: InputProps) {
  const t = useTranslate();
  const field = useField(name);

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{t(label)}</Label>}
      <SelectUI
        value={(field.value as string) ?? ""}
        onValueChange={(val) => field.onChange(val)}
        disabled={disabled}
      >
        <SelectTrigger
          id={name}
          className={cn(field.error && "border-destructive")}
        >
          <SelectValue placeholder={placeholder ? t(placeholder) : undefined} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {t(opt.label)}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectUI>
      {helperText && !field.error && (
        <p className="text-sm text-muted-foreground">{t(helperText)}</p>
      )}
      {field.error && <p className="text-sm text-destructive">{field.error}</p>}
    </div>
  );
}
