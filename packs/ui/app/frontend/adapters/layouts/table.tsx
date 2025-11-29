import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/components/ui/table";
import { Input } from "@ui/components/ui/input";
import { Button } from "@ui/components/ui/button";
import { Checkbox } from "@ui/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { cn } from "@ui/lib/utils";
import { useTranslate, useServices } from "@ui/lib/provider";
import type { TableProps } from "@ui/lib/registry";
import type { UISchema, UISchemaColumn } from "@ui/lib/types";
import { useDrawer, useViewConfig } from "./view";

interface TableRow {
  id: string | number;
  [key: string]: unknown;
}

export function TABLE({
  schema,
  columns: columnsProp,
  data: dataProp = [],
  searchable,
  selectable,
  pageSize = 10,
  rowHref,
  rowClick,
  rowActions,
  onRowClick,
}: TableProps) {
  const t = useTranslate();
  const services = useServices();
  const { openDrawer } = useDrawer();
  const viewConfig = useViewConfig();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  // Fetch data using React Query
  const { data: fetchedData } = useQuery({
    queryKey: ["table", viewConfig.url],
    queryFn: async () => {
      const apiConfig = viewConfig.api?.index;
      if (!apiConfig || !viewConfig.url) return { data: [] };

      const url = `${viewConfig.url}${apiConfig.path ? `/${apiConfig.path}` : ""}`;
      const result = await services.fetch(url, { method: apiConfig.method });
      return result;
    },
    enabled: !!viewConfig.url && !!viewConfig.api?.index,
  });

  // Use fetched data or passed data prop
  const data = (fetchedData?.data as TableRow[]) ?? dataProp;

  // Use columns from prop or schema
  const schemaColumns = columnsProp ?? schema.columns ?? [];

  const isSearchable = searchable ?? schema.searchable;
  const isSelectable = selectable ?? schema.selectable;
  const tablePageSize = pageSize ?? schema.pageSize ?? 10;
  const tableRowActions = rowActions ?? schema.rowActions;
  const tableRowClick = rowClick ?? schema.rowClick;
  const tableRowHref = rowHref ?? schema.rowHref;

  // Transform schema columns to TanStack columns
  const columns: ColumnDef<TableRow>[] = useMemo(() => {
    const cols: ColumnDef<TableRow>[] = [];

    // Selection column
    if (isSelectable) {
      cols.push({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            onClick={(e) => e.stopPropagation()}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }

    // Data columns from schema
    schemaColumns.forEach((col: UISchemaColumn) => {
      cols.push({
        id: col.name,
        accessorKey: col.name,
        header: ({ column }) =>
          col.sortable !== false ? (
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t(col.label || col.name)}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <span>{t(col.label || col.name)}</span>
          ),
        cell: ({ getValue }) => {
          const value = getValue();
          // Simple display - in real implementation would use display adapters
          if (value == null)
            return <span className="text-muted-foreground">—</span>;
          if (typeof value === "boolean") return value ? "Yes" : "No";
          if (value instanceof Date) return value.toLocaleDateString();
          return String(value);
        },
      });
    });

    // Row actions column
    if (tableRowActions) {
      cols.push({
        id: "actions",
        cell: ({ row }) => (
          <RowActionsDropdown
            row={row.original}
            actions={tableRowActions.elements}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }

    return cols;
  }, [schemaColumns, isSelectable, tableRowActions, t]);

  const table = useReactTable({
    data: data as TableRow[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, rowSelection, globalFilter },
    initialState: { pagination: { pageSize: tablePageSize } },
  });

  const handleRowClick = (row: TableRow) => {
    if (onRowClick) {
      onRowClick(row as Record<string, unknown>);
    } else if (tableRowClick?.opens) {
      openDrawer(tableRowClick.opens, row as Record<string, unknown>);
    } else if (tableRowHref) {
      const href = tableRowHref.replace(/:(\w+)/g, (_, key) =>
        String(row[key] ?? ""),
      );
      services.navigate(href);
    }
  };

  const isClickable = !!(onRowClick || tableRowClick?.opens || tableRowHref);

  return (
    <div data-ui="table" data-testid="table-renderer" className={cn("space-y-4", schema.className)}>
      {/* Search */}
      {isSearchable && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t(schema.search_placeholder as string) || t("Search...")}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
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
                          header.getContext(),
                        )}
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
                  onClick={() => isClickable && handleRowClick(row.original)}
                  className={isClickable ? "cursor-pointer" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("No results.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {isSelectable && (
            <>
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            {t("Previous")}
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t("Next")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Row Actions Dropdown Component
function RowActionsDropdown({
  row,
  actions,
}: {
  row: TableRow;
  actions: UISchema[];
}) {
  const t = useTranslate();
  const services = useServices();
  const { openDrawer } = useDrawer();
  const viewConfig = useViewConfig();
  const queryClient = useQueryClient();

  const handleAction = async (action: UISchema, e: React.MouseEvent) => {
    e.stopPropagation();

    if (action.confirm) {
      const confirmed = await services.confirm(t(action.confirm));
      if (!confirmed) return;
    }

    if (action.opens) {
      openDrawer(action.opens, row as Record<string, unknown>);
    } else if (action.href) {
      const href = action.href.replace(/:(\w+)/g, (_, key) =>
        String(row[key] ?? ""),
      );
      services.navigate(href);
    } else if (action.api) {
      try {
        // Handle api as string (action name) or object
        let apiConfig: { method: string; path: string };

        if (typeof action.api === "string") {
          // It's an action name like "destroy" - look it up in the registry
          const endpoint = viewConfig.api[action.api];
          if (endpoint) {
            let path = endpoint.path;
            // Interpolate path with row data
            path = path.replace(/:(\w+)/g, (_, key) => String(row[key] ?? ""));
            apiConfig = { method: endpoint.method, path: `${viewConfig.url}/${path}` };
          } else {
            // Fallback to parsing as "METHOD path" format
            apiConfig = parseApiString(action.api, row);
          }
        } else {
          apiConfig = action.api as { method: string; path: string };
        }

        await services.fetch(apiConfig.path, { method: apiConfig.method });

        // Invalidate table queries after successful action
        await queryClient.invalidateQueries({ queryKey: ["table", viewConfig.url] });

        if (action.notification?.success) {
          services.toast({ type: "success", message: t(action.notification.success) });
        }
      } catch {
        if (action.notification?.error) {
          services.toast({ type: "error", message: t(action.notification.error) });
        }
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={(e) => handleAction(action, e)}
            className={cn(
              action.variant === "destructive" &&
                "text-destructive focus:text-destructive",
            )}
          >
            {t(action.label || "")}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function parseApiString(
  api: string,
  row: TableRow,
): { method: string; path: string } {
  const [method, ...pathParts] = api.split(" ");
  let path = pathParts.join(" ");
  // Replace :id placeholders with actual values
  path = path.replace(/:(\w+)/g, (_, key) => String(row[key] ?? ""));
  return { method: method || "GET", path: path || api };
}
