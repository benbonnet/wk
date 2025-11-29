import { Card, CardContent } from "@ui-components/card";
import { cn } from "@ui/utils";
import { useTranslate } from "@ui/provider";
import type { DisplayArrayProps } from "@ui/registry";
import type { UISchema } from "@ui/types";
import { DynamicRenderer } from "@ui/renderer";
import { ShowContext, useShowData } from "./show";

interface ExtendedDisplayArrayProps extends DisplayArrayProps {
  emptyMessage?: string;
}

export function DisplayArray({
  name,
  label,
  template = [],
  emptyMessage = "No items",
  className,
  children,
}: ExtendedDisplayArrayProps) {
  const t = useTranslate();
  const showData = useShowData();

  const items = (showData[name] as Record<string, unknown>[]) || [];

  if (items.length === 0) {
    return (
      <div data-ui="display-array" className={cn("space-y-4", className)}>
        {label && <h3 className="text-sm font-medium">{t(label)}</h3>}
        <p className="text-sm text-muted-foreground">{t(emptyMessage)}</p>
      </div>
    );
  }

  return (
    <div data-ui="display-array" className={cn("space-y-4", className)}>
      {label && <h3 className="text-sm font-medium">{t(label)}</h3>}

      <div className="space-y-3">
        {items.map((item, index) => (
          <Card key={index}>
            <CardContent className="pt-4">
              <ShowContext.Provider value={{ data: item }}>
                {template.length > 0
                  ? template.map((field: UISchema, fieldIndex: number) => (
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
