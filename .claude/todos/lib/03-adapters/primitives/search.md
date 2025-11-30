# SEARCH Adapter

## Purpose

Search input for filtering tables or lists.

## Registry Interface

```ts
export interface SearchProps extends BaseRendererProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}
```

## shadcn Components Used

- `Input`

## Implementation

```tsx
import { Input } from "@ui-components/input";
import { Search, X } from "lucide-react";
import { Button } from "@ui-components/button";
import type { SearchProps } from "@ui/registry";

export function SearchAdapter({
  schema,
  placeholder,
  value,
  onChange,
}: SearchProps) {
  const [searchValue, setSearchValue] = useState(value || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onChange?.(newValue);
  };

  const handleClear = () => {
    setSearchValue("");
    onChange?.("");
  };

  return (
    <div className={cn("relative", schema.className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder || schema.placeholder || "Search..."}
        value={searchValue}
        onChange={handleChange}
        className="pl-9 pr-9"
      />
      {searchValue && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
          onClick={handleClear}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
```

## With Debounce

```tsx
import { useDebouncedCallback } from "use-debounce";

export function DebouncedSearchAdapter({
  schema,
  placeholder,
  value,
  onChange,
}: SearchProps) {
  const [searchValue, setSearchValue] = useState(value || "");

  const debouncedOnChange = useDebouncedCallback((value: string) => {
    onChange?.(value);
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    debouncedOnChange(newValue);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder || schema.placeholder || "Search..."}
        value={searchValue}
        onChange={handleChange}
        className="pl-9"
      />
    </div>
  );
}
```

## Schema Example

```json
{
  "type": "SEARCH",
  "placeholder": "Search users..."
}
```

## Notes

- Search icon on left
- Clear button appears when value present
- Debounced version prevents excessive API calls
- Usually connected to TABLE or list filtering
