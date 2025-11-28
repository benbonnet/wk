import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-components/ui/select";
import { Label } from "@ui-components/ui/label";
import { cn } from "@ui/utils";
import { useTranslate } from "@ui/provider";
import type { InputProps } from "@ui/registry";

export function INPUT_SELECT({
  name,
  label,
  placeholder,
  helperText,
  options = [],
  disabled,
  value,
  onChange,
  error,
}: InputProps) {
  const t = useTranslate();

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{t(label)}</Label>}
      <Select
        value={(value as string) ?? ""}
        onValueChange={(val) => onChange?.(val)}
        disabled={disabled}
      >
        <SelectTrigger
          id={name}
          className={cn(error && "border-destructive")}
        >
          <SelectValue placeholder={placeholder ? t(placeholder) : undefined} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {t(opt.label)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{t(helperText)}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
