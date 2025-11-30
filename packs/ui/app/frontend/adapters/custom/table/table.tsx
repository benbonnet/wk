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
  Table as TableUI,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/components/table";
import { Input } from "@ui/components/input";
import { Button } from "@ui/components/button";
import { Checkbox } from "@ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import {
  ArrowUpDown,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { cn } from "@ui/lib/utils";
import { useTranslate, useServices } from "@ui/lib/ui-renderer/provider";
import type { TableProps } from "@ui/lib/ui-renderer/registry";
import type { UISchema, UISchemaColumn } from "@ui/lib/ui-renderer/types";
import { useDrawer, useViewConfig } from "../view";

interface DataTableRow {
  id: string | number;
  [key: string]: unknown;
}

export function Table({
  columns: columnsProp = [],
  searchable,
  selectable,
  pageSize = 10,
  rowHref,
  rowClick,
  rowActions,
  search_placeholder,
  onRowClick,
  className,
  data: dataProp = [],
}: TableProps) {
  const t = useTranslate();
  const services = useServices();
  const { openDrawer } = useDrawer();
  const viewConfig = useViewConfig();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

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

  // Flatten data: API returns { id, data: {...} }, we need { id, ...data }
  const rawData = Array.isArray(fetchedData?.data)
    ? fetchedData.data
    : Array.isArray(dataProp)
      ? dataProp
      : [];
  const data = (rawData as DataTableRow[]).map((item) => {
    if (item.data && typeof item.data === "object") {
      return { id: item.id, ...(item.data as Record<string, unknown>) };
    }
    return item;
  });

  const columns: ColumnDef<DataTableRow>[] = useMemo(() => {
    const cols: ColumnDef<DataTableRow>[] = [];

    if (selectable) {
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

    columnsProp.forEach((col: UISchemaColumn) => {
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
          if (value == null)
            return <span className="text-muted-foreground">—</span>;
          if (typeof value === "boolean") return value ? "Yes" : "No";
          if (value instanceof Date) return value.toLocaleDateString();
          return String(value);
        },
      });
    });

    if (rowActions) {
      cols.push({
        id: "actions",
        cell: ({ row }) => (
          <RowActionsDropdown
            row={row.original}
            actions={rowActions.elements}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }

    return cols;
  }, [columnsProp, selectable, rowActions, t]);

  const table = useReactTable({
    data: data as DataTableRow[],
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

  const handleRowClick = (row: DataTableRow) => {
    if (onRowClick) {
      onRowClick(row as Record<string, unknown>);
    } else if (rowClick?.opens) {
      openDrawer(rowClick.opens, row as Record<string, unknown>);
    } else if (rowClick?.href || rowHref) {
      const hrefTemplate = rowClick?.href || rowHref || "";
      const href = hrefTemplate.replace(/:(\w+)/g, (_, key) =>
        String(row[key] ?? ""),
      );
      services.navigate(href);
    }
  };

  const isClickable = !!(onRowClick || rowClick?.opens || rowClick?.href || rowHref);

  return (
    <div
      data-ui="table"
      data-testid="table-renderer"
      className={cn("space-y-4", className)}
    >
      {searchable && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={
              search_placeholder ? t(search_placeholder) : t("Search...")
            }
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      <div className="rounded-md border">
        <TableUI>
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
        </TableUI>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {selectable && (
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

function RowActionsDropdown({
  row,
  actions,
}: {
  row: DataTableRow;
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
            apiConfig = {
              method: endpoint.method,
              path: `${viewConfig.url}/${path}`,
            };
          } else {
            // Fallback to parsing as "METHOD path" format
            apiConfig = parseApiString(action.api, row);
          }
        } else {
          apiConfig = action.api as { method: string; path: string };
        }

        await services.fetch(apiConfig.path, { method: apiConfig.method });

        // Invalidate table queries after successful action
        await queryClient.invalidateQueries({
          queryKey: ["table", viewConfig.url],
        });

        if (action.notification?.success) {
          services.toast({
            type: "success",
            message: t(action.notification.success),
          });
        }
      } catch {
        if (action.notification?.error) {
          services.toast({
            type: "error",
            message: t(action.notification.error),
          });
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
  row: DataTableRow,
): { method: string; path: string } {
  const [method, ...pathParts] = api.split(" ");
  let path = pathParts.join(" ");
  // Replace :id placeholders with actual values
  path = path.replace(/:(\w+)/g, (_, key) => String(row[key] ?? ""));
  return { method: method || "GET", path: path || api };
}
