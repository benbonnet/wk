import { Separator } from "@ui/components/separator";
import { cn } from "@ui/lib/utils";
import { useTranslate } from "@ui/lib/ui-renderer/provider";
import type { PageProps } from "@ui/lib/ui-renderer/registry";
import type { UISchema } from "@ui/lib/ui-renderer/types";
import { DynamicRenderer } from "@ui/lib/ui-renderer/renderer";

export function Page({
  title,
  description,
  actions = [],
  className,
  children,
}: PageProps) {
  const t = useTranslate();

  return (
    <div data-ui="page" className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {title && (
            <h1 className="text-2xl font-semibold tracking-tight">
              {t(title)}
            </h1>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{t(description)}</p>
          )}
        </div>
        {actions.length > 0 && (
          <div className="flex items-center gap-2">
            {actions.map((action: UISchema, index: number) => (
              <DynamicRenderer key={index} schema={action} />
            ))}
          </div>
        )}
      </div>

      <Separator />

      <div>{children}</div>
    </div>
  );
}
