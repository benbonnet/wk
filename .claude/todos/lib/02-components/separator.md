# Separator Component Documentation

## Description

The Separator is a visual or semantic component that divides content. According to the shadcn/ui docs, it "Visually or semantically separates content."

## Installation

To add the Separator component to your project, run:

```bash
pnpm dlx shadcn@latest add separator
```

## Usage

Import the component from your UI components directory:

```javascript
import { Separator } from "@/components/ui/separator"
```

### Basic Example

Here's a practical implementation showing both horizontal and vertical separators:

```javascript
export function SeparatorDemo() {
  return (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm leading-none font-medium">Radix Primitives</h4>
        <p className="text-muted-foreground text-sm">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  )
}
```

## API Reference

The component supports the `orientation` prop to control its direction:

- **Default**: Horizontal divider
- **`orientation="vertical"`**: Creates a vertical divider

For complete API documentation, refer to the [Radix UI Separator documentation](https://www.radix-ui.com/docs/primitives/components/separator).
