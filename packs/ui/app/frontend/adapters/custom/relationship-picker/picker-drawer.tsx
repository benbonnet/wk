import { useState, useMemo, useCallback, type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@ui/components/sheet";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { Checkbox } from "@ui/components/checkbox";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@ui/components/table";
import { ScrollArea } from "@ui/components/scroll-area";
import { Plus, Check, Search } from "lucide-react";
import { useServices, useTranslate } from "@ui/lib/ui-renderer/provider";
import { RelationshipCreateDrawer } from "./create-drawer";
import type { UISchema } from "@ui/lib/ui-renderer/types";

interface AttributePayload {
  id?: number;
  [key: string]: unknown;
}

interface ColumnDef {
  name: string;
  kind: string;
  label?: string;
}

interface RelationshipPickerDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  cardinality: "one" | "many";
  relationSchema: string;
  basePath: string;
  columns: ColumnDef[];
  template: UISchema[];
  onConfirm: (items: AttributePayload[]) => void;
  title: string;
  searchPlaceholder?: string;
  confirmLabel?: string;
  _ns?: string;
}

interface Item {
  id: number;
  [key: string]: unknown;
}

/**
 * RelationshipPickerDrawer (Layer 2)
 *
 * ADD ONLY drawer - no pre-selection, no removal logic.
 * Contains a table for searching and selecting existing items.
 *
 * - has_one: Single selection (radio behavior)
 * - has_many: Multiple selection (checkboxes, multipage persistence)
 */
export const RelationshipPickerDrawer: FC<RelationshipPickerDrawerProps> = ({
  open,
  onOpenChange,
  name,
  cardinality,
  basePath,
  columns,
  template,
  onConfirm,
  title,
  searchPlaceholder,
  confirmLabel = "confirm",
  _ns = "common",
}) => {
  const t = useTranslate();
  const services = useServices();

  // Local state for selections within this drawer session
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  // Track newly created items that aren't in fetched data yet
  const [createdItems, setCreatedItems] = useState<
    Map<number, AttributePayload>
  >(new Map());

  // Table state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch data from backend
  const queryParams = useMemo(() => {
    const params: Record<string, unknown> = {
      page: currentPage,
      per_page: pageSize,
    };
    if (searchQuery) {
      params.q = searchQuery;
    }
    return params;
  }, [currentPage, searchQuery]);

  const { data: fetchedData, isLoading } = useQuery({
    queryKey: ["relationship-picker", basePath, queryParams],
    queryFn: async () => {
      const queryString = new URLSearchParams(
        queryParams as Record<string, string>,
      ).toString();
      const response = await services.fetch(`${basePath}?${queryString}`);
      if (response.data) {
        return {
          items: response.data as Item[],
          pagination: response.pagination,
        };
      }
      if (response.items) {
        return {
          items: response.items as Item[],
          pagination: response.pagination,
        };
      }
      return { items: response as Item[], pagination: null };
    },
    enabled: open && !!basePath,
  });

  const data = fetchedData?.items ?? [];
  const paginationInfo = fetchedData?.pagination;

  // Handle row selection
  const handleRowSelect = useCallback(
    (row: Item) => {
      if (cardinality === "one") {
        // Single selection: toggle or replace
        setSelectedIds((prev) => {
          if (prev.has(row.id)) {
            return new Set<number>();
          }
          return new Set<number>([row.id]);
        });
      } else {
        // Multiple selection: toggle
        setSelectedIds((prev) => {
          const newSelected = new Set<number>(prev);
          if (newSelected.has(row.id)) {
            newSelected.delete(row.id);
          } else {
            newSelected.add(row.id);
          }
          return newSelected;
        });
      }
    },
    [cardinality],
  );

  // Handle newly created item from Layer 3 - auto-select it and store it
  const handleCreateSuccess = (newItem: {
    id: number;
    [key: string]: unknown;
  }) => {
    // Store the created item so we can include it in confirmation
    setCreatedItems((prev) => new Map(prev).set(newItem.id, newItem));

    if (cardinality === "one") {
      setSelectedIds(new Set([newItem.id]));
    } else {
      setSelectedIds((prev) => new Set([...prev, newItem.id]));
    }
    setCreateDrawerOpen(false);
  };

  // Handle confirm - return selected items (data is now flat)
  const handleConfirm = () => {
    const selected: AttributePayload[] = [];

    // Add selected items from fetched data (skip if already in createdItems to avoid duplicates)
    for (const item of data) {
      if (selectedIds.has(item.id) && !createdItems.has(item.id)) {
        selected.push(item);
      }
    }

    // Add newly created items that are selected
    for (const [id, item] of createdItems) {
      if (selectedIds.has(id)) {
        selected.push(item);
      }
    }

    onConfirm(selected);
  };

  // Handle search
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Total selection count
  const totalSelected = selectedIds.size;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-[700px] sm:max-w-[700px] flex flex-col"
          data-testid={`relationship-picker-drawer-${name}`}
        >
          <SheetHeader className="flex-shrink-0">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription className="sr-only">
              {t("select_items_description")}
            </SheetDescription>
            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setCreateDrawerOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                {t("create_new")}
              </Button>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-hidden flex flex-col py-4">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder || t("search_placeholder")}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Table */}
            <ScrollArea className="flex-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10" />
                    {columns.map((col) => (
                      <TableHead key={col.name}>
                        {t(col.label || col.name)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item: Item) => (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer"
                      onClick={() => handleRowSelect(item)}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(item.id)}
                          onCheckedChange={() => handleRowSelect(item)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      {columns.map((col) => (
                        <TableCell key={col.name}>
                          {String(item[col.name] ?? "-")}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {data.length === 0 && !isLoading && (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length + 1}
                        className="text-center text-muted-foreground py-8"
                      >
                        {t("no_results")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">{t("loading")}</div>
                </div>
              )}
            </ScrollArea>

            {/* Pagination */}
            {paginationInfo && paginationInfo.total_pages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  {t("previous")}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {t("page_x_of_y")
                    .replace("%{current}", String(currentPage))
                    .replace("%{total}", String(paginationInfo.total_pages))}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= paginationInfo.total_pages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  {t("next")}
                </Button>
              </div>
            )}
          </div>

          <SheetFooter className="flex-shrink-0 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="button" onClick={handleConfirm}>
              <Check className="h-4 w-4 mr-1" />
              {t(confirmLabel)} ({totalSelected})
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Layer 3: Create drawer */}
      <RelationshipCreateDrawer
        open={createDrawerOpen}
        onOpenChange={setCreateDrawerOpen}
        name={name}
        template={template}
        basePath={basePath}
        onSuccess={handleCreateSuccess}
        _ns={_ns}
      />
    </>
  );
};
