# Switch Component Documentation

## Description

The Switch component is "a control that allows the user to toggle between checked and not checked." It provides a binary toggle interface built on Radix UI primitives.

## Installation

### Using CLI
```bash
pnpm dlx shadcn@latest add switch
```

Alternative package managers:
- `npm dlx shadcn@latest add switch`
- `yarn shadcn@latest add switch`
- `bun shadcn@latest add switch`

## Usage

### Basic Import
```javascript
import { Switch } from "@/components/ui/switch"
```

### Example: Airplane Mode Toggle

```jsx
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function SwitchDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  )
}
```

## Implementation Notes

- The component works seamlessly with the `Label` component for accessibility
- It uses Flexbox utilities for layout alignment
- The switch maintains a 2-unit spacing gap between the toggle and its label
- It integrates with the design system's spacing and component conventions

## Reference

For complete API documentation and additional implementation details, consult the [Radix UI Switch documentation](https://www.radix-ui.com/docs/primitives/components/switch#api-reference).
