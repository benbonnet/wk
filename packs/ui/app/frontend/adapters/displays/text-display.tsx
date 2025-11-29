import { Label } from "@ui/components/ui/label";
import { cn } from "@ui/lib/utils";
import { useTranslate } from "@ui/lib/provider";
import { useShowData } from "../layouts/show";
import type { DisplayProps } from "@ui/lib/registry";

export function DISPLAY_TEXT({ name, label, value }: DisplayProps) {
  const t = useTranslate();
  const showData = useShowData();

  const displayValue = value ?? (name ? showData[name] : undefined);

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
