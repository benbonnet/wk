import { RadioGroup, RadioGroupItem } from "@ui-components/radio-group";
import { Label } from "@ui-components/label";
import { useTranslate } from "@ui/provider";
import { useField } from "./custom/form";
import type { InputProps } from "@ui/registry";

export function Radios({
  name,
  label,
  disabled,
  helperText,
  options = [],
}: InputProps) {
  const t = useTranslate();
  const field = useField(name);

  return (
    <div className="space-y-3">
      {label && <Label className="text-base">{t(label)}</Label>}
      <RadioGroup
        value={(field.value as string) ?? ""}
        onValueChange={(val) => field.onChange(val)}
        disabled={disabled}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-3">
            <RadioGroupItem
              value={option.value}
              id={`${name}-${option.value}`}
            />
            <Label
              htmlFor={`${name}-${option.value}`}
              className="text-sm font-normal"
            >
              {t(option.label)}
              {option.description && (
                <span className="block text-muted-foreground">
                  {t(option.description)}
                </span>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {helperText && !field.error && (
        <p className="text-sm text-muted-foreground">{t(helperText)}</p>
      )}
      {field.error && <p className="text-sm text-destructive">{field.error}</p>}
    </div>
  );
}
