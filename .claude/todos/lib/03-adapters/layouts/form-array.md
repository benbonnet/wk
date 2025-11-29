# FORM_ARRAY Adapter

## Purpose

Repeatable form fields for arrays (e.g., multiple addresses, phone numbers).

## Registry Interface

```ts
export interface FormArrayProps extends BaseRendererProps {
  name: string;
  addLabel?: string;
  removeLabel?: string;
  template: UISchemaInterface[];
}
```

## shadcn Components Used

- `Button` (add/remove)
- `Card` (optional wrapper for each item)
- `Separator`

## Implementation (Formik)

```tsx
import { FieldArray, useFormikContext } from "formik";
import { Button } from "@ui-components/button";
import { Card, CardContent } from "@ui-components/card";
import { Plus, Trash2 } from "lucide-react";
import type { FormArrayProps } from "@ui/registry";

export function FormArrayAdapter({
  schema,
  name,
  addLabel = "Add Item",
  removeLabel,
  template,
  children,
}: FormArrayProps) {
  const { values } = useFormikContext<Record<string, unknown[]>>();
  const fieldName = name || schema.name!;
  const items = (values[fieldName] as unknown[]) || [];

  // Create empty item from template
  const createEmptyItem = () => {
    const item: Record<string, unknown> = {};
    template.forEach((field) => {
      if (field.name) {
        item[field.name] = "";
      }
    });
    return item;
  };

  return (
    <FieldArray name={fieldName}>
      {({ push, remove }) => (
        <div className={cn("space-y-4", schema.className)}>
          {/* Label */}
          {schema.label && (
            <h3 className="text-sm font-medium">{schema.label}</h3>
          )}

          {/* Items */}
          {items.map((_, index) => (
            <Card key={index} className="relative">
              <CardContent className="pt-6">
                {/* Render template fields with array index */}
                <div className="space-y-4">
                  {template.map((field) => (
                    <DynamicRenderer
                      key={field.name}
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
                  className="absolute top-2 right-2"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}

          {/* Add Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => push(createEmptyItem())}
          >
            <Plus className="mr-2 h-4 w-4" />
            {addLabel || schema.addLabel || "Add Item"}
          </Button>
        </div>
      )}
    </FieldArray>
  );
}
```

## Simple List Variant

```tsx
// For simple string arrays (e.g., tags, emails)
export function SimpleFormArrayAdapter({ name, addLabel }: FormArrayProps) {
  const { values } = useFormikContext<Record<string, string[]>>();
  const items = values[name] || [];

  return (
    <FieldArray name={name}>
      {({ push, remove }) => (
        <div className="space-y-2">
          {items.map((_, index) => (
            <div key={index} className="flex gap-2">
              <Input name={`${name}.${index}`} />
              <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={() => push("")}>
            <Plus className="mr-2 h-4 w-4" />
            {addLabel}
          </Button>
        </div>
      )}
    </FieldArray>
  );
}
```

## Schema Example

```json
{
  "type": "FORM",
  "elements": [
    {
      "type": "FORM_ARRAY",
      "name": "addresses",
      "label": "Addresses",
      "addLabel": "Add Address",
      "template": [
        { "type": "COMPONENT", "name": "street", "kind": "INPUT_TEXT", "label": "Street" },
        { "type": "COMPONENT", "name": "city", "kind": "INPUT_TEXT", "label": "City" },
        { "type": "COMPONENT", "name": "zip", "kind": "INPUT_TEXT", "label": "ZIP" }
      ]
    }
  ]
}
```

## Notes

- Template defines the shape of each array item
- Field names in template are relative (street, not addresses.0.street)
- Adapter prefixes with array path automatically
- Empty items created from template structure
