import { useFormikContext, FieldArray } from "formik";
import { Button } from "@ui/components/button";
import { Card, CardContent } from "@ui/components/card";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@ui/lib/utils";
import { useTranslate } from "@ui/lib/ui-renderer/provider";
import type { FormArrayProps } from "@ui/lib/ui-renderer/registry";
import type { UISchema } from "@ui/lib/ui-renderer/types";
import { DynamicRenderer } from "@ui/lib/ui-renderer/renderer";

export function FormArray({
  name,
  label,
  template = [],
  addLabel,
  removeLabel,
  className,
}: FormArrayProps) {
  const t = useTranslate();
  const { values } = useFormikContext<Record<string, unknown>>();

  // Get nested value from path like "addresses" or "contacts.children"
  const getNestedValue = (obj: Record<string, unknown>, path: string): unknown[] => {
    const parts = path.split(".");
    let current: unknown = obj;
    for (const part of parts) {
      if (current === null || current === undefined) return [];
      current = (current as Record<string, unknown>)[part];
    }
    return (current as unknown[]) || [];
  };

  const items = getNestedValue(values, name);

  const createEmptyItem = () => {
    const item: Record<string, unknown> = {};
    template.forEach((field: UISchema) => {
      if (field.name) item[field.name] = "";
    });
    return item;
  };

  return (
    <FieldArray name={name}>
      {({ push, remove }) => (
        <div data-ui="form-array" className={cn("space-y-4", className)}>
          {label && <h3 className="text-sm font-medium">{t(label)}</h3>}

          {items.length === 0 && (
            <p className="text-sm text-muted-foreground">{t("No items")}</p>
          )}

          {items.map((_, index) => (
            <Card key={index} className="relative">
              <CardContent className="pt-6 pb-4">
                <div className="space-y-4">
                  {template.map((field: UISchema, fieldIndex: number) => (
                    <DynamicRenderer
                      key={fieldIndex}
                      schema={{ ...field, name: `${name}.${index}.${field.name}` }}
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">
                    {removeLabel ? t(removeLabel) : t("Remove")}
                  </span>
                </Button>
              </CardContent>
            </Card>
          ))}

          <Button type="button" variant="outline" onClick={() => push(createEmptyItem())}>
            <Plus className="mr-2 h-4 w-4" />
            {addLabel ? t(addLabel) : t("Add Item")}
          </Button>
        </div>
      )}
    </FieldArray>
  );
}
