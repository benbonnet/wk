import { Badge } from "@ui/components/ui/badge";
import { Label } from "@ui/components/ui/label";
import { cn } from "@ui/lib/utils";
import { useTranslate } from "@ui/lib/provider";
import { useShowData } from "../layouts/show";
import type { DisplayProps } from "@ui/lib/registry";

// Color mapping for common status values
const statusColors: Record<string, string> = {
  // Status
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  failed: "bg-red-100 text-red-800 border-red-200",
  cancelled: "bg-gray-100 text-gray-800 border-gray-200",

  // Priority
  low: "bg-gray-100 text-gray-800 border-gray-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  critical: "bg-red-100 text-red-800 border-red-200",

  // Boolean
  true: "bg-green-100 text-green-800 border-green-200",
  false: "bg-gray-100 text-gray-800 border-gray-200",
};

export function DISPLAY_BADGE({
  name,
  label,
  value,
  options = [],
}: DisplayProps) {
  const t = useTranslate();
  const showData = useShowData();

  const rawValue = value ?? (name ? showData[name] : undefined);

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

  // Find label from options if available
  const displayLabel =
    options?.find((o) => o.value === rawValue)?.label || String(rawValue);

  // Get color class
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
