import { useContext } from "react";
import { useTranslate } from "@ui/lib/ui-renderer/provider";
import { Badge } from "@ui/components/badge";
import { cn } from "@ui/lib/utils";
import { ShowContext } from "./show";

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

// Format date with ordinal suffix
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
          ? "rd"
          : "th";

  return `${month} ${day}${suffix}, ${year}`;
}

// Format datetime with ordinal suffix
function formatDatetime(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
          ? "rd"
          : "th";

  return `${month} ${day}${suffix}, ${year} at ${time}`;
}

// Format number with thousands separator
function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
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

  // Get value from: 1) explicit value prop, 2) data prop (from DynamicRenderer), 3) ShowContext
  const value =
    propValue !== undefined
      ? propValue
      : data?.[name] !== undefined
        ? data[name]
        : showContext?.data?.[name];

  // Empty state character
  const emptyState = "—";

  // Check if value is empty
  const isEmpty = value === null || value === undefined || value === "";

  switch (type) {
    case "DISPLAY_TEXT":
      return (
        <div data-ui="display-text" className={cn("space-y-1", className)}>
          {translatedLabel && (
            <p className="text-sm font-medium text-muted-foreground">
              {translatedLabel}
            </p>
          )}
          <p className="text-sm">{isEmpty ? emptyState : String(value)}</p>
        </div>
      );

    case "DISPLAY_LONGTEXT":
      return (
        <div data-ui="display-longtext" className={cn("space-y-1", className)}>
          {translatedLabel && (
            <p className="text-sm font-medium text-muted-foreground">
              {translatedLabel}
            </p>
          )}
          <p className="text-sm whitespace-pre-wrap">
            {isEmpty ? emptyState : String(value)}
          </p>
        </div>
      );

    case "DISPLAY_NUMBER":
      const numValue =
        typeof value === "number" ? formatNumber(value) : emptyState;
      return (
        <div data-ui="display-number" className={cn("space-y-1", className)}>
          {translatedLabel && (
            <p className="text-sm font-medium text-muted-foreground">
              {translatedLabel}
            </p>
          )}
          <p className="text-sm font-mono">
            {isEmpty && value !== 0 ? emptyState : numValue}
          </p>
        </div>
      );

    case "DISPLAY_DATE":
      const dateValue =
        !isEmpty && value ? formatDate(value as string) : emptyState;
      return (
        <div data-ui="display-date" className={cn("space-y-1", className)}>
          {translatedLabel && (
            <p className="text-sm font-medium text-muted-foreground">
              {translatedLabel}
            </p>
          )}
          <p className="text-sm">{dateValue}</p>
        </div>
      );

    case "DISPLAY_DATETIME":
      const datetimeValue =
        !isEmpty && value ? formatDatetime(value as string) : emptyState;
      return (
        <div data-ui="display-datetime" className={cn("space-y-1", className)}>
          {translatedLabel && (
            <p className="text-sm font-medium text-muted-foreground">
              {translatedLabel}
            </p>
          )}
          <p className="text-sm">{datetimeValue}</p>
        </div>
      );

    case "DISPLAY_BADGE":
      if (isEmpty) {
        return (
          <div data-ui="display-badge" className={cn("space-y-1", className)}>
            {translatedLabel && (
              <p className="text-sm font-medium text-muted-foreground">
                {translatedLabel}
              </p>
            )}
            <p className="text-sm">{emptyState}</p>
          </div>
        );
      }
      // Check if there's a matching option label
      const badgeOption = options.find((o) => o.value === value);
      const badgeText = badgeOption ? t(badgeOption.label) : String(value);
      return (
        <div data-ui="display-badge" className={cn("space-y-1", className)}>
          {translatedLabel && (
            <p className="text-sm font-medium text-muted-foreground">
              {translatedLabel}
            </p>
          )}
          <Badge variant="secondary">{badgeText}</Badge>
        </div>
      );

    case "DISPLAY_TAGS":
      const tags = Array.isArray(value) ? value : [];
      if (tags.length === 0) {
        return (
          <div data-ui="display-tags" className={cn("space-y-1", className)}>
            {translatedLabel && (
              <p className="text-sm font-medium text-muted-foreground">
                {translatedLabel}
              </p>
            )}
            <p className="text-sm">{emptyState}</p>
          </div>
        );
      }
      return (
        <div data-ui="display-tags" className={cn("space-y-1", className)}>
          {translatedLabel && (
            <p className="text-sm font-medium text-muted-foreground">
              {translatedLabel}
            </p>
          )}
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, i) => (
              <Badge key={i} variant="outline">
                {String(tag)}
              </Badge>
            ))}
          </div>
        </div>
      );

    case "DISPLAY_BOOLEAN":
      // Truthy/falsy logic
      const boolValue = value ? "Yes" : "No";
      return (
        <div data-ui="display-boolean" className={cn("space-y-1", className)}>
          {translatedLabel && (
            <p className="text-sm font-medium text-muted-foreground">
              {translatedLabel}
            </p>
          )}
          <p className="text-sm">{boolValue}</p>
        </div>
      );

    case "DISPLAY_SELECT":
      if (isEmpty) {
        return (
          <div data-ui="display-select" className={cn("space-y-1", className)}>
            {translatedLabel && (
              <p className="text-sm font-medium text-muted-foreground">
                {translatedLabel}
              </p>
            )}
            <p className="text-sm">{emptyState}</p>
          </div>
        );
      }
      const selectedOption = options.find((o) => o.value === value);
      const selectDisplay = selectedOption
        ? t(selectedOption.label)
        : String(value);
      return (
        <div data-ui="display-select" className={cn("space-y-1", className)}>
          {translatedLabel && (
            <p className="text-sm font-medium text-muted-foreground">
              {translatedLabel}
            </p>
          )}
          <p className="text-sm">{selectDisplay}</p>
        </div>
      );

    default:
      console.error(`DisplayAdapter: Unknown type ${type}`);
      return (
        <div className="text-destructive">Unknown display type: {type}</div>
      );
  }
}
