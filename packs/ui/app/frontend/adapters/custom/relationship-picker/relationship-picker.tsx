import { cn } from "@ui/lib/utils";
import { useField } from "../form";
import { RelationshipPickerField } from "./field";
import type { RelationshipPickerProps } from "@ui/lib/ui-renderer/registry";

interface ExtendedRelationshipPickerProps extends RelationshipPickerProps {
  label?: string;
  addLabel?: string;
  searchPlaceholder?: string;
}

export function RelationshipPicker({
  name,
  cardinality = "many",
  relationSchema,
  columns = [],
  template = [],
  confirmLabel,
  emptyMessage,
  label,
  addLabel,
  searchPlaceholder,
  className,
}: ExtendedRelationshipPickerProps) {
  const field = useField(name);

  return (
    <div data-ui="relationship-picker" className={cn("space-y-3", className)}>
      <RelationshipPickerField
        name={name}
        cardinality={cardinality}
        relationSchema={relationSchema}
        label={label}
        addLabel={addLabel}
        emptyMessage={emptyMessage}
        searchPlaceholder={searchPlaceholder}
        confirmLabel={confirmLabel}
        columns={columns}
        template={template}
        value={field.value}
        onChange={field.onChange}
      />
    </div>
  );
}
