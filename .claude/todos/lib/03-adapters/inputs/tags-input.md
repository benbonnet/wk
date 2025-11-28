# INPUT_TAGS Adapter

## Purpose

Tag input for entering multiple string values.

## Registry Interface

```ts
export interface TagsInputProps extends InputBaseProps {
  value?: string[];
}
```

## shadcn Components Used

- `Input`
- `Badge`
- `Button`
- `Label`

## Implementation

```tsx
import { useState, useRef, KeyboardEvent } from "react";
import { useField } from "formik";
import { Input } from "@ui-components/ui/input";
import { Badge } from "@ui-components/ui/badge";
import { Label } from "@ui-components/ui/label";
import { X } from "lucide-react";
import type { TagsInputProps } from "@ui/registry";

export function TagsInputAdapter({
  name,
  label,
  helperText,
  placeholder,
  disabled,
}: TagsInputProps) {
  const [field, meta, helpers] = useField(name);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const tags = (field.value as string[]) || [];
  const hasError = meta.touched && meta.error;

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      helpers.setValue([...tags, trimmed]);
    }
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    helpers.setValue(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      <div
        className={cn(
          "flex flex-wrap gap-2 rounded-md border p-2 focus-within:ring-2 focus-within:ring-ring",
          hasError && "border-destructive",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1">
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => inputValue && addTag(inputValue)}
          placeholder={tags.length === 0 ? placeholder || "Add tags..." : ""}
          disabled={disabled}
          className="flex-1 min-w-[120px] border-0 p-0 h-7 focus-visible:ring-0"
        />
      </div>

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

## With Suggestions

```tsx
export function TagsInputWithSuggestionsAdapter({
  name,
  label,
  suggestions = [],
}: TagsInputProps & { suggestions?: string[] }) {
  const [field, , helpers] = useField(name);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const tags = (field.value as string[]) || [];

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.includes(s)
  );

  return (
    <div className="space-y-2 relative">
      {label && <Label>{label}</Label>}
      {/* Tag input UI... */}

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-md border bg-popover shadow-md">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
              onClick={() => {
                helpers.setValue([...tags, suggestion]);
                setInputValue("");
                setShowSuggestions(false);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Schema Example

```json
{
  "type": "COMPONENT",
  "name": "skills",
  "kind": "INPUT_TAGS",
  "label": "Skills",
  "placeholder": "Add skills...",
  "helperText": "Press Enter to add"
}
```

## Notes

- Stores array of strings
- Enter key adds tag
- Backspace removes last tag when input empty
- Clicking X removes specific tag
- Blur adds current input as tag
