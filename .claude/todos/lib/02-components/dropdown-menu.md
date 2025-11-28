# Dropdown Menu Component Documentation

## Description

The Dropdown Menu component displays a menu to users containing a set of actions or functions, triggered by a button. It's built on Radix UI primitives and provides accessible, composable functionality.

## Installation

```bash
pnpm dlx shadcn@latest add dropdown-menu
```

## Basic Usage

```javascript
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Team</DropdownMenuItem>
    <DropdownMenuItem>Subscription</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>;
```

## Sub-Components

- **DropdownMenuTrigger**: Button element that opens the menu
- **DropdownMenuContent**: Container for menu items
- **DropdownMenuItem**: Individual selectable menu item
- **DropdownMenuLabel**: Non-selectable label text
- **DropdownMenuSeparator**: Visual divider between items
- **DropdownMenuGroup**: Groups related items together
- **DropdownMenuShortcut**: Displays keyboard shortcuts alongside items
- **DropdownMenuSub**: Creates nested submenu structures
- **DropdownMenuSubTrigger**: Opens submenu
- **DropdownMenuSubContent**: Container for submenu items
- **DropdownMenuCheckboxItem**: Menu item with checkbox state
- **DropdownMenuRadioGroup**: Group for radio button items
- **DropdownMenuRadioItem**: Individual radio option
- **DropdownMenuPortal**: Portal rendering for submenus

## Key Examples

### With Checkboxes

Use `DropdownMenuCheckboxItem` with `checked` and `onCheckedChange` props for toggleable options.

### With Radio Groups

Implement `DropdownMenuRadioGroup` for mutually exclusive selections with `value` and `onValueChange` handlers.

### With Dialog Integration

Set `modal={false}` on the DropdownMenu wrapper to allow opening dialogs from menu items without closing the menu.

## Documentation References

- [Radix UI Docs](https://www.radix-ui.com/docs/primitives/components/dropdown-menu)
- [API Reference](https://www.radix-ui.com/docs/primitives/components/dropdown-menu#api-reference)
