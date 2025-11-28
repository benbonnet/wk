# Phase 6: shadcn Adapters

## Goal
Create adapter components that wrap shadcn to match registry interfaces.

## Location
```
app/frontend/
├── adapters/              # Adapters for UI library
│   ├── index.ts
│   ├── layouts/
│   │   ├── view.tsx
│   │   ├── page.tsx
│   │   ├── drawer.tsx
│   │   ├── form.tsx
│   │   ├── table.tsx
│   │   ├── show.tsx
│   │   └── ...
│   ├── primitives/
│   │   ├── link.tsx
│   │   ├── button.tsx
│   │   ├── dropdown.tsx
│   │   └── ...
│   ├── inputs/
│   │   ├── text-input.tsx
│   │   ├── select.tsx
│   │   ├── checkbox.tsx
│   │   └── ...
│   └── displays/
│       ├── text-display.tsx
│       ├── badge-display.tsx
│       └── ...
```

## Example Adapters

### 1. app/frontend/adapters/primitives/button.tsx

```tsx
import { Button as ShadcnButton } from "@ui-components/ui/button";
import type { ButtonProps } from "@ui/registry";

export function ButtonAdapter({ schema, label, variant, onClick }: ButtonProps) {
  const variantMap = {
    primary: "default",
    secondary: "secondary",
    ghost: "ghost",
    destructive: "destructive",
  } as const;

  return (
    <ShadcnButton
      variant={variantMap[variant || "primary"]}
      onClick={onClick}
      className={schema.className}
    >
      {label}
    </ShadcnButton>
  );
}
```

### 2. app/frontend/adapters/inputs/text-input.tsx

```tsx
import { Input } from "@ui-components/ui/input";
import { Label } from "@ui-components/ui/label";
import { useField } from "formik";
import type { TextInputProps } from "@ui/registry";

export function TextInputAdapter({
  name,
  label,
  helperText,
  placeholder,
  inputType = "text",
}: TextInputProps) {
  const [field, meta] = useField(name);

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        id={name}
        type={inputType}
        placeholder={placeholder}
        {...field}
      />
      {meta.touched && meta.error && (
        <p className="text-sm text-red-600">{meta.error}</p>
      )}
      {helperText && !meta.error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
```

### 3. app/frontend/adapters/layouts/table.tsx

```tsx
import { DataTable } from "@ui-components/table/data-table";
import { useServices } from "@ui";
import type { TableProps } from "@ui/registry";

export function TableAdapter({ schema, columns, data, onRowClick }: TableProps) {
  const { fetch } = useServices();

  // Transform columns to DataTable format
  const tableColumns = columns.map((col) => ({
    id: col.name,
    header: col.label || col.name,
    accessorFn: (row: any) => row.data[col.name],
    // ... cell renderer based on col.kind
  }));

  return (
    <DataTable
      columns={tableColumns}
      data={data || []}
      onRowClick={onRowClick}
      searchable={schema.searchable}
      // ...
    />
  );
}
```

### 4. app/frontend/adapters/index.ts

```ts
// Layouts
export { ViewAdapter as VIEW } from "./layouts/view";
export { PageAdapter as PAGE } from "./layouts/page";
export { DrawerAdapter as DRAWER } from "./layouts/drawer";
export { FormAdapter as FORM } from "./layouts/form";
export { TableAdapter as TABLE } from "./layouts/table";
export { ShowAdapter as SHOW } from "./layouts/show";
export { ActionsAdapter as ACTIONS } from "./layouts/actions";
export { GroupAdapter as GROUP } from "./layouts/group";
export { CardGroupAdapter as CARD_GROUP } from "./layouts/card-group";
export { MultistepAdapter as MULTISTEP } from "./layouts/multistep";
export { StepAdapter as STEP } from "./layouts/step";
export { FormArrayAdapter as FORM_ARRAY } from "./layouts/form-array";
export { DisplayArrayAdapter as DISPLAY_ARRAY } from "./layouts/display-array";
export { AlertAdapter as ALERT } from "./layouts/alert";

// Primitives
export { LinkAdapter as LINK } from "./primitives/link";
export { ButtonAdapter as BUTTON } from "./primitives/button";
export { DropdownAdapter as DROPDOWN } from "./primitives/dropdown";
export { OptionAdapter as OPTION } from "./primitives/option";
export { SearchAdapter as SEARCH } from "./primitives/search";
export { SubmitAdapter as SUBMIT } from "./primitives/submit";
export { ComponentAdapter as COMPONENT } from "./primitives/component";
export { RelationshipPickerAdapter as RELATIONSHIP_PICKER } from "./primitives/relationship-picker";

// Inputs
export { TextInputAdapter as INPUT_TEXT } from "./inputs/text-input";
export { TextareaAdapter as INPUT_TEXTAREA } from "./inputs/textarea";
export { SelectAdapter as INPUT_SELECT } from "./inputs/select";
export { CheckboxAdapter as INPUT_CHECKBOX } from "./inputs/checkbox";
export { CheckboxesAdapter as INPUT_CHECKBOXES } from "./inputs/checkboxes";
export { RadiosAdapter as INPUT_RADIOS } from "./inputs/radios";
export { DateInputAdapter as INPUT_DATE } from "./inputs/date-input";
export { DateTimeInputAdapter as INPUT_DATETIME } from "./inputs/datetime-input";
export { TagsInputAdapter as INPUT_TAGS } from "./inputs/tags-input";
export { RichTextInputAdapter as INPUT_AI_RICH_TEXT } from "./inputs/rich-text-input";

// Displays
export { TextDisplayAdapter as DISPLAY_TEXT } from "./displays/text-display";
export { LongTextDisplayAdapter as DISPLAY_LONGTEXT } from "./displays/longtext-display";
export { NumberDisplayAdapter as DISPLAY_NUMBER } from "./displays/number-display";
export { DateDisplayAdapter as DISPLAY_DATE } from "./displays/date-display";
export { DateTimeDisplayAdapter as DISPLAY_DATETIME } from "./displays/datetime-display";
export { BadgeDisplayAdapter as DISPLAY_BADGE } from "./displays/badge-display";
export { TagsDisplayAdapter as DISPLAY_TAGS } from "./displays/tags-display";
export { BooleanDisplayAdapter as DISPLAY_BOOLEAN } from "./displays/boolean-display";
export { SelectDisplayAdapter as DISPLAY_SELECT } from "./displays/select-display";
```

## Verification
```bash
npx tsc --noEmit
```
