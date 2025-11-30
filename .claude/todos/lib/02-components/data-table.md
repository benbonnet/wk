# Data Table Component Documentation

## Overview

The Data Table component provides "powerful table and datagrids built using TanStack Table." Rather than a single pre-built component, this guide demonstrates building custom data tables leveraging TanStack Table and shadcn/ui's base `<Table />` component.

## Installation

Install the base Table component and TanStack Table dependency:

```bash
pnpm dlx shadcn@latest add table
pnpm add @tanstack/react-table
```

## Project Structure

Organize your data table implementation as follows:

```
app/payments/
├── columns.tsx      (column definitions)
├── data-table.tsx   (DataTable component)
└── page.tsx         (page rendering)
```

## Basic Implementation

### Column Definitions

Define your data shape and column configuration in `columns.tsx`:

```typescript
"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]
```

### DataTable Component

Create a reusable `<DataTable />` component in `data-table.tsx`:

```typescript
"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
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
  )
}
```

## Advanced Features

### Cell Formatting

Format cells with custom rendering (e.g., currency):

```typescript
{
  accessorKey: "amount",
  header: () => <div className="text-right">Amount</div>,
  cell: ({ row }) => {
    const amount = parseFloat(row.getValue("amount"))
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
    return <div className="text-right font-medium">{formatted}</div>
  },
}
```

### Sorting

Enable column sorting with the `getSortedRowModel`:

```typescript
const [sorting, setSorting] = useState<SortingState>([])

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: setSorting,
  state: { sorting },
})
```

Add sortable header cells:

```typescript
{
  accessorKey: "email",
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Email
      <ArrowUpDown />
    </Button>
  ),
}
```

### Filtering

Implement column filtering:

```typescript
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

const table = useReactTable({
  onColumnFiltersChange: setColumnFilters,
  getFilteredRowModel: getFilteredRowModel(),
  state: { columnFilters },
})

// In JSX:
<Input
  placeholder="Filter emails..."
  value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
  onChange={(event) =>
    table.getColumn("email")?.setFilterValue(event.target.value)
  }
/>
```

### Pagination

Add pagination functionality:

```typescript
const table = useReactTable({
  getPaginationRowModel: getPaginationRowModel(),
})

// Controls:
<Button onClick={() => table.previousPage()}>Previous</Button>
<Button onClick={() => table.nextPage()}>Next</Button>
```

### Column Visibility

Toggle column visibility with a dropdown:

```typescript
const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

<DropdownMenu>
  <DropdownMenuTrigger>Columns</DropdownMenuTrigger>
  <DropdownMenuContent>
    {table
      .getAllColumns()
      .filter((column) => column.getCanHide())
      .map((column) => (
        <DropdownMenuCheckboxItem
          key={column.id}
          checked={column.getIsVisible()}
          onCheckedChange={(value) => column.toggleVisibility(!!value)}
        >
          {column.id}
        </DropdownMenuCheckboxItem>
      ))}
  </DropdownMenuContent>
</DropdownMenu>
```

### Row Selection

Enable row selection with checkboxes:

```typescript
const [rowSelection, setRowSelection] = useState({})

const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
]
```

Display selected count:

```typescript
<div>
  {table.getFilteredSelectedRowModel().rows.length} of{" "}
  {table.getFilteredRowModel().rows.length} row(s) selected.
</div>
```

## Row Actions

Add dropdown actions per row:

```typescript
{
  id: "actions",
  cell: ({ row }) => {
    const payment = row.original
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(payment.id)}
          >
            Copy ID
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}
```

## Key Notes

- The guide emphasizes flexibility through headless UI principles rather than rigid component constraints
- Extract reusable table components when needed across multiple pages
- Combine features (sorting, filtering, pagination, visibility) as needed for your use case
- Reference [TanStack Table documentation](https://tanstack.com/table/v8/docs/introduction) for advanced customization
