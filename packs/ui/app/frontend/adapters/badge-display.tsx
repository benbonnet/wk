import { Badge } from "@ui/components/badge";
import { Label } from "@ui/components/label";
import { useTranslate } from "@ui/lib/ui-renderer/provider";
import { useShowData } from "./show";
import type { DisplayProps } from "@ui/lib/ui-renderer/registry";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  failed: "bg-red-100 text-red-800 border-red-200",
  cancelled: "bg-gray-100 text-gray-800 border-gray-200",
  low: "bg-gray-100 text-gray-800 border-gray-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  critical: "bg-red-100 text-red-800 border-red-200",
  true: "bg-green-100 text-green-800 border-green-200",
  false: "bg-gray-100 text-gray-800 border-gray-200",
};

export function BadgeDisplay({
  name,
  label,
  options = [],
  data,
}: DisplayProps) {
  const t = useTranslate();
  const showData = useShowData();

  const rawValue = data?.[name] ?? showData[name];

  if (rawValue == null) {
    return (
      <div className="space-y-1">
        {label && (
          <Label className="text-sm text-muted-foreground">{t(label)}</Label>
        )}
        <span className="text-sm">—</span>
      </div>
    );
  }

  const stringValue = String(rawValue).toLowerCase();
  const displayLabel =
    options?.find((o) => o.value === rawValue)?.label || String(rawValue);
  const colorClass = statusColors[stringValue] || "bg-gray-100 text-gray-800";

  return (
    <div className="space-y-1">
      {label && (
        <Label className="text-sm text-muted-foreground">{t(label)}</Label>
      )}
      <Badge variant="outline" className={colorClass}>
        {t(displayLabel)}
      </Badge>
    </div>
  );
}
