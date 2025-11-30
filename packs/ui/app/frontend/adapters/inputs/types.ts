import type { FieldInputProps, FieldMetaProps, FieldHelperProps } from "formik";

export interface Option {
  value: string;
  label: string;
}

export interface InputComponentProps {
  field: FieldInputProps<unknown>;
  meta: FieldMetaProps<unknown>;
  helpers: FieldHelperProps<unknown>;
  name: string;
  label?: string;
  helperText?: string;
  placeholder?: string;
  options?: Option[];
  rows?: number;
  disabled?: boolean;
  className?: string;
  inputType?: "text" | "number" | "email" | "tel" | "url" | "password";
  t: (key: string) => string;
}
