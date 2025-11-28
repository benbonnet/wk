import { Label } from "@ui-components/ui/label";
import { useTranslate } from "@ui/provider";
import { useShowData } from "../layouts/show";
import type { DisplayProps } from "@ui/registry";

export function DISPLAY_NUMBER({
  name,
  label,
  value,
}: DisplayProps) {
  const t = useTranslate();
  const showData = useShowData();

  const rawValue = value ?? (name ? showData[name] : undefined);

  const formattedValue =
    rawValue != null
      ? new Intl.NumberFormat().format(Number(rawValue))
      : "—";

  return (
    <div className="space-y-1">
      {label && (
        <Label className="text-sm text-muted-foreground">{t(label)}</Label>
      )}
      <p className="text-sm font-medium tabular-nums">{formattedValue}</p>
    </div>
  );
}
