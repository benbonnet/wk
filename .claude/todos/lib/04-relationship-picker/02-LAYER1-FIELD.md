# Layer 1: RelationshipPickerField

## Purpose

The field component that lives inside the parent form. Displays selected items and handles removal directly via `_destroy` pattern.

## Props Interface

```typescript
interface RelationshipPickerFieldProps {
  name: string;                           // Formik field name (e.g., "children_attributes")
  cardinality: "one" | "many";            // has_one vs has_many
  relationSchema: string;                 // e.g., "child" → builds API path
  label?: string;                         // Field label (translated)
  addLabel?: string;                      // "Add" button text (default: "add")
  emptyMessage?: string;                  // Empty state text (default: "no_selection")
  searchPlaceholder?: string;             // Passed to drawer
  confirmLabel?: string;                  // Passed to drawer
  columns: UISchemaColumnInterface[];     // For display summary
  template: UISchemaInterface[];          // Form schema for create drawer
  formSchema: Record<string, unknown>;    // JSON Schema for validation
  _ns?: string;                           // Translation namespace
}
```

## Core Behavior

### Formik Integration

```typescript
const [field, , helpers] = useField(name);

// Normalize value to array
const allItems: AttributePayload[] = Array.isArray(field.value)
  ? field.value
  : field.value ? [field.value] : [];

// Filter destroyed items for display
const visibleItems = allItems.filter((item) => !item._destroy);
```

### Adding Items (from Layer 2)

```typescript
const handleAddItems = (newItems: AttributePayload[]) => {
  if (newItems.length === 0) {
    setDrawerOpen(false);
    return;
  }

  if (cardinality === "one") {
    // Set single item
    helpers.setValue(newItems[0]);
  } else {
    // Append to existing
    helpers.setValue([...allItems, ...newItems]);
  }
  setDrawerOpen(false);
};
```

### Removing Items (Rails `_destroy` pattern)

```typescript
const handleRemove = (index: number) => {
  const item = visibleItems[index];

  if (item.id) {
    // Existing item: mark for destruction (keep in array)
    const updated = allItems.map((s) =>
      s.id === item.id ? { ...s, _destroy: 1 } : s
    );
    helpers.setValue(cardinality === "one" ? updated[0] : updated);
  } else {
    // New item (no id): remove entirely
    const updated = allItems.filter((s) => s !== item);
    helpers.setValue(cardinality === "one" ? updated[0] || null : updated);
  }
};
```

### has_one vs has_many

```typescript
// For has_one: disable "Add" button if item already exists
const isAddDisabled = cardinality === "one" && visibleItems.length > 0;
```

## Display Summary

Shows first 2 columns from schema:

```tsx
{columns
  .slice(0, 2)
  .map((col) => item[col.name])
  .filter(Boolean)
  .join(" - ")}
```

Example output: `"John - Doe"` (first_name - last_name)

## Drawer Reset Pattern

Uses key prop to force remount (clears drawer state on reopen):

```typescript
const [drawerKey, setDrawerKey] = useState(0);

const handleOpenDrawer = () => {
  setDrawerKey((k) => k + 1);
  setTimeout(() => setDrawerOpen(true), 0);
};
```

## API Path Construction

Derives picker API path from parent basePath:

```typescript
const pickerBasePath = `${basePath.replace(/\/[^/]+$/, "")}/${relationSchema}s`;
// /api/v1/parents/123 → /api/v1/children
```

## Implementation Checklist

- [ ] Formik `useField` integration
- [ ] `_destroy` pattern for existing items
- [ ] Complete removal for new items (no id)
- [ ] has_one: single item, disabled add button when filled
- [ ] has_many: multiple items, always enabled add
- [ ] Display summary from first 2 columns
- [ ] Key-based drawer reset on reopen
- [ ] Empty state with centered add button
- [ ] Item list with remove (X) buttons
