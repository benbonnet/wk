# CARD_GROUP Adapter

## Purpose

Groups content inside a Card component with optional header.

## Registry Interface

```ts
export interface CardGroupProps extends BaseRendererProps {
  label?: string;
  subtitle?: string;
}
```

## shadcn Components Used

- `Card`
- `CardHeader`
- `CardTitle`
- `CardDescription`
- `CardContent`

## Implementation

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@ui-components/ui/card";
import type { CardGroupProps } from "@ui/registry";

export function CardGroupAdapter({
  schema,
  label,
  subtitle,
  children,
}: CardGroupProps) {
  const cardTitle = label || schema.label;
  const cardDescription = subtitle || schema.subtitle;
  const hasHeader = cardTitle || cardDescription;

  return (
    <Card className={schema.className}>
      {hasHeader && (
        <CardHeader>
          {cardTitle && <CardTitle>{cardTitle}</CardTitle>}
          {cardDescription && <CardDescription>{cardDescription}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={!hasHeader ? "pt-6" : ""}>
        <div className="space-y-4">{children}</div>
      </CardContent>
    </Card>
  );
}
```

## With Actions

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@ui-components/ui/card";

export function CardGroupAdapter({
  schema,
  label,
  subtitle,
  actions,
  children,
}: CardGroupProps) {
  return (
    <Card className={schema.className}>
      <CardHeader>
        {label && <CardTitle>{label}</CardTitle>}
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
        {actions && <CardAction>{actions}</CardAction>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">{children}</div>
      </CardContent>
    </Card>
  );
}
```

## Schema Example

```json
{
  "type": "SHOW",
  "elements": [
    {
      "type": "CARD_GROUP",
      "label": "Account Settings",
      "subtitle": "Manage your account preferences",
      "elements": [
        { "type": "COMPONENT", "name": "email", "kind": "DISPLAY_TEXT", "label": "Email" },
        { "type": "COMPONENT", "name": "timezone", "kind": "DISPLAY_SELECT", "label": "Timezone" }
      ]
    }
  ]
}
```

## Notes

- Provides visual grouping with card styling
- Good for dashboards and settings pages
- Can contain forms, displays, or mixed content
