# Tooltip Component Documentation

## Description

"A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it."

## Installation

```bash
pnpm dlx shadcn@latest add tooltip
```

## Usage

### Import Statement

```javascript
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
```

### Basic Example

```jsx
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  )
}
```

## Key Components

- **`<Tooltip>`**: Container wrapper for the tooltip functionality
- **`<TooltipTrigger>`**: Element that triggers the tooltip display
- **`<TooltipContent>`**: Container for the tooltip message or content

## Recent Updates

As of September 22, 2025, tooltip colors were updated. The styling now uses the foreground color for backgrounds and background color for text. Update `bg-primary text-primary-foreground` to `bg-foreground text-background` for `<TooltipContent />` and `<TooltipArrow />`.

## References

- [Radix UI Tooltip Documentation](https://www.radix-ui.com/docs/primitives/components/tooltip)
- [API Reference](https://www.radix-ui.com/docs/primitives/components/tooltip#api-reference)
