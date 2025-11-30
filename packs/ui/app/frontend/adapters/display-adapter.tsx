import { useContext } from "react";
import { useTranslate } from "@ui/lib/ui-renderer/provider";
import { cn } from "@ui/lib/utils";
import { ShowContext } from "./layouts";
import { DISPLAY_COMPONENTS, type DisplayType } from "./displays";

interface Option {
  value: string;
  label: string;
}

interface DisplayAdapterProps {
  type: string;
  name: string;
  value?: unknown;
  data?: Record<string, unknown>;
  label?: string;
  options?: Option[];
  className?: string;
}

export function DisplayAdapter({
  type,
  name,
  value: propValue,
  data,
  label,
  options = [],
  className,
}: DisplayAdapterProps) {
  const t = useTranslate();
  const showContext = useContext(ShowContext);
  const translatedLabel = label ? t(label) : undefined;

  // Get value from: 1) explicit value prop, 2) data prop, 3) ShowContext
  const value =
    propValue !== undefined
      ? propValue
      : data?.[name] !== undefined
        ? data[name]
        : showContext?.data?.[name];

  const emptyState = "—";
  const isEmpty = value === null || value === undefined || value === "";

  const Component = DISPLAY_COMPONENTS[type as DisplayType];

  if (!Component) {
    console.error(`DisplayAdapter: Unknown type ${type}`);
    return <div className="text-destructive">Unknown display type: {type}</div>;
  }

  const typeSlug = type.replace("DISPLAY_", "").toLowerCase();

  return (
    <div data-ui={`display-${typeSlug}`} className={cn("space-y-1", className)}>
      {translatedLabel && (
        <p className="text-sm font-medium text-muted-foreground">
          {translatedLabel}
        </p>
      )}
      <Component
        value={value}
        isEmpty={isEmpty}
        emptyState={emptyState}
        options={options}
        t={t}
      />
    </div>
  );
}
