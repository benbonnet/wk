# SUBMIT Adapter

## Purpose

Form submit button that reads form state for loading/disabled status.

## Registry Interface

```ts
export interface SubmitProps extends BaseRendererProps {
  label?: string;
  loadingLabel?: string;
}
```

## shadcn Components Used

- `Button`

## Implementation (Formik)

```tsx
import { useFormikContext } from "formik";
import { Button } from "@ui-components/ui/button";
import { Loader2 } from "lucide-react";
import type { SubmitProps } from "@ui/registry";

export function SubmitAdapter({ schema, label, loadingLabel }: SubmitProps) {
  const { isSubmitting, isValid, dirty } = useFormikContext();

  const submitLabel = label || schema.label || "Submit";
  const submitLoadingLabel = loadingLabel || schema.loadingLabel || "Saving...";

  return (
    <Button
      type="submit"
      disabled={isSubmitting || !isValid || !dirty}
      className={schema.className}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {submitLoadingLabel}
        </>
      ) : (
        submitLabel
      )}
    </Button>
  );
}
```

## Implementation (React Hook Form)

```tsx
import { useFormContext } from "react-hook-form";
import { Button } from "@ui-components/ui/button";
import { Loader2 } from "lucide-react";
import type { SubmitProps } from "@ui/registry";

export function SubmitAdapter({ schema, label, loadingLabel }: SubmitProps) {
  const {
    formState: { isSubmitting, isValid, isDirty },
  } = useFormContext();

  const submitLabel = label || schema.label || "Submit";
  const submitLoadingLabel = loadingLabel || schema.loadingLabel || "Saving...";

  return (
    <Button
      type="submit"
      disabled={isSubmitting || !isValid || !isDirty}
      className={schema.className}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {submitLoadingLabel}
        </>
      ) : (
        submitLabel
      )}
    </Button>
  );
}
```

## With Cancel Button

```tsx
export function SubmitWithCancelAdapter({ schema, label, loadingLabel }: SubmitProps) {
  const { isSubmitting, resetForm } = useFormikContext();
  const { closeDrawer } = useDrawer();

  const handleCancel = () => {
    resetForm();
    closeDrawer();
  };

  return (
    <div className="flex gap-2">
      <Button type="button" variant="outline" onClick={handleCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingLabel || "Saving..."}
          </>
        ) : (
          label || schema.label || "Save"
        )}
      </Button>
    </div>
  );
}
```

## Schema Examples

### Simple Submit

```json
{
  "type": "SUBMIT",
  "label": "Save Changes",
  "loadingLabel": "Saving..."
}
```

### In Form Context

```json
{
  "type": "FORM",
  "elements": [
    { "type": "COMPONENT", "name": "email", "kind": "INPUT_TEXT" },
    { "type": "SUBMIT", "label": "Update Email" }
  ]
}
```

## Notes

- Must be within a FORM adapter to access form context
- Automatically disables when:
  - Form is submitting
  - Form is invalid
  - Form has no changes (not dirty)
- Shows loading spinner during submission
