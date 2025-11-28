import { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@ui/utils";
import type { FormProps } from "@ui/registry";

interface FormContextValue {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isDirty: boolean;
  setValue: (name: string, value: unknown) => void;
  setError: (name: string, error: string) => void;
  setTouched: (name: string) => void;
  getValue: (name: string) => unknown;
  getError: (name: string) => string | undefined;
  isTouched: (name: string) => boolean;
}

export const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useFormContext must be used within FormAdapter");
  return ctx;
}

export function useField(name: string) {
  const form = useFormContext();

  return {
    value: form.getValue(name),
    error: form.isTouched(name) ? form.getError(name) : undefined,
    touched: form.isTouched(name),
    onChange: (value: unknown) => form.setValue(name, value),
    onBlur: () => form.setTouched(name),
  };
}

export function FORM({
  schema,
  action,
  onSubmit,
  defaultValues = {},
  children,
}: FormProps) {
  const [values, setValues] = useState<Record<string, unknown>>(defaultValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouchedState] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues] = useState(defaultValues);

  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  const setValue = useCallback((name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error when value changes
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const setError = useCallback((name: string, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const setTouched = useCallback((name: string) => {
    setTouchedState((prev) => ({ ...prev, [name]: true }));
  }, []);

  const getValue = useCallback((name: string) => values[name], [values]);

  const getError = useCallback((name: string) => errors[name], [errors]);

  const isTouched = useCallback((name: string) => touched[name] || false, [touched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(values);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contextValue: FormContextValue = {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    setValue,
    setError,
    setTouched,
    getValue,
    getError,
    isTouched,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form
        data-ui="form"
        onSubmit={handleSubmit}
        className={cn("space-y-6", schema.className)}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}
