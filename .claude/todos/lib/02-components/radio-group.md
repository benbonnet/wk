# Radio Group Component Documentation

## Overview

The Radio Group component is a set of checkable buttons known as radio buttons where no more than one button can be checked at a time. It provides an accessible way for users to select a single option from multiple choices.

## Installation

To add the Radio Group component to your project, use the CLI:

```bash
pnpm dlx shadcn@latest add radio-group
```

## Basic Usage

Import the necessary components:

```javascript
import { Label } from "@/components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
```

Implement a basic radio group with options:

```jsx
<RadioGroup defaultValue="option-one">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-one" id="option-one" />
    <Label htmlFor="option-one">Option One</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-two" id="option-two" />
    <Label htmlFor="option-two">Option Two</Label>
  </div>
</RadioGroup>
```

## Example: Display Sizing Options

This example demonstrates a practical implementation with three sizing variants:

```jsx
export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  )
}
```

## Related Documentation

For comprehensive API details and behavior specifications, refer to the official Radix UI Radio Group documentation at https://www.radix-ui.com/docs/primitives/components/radio-group and its API reference.
