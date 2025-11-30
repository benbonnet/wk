# Badge Component Documentation

## Overview

The Badge component "displays a badge or a component that looks like a badge."

## Installation

To add the Badge component to your project, use the CLI:

```bash
pnpm dlx shadcn@latest add badge
```

Alternative package managers:
- npm
- yarn
- bun

## Usage

### Basic Import

```javascript
import { Badge } from "@/components/ui/badge"
```

### Basic Syntax

```jsx
<Badge variant="default | outline | secondary | destructive">Badge</Badge>
```

## Component Variants

The Badge component supports multiple styling variants:

1. **Default** - Standard badge styling
2. **Secondary** - Alternative color scheme
3. **Destructive** - Red/error state styling
4. **Outline** - Border-only variant

## Example Implementation

```jsx
import { AlertCircleIcon, BadgeCheckIcon, CheckIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function BadgeDemo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-full flex-wrap gap-2">
        <Badge>Badge</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    </div>
  )
}
```

## Advanced Usage

### Badge as Link

Using the `asChild` prop, you can render the Badge as another component:

```jsx
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function LinkAsBadge() {
  return (
    <Badge asChild>
      <Link href="/">Badge</Link>
    </Badge>
  )
}
```

This approach allows styling different component types consistently as badges.
