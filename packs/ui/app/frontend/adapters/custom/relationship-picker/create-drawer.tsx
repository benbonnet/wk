import { useState, useCallback, type FC } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@ui-components/sheet";
import { Button } from "@ui-components/button";
import { useServices, useTranslate } from "@ui/provider";
import { DynamicRenderer } from "@ui/renderer";
import type { UISchema } from "@ui/types";
import { FormContext } from "../form";

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
 */
export const RelationshipCreateDrawer: FC<RelationshipCreateDrawerProps> = ({
  open,
  onOpenChange,
  name,
  template,
  basePath,
  onSuccess,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _ns = "common",
}) => {
  const t = useTranslate();
  const services = useServices();
  const queryClient = useQueryClient();

  // Form state management
  const [values, setValuesState] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouchedState] = useState<Record<string, boolean>>({});

  const setValue = useCallback((fieldName: string, value: unknown) => {
    setValuesState((prev) => ({ ...prev, [fieldName]: value }));
    // Clear error when value changes
    setErrors((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  }, []);

  const setError = useCallback((fieldName: string, error: string) => {
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  }, []);

  const setTouched = useCallback((fieldName: string) => {
    setTouchedState((prev) => ({ ...prev, [fieldName]: true }));
  }, []);

  const getValue = useCallback(
    (fieldName: string) => values[fieldName],
    [values],
  );
  const getError = useCallback(
    (fieldName: string) => errors[fieldName],
    [errors],
  );
  const isTouched = useCallback(
    (fieldName: string) => touched[fieldName] || false,
    [touched],
  );

  const createMutation = useMutation({
    mutationFn: async (formValues: Record<string, unknown>) => {
      const response = await services.fetch(basePath, {
        method: "POST",
        body: JSON.stringify({ data: formValues }),
      });
      return response;
    },
    onSuccess: (created) => {
      // Invalidate picker list so it refetches with new item
      queryClient.invalidateQueries({
        queryKey: ["relationship-picker", basePath],
      });
      // Reset form
      setValuesState({});
      setErrors({});
      setTouchedState({});
      // Return created item with ID to parent
      onSuccess({ id: created.id, ...created.data });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(values);
  };

  // Form context value
  const formContextValue = {
    values,
    errors,
    touched,
    isSubmitting: createMutation.isPending,
    isDirty: Object.keys(values).length > 0,
    setValue,
    setError,
    setTouched,
    getValue,
    getError,
    isTouched,
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
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <FormContext.Provider value={formContextValue}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {template.map((element, index) => (
                <DynamicRenderer key={index} schema={element} data={{}} />
              ))}
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? t("saving") : t("add")}
              </Button>
            </form>
          </FormContext.Provider>
        </div>
      </SheetContent>
    </Sheet>
  );
};
