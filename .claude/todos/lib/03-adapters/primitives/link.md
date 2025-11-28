# LINK Adapter

## Purpose

Navigation link styled as button or text link.

## Registry Interface

```ts
export interface LinkProps extends BaseRendererProps {
  label: string;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  icon?: string;
  onClick?: () => void;
}
```

## shadcn Components Used

- `Button` (with `asChild` prop)

## Implementation

```tsx
import { Link as RouterLink } from "react-router";
import { Button } from "@ui-components/ui/button";
import * as Icons from "lucide-react";
import { useDrawer } from "../layouts/view";
import type { LinkProps } from "@ui/registry";

const variantMap = {
  primary: "default",
  secondary: "secondary",
  ghost: "ghost",
  destructive: "destructive",
} as const;

export function LinkAdapter({
  schema,
  label,
  href,
  variant,
  icon,
  onClick,
}: LinkProps) {
  const { openDrawer } = useDrawer();
  const linkLabel = label || schema.label!;
  const linkHref = href || schema.href;
  const linkVariant = variantMap[variant || schema.variant || "ghost"];
  const IconComponent = icon || schema.icon ? Icons[icon || schema.icon] : null;

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
      return;
    }

    if (schema.opens) {
      e.preventDefault();
      openDrawer(schema.opens);
    }
  };

  // External link
  if (linkHref?.startsWith("http")) {
    return (
      <Button variant={linkVariant} asChild className={schema.className}>
        <a href={linkHref} target="_blank" rel="noopener noreferrer">
          {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
          {linkLabel}
        </a>
      </Button>
    );
  }

  // Internal link
  if (linkHref) {
    return (
      <Button variant={linkVariant} asChild className={schema.className}>
        <RouterLink to={linkHref} onClick={handleClick}>
          {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
          {linkLabel}
        </RouterLink>
      </Button>
    );
  }

  // Button that opens drawer or has onClick
  return (
    <Button variant={linkVariant} onClick={handleClick} className={schema.className}>
      {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
      {linkLabel}
    </Button>
  );
}
```

## Text Link Variant

```tsx
// For inline text links (not button-styled)
export function TextLinkAdapter({ schema, label, href }: LinkProps) {
  const linkHref = href || schema.href;

  if (linkHref?.startsWith("http")) {
    return (
      <a
        href={linkHref}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline-offset-4 hover:underline"
      >
        {label || schema.label}
      </a>
    );
  }

  return (
    <RouterLink
      to={linkHref || "#"}
      className="text-primary underline-offset-4 hover:underline"
    >
      {label || schema.label}
    </RouterLink>
  );
}
```

## Schema Examples

### Internal Link

```json
{
  "type": "LINK",
  "label": "View Profile",
  "href": "/users/:id",
  "icon": "User"
}
```

### External Link

```json
{
  "type": "LINK",
  "label": "Documentation",
  "href": "https://docs.example.com",
  "icon": "ExternalLink"
}
```

### Link Opens Drawer

```json
{
  "type": "LINK",
  "label": "Edit Settings",
  "opens": "edit-settings",
  "variant": "ghost"
}
```

## Notes

- Uses `Button` with `asChild` for consistent styling
- External links open in new tab
- Internal links use React Router
- Can open drawers like BUTTON adapter
