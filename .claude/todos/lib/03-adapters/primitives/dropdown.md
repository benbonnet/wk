# DROPDOWN Adapter

## Purpose

Dropdown menu with options/actions.

## Registry Interface

```ts
export interface DropdownProps extends BaseRendererProps {
  label?: string;
  searchable?: boolean;
  options: Option[];
}
```

## shadcn Components Used

- `DropdownMenu`
- `DropdownMenuTrigger`
- `DropdownMenuContent`
- `DropdownMenuItem`
- `DropdownMenuLabel`
- `DropdownMenuSeparator`
- `Button`

## Implementation

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui-components/ui/dropdown-menu";
import { Button } from "@ui-components/ui/button";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import type { DropdownProps } from "@ui/registry";

export function DropdownAdapter({
  schema,
  label,
  children,
}: DropdownProps) {
  const dropdownLabel = label || schema.label;
  const icon = schema.icon;

  // Icon-only trigger (e.g., row actions)
  const TriggerButton = icon === "MoreHorizontal" ? (
    <Button variant="ghost" size="icon">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  ) : (
    <Button variant="outline">
      {dropdownLabel}
      <ChevronDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {TriggerButton}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={schema.className}>
        {dropdownLabel && !icon && (
          <>
            <DropdownMenuLabel>{dropdownLabel}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {/* Children are OPTION adapters rendered by DynamicRenderer */}
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## With Searchable Options

```tsx
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from "@ui-components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@ui-components/ui/popover";

export function SearchableDropdownAdapter({
  schema,
  label,
  options,
  onSelect,
}: DropdownProps & { onSelect?: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          {value || label || "Select..."}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={schema.searchPlaceholder || "Search..."} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(val) => {
                  setValue(val);
                  onSelect?.(val);
                  setOpen(false);
                }}
              >
                {option.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
```

## Schema Examples

### Simple Dropdown

```json
{
  "type": "DROPDOWN",
  "label": "Actions",
  "elements": [
    { "type": "OPTION", "label": "Edit", "opens": "edit-user" },
    { "type": "OPTION", "label": "Delete", "api": "DELETE /users/:id" }
  ]
}
```

### Icon Dropdown (Row Actions)

```json
{
  "type": "DROPDOWN",
  "icon": "MoreHorizontal",
  "elements": [
    { "type": "OPTION", "label": "View", "href": "/users/:id" },
    { "type": "OPTION", "label": "Edit", "opens": "edit-user" },
    { "type": "OPTION", "label": "Delete", "variant": "destructive" }
  ]
}
```

## Notes

- Children are OPTION adapters
- Supports icon-only trigger for table row actions
- Searchable variant uses Command + Popover (Combobox pattern)
