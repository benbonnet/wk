import { cn } from "@ui/utils";
import { useTranslate } from "@ui/provider";
import type { GroupProps } from "@ui/registry";

export function GROUP({
  schema,
  label,
  children,
}: GroupProps) {
  const t = useTranslate();

  const groupLabel = label || schema.label;
  const groupSubtitle = schema.subtitle;
  const direction = schema.direction || "VERTICAL";
  const isHorizontal = direction === "HORIZONTAL";

  return (
    <div data-ui="group" className={cn("space-y-3", schema.className)}>
      {/* Group Header */}
      {(groupLabel || groupSubtitle) && (
        <div className="space-y-1">
          {groupLabel && (
            <h3 className="text-sm font-medium leading-none">{t(groupLabel)}</h3>
          )}
          {groupSubtitle && (
            <p className="text-sm text-muted-foreground">{t(groupSubtitle)}</p>
          )}
        </div>
      )}

      {/* Group Content */}
      <div
        className={cn(
          isHorizontal ? "flex flex-wrap items-start gap-4" : "grid gap-4"
        )}
      >
        {children}
      </div>
    </div>
  );
}
