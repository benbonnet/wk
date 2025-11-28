# DISPLAY_LONGTEXT Adapter

## Purpose

Display multi-line or long text content.

## Registry Interface

```ts
export interface LongTextDisplayProps extends DisplayBaseProps {}
```

## shadcn Components Used

- `Label`
- `ScrollArea` (optional for very long content)

## Implementation

```tsx
import { Label } from "@ui-components/ui/label";
import { useShowData } from "../layouts/show";
import type { LongTextDisplayProps } from "@ui/registry";

export function LongTextDisplayAdapter({
  name,
  label,
  value,
  className,
}: LongTextDisplayProps) {
  const showData = useShowData();
  const displayValue = value ?? (name ? showData[name] : undefined);

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <Label className="text-sm text-muted-foreground">{label}</Label>
      )}
      <p className="text-sm whitespace-pre-wrap">
        {displayValue != null ? String(displayValue) : "—"}
      </p>
    </div>
  );
}
```

## With Scroll Area

```tsx
import { ScrollArea } from "@ui-components/ui/scroll-area";

export function ScrollableLongTextAdapter({
  name,
  label,
  value,
  maxHeight = 200,
}: LongTextDisplayProps & { maxHeight?: number }) {
  const showData = useShowData();
  const displayValue = value ?? (name ? showData[name] : undefined);

  return (
    <div className="space-y-1">
      {label && (
        <Label className="text-sm text-muted-foreground">{label}</Label>
      )}
      <ScrollArea className={`max-h-[${maxHeight}px]`}>
        <p className="text-sm whitespace-pre-wrap">
          {displayValue ?? "—"}
        </p>
      </ScrollArea>
    </div>
  );
}
```

## With Markdown

```tsx
import ReactMarkdown from "react-markdown";

export function MarkdownDisplayAdapter({
  name,
  label,
  value,
}: LongTextDisplayProps) {
  const showData = useShowData();
  const displayValue = value ?? (name ? showData[name] : undefined);

  return (
    <div className="space-y-1">
      {label && (
        <Label className="text-sm text-muted-foreground">{label}</Label>
      )}
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown>{String(displayValue ?? "")}</ReactMarkdown>
      </div>
    </div>
  );
}
```

## Schema Example

```json
{
  "type": "COMPONENT",
  "name": "description",
  "kind": "DISPLAY_LONGTEXT",
  "label": "Description"
}
```

## Notes

- Preserves whitespace with `whitespace-pre-wrap`
- Can render markdown content
- Optional scroll area for very long content
