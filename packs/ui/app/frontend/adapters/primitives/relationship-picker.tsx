import { cn } from "@ui/lib/utils";
import { useTranslate } from "@ui/lib/provider";
import { useField } from "../layouts/form";
import { RelationshipPickerField } from "@ui/lib/form";
import type { RelationshipPickerProps } from "@ui/lib/registry";

/**
 * RELATIONSHIP_PICKER Adapter
 *
 * 3-layer component for managing Rails nested attributes:
 * - Layer 1: RelationshipPickerField (displays selected, handles removal)
 * - Layer 2: RelationshipPickerDrawer (search, select existing)
 * - Layer 3: RelationshipCreateDrawer (create new inline)
 */
export function RELATIONSHIP_PICKER({
  schema,
  name,
  cardinality,
  relationSchema,
  columns,
  template,
  confirmLabel,
  emptyMessage,
  basePath,
}: RelationshipPickerProps & { basePath?: string }) {
  const t = useTranslate();
  const fieldName = name || schema.name!;
  const field = useField(fieldName);

  const pickerCardinality = cardinality || schema.cardinality || "many";
  const pickerColumns = columns || schema.columns || [];
  const pickerTemplate = template || schema.template || [];
  const pickerRelationSchema = relationSchema || schema.relationSchema || "";

  // Derive basePath from relationSchema if not provided
  const apiBasePath =
    basePath || schema.basePath || `/api/v1/${pickerRelationSchema}s`;

  return (
    <div
      data-ui="relationship-picker"
      className={cn("space-y-3", schema.className)}
    >
      <RelationshipPickerField
        name={fieldName}
        cardinality={pickerCardinality}
        relationSchema={pickerRelationSchema}
        basePath={apiBasePath}
        label={schema.label}
        addLabel={schema.addLabel}
        emptyMessage={emptyMessage || schema.emptyMessage}
        searchPlaceholder={schema.searchPlaceholder}
        confirmLabel={confirmLabel || schema.confirmLabel}
        columns={pickerColumns}
        template={pickerTemplate}
        value={field.value}
        onChange={field.onChange}
      />
    </div>
  );
}
