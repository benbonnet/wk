import { useEffect, useMemo } from "react";
import { Formik, Form as FormikForm, useFormikContext } from "formik";
import * as Yup from "yup";
import { cn } from "@ui/lib/utils";
import { useTranslate } from "@ui/lib/ui-renderer/provider";
import type { FormProps } from "@ui/lib/ui-renderer/registry";
import type { UISchema } from "@ui/lib/ui-renderer/types";
import { useViewConfig, useDrawer } from "../view";

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

  // Build Yup validation schema from elements
  const validationSchema = useMemo(() => {
    const buildSchema = (els: UISchema[] | undefined): Record<string, Yup.AnySchema> => {
      if (!els) return {};
      const shape: Record<string, Yup.AnySchema> = {};

      for (const el of els) {
        if (el.required && el.name) {
          // Determine field type based on schema type
          if (el.type === "INPUT_CHECKBOX") {
            shape[el.name] = Yup.boolean().oneOf([true], t("required") || "Required");
          } else if (el.type === "INPUT_CHECKBOXES") {
            shape[el.name] = Yup.array().min(1, t("required") || "Required");
          } else {
            shape[el.name] = Yup.string().required(t("required") || "Required");
          }
        }
        // Recurse into nested elements
        if (el.elements) {
          Object.assign(shape, buildSchema(el.elements as UISchema[]));
        }
      }
      return shape;
    };

    return Yup.object().shape(buildSchema(elements));
  }, [elements, t]);

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      const formAction = action || "save";
      const record = use_record && drawerData ? drawerData : values;

      await executeApi({
        action: formAction,
        url_parameters: record as Record<string, unknown>,
        body: { data: values },
        notification,
      });

      if (onSubmit) await onSubmit(values);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Formik
      initialValues={initialData as Record<string, unknown>}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <FormInner className={className} use_record={use_record} drawerData={drawerData}>
        {children}
      </FormInner>
    </Formik>
  );
}

interface FormInnerProps {
  children: React.ReactNode;
  className?: string;
  use_record?: boolean;
  drawerData: Record<string, unknown> | null;
}

function FormInner({ children, className, use_record, drawerData }: FormInnerProps) {
  const { resetForm } = useFormikContext();

  // Reset form when drawer data changes
  useEffect(() => {
    if (use_record && drawerData) {
      resetForm({ values: drawerData });
    }
  }, [drawerData, use_record, resetForm]);

  return (
    <FormikForm
      data-ui="form"
      data-testid="form-renderer"
      className={cn("space-y-6", className)}
    >
      {children}
    </FormikForm>
  );
}
