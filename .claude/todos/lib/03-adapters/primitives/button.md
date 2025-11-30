# BUTTON Adapter

## Purpose

Action button with variants, icons, and loading states.

## Registry Interface

```ts
export interface ButtonProps extends BaseRendererProps {
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  icon?: string;
  onClick?: () => void;
  loading?: boolean;
}
```

## shadcn Components Used

- `Button`

## Implementation

```tsx
import { Button } from "@ui-components/button";
import { Loader2 } from "lucide-react";
import * as Icons from "lucide-react";
import { useDrawer } from "../layouts/view";
import { useServices } from "@ui";
import type { ButtonProps } from "@ui/registry";

const variantMap = {
  primary: "default",
  secondary: "secondary",
  ghost: "ghost",
  destructive: "destructive",
} as const;

export function ButtonAdapter({
  schema,
  label,
  variant,
  icon,
  onClick,
  loading,
}: ButtonProps) {
  const { openDrawer } = useDrawer();
  const { fetch, toast, confirm, navigate } = useServices();
  const [isLoading, setIsLoading] = useState(loading || false);

  const buttonVariant = variantMap[variant || schema.variant || "primary"];
  const buttonLabel = label || schema.label!;
  const IconComponent = icon || schema.icon ? Icons[icon || schema.icon] : null;

  const handleClick = async () => {
    // Custom onClick handler
    if (onClick) {
      onClick();
      return;
    }

    // Opens a drawer
    if (schema.opens) {
      openDrawer(schema.opens);
      return;
    }

    // API call
    if (schema.api) {
      // Confirm if needed
      if (schema.confirm) {
        const confirmed = await confirm(schema.confirm);
        if (!confirmed) return;
      }

      setIsLoading(true);
      try {
        const apiConfig = typeof schema.api === "string"
          ? parseApiString(schema.api)
          : schema.api;

        await fetch(apiConfig.path, { method: apiConfig.method });

        if (schema.notification?.success) {
          toast(schema.notification.success, "success");
        }
      } catch (error) {
        if (schema.notification?.error) {
          toast(schema.notification.error, "error");
        }
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Navigate via href
    if (schema.href) {
      navigate(schema.href);
    }
  };

  return (
    <Button
      variant={buttonVariant}
      onClick={handleClick}
      disabled={isLoading}
      className={schema.className}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : IconComponent ? (
        <IconComponent className="mr-2 h-4 w-4" />
      ) : null}
      {buttonLabel}
    </Button>
  );
}

function parseApiString(api: string): { method: string; path: string } {
  const [method, path] = api.split(" ");
  return { method: method || "GET", path: path || api };
}
```

## Schema Examples

### Simple Button

```json
{
  "type": "BUTTON",
  "label": "Save",
  "variant": "primary"
}
```

### Button Opens Drawer

```json
{
  "type": "BUTTON",
  "label": "Add User",
  "icon": "Plus",
  "opens": "create-user"
}
```

### Button with API Call

```json
{
  "type": "BUTTON",
  "label": "Delete",
  "variant": "destructive",
  "icon": "Trash2",
  "api": "DELETE /api/users/:id",
  "confirm": "Are you sure you want to delete this user?",
  "notification": {
    "success": "User deleted successfully",
    "error": "Failed to delete user"
  }
}
```

### Button with Navigation

```json
{
  "type": "BUTTON",
  "label": "View Details",
  "variant": "ghost",
  "href": "/users/:id"
}
```

## Notes

- Variant mapping translates schema variants to shadcn variants
- Icons from lucide-react loaded dynamically
- Handles drawer opening, API calls, and navigation
- Loading state shows spinner
