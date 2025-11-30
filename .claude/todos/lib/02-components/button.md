# Button Component Documentation

## Overview

The Button component displays a button or a component that looks like a button. It's a foundational UI element with multiple style variants and sizes.

## Installation

```bash
pnpm dlx shadcn@latest add button
```

## Basic Usage

```tsx
import { Button } from "@/components/ui/button"

export function ButtonDemo() {
  return <Button variant="outline">Button</Button>
}
```

## Variants

The Button component supports six distinct style variants:

- **Default**: Standard button styling
- **Outline**: Border-only button with transparent background
- **Secondary**: Alternative primary styling
- **Ghost**: Minimal styling, background only on hover
- **Destructive**: Warning/danger action styling
- **Link**: Button styled as a hyperlink

## Sizes

Available size options include:

- `sm` - Small button
- `default` - Standard button
- `lg` - Large button
- `icon` - Icon button (default)
- `icon-sm` - Small icon button
- `icon-lg` - Large icon button

## Code Examples

**With Icon:**
```tsx
import { IconGitBranch } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export function ButtonWithIcon() {
  return (
    <Button variant="outline" size="sm">
      <IconGitBranch /> New Branch
    </Button>
  )
}
```

**Rounded Icon Button:**
```tsx
<Button variant="outline" size="icon" className="rounded-full">
  <ArrowUpIcon />
</Button>
```

**Loading State:**
```tsx
<Button size="sm" variant="outline" disabled>
  <Spinner />
  Submit
</Button>
```

## API Reference

### Button Props

| Prop | Type | Default |
|------|------|---------|
| `variant` | "default" \| "outline" \| "ghost" \| "destructive" \| "secondary" \| "link" | "default" |
| `size` | "default" \| "sm" \| "lg" \| "icon" \| "icon-sm" \| "icon-lg" | "default" |
| `asChild` | boolean | false |

## Notable Features

The component automatically adjusts spacing between icons and text based on button size. The `asChild` prop allows wrapping other components (like links) to inherit button styling.

## Cursor Behavior Update

With Tailwind v4, the default cursor for buttons changed from `pointer` to `default`. To maintain the pointer cursor, add this CSS:

```css
@layer base {
  button:not(:disabled),
  [role="button"]:not(:disabled) {
    cursor: pointer;
  }
}
```
