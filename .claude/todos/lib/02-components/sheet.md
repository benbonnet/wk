# Sheet Component Documentation

## Description

The Sheet component extends the Dialog component to display content that complements the main content of the screen. It functions as a complementary panel that slides in from the edge of the viewport.

## Installation

```bash
pnpm dlx shadcn@latest add sheet
```

## Basic Usage

```typescript
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
```

```jsx
<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

## Complete Example

```jsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Name</Label>
            <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-username">Username</Label>
            <Input id="sheet-demo-username" defaultValue="@peduarte" />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
```

## Positioning Variants

The `side` property on `<SheetContent />` controls the edge from which the sheet slides in. Valid options are: `top`, `right`, `bottom`, or `left`.

## Size Customization

Adjust sheet dimensions using CSS classes on `SheetContent`:

```jsx
<SheetContent className="w-[400px] sm:w-[540px]">
  <SheetHeader>
    <SheetTitle>Are you absolutely sure?</SheetTitle>
    <SheetDescription>
      This action cannot be undone. This will permanently delete your account
      and remove your data from our servers.
    </SheetDescription>
  </SheetHeader>
</SheetContent>
```

## Component Structure

- **Sheet**: Root container managing open/closed state
- **SheetTrigger**: Element that triggers the sheet to open
- **SheetContent**: Main content container with positioning support
- **SheetHeader**: Container for header elements
- **SheetTitle**: Title text within the header
- **SheetDescription**: Description text within the header
- **SheetFooter**: Container for footer actions
- **SheetClose**: Button to programmatically close the sheet

## References

For detailed API reference and additional information, see the [Radix UI Dialog documentation](https://www.radix-ui.com/docs/primitives/components/dialog).
