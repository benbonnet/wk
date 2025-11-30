# Select Component Documentation

## Overview

The Select component displays a list of options for users to choose from, triggered by a button. It's built on Radix UI primitives.

**Description:** "Displays a list of options for the user to pick from—triggered by a button."

## Installation

Using the CLI:
```bash
pnpm dlx shadcn@latest add select
```

## Import Statement

```typescript
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
```

## Basic Usage

```jsx
<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>
```

## Example: Fruit Selection

```jsx
export function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
```

## Scrollable Variant

For longer lists, the component supports scrolling with organized groups:

```jsx
<Select>
  <SelectTrigger className="w-[280px]">
    <SelectValue placeholder="Select a timezone" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>North America</SelectLabel>
      <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
      <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
      <!-- Additional items -->
    </SelectGroup>
  </SelectContent>
</Select>
```

## Key Components

- **Select**: Root wrapper
- **SelectTrigger**: Button that opens the dropdown
- **SelectValue**: Displays selected value or placeholder
- **SelectContent**: Container for options
- **SelectGroup**: Groups related items
- **SelectLabel**: Labels for option groups
- **SelectItem**: Individual selectable options

## References

- [Radix UI Select Documentation](https://www.radix-ui.com/docs/primitives/components/select)
- [API Reference](https://www.radix-ui.com/docs/primitives/components/select#api-reference)
