# INPUT_SELECT Adapter

## Purpose

Dropdown select for choosing from predefined options.

## Registry Interface

```ts
export interface SelectProps extends InputBaseProps {
  options: Option[];
  searchable?: boolean;
  searchPlaceholder?: string;
}
```

## shadcn Components Used

- `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
- `Label`
- For searchable: `Popover`, `Command`

## Implementation (Standard Select)

```tsx
import { useField } from "formik";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-components/select";
import { Label } from "@ui-components/label";
import type { SelectProps } from "@ui/registry";

export function SelectAdapter({
  name,
  label,
  helperText,
  placeholder,
  options,
  disabled,
}: SelectProps) {
  const [field, meta, helpers] = useField(name);

  const hasError = meta.touched && meta.error;

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Select
        value={field.value as string}
        onValueChange={(value) => helpers.setValue(value)}
        disabled={disabled}
      >
        <SelectTrigger
          id={name}
          className={hasError ? "border-destructive" : ""}
        >
          <SelectValue placeholder={placeholder || "Select..."} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && (
        <p className="text-sm text-destructive">{meta.error}</p>
      )}
      {helperText && !hasError && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
```

## Implementation (Searchable - Combobox)

```tsx
import { useState } from "react";
import { useField } from "formik";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@ui-components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui-components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui-components/popover";
import { Label } from "@ui-components/label";
import { cn } from "@ui/utils";
import type { SelectProps } from "@ui/registry";

export function SearchableSelectAdapter({
  name,
  label,
  placeholder,
  searchPlaceholder,
  options,
  disabled,
}: SelectProps) {
  const [field, meta, helpers] = useField(name);
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((o) => o.value === field.value);

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={name}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between",
              !field.value && "text-muted-foreground"
            )}
          >
            {selectedOption?.label || placeholder || "Select..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder || "Search..."} />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      helpers.setValue(option.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        field.value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {meta.touched && meta.error && (
        <p className="text-sm text-destructive">{meta.error}</p>
      )}
    </div>
  );
}
```

## Schema Examples

### Standard Select

```json
{
  "type": "COMPONENT",
  "name": "country",
  "kind": "INPUT_SELECT",
  "label": "Country",
  "placeholder": "Select country",
  "options": [
    { "value": "us", "label": "United States" },
    { "value": "uk", "label": "United Kingdom" },
    { "value": "ca", "label": "Canada" }
  ]
}
```

### Searchable Select

```json
{
  "type": "COMPONENT",
  "name": "timezone",
  "kind": "INPUT_SELECT",
  "label": "Timezone",
  "searchable": true,
  "searchPlaceholder": "Search timezones...",
  "options": [...]
}
```

## Notes

- Standard select for small option lists
- Searchable (Combobox) for large lists
- Options defined in schema or fetched from API
