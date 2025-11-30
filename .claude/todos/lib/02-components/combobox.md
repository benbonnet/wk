# Combobox Component Documentation

## Description

The Combobox is a searchable input component that combines autocomplete functionality with a dropdown list of suggestions. It's described as an "Autocomplete input and command palette with a list of suggestions."

## Installation

The Combobox is built by composing two existing components:

```bash
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add command
```

No separate installation is needed—it uses the Popover and Command components as its foundation.

## Basic Usage

The core implementation combines a Popover trigger with a Command menu inside:

```typescript
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
]

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((f) => f.value === value)?.label
            : "Select framework..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

## Component Variants

### Status Selection Variant

Implements a popover-based status selector with custom styling for different states.

### Responsive Variant

Uses `useMediaQuery` hook to switch between Popover (desktop) and Drawer (mobile) implementations, providing an optimized experience across device sizes.

### Dropdown Menu Integration

Embeds the combobox within a dropdown menu's submenu for label filtering functionality.

## Key Props & Features

- **open/onOpenChange**: Controls popover visibility
- **value/setValue**: Manages selected item
- **CommandInput**: Provides search/filter functionality
- **CommandItem.onSelect**: Handles item selection logic
- **aria-expanded**: Accessibility attribute for button state

The component supports toggling selection (selecting again deselects) and automatically closes the popover upon selection.
