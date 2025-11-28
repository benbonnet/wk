# Checkbox Component Documentation

## Description

The Checkbox component is a control that allows users to toggle between checked and unchecked states. It's built on Radix UI primitives and provides accessible form input functionality.

## Installation

```bash
pnpm dlx shadcn@latest add checkbox
```

Alternative package managers:

- npm
- yarn
- bun

## Basic Usage

```typescript
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function CheckboxDemo() {
  return (
    <div className="flex items-center gap-3">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  )
}
```

## Component Variants

### Standard Checkbox

A basic unchecked checkbox paired with a label for user agreement scenarios.

### Pre-checked State

```typescript
<Checkbox id="terms-2" defaultChecked />
```

### Disabled State

```typescript
<Checkbox id="toggle" disabled />
```

### Enhanced Selection Card

A styled variant that highlights the container when checked:

```typescript
<Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50">
  <Checkbox
    id="toggle-2"
    defaultChecked
    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
  />
  <div className="grid gap-1.5 font-normal">
    <p className="text-sm leading-none font-medium">Enable notifications</p>
    <p className="text-muted-foreground text-sm">You can manage settings anytime.</p>
  </div>
</Label>
```

## Import

```typescript
import { Checkbox } from "@/components/ui/checkbox";
```

## References

- **Radix UI Documentation:** Available via official Radix UI primitives docs
- **API Reference:** Full specification available through Radix UI component API reference
