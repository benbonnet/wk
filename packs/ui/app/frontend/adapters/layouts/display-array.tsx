import { Card, CardContent } from "@ui/components/ui/card";
import { cn } from "@ui/lib/utils";
import { useTranslate } from "@ui/lib/provider";
import type { DisplayArrayProps } from "@ui/lib/registry";
import { DynamicRenderer } from "@ui/lib/renderer";
import { ShowContext, useShowData } from "./show";

export function DISPLAY_ARRAY({
  schema,
  name,
  template,
  children,
}: DisplayArrayProps) {
  const t = useTranslate();
  const showData = useShowData();

  const fieldName = name || schema.name!;
  const items = (showData[fieldName] as Record<string, unknown>[]) || [];
  const templateSchema = template || schema.template || [];
  const emptyMessage = schema.emptyMessage || "No items";

  if (items.length === 0) {
    return (
      <div
        data-ui="display-array"
        className={cn("space-y-4", schema.className)}
      >
        {schema.label && (
          <h3 className="text-sm font-medium">{t(schema.label)}</h3>
        )}
        <p className="text-sm text-muted-foreground">{t(emptyMessage)}</p>
      </div>
    );
  }

  return (
    <div data-ui="display-array" className={cn("space-y-4", schema.className)}>
      {schema.label && (
        <h3 className="text-sm font-medium">{t(schema.label)}</h3>
      )}

      <div className="space-y-3">
        {items.map((item, index) => (
          <Card key={index}>
            <CardContent className="pt-4">
              {/* Render template elements with item data */}
              <ShowContext.Provider value={{ data: item }}>
                {templateSchema.length > 0
                  ? templateSchema.map((field, fieldIndex) => (
                      <DynamicRenderer key={fieldIndex} schema={field} />
                    ))
                  : children}
              </ShowContext.Provider>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
