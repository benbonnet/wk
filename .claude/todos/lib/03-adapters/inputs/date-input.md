# INPUT_DATE Adapter

## Purpose

Date picker for selecting a single date.

## Registry Interface

```ts
export interface DateInputProps extends InputBaseProps {
  // Date-specific props
}
```

## shadcn Components Used

- `Calendar`
- `Popover`, `PopoverTrigger`, `PopoverContent`
- `Button`
- `Label`

## Implementation

```tsx
import { useState } from "react";
import { useField } from "formik";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@ui-components/ui/calendar";
import { Button } from "@ui-components/ui/button";
import { Label } from "@ui-components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui-components/ui/popover";
import { cn } from "@ui/utils";
import type { DateInputProps } from "@ui/registry";

export function DateInputAdapter({
  name,
  label,
  helperText,
  placeholder,
  disabled,
}: DateInputProps) {
  const [field, meta, helpers] = useField(name);
  const [open, setOpen] = useState(false);

  const hasError = meta.touched && meta.error;

  // Parse value as Date
  const dateValue = field.value ? new Date(field.value as string) : undefined;

  const handleSelect = (date: Date | undefined) => {
    helpers.setValue(date?.toISOString().split("T")[0] || null);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={name}
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateValue && "text-muted-foreground",
              hasError && "border-destructive"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateValue ? format(dateValue, "PPP") : placeholder || "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {hasError && (
        <p className="text-sm text-destructive">{meta.error}</p>
      )}
      {helperText && !hasError && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
```

## With Dropdown Month/Year Navigation

```tsx
<Calendar
  mode="single"
  selected={dateValue}
  onSelect={handleSelect}
  captionLayout="dropdown"
  fromYear={1900}
  toYear={2100}
/>
```

## Date Range Variant

```tsx
export function DateRangeInputAdapter({ name, label }: DateInputProps) {
  const [field, , helpers] = useField(name);

  const dateRange = field.value as { from?: Date; to?: Date } | undefined;

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              "Pick a date range"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={(range) => helpers.setValue(range)}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
```

## Schema Example

```json
{
  "type": "COMPONENT",
  "name": "birth_date",
  "kind": "INPUT_DATE",
  "label": "Date of Birth",
  "placeholder": "Select your birth date"
}
```

## Notes

- Stores ISO date string (YYYY-MM-DD)
- Uses date-fns for formatting
- Dropdown layout good for birth dates (wide year range)
