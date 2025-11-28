import { cn } from "@ui/utils";
import { useTranslate } from "@ui/provider";
import type { StepProps } from "@ui/registry";

export function STEP({ schema, label, active, children }: StepProps) {
  const t = useTranslate();

  const stepLabel = label || schema.label;
  const stepSubtitle = schema.subtitle;

  if (!active) {
    return null;
  }

  return (
    <div data-ui="step" className={cn("space-y-6", schema.className)}>
      {/* Step Header */}
      {(stepLabel || stepSubtitle) && (
        <div className="space-y-2">
          {stepLabel && (
            <h2 className="text-lg font-semibold">{t(stepLabel)}</h2>
          )}
          {stepSubtitle && (
            <p className="text-sm text-muted-foreground">{t(stepSubtitle)}</p>
          )}
        </div>
      )}

      {/* Step Content */}
      <div className="space-y-4">{children}</div>
    </div>
  );
}
