import { useState } from "react";
import { format, parseISO, setHours, setMinutes } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@ui-components/calendar";
import { Button } from "@ui-components/button";
import { Input } from "@ui-components/input";
import { Label } from "@ui-components/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui-components/popover";
import { cn } from "@ui/utils";
import { useTranslate } from "@ui/provider";
import { useField } from "./custom/form";
import type { InputProps } from "@ui/registry";

export function DatetimeInput({
  name,
  label,
  placeholder,
  disabled,
  helperText,
}: InputProps) {
  const t = useTranslate();
  const field = useField(name);
  const [open, setOpen] = useState(false);

  const dateTimeValue = field.value
    ? parseISO(field.value as string)
    : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      field.onChange(null);
      return;
    }

    if (dateTimeValue) {
      date = setHours(date, dateTimeValue.getHours());
      date = setMinutes(date, dateTimeValue.getMinutes());
    }

    field.onChange(date.toISOString());
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    if (!time) return;

    const [hours, minutes] = time.split(":").map(Number);
    let newDate = dateTimeValue || new Date();
    newDate = setHours(newDate, hours);
    newDate = setMinutes(newDate, minutes);

    field.onChange(newDate.toISOString());
  };

  const timeValue = dateTimeValue ? format(dateTimeValue, "HH:mm") : "";

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{t(label)}</Label>}
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={name}
              variant="outline"
              disabled={disabled}
              className={cn(
                "flex-1 justify-start text-left font-normal",
                !dateTimeValue && "text-muted-foreground",
                field.error && "border-destructive",
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
        <Input
          type="time"
          value={timeValue}
          onChange={handleTimeChange}
          disabled={disabled || !dateTimeValue}
          className={cn("w-32", field.error && "border-destructive")}
        />
      </div>
      {helperText && !field.error && (
        <p className="text-sm text-muted-foreground">{t(helperText)}</p>
      )}
      {field.error && <p className="text-sm text-destructive">{field.error}</p>}
    </div>
  );
}
