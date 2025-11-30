import { Checkbox } from "@ui/components/checkbox";
import { Label } from "@ui/components/label";
import type { InputComponentProps } from "./types";

export function InputCheckboxes({
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
  const values = (field.value as string[]) || [];

  return (
    <div className="space-y-2">
      {label && <Label>{t(label)}</Label>}
      <div className="space-y-2">
        {options.map((option) => {
          const isChecked = values.includes(option.value);
          return (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${name}-${option.value}`}
                checked={isChecked}
                onCheckedChange={(checked) => {
                  if (checked) {
                    helpers.setValue([...values, option.value]);
                  } else {
                    helpers.setValue(values.filter((v) => v !== option.value));
                  }
                }}
                disabled={disabled}
              />
              <Label
                htmlFor={`${name}-${option.value}`}
                className="cursor-pointer"
              >
                {t(option.label)}
              </Label>
            </div>
          );
        })}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
