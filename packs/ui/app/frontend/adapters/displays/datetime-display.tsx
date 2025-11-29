import { format, parseISO, formatDistanceToNow } from "date-fns";
import { Label } from "@ui/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui/components/ui/tooltip";
import { useTranslate } from "@ui/lib/provider";
import { useShowData } from "../layouts/show";
import type { DisplayProps } from "@ui/lib/registry";

export function DISPLAY_DATETIME({ name, label, value }: DisplayProps) {
  const t = useTranslate();
  const showData = useShowData();

  const rawValue = value ?? (name ? showData[name] : undefined);

  if (!rawValue) {
    return (
      <div className="space-y-1">
        {label && (
          <Label className="text-sm text-muted-foreground">{t(label)}</Label>
        )}
        <p className="text-sm">—</p>
      </div>
    );
  }

  const date = parseISO(String(rawValue));
  const formatted = format(date, "PPP 'at' p"); // "January 1, 2025 at 2:30 PM"
  const relative = formatDistanceToNow(date, { addSuffix: true });

  return (
    <div className="space-y-1">
      {label && (
        <Label className="text-sm text-muted-foreground">{t(label)}</Label>
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="text-sm font-medium cursor-help">{formatted}</p>
        </TooltipTrigger>
        <TooltipContent>{relative}</TooltipContent>
      </Tooltip>
    </div>
  );
}
