import { type FC } from "react";
import { Formik, Form as FormikForm, useFormikContext } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@ui/components/sheet";
import { Button } from "@ui/components/button";
import { useServices, useTranslate } from "@ui/lib/ui-renderer/provider";
import { DynamicRenderer } from "@ui/lib/ui-renderer/renderer";
import type { UISchema } from "@ui/lib/ui-renderer/types";

interface RelationshipCreateDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  template: UISchema[];
  basePath: string;
  onSuccess: (item: { id: number; [key: string]: unknown }) => void;
  _ns?: string;
}

/**
 * RelationshipCreateDrawer (Layer 3)
 *
 * Nested drawer for creating new items.
 * POSTs to API and returns created item with ID.
 * Uses Formik for form state management.
 */
export const RelationshipCreateDrawer: FC<RelationshipCreateDrawerProps> = ({
  open,
  onOpenChange,
  name,
  template,
  basePath,
  onSuccess,
}) => {
  const t = useTranslate();
  const services = useServices();
  const queryClient = useQueryClient();

  // Build initial values from template
  const initialValues: Record<string, unknown> = {};
  template.forEach((field) => {
    if (field.name) {
      initialValues[field.name] = "";
    }
  });

  const createMutation = useMutation({
    mutationFn: async (formValues: Record<string, unknown>) => {
      const response = await services.fetch(basePath, {
        method: "POST",
        data: { data: formValues },
      });
      return response;
    },
    onSuccess: (response) => {
      // Invalidate picker list so it refetches with new item
      queryClient.invalidateQueries({
        queryKey: ["relationship-picker", basePath],
      });
      // Response structure: { data: { id, data: {...} }, meta }
      const item = response.data;
      onSuccess({ id: item.id, ...item.data });
    },
  });

  const handleSubmit = async (values: Record<string, unknown>) => {
    createMutation.mutate(values);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[450px] sm:max-w-[450px]"
        data-testid={`relationship-create-drawer-${name}`}
      >
        <SheetHeader>
          <SheetTitle>{t("create_new")}</SheetTitle>
          <SheetDescription className="sr-only">
            {t("create_new_description")}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            <CreateDrawerForm
              template={template}
              isSubmitting={createMutation.isPending}
              t={t}
            />
          </Formik>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface CreateDrawerFormProps {
  template: UISchema[];
  isSubmitting: boolean;
  t: (key: string) => string;
}

function CreateDrawerForm({ template, isSubmitting, t }: CreateDrawerFormProps) {
  const { submitForm } = useFormikContext();

  return (
    <FormikForm className="space-y-4">
      {template.map((element, index) => (
        <DynamicRenderer key={index} schema={element} data={{}} />
      ))}
      <Button
        type="button"
        onClick={submitForm}
        disabled={isSubmitting}
      >
        {isSubmitting ? t("saving") : t("add")}
      </Button>
    </FormikForm>
  );
}
