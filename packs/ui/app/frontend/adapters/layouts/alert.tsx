import { Alert, AlertTitle, AlertDescription } from "@ui/components/ui/alert";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@ui/lib/utils";
import { useTranslate } from "@ui/lib/provider";
import type { AlertProps } from "@ui/lib/registry";

const colorVariants = {
  default: {
    containerClass: "",
    iconClass: "",
    Icon: Info,
  },
  red: {
    containerClass: "border-red-500/50 text-red-600 [&>svg]:text-red-600",
    iconClass: "text-red-600",
    Icon: AlertCircle,
  },
  green: {
    containerClass: "border-green-500/50 text-green-600 [&>svg]:text-green-600",
    iconClass: "text-green-600",
    Icon: CheckCircle,
  },
  blue: {
    containerClass: "border-blue-500/50 text-blue-600 [&>svg]:text-blue-600",
    iconClass: "text-blue-600",
    Icon: Info,
  },
  yellow: {
    containerClass:
      "border-yellow-500/50 text-yellow-600 [&>svg]:text-yellow-600",
    iconClass: "text-yellow-600",
    Icon: AlertTriangle,
  },
};

export function ALERT({ schema, label, color = "default" }: AlertProps) {
  const t = useTranslate();

  const alertLabel = label || schema.label!;
  const alertColor = color || schema.color || "default";
  const subtitle = schema.subtitle;

  const variant = colorVariants[alertColor];
  const Icon = variant.Icon;

  return (
    <Alert
      data-ui="alert"
      className={cn(variant.containerClass, schema.className)}
    >
      <Icon className="h-4 w-4" />
      <AlertTitle>{t(alertLabel)}</AlertTitle>
      {subtitle && <AlertDescription>{t(subtitle)}</AlertDescription>}
    </Alert>
  );
}
