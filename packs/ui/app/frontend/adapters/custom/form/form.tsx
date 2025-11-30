import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { cn } from "@ui/lib/utils";
import { useTranslate } from "@ui/lib/ui-renderer/provider";
import type { FormProps } from "@ui/lib/ui-renderer/registry";
import type { UISchema } from "@ui/lib/ui-renderer/types";
import { useViewConfig, useDrawer } from "../view";

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
  if (!ctx) throw new Error("useFormContext must be used within Form");
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

interface ExtendedFormProps extends FormProps {
  elements?: UISchema[];
}

export function Form({
  action,
  use_record,
  notification,
  onSubmit,
  defaultValues = {},
  elements,
  className,
  children,
}: ExtendedFormProps) {
  const t = useTranslate();
  const { executeApi } = useViewConfig();
  const { drawerData } = useDrawer();

  const initialData = use_record && drawerData ? drawerData : defaultValues;

  const [values, setValues] = useState<Record<string, unknown>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouchedState] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState(initialData);

  useEffect(() => {
    if (use_record && drawerData) {
      setValues(drawerData);
      setInitialValues(drawerData);
    }
  }, [drawerData, use_record]);

  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  const setValue = useCallback((name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
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

  const requiredFields = useMemo(() => {
    const collectRequired = (els: UISchema[] | undefined): string[] => {
      if (!els) return [];
      const required: string[] = [];
      for (const el of els) {
        if (el.required && el.name) required.push(el.name);
        if (el.elements)
          required.push(...collectRequired(el.elements as UISchema[]));
      }
      return required;
    };
    return collectRequired(elements);
  }, [elements]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    for (const fieldName of requiredFields) {
      const value = values[fieldName];
      if (value === undefined || value === null || value === "") {
        newErrors[fieldName] = t("required") || "Required";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const newTouched: Record<string, boolean> = {};
      for (const fieldName of Object.keys(newErrors)) {
        newTouched[fieldName] = true;
      }
      setTouchedState((prev) => ({ ...prev, ...newTouched }));
      return false;
    }

    return true;
  }, [requiredFields, values, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formAction = action || "save";
      const item = use_record && drawerData ? drawerData : values;

      await executeApi(
        formAction,
        item as Record<string, unknown>,
        { data: values },
        notification,
      );

      if (onSubmit) await onSubmit(values);
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
        className={cn("space-y-6", className)}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}
