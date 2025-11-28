import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@ui-components/ui/dialog";
import { Button } from "@ui-components/ui/button";
import { Input } from "@ui-components/ui/input";
import { Card, CardContent } from "@ui-components/ui/card";
import { Badge } from "@ui-components/ui/badge";
import { Checkbox } from "@ui-components/ui/checkbox";
import { Search, Plus, X } from "lucide-react";
import { cn } from "@ui/utils";
import { useTranslate } from "@ui/provider";
import { useField } from "../layouts/form";
import type { RelationshipPickerProps } from "@ui/registry";

interface SelectedItem {
  id: string | number;
  [key: string]: unknown;
}

export function RELATIONSHIP_PICKER({
  schema,
  name,
  cardinality,
  relationSchema,
  columns,
  template,
  confirmLabel,
  emptyMessage,
}: RelationshipPickerProps) {
  const t = useTranslate();
  const fieldName = name || schema.name!;
  const field = useField(fieldName);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tempSelected, setTempSelected] = useState<SelectedItem[]>([]);

  const pickerCardinality = cardinality || schema.cardinality || "many";
  const pickerConfirmLabel = confirmLabel || schema.confirmLabel || "Confirm";
  const pickerEmptyMessage = emptyMessage || schema.emptyMessage || "No items selected";

  // Get current selected items from field value
  const currentValue = field.value as SelectedItem | SelectedItem[] | null;
  const selectedItems: SelectedItem[] = Array.isArray(currentValue)
    ? currentValue
    : currentValue
    ? [currentValue]
    : [];

  // Mock data for available items - in real implementation, fetch from API
  const availableItems: SelectedItem[] = [];

  const handleOpenDialog = () => {
    setTempSelected(selectedItems);
    setOpen(true);
  };

  const handleConfirm = () => {
    if (pickerCardinality === "one") {
      field.onChange(tempSelected[0] || null);
    } else {
      field.onChange(tempSelected);
    }
    setOpen(false);
  };

  const handleToggleItem = (item: SelectedItem) => {
    if (pickerCardinality === "one") {
      setTempSelected([item]);
    } else {
      const isSelected = tempSelected.some((s) => s.id === item.id);
      if (isSelected) {
        setTempSelected(tempSelected.filter((s) => s.id !== item.id));
      } else {
        setTempSelected([...tempSelected, item]);
      }
    }
  };

  const handleRemoveItem = (item: SelectedItem) => {
    if (pickerCardinality === "one") {
      field.onChange(null);
    } else {
      const newItems = selectedItems.filter((s) => s.id !== item.id);
      field.onChange(newItems);
    }
  };

  const isItemSelected = (item: SelectedItem) =>
    tempSelected.some((s) => s.id === item.id);

  return (
    <div data-ui="relationship-picker" className={cn("space-y-3", schema.className)}>
      {/* Label */}
      {schema.label && (
        <label className="text-sm font-medium leading-none">
          {t(schema.label)}
        </label>
      )}

      {/* Selected Items */}
      {selectedItems.length > 0 ? (
        <div className="space-y-2">
          {selectedItems.map((item) => (
            <Card key={item.id} className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">{String(item.name || item.id)}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleRemoveItem(item)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">{t("Remove")}</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t(pickerEmptyMessage)}</p>
      )}

      {/* Add Button */}
      <Button type="button" variant="outline" onClick={handleOpenDialog}>
        <Plus className="mr-2 h-4 w-4" />
        {pickerCardinality === "one" && selectedItems.length > 0
          ? t("Change")
          : t("Select")}
      </Button>

      {/* Selection Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t(schema.label || "Select Items")}
            </DialogTitle>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("Search...")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Selected count */}
          {pickerCardinality === "many" && tempSelected.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {tempSelected.length} {t("selected")}
              </Badge>
            </div>
          )}

          {/* Items list */}
          <div className="max-h-80 overflow-y-auto space-y-2">
            {availableItems.length > 0 ? (
              availableItems
                .filter((item) =>
                  String(item.name || item.id)
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map((item) => (
                  <Card
                    key={item.id}
                    className={cn(
                      "cursor-pointer transition-colors",
                      isItemSelected(item) && "border-primary bg-primary/5"
                    )}
                    onClick={() => handleToggleItem(item)}
                  >
                    <CardContent className="flex items-center gap-3 p-3">
                      {pickerCardinality === "many" && (
                        <Checkbox checked={isItemSelected(item)} />
                      )}
                      <span className="text-sm">
                        {String(item.name || item.id)}
                      </span>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {t("No items available")}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("Cancel")}
            </Button>
            <Button type="button" onClick={handleConfirm}>
              {t(pickerConfirmLabel)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
