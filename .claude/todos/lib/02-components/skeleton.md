# Skeleton Component Documentation

## Description

The Skeleton component serves as a placeholder display while content is being loaded. It provides visual feedback to users that data is being fetched.

## Installation

```bash
pnpm dlx shadcn@latest add skeleton
```

## Usage

### Basic Import

```typescript
import { Skeleton } from "@/components/ui/skeleton";
```

### Simple Example

```typescript
<Skeleton className="h-[20px] w-[100px] rounded-full" />
```

### Card Example

```typescript
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}
```

### Avatar Example

```typescript
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}
```

## Styling

Customize the skeleton's appearance using Tailwind CSS classes for:

- **Height**: `h-[value]`
- **Width**: `w-[value]`
- **Border Radius**: `rounded-full`, `rounded-xl`, etc.
