import { useState } from "react";
import { format, parseISO, setHours, setMinutes } from "date-fns";
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
import { useTranslate } from "@ui/provider";
import type { InputProps } from "@ui/registry";

export function INPUT_DATETIME({
  name,
  label,
  placeholder,
  helperText,
  disabled,
  value,
  onChange,
  error,
}: InputProps) {
  const t = useTranslate();
  const [open, setOpen] = useState(false);

  // Parse value as Date
  const dateTimeValue = value ? parseISO(value as string) : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange?.(null);
      return;
    }

    // Preserve existing time if set
    if (dateTimeValue) {
      date = setHours(date, dateTimeValue.getHours());
      date = setMinutes(date, dateTimeValue.getMinutes());
    }

    onChange?.(date.toISOString());
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    if (!time) return;

    const [hours, minutes] = time.split(":").map(Number);
    let newDate = dateTimeValue || new Date();
    newDate = setHours(newDate, hours);
    newDate = setMinutes(newDate, minutes);

    onChange?.(newDate.toISOString());
  };

  const timeValue = dateTimeValue ? format(dateTimeValue, "HH:mm") : "";

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{t(label)}</Label>}

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
                error && "border-destructive"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateTimeValue
                ? format(dateTimeValue, "PPP")
                : placeholder
                ? t(placeholder)
                : t("Pick a date")}
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
          className={cn("w-32", error && "border-destructive")}
        />
      </div>

      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{t(helperText)}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
