import { Checkbox } from "@ui-components/checkbox";
import { Label } from "@ui-components/label";
import { useTranslate } from "@ui/provider";
import { useField } from "./custom/form";
import type { InputProps } from "@ui/registry";

export function Checkboxes({
  name,
  label,
  disabled,
  helperText,
  options = [],
}: InputProps) {
  const t = useTranslate();
  const field = useField(name);
  const selectedValues = (field.value as string[]) || [];

  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      field.onChange([...selectedValues, optionValue]);
    } else {
      field.onChange(selectedValues.filter((v) => v !== optionValue));
    }
  };

  return (
    <div className="space-y-3">
      {label && <Label className="text-base">{t(label)}</Label>}
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-3">
            <Checkbox
              id={`${name}-${option.value}`}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={(checked) =>
                handleChange(option.value, checked as boolean)
              }
              disabled={disabled}
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
      </div>
      {helperText && !field.error && (
        <p className="text-sm text-muted-foreground">{t(helperText)}</p>
      )}
      {field.error && <p className="text-sm text-destructive">{field.error}</p>}
    </div>
  );
}
