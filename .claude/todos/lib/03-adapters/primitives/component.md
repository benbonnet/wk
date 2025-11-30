# COMPONENT Adapter

## Purpose

Dynamic field renderer that selects INPUT or DISPLAY adapter based on `kind`.

## Registry Interface

```ts
export interface ComponentProps extends BaseRendererProps {
  // Uses schema.name and schema.kind to render appropriate input/display
}
```

## Implementation

```tsx
import { useUI } from "@ui";
import type { BaseRendererProps } from "@ui/registry";

export function ComponentAdapter({ schema }: BaseRendererProps) {
  const { inputs, displays } = useUI();

  const kind = schema.kind;
  const name = schema.name;

  if (!kind) {
    console.warn("COMPONENT requires 'kind' in schema");
    return null;
  }

  // Determine if input or display based on kind prefix
  const isInput = kind.startsWith("INPUT_");
  const isDisplay = kind.startsWith("DISPLAY_");

  if (isInput) {
    const InputComponent = inputs[kind as keyof typeof inputs];
    if (!InputComponent) {
      console.warn(`Unknown input kind: ${kind}`);
      return null;
    }

    return (
      <InputComponent
        name={name!}
        label={schema.label}
        placeholder={schema.placeholder}
        helperText={schema.helperText}
        options={schema.options}
        inputType={schema.inputType}
        rows={schema.rows}
        searchPlaceholder={schema.searchPlaceholder}
      />
    );
  }

  if (isDisplay) {
    const DisplayComponent = displays[kind as keyof typeof displays];
    if (!DisplayComponent) {
      console.warn(`Unknown display kind: ${kind}`);
      return null;
    }

    return (
      <DisplayComponent
        name={name}
        label={schema.label}
        options={schema.options}
        className={schema.className}
      />
    );
  }

  console.warn(`Unknown kind type: ${kind}`);
  return null;
}
```

## Kind Mapping

### Input Kinds

| Kind | Adapter | shadcn Component |
|------|---------|------------------|
| INPUT_TEXT | TextInputAdapter | Input |
| INPUT_TEXTAREA | TextareaAdapter | Textarea |
| INPUT_SELECT | SelectAdapter | Select |
| INPUT_CHECKBOX | CheckboxAdapter | Checkbox |
| INPUT_CHECKBOXES | CheckboxesAdapter | Checkbox (multiple) |
| INPUT_RADIOS | RadiosAdapter | RadioGroup |
| INPUT_DATE | DateInputAdapter | Calendar + Popover |
| INPUT_DATETIME | DateTimeInputAdapter | Calendar + Input |
| INPUT_TAGS | TagsInputAdapter | Custom |
| INPUT_AI_RICH_TEXT | RichTextInputAdapter | Custom |

### Display Kinds

| Kind | Adapter | Description |
|------|---------|-------------|
| DISPLAY_TEXT | TextDisplayAdapter | Plain text |
| DISPLAY_LONGTEXT | LongTextDisplayAdapter | Multi-line text |
| DISPLAY_NUMBER | NumberDisplayAdapter | Formatted number |
| DISPLAY_DATE | DateDisplayAdapter | Formatted date |
| DISPLAY_DATETIME | DateTimeDisplayAdapter | Formatted datetime |
| DISPLAY_BADGE | BadgeDisplayAdapter | Badge component |
| DISPLAY_TAGS | TagsDisplayAdapter | Tag list |
| DISPLAY_BOOLEAN | BooleanDisplayAdapter | Yes/No or icon |
| DISPLAY_SELECT | SelectDisplayAdapter | Selected option label |

## Schema Example

```json
{
  "type": "FORM",
  "elements": [
    {
      "type": "COMPONENT",
      "name": "email",
      "kind": "INPUT_TEXT",
      "label": "Email",
      "placeholder": "Enter email",
      "inputType": "email"
    },
    {
      "type": "COMPONENT",
      "name": "role",
      "kind": "INPUT_SELECT",
      "label": "Role",
      "options": [
        { "value": "admin", "label": "Admin" },
        { "value": "user", "label": "User" }
      ]
    }
  ]
}
```

## Notes

- Bridge between schema and specific input/display adapters
- Passes relevant props from schema to the selected adapter
- Kind determines which adapter is used
