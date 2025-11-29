import { Checkbox as CheckboxUI } from "@ui-components/checkbox";
import { Label } from "@ui-components/label";
import { useTranslate } from "@ui/provider";
import { useField } from "./custom/form";
import type { InputProps } from "@ui/registry";

export function Checkbox({ name, label, disabled, helperText }: InputProps) {
  const t = useTranslate();
  const field = useField(name);

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <CheckboxUI
          id={name}
          checked={(field.value as boolean) ?? false}
          onCheckedChange={(checked) => field.onChange(checked)}
          disabled={disabled}
        />
        {label && (
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor={name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t(label)}
            </Label>
            {helperText && (
              <p className="text-sm text-muted-foreground">{t(helperText)}</p>
            )}
          </div>
        )}
      </div>
      {field.error && <p className="text-sm text-destructive">{field.error}</p>}
    </div>
  );
}
