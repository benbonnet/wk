import { useField } from "formik";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { Textarea } from "@ui/components/textarea";
import { Checkbox } from "@ui/components/checkbox";
import { RadioGroup, RadioGroupItem } from "@ui/components/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/select";
import { cn } from "@ui/lib/utils";
import { useTranslate } from "@ui/lib/ui-renderer/provider";

interface Option {
  value: string;
  label: string;
}

interface FormikAdapterProps {
  type: string;
  name: string;
  label?: string;
  helperText?: string;
  placeholder?: string;
  options?: Option[];
  rows?: number;
  disabled?: boolean;
  className?: string;
  inputType?: "text" | "number" | "email" | "tel" | "url" | "password";
}

export function FormikAdapter({
  type,
  name,
  label,
  helperText,
  placeholder,
  options = [],
  rows,
  disabled = false,
  className,
  inputType = "text",
}: FormikAdapterProps) {
  const [field, meta, helpers] = useField(name);
  const t = useTranslate();
  const error = meta.touched && meta.error ? meta.error : undefined;
  const translatedLabel = label ? t(label) : undefined;

  switch (type) {
    case "INPUT_TEXT":
      return (
        <div className="space-y-2">
          {translatedLabel && <Label htmlFor={name}>{translatedLabel}</Label>}
          <Input
            {...field}
            value={field.value ?? ""}
            id={name}
            type={inputType}
            placeholder={placeholder ? t(placeholder) : undefined}
            disabled={disabled}
            className={cn(error && "border-destructive", className)}
          />
          {helperText && !error && (
            <p className="text-sm text-muted-foreground">{t(helperText)}</p>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      );

    case "INPUT_TEXTAREA":
      return (
        <div className="space-y-2">
          {translatedLabel && <Label htmlFor={name}>{translatedLabel}</Label>}
          <Textarea
            {...field}
            value={field.value ?? ""}
            id={name}
            placeholder={placeholder ? t(placeholder) : undefined}
            rows={rows}
            disabled={disabled}
            className={cn(error && "border-destructive", className)}
          />
          {helperText && !error && (
            <p className="text-sm text-muted-foreground">{t(helperText)}</p>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      );

    case "INPUT_SELECT":
      return (
        <div className="space-y-2">
          {translatedLabel && <Label htmlFor={name}>{translatedLabel}</Label>}
          <Select
            value={field.value || ""}
            onValueChange={(value) => helpers.setValue(value)}
            disabled={disabled}
          >
            <SelectTrigger
              id={name}
              className={cn(error && "border-destructive", className)}
            >
              <SelectValue
                placeholder={placeholder ? t(placeholder) : undefined}
              />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(option.label)}
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

    case "INPUT_CHECKBOX":
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={name}
            checked={field.value === true}
            onCheckedChange={(checked) => helpers.setValue(checked)}
            disabled={disabled}
          />
          {translatedLabel && (
            <Label htmlFor={name} className="cursor-pointer">
              {translatedLabel}
            </Label>
          )}
        </div>
      );

    case "INPUT_CHECKBOXES":
      return (
        <div className="space-y-2">
          {translatedLabel && <Label>{translatedLabel}</Label>}
          <div className="space-y-2">
            {options.map((option) => {
              const values = (field.value as string[]) || [];
              const isChecked = values.includes(option.value);
              return (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${name}-${option.value}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        helpers.setValue([...values, option.value]);
                      } else {
                        helpers.setValue(
                          values.filter((v) => v !== option.value),
                        );
                      }
                    }}
                    disabled={disabled}
                  />
                  <Label
                    htmlFor={`${name}-${option.value}`}
                    className="cursor-pointer"
                  >
                    {t(option.label)}
                  </Label>
                </div>
              );
            })}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      );

    case "INPUT_RADIOS":
      return (
        <div className="space-y-2">
          {translatedLabel && <Label>{translatedLabel}</Label>}
          <RadioGroup
            value={field.value || ""}
            onValueChange={(value) => helpers.setValue(value)}
            disabled={disabled}
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${name}-${option.value}`}
                />
                <Label
                  htmlFor={`${name}-${option.value}`}
                  className="cursor-pointer"
                >
                  {t(option.label)}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      );

    case "INPUT_DATE":
      return (
        <div className="space-y-2">
          {translatedLabel && <Label htmlFor={name}>{translatedLabel}</Label>}
          <Input
            {...field}
            value={field.value ?? ""}
            id={name}
            type="date"
            disabled={disabled}
            className={cn(error && "border-destructive", className)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      );

    case "INPUT_DATETIME":
      return (
        <div className="space-y-2">
          {translatedLabel && <Label htmlFor={name}>{translatedLabel}</Label>}
          <Input
            {...field}
            value={field.value ?? ""}
            id={name}
            type="datetime-local"
            disabled={disabled}
            className={cn(error && "border-destructive", className)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      );

    case "INPUT_AI_RICH_TEXT":
      return (
        <div className="space-y-2">
          {translatedLabel && <Label htmlFor={name}>{translatedLabel}</Label>}
          <Textarea
            {...field}
            value={field.value ?? ""}
            id={name}
            placeholder={placeholder ? t(placeholder) : undefined}
            rows={rows || 6}
            disabled={disabled}
            className={cn(error && "border-destructive", className)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      );

    case "INPUT_TAGS":
      return (
        <div className="border border-dashed rounded p-4 text-center text-sm text-muted-foreground">
          Tags field (pending implementation)
        </div>
      );

    default:
      console.error(`FormikAdapter: Unknown type ${type}`);
      return <div className="text-destructive">Unknown input type: {type}</div>;
  }
}
