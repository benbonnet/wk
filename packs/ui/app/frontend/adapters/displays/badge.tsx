import { Badge } from "@ui/components/badge";
import type { DisplayComponentProps } from "./types";

export function DisplayBadge({ value, isEmpty, emptyState, options = [], t }: DisplayComponentProps) {
  if (isEmpty) {
    return <p className="text-sm">{emptyState}</p>;
  }
  const badgeOption = options.find((o) => o.value === value);
  const badgeText = badgeOption ? t(badgeOption.label) : String(value);
  return <Badge variant="secondary">{badgeText}</Badge>;
}
