# Command Component Documentation

## Overview

The Command component is described as a "Fast, composable, unstyled command menu for React." It's built on the `cmdk` library by pacocoursey and provides flexible command palette functionality.

## Installation

Using the CLI:

```bash
pnpm dlx shadcn@latest add command
```

## Basic Imports

```typescript
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
```

## Core Components

**Command** - Main container wrapper for the command menu

**CommandInput** - Search/filter input field accepting a placeholder prop

**CommandList** - Scrollable container for command items

**CommandEmpty** - Displayed when no search results match

**CommandGroup** - Organizes related items with optional heading

**CommandItem** - Individual selectable command option

**CommandSeparator** - Visual divider between command sections

**CommandShortcut** - Displays keyboard shortcuts alongside items

**CommandDialog** - Modal variant for command palettes

## Usage Example

```typescript
<Command className="rounded-lg border shadow-md">
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Settings">
      <CommandItem>
        <span>Profile</span>
        <CommandShortcut>⌘P</CommandShortcut>
      </CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

## Dialog Pattern

For modal command palettes, use CommandDialog with keyboard listeners to toggle open/closed states.
