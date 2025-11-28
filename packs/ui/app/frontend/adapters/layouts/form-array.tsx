import { Button } from "@ui-components/ui/button";
import { Card, CardContent } from "@ui-components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@ui/utils";
import { useTranslate } from "@ui/provider";
import type { FormArrayProps } from "@ui/registry";
import { DynamicRenderer } from "@ui/renderer";
import { useFormContext } from "./form";

export function FORM_ARRAY({
  schema,
  name,
  template,
  addLabel,
  removeLabel,
}: FormArrayProps) {
  const t = useTranslate();
  const form = useFormContext();

  const fieldName = name || schema.name!;
  const items = (form.getValue(fieldName) as Record<string, unknown>[]) || [];
  const templateSchema = template || schema.template || [];

  // Create empty item from template
  const createEmptyItem = () => {
    const item: Record<string, unknown> = {};
    templateSchema.forEach((field) => {
      if (field.name) {
        item[field.name] = "";
      }
    });
    return item;
  };

  const handleAdd = () => {
    form.setValue(fieldName, [...items, createEmptyItem()]);
  };

  const handleRemove = (index: number) => {
    form.setValue(
      fieldName,
      items.filter((_, i) => i !== index)
    );
  };

  return (
    <div data-ui="form-array" className={cn("space-y-4", schema.className)}>
      {/* Label */}
      {schema.label && (
        <h3 className="text-sm font-medium">{t(schema.label)}</h3>
      )}

      {/* Items */}
      {items.map((_, index) => (
        <Card key={index} className="relative">
          <CardContent className="pt-6 pb-4">
            {/* Render template fields with array index */}
            <div className="space-y-4">
              {templateSchema.map((field, fieldIndex) => (
                <DynamicRenderer
                  key={fieldIndex}
                  schema={{
                    ...field,
                    name: `${fieldName}.${index}.${field.name}`,
                  }}
                />
              ))}
            </div>

            {/* Remove Button */}
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

      {/* Add Button */}
      <Button type="button" variant="outline" onClick={handleAdd}>
        <Plus className="mr-2 h-4 w-4" />
        {addLabel ? t(addLabel) : schema.addLabel ? t(schema.addLabel) : t("Add Item")}
      </Button>
    </div>
  );
}
