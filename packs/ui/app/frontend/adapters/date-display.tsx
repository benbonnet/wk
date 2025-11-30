import { format, parseISO, formatDistanceToNow } from "date-fns";
import { Label } from "@ui/components/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui/components/tooltip";
import { useTranslate } from "@ui/lib/ui-renderer/provider";
import { useShowData } from "./show";
import type { DisplayProps } from "@ui/lib/ui-renderer/registry";

export function DateDisplay({ name, label, data }: DisplayProps) {
  const t = useTranslate();
  const showData = useShowData();

  const rawValue = data?.[name] ?? showData[name];

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
  const formatted = format(date, "PPP");
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
