import { Label } from "@ui/components/label";
import { useTranslate } from "@ui/lib/ui-renderer/provider";
import { useShowData } from "./show";
import type { DisplayProps } from "@ui/lib/ui-renderer/registry";

export function SelectDisplay({
  name,
  label,
  options = [],
  data,
}: DisplayProps) {
  const t = useTranslate();
  const showData = useShowData();

  const rawValue = data?.[name] ?? showData[name];
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
