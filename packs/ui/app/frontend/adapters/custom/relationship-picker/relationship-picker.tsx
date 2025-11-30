import { cn } from "@ui/lib/utils";
import { useField } from "../form";
import { RelationshipPickerField } from "./field";
import type { RelationshipPickerProps } from "@ui/lib/ui-renderer/registry";

interface ExtendedRelationshipPickerProps extends RelationshipPickerProps {
  basePath?: string;
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
  basePath,
  label,
  addLabel,
  searchPlaceholder,
  className,
}: ExtendedRelationshipPickerProps) {
  const field = useField(name);

  const apiBasePath = basePath || `/api/v1/${relationSchema}s`;

  return (
    <div data-ui="relationship-picker" className={cn("space-y-3", className)}>
      <RelationshipPickerField
        name={name}
        cardinality={cardinality}
        relationSchema={relationSchema}
        basePath={apiBasePath}
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
