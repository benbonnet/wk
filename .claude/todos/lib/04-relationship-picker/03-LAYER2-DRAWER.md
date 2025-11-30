# Layer 2: RelationshipPickerDrawer

## Purpose

Full-screen drawer with DataTable for searching and selecting existing items. Handles single/multi selection with pagination persistence.

## Props Interface

```typescript
interface RelationshipPickerDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  cardinality: "one" | "many";
  relationSchema: string;
  basePath: string;                       // API endpoint for fetching items
  columns: UISchemaColumnInterface[];     // Table column definitions
  template: UISchemaInterface[];          // Passed to Layer 3 create form
  formSchema: Record<string, unknown>;    // Passed to Layer 3 validation
  onConfirm: (items: AttributePayload[]) => void;
  title: string;
  searchPlaceholder?: string;
  confirmLabel?: string;
  _ns?: string;
}
```

## Core State

```typescript
// Selection persists across pages (Set of IDs)
const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

// Table state
const [searchQuery, setSearchQuery] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [pageSize] = useState(10);
```

## Data Fetching

Uses TanStack Query with pagination:

```typescript
const queryParams = useMemo(() => ({
  page: currentPage,
  per_page: pageSize,
  ...(searchQuery && { q: searchQuery }),
}), [currentPage, pageSize, searchQuery]);

const { data: fetchedData, isLoading } = useQuery({
  queryKey: ["relationship-picker", basePath, queryParams],
  queryFn: async () => {
    const response = await axios.get(basePath, { params: queryParams });
    // Handle different response formats
    if (response.data.data) {
      return { items: response.data.data, pagination: response.data.pagination };
    }
    if (response.data.items) {
      return { items: response.data.items, pagination: response.data.pagination };
    }
    return { items: response.data, pagination: null };
  },
  enabled: open && !!basePath,
});
```

## Selection Behavior

### Single Selection (has_one)

```typescript
if (cardinality === "one") {
  setSelectedIds((prev) => {
    if (prev.has(row.id)) {
      return new Set<number>();  // Deselect
    }
    return new Set<number>([row.id]);  // Replace
  });
}
```

### Multiple Selection (has_many)

```typescript
setSelectedIds((prev) => {
  const newSelected = new Set<number>(prev);
  if (newSelected.has(row.id)) {
    newSelected.delete(row.id);  // Toggle off
  } else {
    newSelected.add(row.id);     // Toggle on
  }
  return newSelected;
});
```

### Selection Persistence

IDs stored in Set → persists across pagination. When user changes pages, previous selections remain.

## Table Column Building

```typescript
const tableColumns: ColumnDef<Item>[] = useMemo(() => {
  const cols: ColumnDef<Item>[] = [
    // Selection column (checkbox or radio)
    {
      id: "select",
      size: 40,
      header: cardinality === "many" ? SelectAllCheckbox : undefined,
      cell: ({ row }) => (
        <Checkbox
          checked={selectedIds.has(row.original.id)}
          onChange={() => handleRowSelect(row.original)}
        />
      ),
    },
  ];

  // Data columns from schema
  columns.forEach((col) => {
    cols.push({
      id: col.name,
      header: col.label || col.name,
      accessorFn: (row) => row.data[col.name],
      cell: ({ getValue }) => {
        const Renderer = displayRenderers[col.kind];
        return Renderer ? <Renderer value={getValue()} /> : String(getValue() ?? "-");
      },
    });
  });

  return cols;
}, [columns, selectedIds, cardinality, handleRowSelect]);
```

## Display Renderers

Maps column `kind` to display components:

```typescript
const displayRenderers: Record<string, FC<{ value: unknown }>> = {
  DISPLAY_TEXT: TextDisplay,
  DISPLAY_NUMBER: NumberDisplay,
  DISPLAY_DATE: DateDisplay,
  DISPLAY_BADGE: BadgeDisplay,
};
```

## Auto-Select Created Items

When Layer 3 creates a new item:

```typescript
const handleCreateSuccess = (newItem: { id: number }) => {
  if (cardinality === "one") {
    setSelectedIds(new Set([newItem.id]));
  } else {
    setSelectedIds((prev) => new Set([...prev, newItem.id]));
  }
  setCreateDrawerOpen(false);
};
```

## Confirm Handler

Returns full item objects (not just IDs):

```typescript
const handleConfirm = () => {
  const selected: AttributePayload[] = data
    .filter((item) => selectedIds.has(item.id))
    .map((item) => ({ id: item.id, ...item.data }));
  onConfirm(selected);
};
```

## Layout Structure

```
┌─────────────────────────────────────────┐
│ Header: Title        [Create New] btn   │
├─────────────────────────────────────────┤
│ Search: [________________]              │
├─────────────────────────────────────────┤
│ □ | Name      | Email          | Status │
│ ☑ | John Doe  | john@email.com | Active │
│ □ | Jane Doe  | jane@email.com | Active │
│ ...                                     │
├─────────────────────────────────────────┤
│ Pagination: < 1 2 3 ... 10 >            │
├─────────────────────────────────────────┤
│ Footer:    [Cancel]  [Confirm (2)]      │
└─────────────────────────────────────────┘
```

## Implementation Checklist

- [ ] Sheet/Drawer container (700px width)
- [ ] TanStack Query data fetching with pagination
- [ ] Search input → resets to page 1
- [ ] Selection stored in Set<number> (persists across pages)
- [ ] has_one: single selection (radio behavior)
- [ ] has_many: multi selection (checkboxes)
- [ ] Select all header checkbox (has_many only)
- [ ] Display renderers for column kinds
- [ ] Row click = toggle selection
- [ ] "Create New" button → opens Layer 3
- [ ] Auto-select newly created items
- [ ] Confirm button shows count: "Confirm (2)"
- [ ] Cancel button closes drawer
- [ ] Loading overlay during fetch
