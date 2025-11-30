# Calendar Component Documentation

## Overview

The Calendar component is a date field element that enables users to enter and modify dates. It's constructed on top of [React DayPicker](https://react-day-picker.js.org).

## Installation

```bash
pnpm dlx shadcn@latest add calendar
```

Alternative package managers:

- `npm dlx shadcn@latest add calendar`
- `yarn dlx shadcn@latest add calendar`
- `bun dlx shadcn@latest add calendar`

## Basic Usage

```typescript
import { Calendar } from "@/components/ui/calendar"

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow-sm"
      captionLayout="dropdown"
    />
  )
}
```

## Key Props

- **mode**: Selection mode ("single", "range", or "multiple")
- **selected**: Currently selected date(s)
- **onSelect**: Callback when date is selected
- **captionLayout**: Display format for month/year ("label", "dropdown", "dropdown-months", "dropdown-years")
- **numberOfMonths**: Display multiple months simultaneously
- **timeZone**: Ensures dates display in user's local timezone

## Notable Features

### Range Selection

Display two calendar months with date range capability:

```typescript
const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
  from: new Date(2025, 5, 12),
  to: new Date(2025, 6, 15),
})

<Calendar
  mode="range"
  numberOfMonths={2}
  selected={dateRange}
  onSelect={setDateRange}
/>
```

### Persian/Hijri Calendar Support

Replace the standard calendar with Persian calendar implementation by modifying the import in `components/ui/calendar.tsx`.

### Custom Cell Sizing

Adjust calendar cell dimensions using CSS variables for responsive design across breakpoints.

### Date with Time Picker

Combine the Calendar with an Input element for time selection alongside date picking.

### Natural Language Input

Integrate with `chrono-node` library to parse conversational date expressions (e.g., "In 2 days").

## Customization

The component supports extensive customization through React DayPicker's API. Reference the [React DayPicker customization documentation](https://react-day-picker.js.org/docs/customization) for detailed styling and behavior modifications.

## Timezone Handling

For accurate timezone representation, set the `timeZone` prop to the user's local timezone detected via `Intl.DateTimeFormat().resolvedOptions().timeZone` within a `useEffect` hook to prevent hydration mismatches.
