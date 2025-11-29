import { Button } from "@ui/components/button";
import { Card, CardContent } from "@ui/components/card";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@ui/lib/utils";
import { useTranslate } from "@ui/lib/ui-renderer/provider";
import type { FormArrayProps } from "@ui/lib/ui-renderer/registry";
import type { UISchema } from "@ui/lib/ui-renderer/types";
import { DynamicRenderer } from "@ui/lib/ui-renderer/renderer";
import { useFormContext } from "./form";

export function FormArray({
  name,
  label,
  template = [],
  addLabel,
  removeLabel,
  className,
}: FormArrayProps) {
  const t = useTranslate();
  const form = useFormContext();

  const items = (form.getValue(name) as Record<string, unknown>[]) || [];

  const createEmptyItem = () => {
    const item: Record<string, unknown> = {};
    template.forEach((field: UISchema) => {
      if (field.name) item[field.name] = "";
    });
    return item;
  };

  const handleAdd = () => {
    form.setValue(name, [...items, createEmptyItem()]);
  };

  const handleRemove = (index: number) => {
    form.setValue(
      name,
      items.filter((_, i) => i !== index),
    );
  };

  return (
    <div data-ui="form-array" className={cn("space-y-4", className)}>
      {label && <h3 className="text-sm font-medium">{t(label)}</h3>}

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
              onClick={() => handleRemove(index)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">
                {removeLabel ? t(removeLabel) : t("Remove")}
              </span>
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button type="button" variant="outline" onClick={handleAdd}>
        <Plus className="mr-2 h-4 w-4" />
        {addLabel ? t(addLabel) : t("Add Item")}
      </Button>
    </div>
  );
}
