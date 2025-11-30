# RelationshipPicker Overview

## Purpose

The RelationshipPicker is a complex 3-layer component for managing Rails nested attributes (`accepts_nested_attributes_for`) in forms. It handles:

- **has_one** relationships (single selection)
- **has_many** relationships (multiple selection)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: RelationshipPickerField                            │
│ - Displays selected items in parent form                    │
│ - Handles removal (with _destroy for Rails)                 │
│ - Opens Layer 2 for adding                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ opens
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: RelationshipPickerDrawer                           │
│ - Full DataTable with search, pagination                    │
│ - Single/multi selection based on cardinality               │
│ - Selection persists across pages                           │
│ - Opens Layer 3 for creating new items                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ opens
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: RelationshipCreateDrawer                           │
│ - Form for creating new related items                       │
│ - POSTs to API, returns created item with ID                │
│ - Auto-selects newly created item in Layer 2                │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

1. **Parent form** contains RelationshipPickerField bound to `children_attributes` (Formik)
2. User clicks "Add" → Opens **Picker Drawer** (Layer 2)
3. Picker fetches available items from API, displays in table
4. User selects items (checkbox for many, radio for one) or clicks "Create New"
5. "Create New" → Opens **Create Drawer** (Layer 3)
6. User fills form, submits → POST to API → Returns with ID
7. New item auto-selected in Layer 2
8. User clicks "Confirm" → Selected items added to parent form
9. Items displayed in Layer 1 with remove buttons
10. Remove button: marks existing items with `_destroy: 1`, removes new items entirely

## Rails Integration

The component outputs nested attributes format:

```json
{
  "children_attributes": [
    { "id": 1, "first_name": "John" },
    { "id": 2, "_destroy": 1 },
    { "first_name": "New Child" }
  ]
}
```

- Items with `id` = existing records (update or destroy)
- Items without `id` = new records (create)
- Items with `_destroy: 1` = mark for deletion

## Files to Create

```
packs/ui/app/frontend/lib/
├── form/
│   ├── relationship-picker-field.tsx    # Layer 1
│   ├── relationship-picker-drawer.tsx   # Layer 2
│   └── relationship-create-drawer.tsx   # Layer 3
```
