import { cn } from "@ui/utils";
import { useTranslate } from "@ui/provider";
import type { GroupProps } from "@ui/registry";

interface ExtendedGroupProps extends GroupProps {
  subtitle?: string;
  direction?: "VERTICAL" | "HORIZONTAL";
}

export function Group({
  label,
  subtitle,
  direction = "VERTICAL",
  className,
  children,
}: ExtendedGroupProps) {
  const t = useTranslate();
  const isHorizontal = direction === "HORIZONTAL";

  return (
    <div data-ui="group" className={cn("space-y-3", className)}>
      {(label || subtitle) && (
        <div className="space-y-1">
          {label && (
            <h3 className="text-sm font-medium leading-none">{t(label)}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-muted-foreground">{t(subtitle)}</p>
          )}
        </div>
      )}
      <div
        className={cn(
          isHorizontal ? "flex flex-wrap items-start gap-4" : "grid gap-4",
        )}
      >
        {children}
      </div>
    </div>
  );
}
