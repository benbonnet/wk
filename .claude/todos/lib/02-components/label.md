# Label Component Documentation

## Overview

The Label component provides an accessible way to render labels associated with form controls and interactive elements.

**Description:** "Renders an accessible label associated with controls."

## Installation

### Using CLI
```bash
pnpm dlx shadcn@latest add label
```

### Manual Import
```typescript
import { Label } from "@/components/ui/label"
```

## Basic Usage

```jsx
<Label htmlFor="email">Your email address</Label>
```

## Example Implementation

Here's a practical example combining the Label component with a Checkbox:

```jsx
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function LabelDemo() {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
    </div>
  )
}
```

## Key Props

- **htmlFor**: Associates the label with a form control by matching the control's `id` attribute, ensuring proper accessibility

## Resources

- [Radix UI Label Documentation](https://www.radix-ui.com/docs/primitives/components/label)
- [API Reference](https://www.radix-ui.com/docs/primitives/components/label#api-reference)
