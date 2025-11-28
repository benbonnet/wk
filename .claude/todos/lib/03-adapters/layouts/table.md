# TABLE Adapter

## Purpose

Data table with sorting, filtering, pagination, and row actions. Built on TanStack Table + shadcn Table components.

## Registry Interface

```ts
export interface TableProps extends BaseRendererProps {
  columns: UISchemaColumn[];
  data?: Array<{ id: string | number; data: Record<string, unknown> }>;
  onRowClick?: (row: unknown) => void;
  searchable?: boolean;
  selectable?: boolean;
  pageSize?: number;
}
```

## shadcn Components Used

- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`
- `Input` (for search)
- `Button` (for pagination)
- `Checkbox` (for row selection)
- `DropdownMenu` (for row actions)
- `Badge` (for status columns)

## Implementation

```tsx
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui-components/ui/table";
import { Input } from "@ui-components/ui/input";
import { Button } from "@ui-components/ui/button";
import { Checkbox } from "@ui-components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import type { TableProps } from "@ui/registry";

export function TableAdapter({
  schema,
  columns: schemaColumns,
  data = [],
  onRowClick,
  searchable,
  selectable,
  pageSize = 10,
}: TableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  // Transform schema columns to TanStack columns
  const columns: ColumnDef<any>[] = useMemo(() => {
    const cols: ColumnDef<any>[] = [];

    // Selection column
    if (selectable || schema.selectable) {
      cols.push({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        ),
      });
    }

    // Data columns from schema
    schemaColumns.forEach((col) => {
      cols.push({
        id: col.name,
        accessorFn: (row) => row.data[col.name],
        header: ({ column }) =>
          col.sortable !== false ? (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              {col.label || col.name}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            col.label || col.name
          ),
        cell: ({ getValue }) => {
          // Render based on col.kind using display adapters
          return <DisplayRenderer kind={col.kind} value={getValue()} />;
        },
      });
    });

    // Row actions column
    if (schema.rowActions) {
      cols.push({
        id: "actions",
        cell: ({ row }) => <RowActionsDropdown row={row} config={schema.rowActions} />,
      });
    }

    return cols;
  }, [schemaColumns, selectable, schema]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, rowSelection, globalFilter },
    initialState: { pagination: { pageSize } },
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      {(searchable || schema.searchable) && (
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick?.(row.original)}
                  className={onRowClick ? "cursor-pointer" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
```

## Schema Example

```json
{
  "type": "TABLE",
  "searchable": true,
  "selectable": true,
  "pageSize": 20,
  "columns": [
    { "name": "email", "kind": "DISPLAY_TEXT", "label": "Email", "sortable": true },
    { "name": "status", "kind": "DISPLAY_BADGE", "label": "Status" },
    { "name": "created_at", "kind": "DISPLAY_DATE", "label": "Created" }
  ],
  "rowClick": { "opens": "edit-user" },
  "rowActions": {
    "icon": "MoreHorizontal",
    "elements": [
      { "type": "OPTION", "label": "Edit", "opens": "edit-user" },
      { "type": "OPTION", "label": "Delete", "api": "DELETE /users/:id", "confirm": "Delete this user?" }
    ]
  }
}
```

## Notes

- Column `kind` determines display adapter (DISPLAY_TEXT, DISPLAY_BADGE, etc.)
- Row actions use DropdownMenu with OPTION adapters
- Bulk actions shown when rows selected
- Data fetching handled externally via React Query
