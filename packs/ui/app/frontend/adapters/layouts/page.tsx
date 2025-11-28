import { Separator } from "@ui-components/ui/separator";
import { cn } from "@ui/utils";
import { useTranslate } from "@ui/provider";
import type { PageProps } from "@ui/registry";
import { DynamicRenderer } from "@ui/renderer";

export function PAGE({
  schema,
  title,
  description,
  children,
}: PageProps) {
  const t = useTranslate();

  const pageTitle = title || schema.title;
  const pageDescription = description || schema.description;

  return (
    <div data-ui="page" className={cn("space-y-6", schema.className)}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {pageTitle && (
            <h1 className="text-2xl font-semibold tracking-tight">
              {t(pageTitle)}
            </h1>
          )}
          {pageDescription && (
            <p className="text-sm text-muted-foreground">
              {t(pageDescription)}
            </p>
          )}
        </div>
        {schema.actions && schema.actions.length > 0 && (
          <div className="flex items-center gap-2">
            {schema.actions.map((action, index) => (
              <DynamicRenderer key={index} schema={action} />
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Page Content */}
      <div>{children}</div>
    </div>
  );
}
