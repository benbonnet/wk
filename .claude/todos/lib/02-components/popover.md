# Popover Component Documentation

## Description

The Popover component "displays rich content in a portal, triggered by a button." It leverages Radix UI primitives to create an accessible overlay that appears relative to a trigger element.

## Installation

Install the popover component using the CLI:

```bash
pnpm dlx shadcn@latest add popover
```

## Basic Usage

Import the necessary components:

```javascript
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
```

Basic implementation:

```jsx
<Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent>Place content for the popover here.</PopoverContent>
</Popover>
```

## Complete Example

The documentation includes a practical demo showing a popover containing form fields for setting dimensions:

```jsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        {/* Form fields and content */}
      </PopoverContent>
    </Popover>
  )
}
```

## Key Features

- **Portal rendering** for overlay content
- **Button-triggered** activation
- **Accessible** implementation via Radix UI
- **Customizable** content within the portal

## References

- [Radix UI Popover Docs](https://www.radix-ui.com/docs/primitives/components/popover)
- [API Reference](https://www.radix-ui.com/docs/primitives/components/popover#api-reference)
