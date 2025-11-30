import { useFormikContext } from "formik";
import { Button } from "@ui/components/button";
import { Loader2 } from "lucide-react";
import { useTranslate } from "@ui/lib/ui-renderer/provider";
import type { SubmitProps } from "@ui/lib/ui-renderer/registry";

export function Submit({
  label = "Submit",
  loadingLabel = "Submitting...",
  className,
}: SubmitProps) {
  const t = useTranslate();
  const { isSubmitting } = useFormikContext();

  return (
    <Button
      data-ui="submit"
      type="submit"
      disabled={isSubmitting}
      className={className}
    >
      {isSubmitting ? (
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
