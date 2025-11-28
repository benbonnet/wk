# OPTION Adapter

## Purpose

Individual option/action within a dropdown menu.

## Registry Interface

```ts
export interface OptionProps extends BaseRendererProps {
  label: string;
  onClick?: () => void;
  icon?: string;
}
```

## shadcn Components Used

- `DropdownMenuItem`

## Implementation

```tsx
import { DropdownMenuItem } from "@ui-components/ui/dropdown-menu";
import * as Icons from "lucide-react";
import { useDrawer } from "../layouts/view";
import { useServices } from "@ui";
import type { OptionProps } from "@ui/registry";

export function OptionAdapter({ schema, label, onClick, icon }: OptionProps) {
  const { openDrawer } = useDrawer();
  const { fetch, toast, confirm, navigate } = useServices();
  const optionLabel = label || schema.label!;
  const IconComponent = icon || schema.icon ? Icons[icon || schema.icon] : null;

  const handleClick = async () => {
    // Custom onClick
    if (onClick) {
      onClick();
      return;
    }

    // Opens drawer
    if (schema.opens) {
      openDrawer(schema.opens);
      return;
    }

    // Navigate
    if (schema.href) {
      navigate(schema.href);
      return;
    }

    // API call
    if (schema.api) {
      if (schema.confirm) {
        const confirmed = await confirm(schema.confirm);
        if (!confirmed) return;
      }

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
      }
    }
  };

  const isDestructive = schema.variant === "destructive";

  return (
    <DropdownMenuItem
      onClick={handleClick}
      className={cn(
        isDestructive && "text-destructive focus:text-destructive",
        schema.className
      )}
    >
      {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
      {optionLabel}
    </DropdownMenuItem>
  );
}

function parseApiString(api: string): { method: string; path: string } {
  const [method, path] = api.split(" ");
  return { method: method || "GET", path: path || api };
}
```

## Schema Examples

### Navigation Option

```json
{
  "type": "OPTION",
  "label": "View Details",
  "href": "/users/:id",
  "icon": "Eye"
}
```

### Drawer Option

```json
{
  "type": "OPTION",
  "label": "Edit",
  "opens": "edit-user",
  "icon": "Pencil"
}
```

### Delete Option

```json
{
  "type": "OPTION",
  "label": "Delete",
  "icon": "Trash2",
  "variant": "destructive",
  "api": "DELETE /api/users/:id",
  "confirm": "Are you sure you want to delete this user?",
  "notification": {
    "success": "User deleted",
    "error": "Failed to delete user"
  }
}
```

## Notes

- Used within DROPDOWN adapter
- Handles same actions as BUTTON (opens, href, api)
- Destructive variant shows red text
