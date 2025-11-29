import { useState, type FC } from "react";
import { Button } from "@ui/components/button";
import { Plus, X } from "lucide-react";
import { useTranslate } from "@ui/lib/ui-renderer/provider";
import { RelationshipPickerDrawer } from "./picker-drawer";
import type { UISchema } from "@ui/lib/ui-renderer/types";

interface AttributePayload {
  id?: number;
  _destroy?: number;
  [key: string]: unknown;
}

interface ColumnDef {
  name: string;
  kind: string;
  label?: string;
}

interface RelationshipPickerFieldProps {
  name: string;
  cardinality: "one" | "many";
  relationSchema: string;
  basePath: string;
  label?: string;
  addLabel?: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  confirmLabel?: string;
  columns: ColumnDef[];
  template: UISchema[];
  value: AttributePayload | AttributePayload[] | null;
  onChange: (value: AttributePayload | AttributePayload[] | null) => void;
  _ns?: string;
}

/**
 * RelationshipPickerField (Layer 1)
 *
 * Displays selected relationship items in the parent form.
 * Handles removal directly via [X] button.
 * Opens RelationshipPickerDrawer for adding new items.
 *
 * - has_one: "Add" button disabled when item exists
 * - has_many: "Add" button always enabled
 */
export const RelationshipPickerField: FC<RelationshipPickerFieldProps> = ({
  name,
  cardinality,
  relationSchema,
  basePath,
  label,
  addLabel = "add",
  emptyMessage = "no_selection",
  searchPlaceholder,
  confirmLabel,
  columns,
  template,
  value,
  onChange,
  _ns = "common",
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerKey, setDrawerKey] = useState(0);
  const t = useTranslate();

  // Open drawer with fresh state (key forces remount)
  const handleOpenDrawer = () => {
    setDrawerKey((k) => k + 1);
    setTimeout(() => setDrawerOpen(true), 0);
  };

  // Normalize value to array for internal handling
  const allItems: AttributePayload[] = Array.isArray(value)
    ? value
    : value
      ? [value]
      : [];

  // Filter out destroyed items for display
  const visibleItems = allItems.filter((item) => !item._destroy);

  // Handle new items from picker - APPEND to existing
  const handleAddItems = (newItems: AttributePayload[]) => {
    if (newItems.length === 0) {
      setDrawerOpen(false);
      return;
    }

    if (cardinality === "one") {
      onChange(newItems[0]);
    } else {
      onChange([...allItems, ...newItems]);
    }
    setDrawerOpen(false);
  };

  // For has_one: disable "Add" button if item already exists
  const isAddDisabled = cardinality === "one" && visibleItems.length > 0;

  // Handle removal directly in Layer 1
  const handleRemove = (index: number) => {
    const item = visibleItems[index];
    if (item.id) {
      // Existing item: mark for destruction (keep in array)
      const updated = allItems.map((s) =>
        s.id === item.id ? { ...s, _destroy: 1 } : s,
      );
      onChange(cardinality === "one" ? updated[0] : updated);
    } else {
      // New item (no id): remove from array entirely
      const updated = allItems.filter((s) => s !== item);
      onChange(cardinality === "one" ? updated[0] || null : updated);
    }
  };

  // Render selected items with remove button
  const renderSelectedSummary = () => {
    if (visibleItems.length === 0) return null;

    return (
      <div className="space-y-2">
        {visibleItems.map((item, index) => (
          <div
            key={item.id || `new-${index}`}
            className="flex items-center justify-between p-2 rounded border border-slate-200 dark:border-slate-700"
          >
            <span className="text-sm">
              {/* Display first two column values as summary */}
              {columns
                .slice(0, 2)
                .map((col) => item[col.name])
                .filter(Boolean)
                .join(" - ")}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-3" data-testid={`relationship-picker-${name}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {t(label)}
        </label>
      )}

      {visibleItems.length === 0 ? (
        // Empty state
        <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-600 p-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t(emptyMessage)}
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-3"
            onClick={handleOpenDrawer}
          >
            <Plus className="h-4 w-4 mr-1" />
            {t(addLabel)}
          </Button>
        </div>
      ) : (
        // Has items
        <div className="space-y-2">
          {renderSelectedSummary()}
          {/* For has_one: button disabled when item exists. For has_many: always enabled */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleOpenDrawer}
            disabled={isAddDisabled}
          >
            <Plus className="h-4 w-4 mr-1" />
            {t(addLabel)}
          </Button>
        </div>
      )}

      {/* Picker drawer - ADD ONLY, no pre-selection */}
      <RelationshipPickerDrawer
        key={drawerKey}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        name={name}
        cardinality={cardinality}
        relationSchema={relationSchema}
        basePath={basePath}
        columns={columns}
        template={template}
        onConfirm={handleAddItems}
        title={t(addLabel)}
        searchPlaceholder={searchPlaceholder ? t(searchPlaceholder) : undefined}
        confirmLabel={confirmLabel}
        _ns={_ns}
      />
    </div>
  );
};
