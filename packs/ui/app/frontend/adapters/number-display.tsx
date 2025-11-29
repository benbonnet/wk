import { Label } from "@ui/components/label";
import { useTranslate } from "@ui/lib/ui-renderer/provider";
import { useShowData } from "./show";
import type { DisplayProps } from "@ui/lib/ui-renderer/registry";

export function NumberDisplay({ name, label, data }: DisplayProps) {
  const t = useTranslate();
  const showData = useShowData();

  const rawValue = data?.[name] ?? showData[name];
  const formattedValue =
    rawValue != null ? new Intl.NumberFormat().format(Number(rawValue)) : "—";

  return (
    <div className="space-y-1">
      {label && (
        <Label className="text-sm text-muted-foreground">{t(label)}</Label>
      )}
      <p className="text-sm font-medium tabular-nums">{formattedValue}</p>
    </div>
  );
}
