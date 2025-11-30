import { Check, X } from "lucide-react";
import { Label } from "@ui/components/label";
import { useTranslate } from "@ui/lib/ui-renderer/provider";
import { useShowData } from "./show";
import type { DisplayProps } from "@ui/lib/ui-renderer/registry";

export function BooleanDisplay({ name, label, data }: DisplayProps) {
  const t = useTranslate();
  const showData = useShowData();

  const rawValue = data?.[name] ?? showData[name];
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
