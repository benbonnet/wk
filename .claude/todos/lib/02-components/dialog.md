# Dialog Component Documentation

## Description

The Dialog component creates "a window overlaid on either the primary window or another dialog window, rendering the content underneath inert."

## Installation

To add the Dialog component to your project, run:

```bash
pnpm dlx shadcn@latest add dialog
```

## Basic Usage

Import the necessary Dialog components:

```javascript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
```

## Simple Example

```jsx
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

## Sub-Components

- **Dialog**: Root container for the dialog
- **DialogTrigger**: Element that opens the dialog
- **DialogContent**: Contains the dialog content and styling
- **DialogHeader**: Container for title and description
- **DialogTitle**: The dialog's heading
- **DialogDescription**: Additional descriptive text
- **DialogFooter**: Container for action buttons
- **DialogClose**: Closes the dialog when triggered

## Form Dialog Example

```jsx
<Dialog>
  <form>
    <DialogTrigger asChild>
      <Button variant="outline">Open Dialog</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="name-1">Name</Label>
          <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="username-1">Username</Label>
          <Input id="username-1" name="username" defaultValue="@peduarte" />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </DialogContent>
  </form>
</Dialog>
```

## Important Notes

When using the Dialog component within a Context Menu or Dropdown Menu, wrap the menu component inside the Dialog component to ensure proper functionality.

## Resources

- [Radix UI Dialog Documentation](https://www.radix-ui.com/docs/primitives/components/dialog)
- [API Reference](https://www.radix-ui.com/docs/primitives/components/dialog#api-reference)
