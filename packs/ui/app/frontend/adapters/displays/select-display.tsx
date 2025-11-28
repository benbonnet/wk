import { Label } from "@ui-components/ui/label";
import { useTranslate } from "@ui/provider";
import { useShowData } from "../layouts/show";
import type { DisplayProps } from "@ui/registry";

export function DISPLAY_SELECT({
  name,
  label,
  value,
  options = [],
}: DisplayProps) {
  const t = useTranslate();
  const showData = useShowData();

  const rawValue = value ?? (name ? showData[name] : undefined);

  // Find the label for the selected value
  const selectedOption = options.find((opt) => opt.value === rawValue);
  const displayValue = selectedOption?.label
    ? t(selectedOption.label)
    : rawValue
    ? String(rawValue)
    : "—";

  return (
    <div className="space-y-1">
      {label && (
        <Label className="text-sm text-muted-foreground">{t(label)}</Label>
      )}
      <p className="text-sm font-medium">{displayValue}</p>
    </div>
  );
}
