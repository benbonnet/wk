import { Badge } from "@ui/components/badge";
import type { DisplayComponentProps } from "./types";

export function DisplayTags({ value, emptyState }: DisplayComponentProps) {
  const tags = Array.isArray(value) ? value : [];
  if (tags.length === 0) {
    return <p className="text-sm">{emptyState}</p>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag, i) => (
        <Badge key={i} variant="outline">
          {String(tag)}
        </Badge>
      ))}
    </div>
  );
}
