import { Button } from "@ui-components/button";
import { Loader2 } from "lucide-react";
import { useTranslate } from "@ui/provider";
import { useFormContext } from "./custom/form";
import type { SubmitProps } from "@ui/registry";

export function Submit({
  label = "Submit",
  loadingLabel = "Submitting...",
  className,
}: SubmitProps) {
  const t = useTranslate();
  const form = useFormContext();

  return (
    <Button
      data-ui="submit"
      type="submit"
      disabled={form.isSubmitting}
      className={className}
    >
      {form.isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t(loadingLabel)}
        </>
      ) : (
        t(label)
      )}
    </Button>
  );
}
