# INPUT_DATETIME Adapter

## Purpose

Date and time picker for selecting date with time.

## Registry Interface

```ts
export interface DateTimeInputProps extends InputBaseProps {
  // DateTime-specific props
}
```

## shadcn Components Used

- `Calendar`
- `Popover`, `PopoverTrigger`, `PopoverContent`
- `Button`
- `Input` (for time)
- `Label`

## Implementation

```tsx
import { useState } from "react";
import { useField } from "formik";
import { format, parse, setHours, setMinutes } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@ui-components/ui/calendar";
import { Button } from "@ui-components/ui/button";
import { Input } from "@ui-components/ui/input";
import { Label } from "@ui-components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui-components/ui/popover";
import { cn } from "@ui/utils";
import type { DateTimeInputProps } from "@ui/registry";

export function DateTimeInputAdapter({
  name,
  label,
  helperText,
  placeholder,
  disabled,
}: DateTimeInputProps) {
  const [field, meta, helpers] = useField(name);
  const [open, setOpen] = useState(false);

  const hasError = meta.touched && meta.error;

  // Parse value as Date
  const dateTimeValue = field.value ? new Date(field.value as string) : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      helpers.setValue(null);
      return;
    }

    // Preserve existing time if set
    if (dateTimeValue) {
      date = setHours(date, dateTimeValue.getHours());
      date = setMinutes(date, dateTimeValue.getMinutes());
    }

    helpers.setValue(date.toISOString());
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    if (!time) return;

    const [hours, minutes] = time.split(":").map(Number);
    let newDate = dateTimeValue || new Date();
    newDate = setHours(newDate, hours);
    newDate = setMinutes(newDate, minutes);

    helpers.setValue(newDate.toISOString());
  };

  const timeValue = dateTimeValue
    ? format(dateTimeValue, "HH:mm")
    : "";

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}

      <div className="flex gap-2">
        {/* Date Picker */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={name}
              variant="outline"
              disabled={disabled}
              className={cn(
                "flex-1 justify-start text-left font-normal",
                !dateTimeValue && "text-muted-foreground",
                hasError && "border-destructive"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateTimeValue
                ? format(dateTimeValue, "PPP")
                : placeholder || "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateTimeValue}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Time Input */}
        <Input
          type="time"
          value={timeValue}
          onChange={handleTimeChange}
          disabled={disabled || !dateTimeValue}
          className="w-32"
        />
      </div>

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

## Combined Popover Variant

```tsx
export function CombinedDateTimeAdapter({ name, label }: DateTimeInputProps) {
  const [field, , helpers] = useField(name);
  const [open, setOpen] = useState(false);

  const dateTimeValue = field.value ? new Date(field.value as string) : undefined;

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateTimeValue
              ? format(dateTimeValue, "PPP 'at' p")
              : "Pick date and time"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <Input
              type="time"
              value={dateTimeValue ? format(dateTimeValue, "HH:mm") : ""}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(":").map(Number);
                let newDate = dateTimeValue || new Date();
                newDate = setHours(setMinutes(newDate, minutes), hours);
                helpers.setValue(newDate.toISOString());
              }}
            />
          </div>
          <Calendar
            mode="single"
            selected={dateTimeValue}
            onSelect={(date) => {
              if (date && dateTimeValue) {
                date = setHours(date, dateTimeValue.getHours());
                date = setMinutes(date, dateTimeValue.getMinutes());
              }
              helpers.setValue(date?.toISOString() || null);
            }}
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
  "name": "scheduled_at",
  "kind": "INPUT_DATETIME",
  "label": "Schedule For",
  "placeholder": "Select date and time"
}
```

## Notes

- Stores ISO datetime string
- Date and time can be selected separately
- Time input disabled until date selected
- Uses date-fns for date manipulation
