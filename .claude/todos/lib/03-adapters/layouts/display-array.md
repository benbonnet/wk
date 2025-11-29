# DISPLAY_ARRAY Adapter

## Purpose

Display-only list of items (read-only version of FORM_ARRAY).

## Registry Interface

```ts
export interface DisplayArrayProps extends BaseRendererProps {
  name: string;
  data?: unknown[];
}
```

## shadcn Components Used

- `Card` (optional wrapper)
- `Separator`
- `Table` (for tabular display)

## Implementation

```tsx
import { Card, CardContent } from "@ui-components/card";
import { Separator } from "@ui-components/separator";
import { useShowData } from "./show";
import type { DisplayArrayProps } from "@ui/registry";

export function DisplayArrayAdapter({
  schema,
  name,
  data,
  children,
}: DisplayArrayProps) {
  const showData = useShowData();
  const fieldName = name || schema.name!;
  const items = data || (showData[fieldName] as unknown[]) || [];

  if (items.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        {schema.emptyMessage || "No items"}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", schema.className)}>
      {schema.label && (
        <h3 className="text-sm font-medium">{schema.label}</h3>
      )}

      <div className="space-y-3">
        {items.map((item, index) => (
          <Card key={index}>
            <CardContent className="pt-4">
              {/* Render template elements with item data */}
              <ShowContext.Provider value={{ data: item as Record<string, unknown> }}>
                {children}
              </ShowContext.Provider>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

## Table Display Variant

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@ui-components/table";

export function DisplayArrayTableAdapter({
  schema,
  name,
  data,
}: DisplayArrayProps) {
  const showData = useShowData();
  const items = data || (showData[name!] as Record<string, unknown>[]) || [];
  const columns = schema.columns || [];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.name}>{col.label || col.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              {columns.map((col) => (
                <TableCell key={col.name}>
                  <DisplayRenderer kind={col.kind} value={item[col.name]} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

## Schema Example

```json
{
  "type": "SHOW",
  "elements": [
    {
      "type": "DISPLAY_ARRAY",
      "name": "addresses",
      "label": "Addresses",
      "emptyMessage": "No addresses on file",
      "elements": [
        { "type": "COMPONENT", "name": "street", "kind": "DISPLAY_TEXT" },
        { "type": "COMPONENT", "name": "city", "kind": "DISPLAY_TEXT" },
        { "type": "COMPONENT", "name": "zip", "kind": "DISPLAY_TEXT" }
      ]
    }
  ]
}
```

## Notes

- Read-only display of array data
- Each item renders child elements with item context
- Supports card list or table display modes
- Empty state message configurable
