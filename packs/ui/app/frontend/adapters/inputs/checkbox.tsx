import { Checkbox } from "@ui-components/ui/checkbox";
import { Label } from "@ui-components/ui/label";
import { useTranslate } from "@ui/provider";
import type { InputProps } from "@ui/registry";

export function INPUT_CHECKBOX({
  name,
  label,
  helperText,
  disabled,
  value,
  onChange,
  error,
}: InputProps) {
  const t = useTranslate();

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <Checkbox
          id={name}
          checked={(value as boolean) ?? false}
          onCheckedChange={(checked) => onChange?.(checked)}
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
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
