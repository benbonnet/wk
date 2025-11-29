import { cn } from "@ui/utils";
import { useTranslate } from "@ui/provider";
import type { StepProps } from "@ui/registry";

interface ExtendedStepProps extends StepProps {
  subtitle?: string;
}

export function Step({
  label,
  subtitle,
  active,
  className,
  children,
}: ExtendedStepProps) {
  const t = useTranslate();

  if (!active) {
    return null;
  }

  return (
    <div data-ui="step" className={cn("space-y-6", className)}>
      {(label || subtitle) && (
        <div className="space-y-2">
          {label && <h2 className="text-lg font-semibold">{t(label)}</h2>}
          {subtitle && (
            <p className="text-sm text-muted-foreground">{t(subtitle)}</p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}
