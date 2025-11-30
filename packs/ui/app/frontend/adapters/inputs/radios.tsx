import { RadioGroup, RadioGroupItem } from "@ui/components/radio-group";
import { Label } from "@ui/components/label";
import type { InputComponentProps } from "./types";

export function InputRadios({
  field,
  meta,
  helpers,
  name,
  label,
  options = [],
  disabled,
  t,
}: InputComponentProps) {
  const error = meta.touched && meta.error ? meta.error : undefined;

  return (
    <div className="space-y-2">
      {label && <Label>{t(label)}</Label>}
      <RadioGroup
        value={field.value || ""}
        onValueChange={(value) => helpers.setValue(value)}
        disabled={disabled}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={`${name}-${option.value}`}
            />
            <Label
              htmlFor={`${name}-${option.value}`}
              className="cursor-pointer"
            >
              {t(option.label)}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
