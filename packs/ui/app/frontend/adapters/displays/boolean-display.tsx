import { Check, X } from "lucide-react";
import { Label } from "@ui-components/ui/label";
import { useTranslate } from "@ui/provider";
import { useShowData } from "../layouts/show";
import type { DisplayProps } from "@ui/registry";

export function DISPLAY_BOOLEAN({
  name,
  label,
  value,
}: DisplayProps) {
  const t = useTranslate();
  const showData = useShowData();

  const rawValue = value ?? (name ? showData[name] : undefined);
  const boolValue = Boolean(rawValue);

  return (
    <div className="space-y-1">
      {label && (
        <Label className="text-sm text-muted-foreground">{t(label)}</Label>
      )}
      <div className="flex items-center gap-2">
        {boolValue ? (
          <>
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">{t("Yes")}</span>
          </>
        ) : (
          <>
            <X className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{t("No")}</span>
          </>
        )}
      </div>
    </div>
  );
}
