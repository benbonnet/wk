import { Label } from "@ui-components/label";
import { useTranslate } from "@ui/provider";
import { useShowData } from "./show";
import type { DisplayProps } from "@ui/registry";

export function TextDisplay({ name, label, data }: DisplayProps) {
  const t = useTranslate();
  const showData = useShowData();

  const displayValue = data?.[name] ?? showData[name];

  return (
    <div className="space-y-1">
      {label && (
        <Label className="text-sm text-muted-foreground">{t(label)}</Label>
      )}
      <p className="text-sm font-medium">
        {displayValue != null ? String(displayValue) : "—"}
      </p>
    </div>
  );
}
