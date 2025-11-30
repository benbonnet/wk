# Implementation Plan

## Files to Create

```
packs/ui/app/frontend/lib/
├── form/
│   ├── relationship-picker-field.tsx    # Layer 1 (~220 lines)
│   ├── relationship-picker-drawer.tsx   # Layer 2 (~340 lines)
│   └── relationship-create-drawer.tsx   # Layer 3 (~90 lines)
└── form/index.ts                        # Exports
```

## Dependencies Required

### Already in project

- Formik (form state)
- TanStack Query (data fetching)
- Axios (HTTP)

### Need to verify/add

- lucide-react (icons: Plus, X, Check)
- DataTable component (or build minimal version)
- Sheet/AppSheet component (drawer)
- DynamicForm component (renders UISchema)

## Implementation Order

### Phase 1: Layer 3 (simplest, no dependencies on other layers)

1. Create `relationship-create-drawer.tsx`
2. Uses existing Sheet + DynamicForm
3. Simple mutation → POST → return with ID

### Phase 2: Layer 2 (depends on Layer 3)

1. Create `relationship-picker-drawer.tsx`
2. Build DataTable integration
3. Selection state (Set<number>)
4. Search + pagination
5. Import and use Layer 3

### Phase 3: Layer 1 (depends on Layer 2)

1. Create `relationship-picker-field.tsx`
2. Formik useField integration
3. `_destroy` pattern
4. Import and use Layer 2

### Phase 4: Registry Integration

1. Update `ComponentRegistry` type to include `RELATIONSHIP_PICKER`
2. Update adapters to export the real implementation
3. Wire renderer to recognize `TYPE: "RELATIONSHIP_PICKER"`

## Component Props Summary

### Layer 1: RelationshipPickerField

```typescript
{
  name: string;
  cardinality: "one" | "many";
  relationSchema: string;
  label?: string;
  addLabel?: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  confirmLabel?: string;
  columns: Column[];
  template: UISchema[];
  formSchema: JSONSchema;
}
```

### Layer 2: RelationshipPickerDrawer

```typescript
{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  cardinality: "one" | "many";
  basePath: string;
  columns: Column[];
  template: UISchema[];
  formSchema: JSONSchema;
  onConfirm: (items: Item[]) => void;
  title: string;
  searchPlaceholder?: string;
  confirmLabel?: string;
}
```

### Layer 3: RelationshipCreateDrawer

```typescript
{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  template: UISchema[];
  formSchema: JSONSchema;
  basePath: string;
  onSuccess: (item: { id: number; ... }) => void;
}
```

## Renderer Integration

In `renderer.tsx`, handle `RELATIONSHIP_PICKER` type:

```tsx
case "RELATIONSHIP_PICKER":
  const PickerComponent = components.RELATIONSHIP_PICKER;
  return (
    <PickerComponent
      name={schema.NAME}
      cardinality={schema.CARDINALITY}
      relationSchema={schema.RELATION_SCHEMA}
      columns={schema.COLUMNS}
      template={schema.TEMPLATE}
      label={schema.LABEL}
      addLabel={schema.ADD_LABEL}
      emptyMessage={schema.EMPTY_MESSAGE}
      confirmLabel={schema.CONFIRM_LABEL}
      formSchema={formSchema}  // From context or props
    />
  );
```

## Testing Strategy

### Unit Tests

- Layer 1: Formik value manipulation, \_destroy behavior
- Layer 2: Selection state, single vs multi
- Layer 3: Mutation flow

### Integration Tests

- Full flow: select existing → confirm → appears in form
- Full flow: create new → auto-select → confirm → appears in form
- Removal: existing item → \_destroy, new item → removed

## Estimated Effort

| Component | Lines | Complexity | Time |
| --------- | ----- | ---------- | ---- |
| Layer 3   | ~90   | Low        | 1hr  |
| Layer 2   | ~340  | High       | 4hr  |
| Layer 1   | ~220  | Medium     | 2hr  |
| Tests     | ~300  | Medium     | 3hr  |
| **Total** | ~950  |            | 10hr |
