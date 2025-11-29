import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { cn } from "@ui/lib/utils";
import { useTranslate } from "@ui/lib/provider";
import type { FormProps } from "@ui/lib/registry";
import type { UISchema } from "@ui/lib/types";
import { useViewConfig, useDrawer } from "./view";

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

// Helper to collect required fields from schema elements
function collectRequiredFields(elements: UISchema[] | undefined): string[] {
  if (!elements) return [];
  const required: string[] = [];

  for (const el of elements) {
    if (el.required && el.name) {
      required.push(el.name);
    }
    if (el.elements) {
      required.push(...collectRequiredFields(el.elements as UISchema[]));
    }
  }

  return required;
}

export function FORM({
  schema,
  action,
  onSubmit,
  defaultValues = {},
  children,
}: FormProps) {
  const t = useTranslate();
  const { executeApi } = useViewConfig();
  const { drawerData } = useDrawer();

  // Use drawerData as initial values if use_record is true
  const useRecord = schema.use_record as boolean | undefined;
  const initialData = useRecord && drawerData ? drawerData : defaultValues;

  const [values, setValues] = useState<Record<string, unknown>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouchedState] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState(initialData);

  // Update values when drawerData changes (for edit forms)
  useEffect(() => {
    if (useRecord && drawerData) {
      setValues(drawerData);
      setInitialValues(drawerData);
    }
  }, [drawerData, useRecord]);

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

  const isTouched = useCallback(
    (name: string) => touched[name] || false,
    [touched],
  );

  // Validate required fields
  const validateForm = useCallback((): boolean => {
    const requiredFields = collectRequiredFields(schema.elements as UISchema[] | undefined);
    const newErrors: Record<string, string> = {};

    for (const fieldName of requiredFields) {
      const value = values[fieldName];
      if (value === undefined || value === null || value === "") {
        newErrors[fieldName] = t("required") || "Required";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Mark all errored fields as touched
      const newTouched: Record<string, boolean> = {};
      for (const fieldName of Object.keys(newErrors)) {
        newTouched[fieldName] = true;
      }
      setTouchedState((prev) => ({ ...prev, ...newTouched }));
      return false;
    }

    return true;
  }, [schema.elements, values, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submitting
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Get action and notification from schema
      const formAction = (schema.action as string) || action || "save";
      const notification = schema.notification as { success?: string; error?: string } | undefined;

      // Determine the item (for path interpolation)
      const item = useRecord && drawerData ? drawerData : values;

      // Call executeApi
      await executeApi(formAction, item as Record<string, unknown>, { data: values }, notification);

      // Also call onSubmit if provided
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
        data-testid="form-renderer"
        onSubmit={handleSubmit}
        className={cn("space-y-6", schema.className)}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}
