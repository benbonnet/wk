import { useField } from "formik";
import { useTranslate } from "@ui/lib/ui-renderer/provider";
import { INPUT_COMPONENTS, type InputType } from "./inputs";

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

  const Component = INPUT_COMPONENTS[type as InputType];

  if (!Component) {
    console.error(`FormikAdapter: Unknown type ${type}`);
    return <div className="text-destructive">Unknown input type: {type}</div>;
  }

  return (
    <Component
      field={field}
      meta={meta}
      helpers={helpers}
      name={name}
      label={label}
      helperText={helperText}
      placeholder={placeholder}
      options={options}
      rows={rows}
      disabled={disabled}
      className={className}
      inputType={inputType}
      t={t}
    />
  );
}
