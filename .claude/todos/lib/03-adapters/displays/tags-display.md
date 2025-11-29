# DISPLAY_TAGS Adapter

## Purpose

Display array of tags/values as badges.

## Registry Interface

```ts
export interface TagsDisplayProps extends DisplayBaseProps {}
```

## shadcn Components Used

- `Badge`
- `Label`

## Implementation

```tsx
import { Badge } from "@ui-components/badge";
import { Label } from "@ui-components/label";
import { useShowData } from "../layouts/show";
import type { TagsDisplayProps } from "@ui/registry";

export function TagsDisplayAdapter({
  name,
  label,
  value,
  className,
}: TagsDisplayProps) {
  const showData = useShowData();
  const rawValue = value ?? (name ? showData[name] : undefined);

  const tags = Array.isArray(rawValue) ? rawValue : [];

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <Label className="text-sm text-muted-foreground">{label}</Label>
      )}
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {String(tag)}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">—</span>
      )}
    </div>
  );
}
```

## Colored Tags Variant

```tsx
// Generate consistent color from string
function stringToColor(str: string): string {
  const colors = [
    "bg-red-100 text-red-800",
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-yellow-100 text-yellow-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
  ];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

export function ColoredTagsAdapter({
  name,
  label,
  value,
}: TagsDisplayProps) {
  const showData = useShowData();
  const rawValue = value ?? (name ? showData[name] : undefined);
  const tags = Array.isArray(rawValue) ? rawValue : [];

  return (
    <div className="space-y-1">
      {label && <Label className="text-sm text-muted-foreground">{label}</Label>}
      <div className="flex flex-wrap gap-1">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="outline"
            className={stringToColor(String(tag))}
          >
            {String(tag)}
          </Badge>
        ))}
      </div>
    </div>
  );
}
```

## Table Cell Variant

```tsx
export function TagsCellAdapter({ value }: { value: unknown }) {
  const tags = Array.isArray(value) ? value : [];

  if (tags.length === 0) return <span>—</span>;

  // Show first 2 tags + count
  const visible = tags.slice(0, 2);
  const remaining = tags.length - 2;

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((tag, index) => (
        <Badge key={index} variant="secondary" className="text-xs">
          {String(tag)}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge variant="outline" className="text-xs">
          +{remaining}
        </Badge>
      )}
    </div>
  );
}
```

## Schema Example

```json
{
  "type": "COMPONENT",
  "name": "tags",
  "kind": "DISPLAY_TAGS",
  "label": "Tags"
}
```

## Notes

- Expects array value
- Empty array shows em-dash
- Table cell truncates to 2 tags + count
