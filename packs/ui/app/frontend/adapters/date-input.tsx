import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@ui-components/calendar";
import { Button } from "@ui-components/button";
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

export function DateInput({
  name,
  label,
  placeholder,
  disabled,
  helperText,
}: InputProps) {
  const t = useTranslate();
  const field = useField(name);
  const [open, setOpen] = useState(false);

  const dateValue = field.value ? parseISO(field.value as string) : undefined;

  const handleSelect = (date: Date | undefined) => {
    field.onChange(date?.toISOString().split("T")[0] || null);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{t(label)}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={name}
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateValue && "text-muted-foreground",
              field.error && "border-destructive",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateValue
              ? format(dateValue, "PPP")
              : placeholder
                ? t(placeholder)
                : t("Pick a date")}
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
      {helperText && !field.error && (
        <p className="text-sm text-muted-foreground">{t(helperText)}</p>
      )}
      {field.error && <p className="text-sm text-destructive">{field.error}</p>}
    </div>
  );
}
