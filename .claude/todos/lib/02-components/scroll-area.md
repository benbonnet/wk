# Scroll Area Component Documentation

## Description

The Scroll Area component "Augments native scroll functionality for custom, cross-browser styling." It provides a way to create custom, styled scrollbars while maintaining cross-browser compatibility.

## Installation

Using the CLI:

```bash
pnpm dlx shadcn@latest add scroll-area
```

## Usage

Import the component:

```javascript
import { ScrollArea } from "@/components/ui/scroll-area"
```

Basic implementation:

```jsx
<ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
  Jokester began sneaking into the castle in the middle of the night and
  leaving jokes all over the place: under the king's pillow, in his soup,
  even in the royal toilet. The king was furious, but he couldn't seem to
  stop Jokester. And then, one day, the people of the kingdom discovered
  that the jokes left by Jokester were so funny that they couldn't help but laugh.
</ScrollArea>
```

## Examples

### Basic Tags List

Display a scrollable list with separators between items using custom scrolling styling.

### Horizontal Scrolling

The component supports horizontal scrolling via the `ScrollBar` component with `orientation="horizontal"` to create gallery-style layouts with side-scrolling content.

## Related Resources

- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/components/scroll-area)
- [API Reference](https://www.radix-ui.com/docs/primitives/components/scroll-area#api-reference)
