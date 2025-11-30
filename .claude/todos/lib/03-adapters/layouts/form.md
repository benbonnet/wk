# FORM Adapter

## Purpose

Form container that handles submission, validation, and form state. Integrates with Formik (or React Hook Form).

## Registry Interface

```ts
export interface FormProps extends BaseRendererProps {
  initialValues?: Record<string, unknown>;
  onSubmit?: (values: Record<string, unknown>) => Promise<void>;
  validationSchema?: Record<string, unknown>;
}
```

## shadcn Components Used

- No direct shadcn form wrapper (Formik handles form state)
- Child input adapters use shadcn input components

## Implementation (Formik)

```tsx
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import type { FormProps } from "@ui/registry";

export function FormAdapter({
  schema,
  initialValues = {},
  onSubmit,
  validationSchema,
  children,
}: FormProps) {
  const handleSubmit = async (values: Record<string, unknown>) => {
    if (onSubmit) {
      await onSubmit(values);
    }
  };

  // Convert JSON schema to Zod if needed
  const formikSchema = validationSchema
    ? toFormikValidationSchema(validationSchema)
    : undefined;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={formikSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className={cn("space-y-6", schema.className)}>
          {children}
        </Form>
      )}
    </Formik>
  );
}
```

## Alternative: React Hook Form

```tsx
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FormProps } from "@ui/registry";

export function FormAdapter({
  schema,
  initialValues = {},
  onSubmit,
  validationSchema,
  children,
}: FormProps) {
  const methods = useForm({
    defaultValues: initialValues,
    resolver: validationSchema ? zodResolver(validationSchema) : undefined,
  });

  const handleSubmit = methods.handleSubmit(async (values) => {
    if (onSubmit) {
      await onSubmit(values);
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className={cn("space-y-6", schema.className)}>
        {children}
      </form>
    </FormProvider>
  );
}
```

## Schema Example

```json
{
  "type": "FORM",
  "action": "/api/users",
  "use_record": true,
  "elements": [
    { "type": "COMPONENT", "name": "email", "kind": "INPUT_TEXT" },
    { "type": "COMPONENT", "name": "role", "kind": "INPUT_SELECT", "options": [...] },
    { "type": "SUBMIT", "label": "Save" }
  ]
}
```

## Notes

- `initialValues` can be populated from API response when `use_record: true`
- Validation can be defined server-side and converted to Zod/Yup
- Form context makes field values available to all child input adapters
- SUBMIT adapter reads form submission state from context
