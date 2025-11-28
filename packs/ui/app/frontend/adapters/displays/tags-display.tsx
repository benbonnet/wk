import { Badge } from "@ui-components/ui/badge";
import { Label } from "@ui-components/ui/label";
import { useTranslate } from "@ui/provider";
import { useShowData } from "../layouts/show";
import type { DisplayProps } from "@ui/registry";

export function DISPLAY_TAGS({
  name,
  label,
  value,
}: DisplayProps) {
  const t = useTranslate();
  const showData = useShowData();

  const rawValue = value ?? (name ? showData[name] : undefined);
  const tags = Array.isArray(rawValue) ? rawValue : [];

  return (
    <div className="space-y-1">
      {label && (
        <Label className="text-sm text-muted-foreground">{t(label)}</Label>
      )}
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {String(tag)}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">—</span>
      )}
    </div>
  );
}
