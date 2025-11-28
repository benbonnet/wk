import { useState } from "react";
import { format, parseISO } from "date-fns";
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
import { useTranslate } from "@ui/provider";
import type { InputProps } from "@ui/registry";

export function INPUT_DATE({
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
  const dateValue = value ? parseISO(value as string) : undefined;

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date?.toISOString().split("T")[0] || null);
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
              error && "border-destructive"
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
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{t(helperText)}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
