# RELATIONSHIP_PICKER Adapter

## Purpose

Picker for selecting related records (one or many). Displays searchable table or list.

## Registry Interface

```ts
export interface RelationshipPickerProps extends BaseRendererProps {
  name: string;
  cardinality: "one" | "many";
  relationSchema: string;
  columns: UISchemaColumn[];
}
```

## shadcn Components Used

- `Dialog` / `Sheet`
- `Button`
- `Input` (search)
- `Table`
- `Checkbox` (for multi-select)
- `Badge` (to show selected)
- `ScrollArea`

## Implementation

```tsx
import { useState } from "react";
import { useField } from "formik";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@ui-components/dialog";
import { Button } from "@ui-components/button";
import { Input } from "@ui-components/input";
import { Badge } from "@ui-components/badge";
import { Checkbox } from "@ui-components/checkbox";
import { ScrollArea } from "@ui-components/scroll-area";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@ui-components/table";
import { X, Plus, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { RelationshipPickerProps } from "@ui/registry";

export function RelationshipPickerAdapter({
  schema,
  name,
  cardinality,
  relationSchema,
  columns,
}: RelationshipPickerProps) {
  const fieldName = name || schema.name!;
  const [field, , helpers] = useField(fieldName);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tempSelection, setTempSelection] = useState<string[]>([]);

  const isSingle = (cardinality || schema.cardinality) === "one";
  const schemaName = relationSchema || schema.relationSchema!;
  const cols = columns || schema.columns || [];

  // Fetch related records
  const { data: records = [] } = useQuery({
    queryKey: [schemaName, search],
    queryFn: () => fetchRecords(schemaName, search),
    enabled: open,
  });

  // Current selection
  const selectedIds = isSingle
    ? field.value ? [field.value] : []
    : (field.value as string[]) || [];

  const handleOpen = () => {
    setTempSelection(selectedIds);
    setOpen(true);
  };

  const handleConfirm = () => {
    if (isSingle) {
      helpers.setValue(tempSelection[0] || null);
    } else {
      helpers.setValue(tempSelection);
    }
    setOpen(false);
  };

  const toggleSelection = (id: string) => {
    if (isSingle) {
      setTempSelection([id]);
    } else {
      setTempSelection((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    }
  };

  const removeSelected = (id: string) => {
    if (isSingle) {
      helpers.setValue(null);
    } else {
      helpers.setValue(selectedIds.filter((x) => x !== id));
    }
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      {schema.label && (
        <label className="text-sm font-medium">{schema.label}</label>
      )}

      {/* Selected Items */}
      <div className="flex flex-wrap gap-2">
        {selectedIds.map((id) => (
          <Badge key={id} variant="secondary" className="gap-1">
            {id}
            <button type="button" onClick={() => removeSelected(id)}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={handleOpen}>
          <Plus className="mr-1 h-3 w-3" />
          {isSingle ? "Select" : "Add"}
        </Button>
      </div>

      {/* Picker Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Select {schema.label || schemaName}
            </DialogTitle>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Records Table */}
          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10" />
                  {cols.map((col) => (
                    <TableHead key={col.name}>{col.label || col.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record: any) => (
                  <TableRow
                    key={record.id}
                    className="cursor-pointer"
                    onClick={() => toggleSelection(record.id)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={tempSelection.includes(record.id)}
                        onCheckedChange={() => toggleSelection(record.id)}
                      />
                    </TableCell>
                    {cols.map((col) => (
                      <TableCell key={col.name}>
                        {record.data[col.name]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              {schema.confirmLabel || "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

async function fetchRecords(schema: string, search: string) {
  const res = await fetch(`/api/${schema}?search=${search}`);
  return res.json();
}
```

## Schema Example

```json
{
  "type": "RELATIONSHIP_PICKER",
  "name": "assigned_users",
  "label": "Assigned Users",
  "cardinality": "many",
  "relationSchema": "users",
  "columns": [
    { "name": "email", "kind": "DISPLAY_TEXT", "label": "Email" },
    { "name": "name", "kind": "DISPLAY_TEXT", "label": "Name" }
  ],
  "confirmLabel": "Assign Users"
}
```

## Notes

- Single cardinality stores string ID
- Many cardinality stores array of IDs
- Fetches related records on dialog open
- Search filters server-side
- Shows selected as badges with remove button
