import { RadioGroup, RadioGroupItem } from "@ui/components/ui/radio-group";
import { Label } from "@ui/components/ui/label";
import { useTranslate } from "@ui/lib/provider";
import type { InputProps } from "@ui/lib/registry";

export function INPUT_RADIOS({
  name,
  label,
  helperText,
  options = [],
  disabled,
  value,
  onChange,
  error,
}: InputProps) {
  const t = useTranslate();

  return (
    <div className="space-y-3">
      {label && <Label className="text-base">{t(label)}</Label>}

      <RadioGroup
        value={(value as string) ?? ""}
        onValueChange={(val) => onChange?.(val)}
        disabled={disabled}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-3">
            <RadioGroupItem
              value={option.value}
              id={`${name}-${option.value}`}
            />
            <Label
              htmlFor={`${name}-${option.value}`}
              className="text-sm font-normal"
            >
              {t(option.label)}
              {option.description && (
                <span className="block text-muted-foreground">
                  {t(option.description)}
                </span>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{t(helperText)}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
