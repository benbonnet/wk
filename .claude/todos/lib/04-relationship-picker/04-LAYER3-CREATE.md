# Layer 3: RelationshipCreateDrawer

## Purpose

Nested drawer for creating new related items inline. POSTs to API and returns the created item with ID to Layer 2 for auto-selection.

## Props Interface

```typescript
interface RelationshipCreateDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  template: UISchemaInterface[];          // Form fields from schema
  formSchema: Record<string, unknown>;    // JSON Schema for validation
  basePath: string;                       // POST endpoint
  onSuccess: (data: { id: number; [key: string]: unknown }) => void;
  _ns?: string;
}
```

## Core Implementation

### Mutation Setup

```typescript
const createMutation = useMutation({
  mutationFn: async (values: Record<string, unknown>) => {
    const response = await axios.post(basePath, { data: values });
    return response.data;
  },
  onSuccess: (created) => {
    // Invalidate picker list (refetch includes new item)
    queryClient.invalidateQueries({
      queryKey: ["relationship-picker", basePath],
    });
    // Return to Layer 2 with ID
    onSuccess({ id: created.id, ...created.data });
  },
});
```

### Form Schema Construction

Wraps the provided template in a FORM with SUBMIT:

```typescript
const uiSchema: UISchemaInterface = {
  type: "FORM",
  elements: [
    ...template,  // Fields from relationship_picker DSL
    {
      type: "SUBMIT",
      label: t(_ns, "add"),
    },
  ],
};
```

### Submit Handler

```typescript
const handleSubmit = (values: Record<string, unknown>) => {
  createMutation.mutate(values);
};
```

## Layout

```
┌─────────────────────────────────────────┐
│ Header: Create New                      │
├─────────────────────────────────────────┤
│                                         │
│  First Name: [________________]         │
│                                         │
│  Last Name:  [________________]         │
│                                         │
│  Email:      [________________]         │
│                                         │
│             [Add]                       │
│                                         │
└─────────────────────────────────────────┘
```

Width: 450px (narrower than Layer 2's 700px)

## Data Flow

```
1. User clicks "Create New" in Layer 2
2. Layer 3 opens with empty form
3. User fills form, clicks "Add"
4. POST /api/v1/children { data: { first_name: "...", ... } }
5. API returns { id: 123, data: { first_name: "...", ... } }
6. Mutation invalidates ["relationship-picker", basePath] query
7. onSuccess({ id: 123, first_name: "...", ... })
8. Layer 2 auto-selects ID 123
9. Layer 3 closes
10. Layer 2 table refetches (new item visible)
```

## Dependencies

- TanStack Query (useMutation, useQueryClient)
- DynamicForm component (renders UISchema)
- AppSheet component (drawer container)
- Axios for HTTP

## Implementation Checklist

- [ ] Sheet/Drawer container (450px width)
- [ ] Build UISchema from template + SUBMIT
- [ ] DynamicForm with JSON Schema validation
- [ ] POST mutation to basePath
- [ ] Invalidate picker query on success
- [ ] Return created item with ID to parent
- [ ] Close drawer on success
- [ ] Error handling (mutation error state)
