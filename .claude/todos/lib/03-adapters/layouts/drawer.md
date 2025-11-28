# DRAWER Adapter

## Purpose

Slide-out panel for forms, details, or secondary content. Built on shadcn's Sheet component.

## Registry Interface

```ts
export interface DrawerProps extends BaseRendererProps {
  title?: string;
  description?: string;
  open?: boolean;
  onClose?: () => void;
}
```

## shadcn Components Used

- `Sheet`
- `SheetContent`
- `SheetHeader`
- `SheetTitle`
- `SheetDescription`
- `SheetFooter`
- `SheetClose`

## Implementation

```tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@ui-components/ui/sheet";
import { Button } from "@ui-components/ui/button";
import type { DrawerProps } from "@ui/registry";

export function DrawerAdapter({
  schema,
  title,
  description,
  open,
  onClose,
  children,
}: DrawerProps) {
  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          {(title || schema.title) && (
            <SheetTitle>{title || schema.title}</SheetTitle>
          )}
          {(description || schema.description) && (
            <SheetDescription>{description || schema.description}</SheetDescription>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">{children}</div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
```

## Configuration

Sheet supports different sides via the `side` prop on `SheetContent`:

```tsx
<SheetContent side="right">  {/* default */}
<SheetContent side="left">
<SheetContent side="top">
<SheetContent side="bottom">
```

## Size Customization

```tsx
<SheetContent className="w-[400px] sm:w-[540px]">
```

## Notes

- Typically used for create/edit forms
- Footer contains action buttons (Cancel, Save)
- Content area is scrollable for long forms
- Usually controlled by VIEW-level drawer state
