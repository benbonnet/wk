# shadcn Adapters Reference

## Overview

This directory contains documentation for all adapter components that bridge the UI schema system to shadcn components. Each adapter wraps shadcn components to match the registry interfaces defined in `packs/ui/app/frontend/lib/registry.ts`.

## Directory Structure

```
adapters/
├── index.md              # This file
├── layouts/              # Layout adapters (VIEW, PAGE, FORM, TABLE, etc.)
│   ├── view.md
│   ├── page.md
│   ├── drawer.md
│   ├── form.md
│   ├── table.md
│   ├── show.md
│   ├── actions.md
│   ├── group.md
│   ├── card-group.md
│   ├── multistep.md
│   ├── step.md
│   ├── form-array.md
│   ├── display-array.md
│   └── alert.md
├── primitives/           # Primitive adapters (BUTTON, LINK, DROPDOWN, etc.)
│   ├── button.md
│   ├── link.md
│   ├── dropdown.md
│   ├── option.md
│   ├── search.md
│   ├── submit.md
│   ├── component.md
│   └── relationship-picker.md
├── inputs/               # Input adapters (INPUT_TEXT, INPUT_SELECT, etc.)
│   ├── text-input.md
│   ├── textarea.md
│   ├── select.md
│   ├── checkbox.md
│   ├── checkboxes.md
│   ├── radios.md
│   ├── date-input.md
│   ├── datetime-input.md
│   ├── tags-input.md
│   └── rich-text-input.md
└── displays/             # Display adapters (DISPLAY_TEXT, DISPLAY_BADGE, etc.)
    ├── text-display.md
    ├── longtext-display.md
    ├── number-display.md
    ├── date-display.md
    ├── datetime-display.md
    ├── badge-display.md
    ├── tags-display.md
    ├── boolean-display.md
    └── select-display.md
```

## Adapter Categories

### Layouts (14 adapters)

| Adapter | shadcn Components | Purpose |
|---------|-------------------|---------|
| VIEW | Sheet | Root container, drawer management |
| PAGE | Separator | Page header with title/description/actions |
| DRAWER | Sheet* | Slide-out panel for forms |
| FORM | — | Form container with Formik/RHF |
| TABLE | Table, DataTable, Checkbox, DropdownMenu | Data grid with sorting/filtering |
| SHOW | Card | Read-only record display |
| ACTIONS | — | Button group container |
| GROUP | Separator | Field grouping with label |
| CARD_GROUP | Card* | Card-wrapped content group |
| MULTISTEP | Button, Card | Multi-step wizard |
| STEP | — | Individual wizard step |
| FORM_ARRAY | Button, Card | Repeatable form fields |
| DISPLAY_ARRAY | Card, Table | Read-only array display |
| ALERT | Alert* | Callout messages |

### Primitives (8 adapters)

| Adapter | shadcn Components | Purpose |
|---------|-------------------|---------|
| BUTTON | Button | Action button with variants |
| LINK | Button (asChild) | Navigation link |
| DROPDOWN | DropdownMenu* | Menu with options |
| OPTION | DropdownMenuItem | Menu option |
| SEARCH | Input | Search/filter input |
| SUBMIT | Button | Form submit button |
| COMPONENT | — | Dynamic field dispatcher |
| RELATIONSHIP_PICKER | Dialog, Table, Badge | Related record picker |

### Inputs (10 adapters)

| Adapter | shadcn Components | Purpose |
|---------|-------------------|---------|
| INPUT_TEXT | Input, Label | Single-line text |
| INPUT_TEXTAREA | Textarea, Label | Multi-line text |
| INPUT_SELECT | Select* or Combobox | Dropdown selection |
| INPUT_CHECKBOX | Checkbox, Label | Boolean toggle |
| INPUT_CHECKBOXES | Checkbox* | Multi-select checkboxes |
| INPUT_RADIOS | RadioGroup* | Single-select radio |
| INPUT_DATE | Calendar, Popover, Button | Date picker |
| INPUT_DATETIME | Calendar, Popover, Input | Date + time picker |
| INPUT_TAGS | Input, Badge | Tag list input |
| INPUT_AI_RICH_TEXT | (TipTap) | Rich text editor |

### Displays (9 adapters)

| Adapter | shadcn Components | Purpose |
|---------|-------------------|---------|
| DISPLAY_TEXT | Label | Plain text |
| DISPLAY_LONGTEXT | Label, ScrollArea | Multi-line text |
| DISPLAY_NUMBER | Label | Formatted number |
| DISPLAY_DATE | Label, Tooltip | Formatted date |
| DISPLAY_DATETIME | Label, Tooltip | Formatted date + time |
| DISPLAY_BADGE | Badge, Label | Status/category badge |
| DISPLAY_TAGS | Badge* | Tag list |
| DISPLAY_BOOLEAN | Label (or icons) | Yes/No display |
| DISPLAY_SELECT | Label | Selected option label |

## Export Pattern

```ts
// app/frontend/adapters/index.ts

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

## Required shadcn Components

Install these components to support all adapters:

```bash
pnpm dlx shadcn@latest add \
  alert \
  badge \
  button \
  calendar \
  card \
  checkbox \
  command \
  dialog \
  dropdown-menu \
  input \
  label \
  popover \
  radio-group \
  scroll-area \
  select \
  separator \
  sheet \
  skeleton \
  table \
  tabs \
  textarea \
  tooltip
```

## Additional Dependencies

```bash
# Form management
npm install formik
# OR
npm install react-hook-form @hookform/resolvers

# Validation
npm install zod

# Date formatting
npm install date-fns

# Icons
npm install lucide-react

# Data tables
npm install @tanstack/react-table

# Rich text (optional)
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
```

## Usage with Registry

```tsx
import * as adapters from "@/adapters";
import { UIProvider } from "@ui";

// Register adapters with the UI provider
<UIProvider
  components={{
    VIEW: adapters.VIEW,
    PAGE: adapters.PAGE,
    FORM: adapters.FORM,
    // ... etc
  }}
  inputs={{
    INPUT_TEXT: adapters.INPUT_TEXT,
    INPUT_SELECT: adapters.INPUT_SELECT,
    // ... etc
  }}
  displays={{
    DISPLAY_TEXT: adapters.DISPLAY_TEXT,
    DISPLAY_BADGE: adapters.DISPLAY_BADGE,
    // ... etc
  }}
  services={{
    fetch: customFetch,
    navigate: router.push,
    toast: showToast,
    confirm: showConfirm,
  }}
>
  <App />
</UIProvider>
```

## Implementation Notes

1. **Form Integration**: Input adapters support both Formik and React Hook Form. Choose one and implement consistently.

2. **Context Usage**: Several adapters provide React context:
   - `ViewAdapter` → `DrawerContext`
   - `ShowAdapter` → `ShowContext`
   - `MultistepAdapter` → `MultistepContext`

3. **Services**: Actions (BUTTON, OPTION) use services from `UIProvider`:
   - `fetch` - API calls
   - `navigate` - routing
   - `toast` - notifications
   - `confirm` - confirmation dialogs

4. **Icons**: All icons from `lucide-react`. Icon names in schema map to components dynamically.

5. **Styling**: All adapters accept `className` from schema for custom styling.
