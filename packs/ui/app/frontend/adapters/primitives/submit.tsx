import { Button } from "@ui-components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslate } from "@ui/provider";
import { useFormContext } from "../layouts/form";
import type { SubmitProps } from "@ui/registry";

export function SUBMIT({ schema, label }: SubmitProps) {
  const t = useTranslate();
  const form = useFormContext();

  const submitLabel = label || schema.label || "Submit";
  const loadingLabel = schema.loadingLabel || "Submitting...";

  return (
    <Button
      data-ui="submit"
      type="submit"
      disabled={form.isSubmitting}
      className={schema.className}
    >
      {form.isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t(loadingLabel)}
        </>
      ) : (
        t(submitLabel)
      )}
    </Button>
  );
}
