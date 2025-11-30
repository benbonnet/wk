import { Checkbox } from "@ui/components/checkbox";
import { Label } from "@ui/components/label";
import type { InputComponentProps } from "./types";

export function InputCheckbox({
  field,
  helpers,
  name,
  label,
  disabled,
  t,
}: InputComponentProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={name}
        checked={field.value === true}
        onCheckedChange={(checked) => helpers.setValue(checked)}
        disabled={disabled}
      />
      {label && (
        <Label htmlFor={name} className="cursor-pointer">
          {t(label)}
        </Label>
      )}
    </div>
  );
}
