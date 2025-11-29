import {
  Alert as AlertUI,
  AlertTitle,
  AlertDescription,
} from "@ui-components/alert";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@ui/utils";
import { useTranslate } from "@ui/provider";
import type { AlertProps } from "@ui/registry";

const colorVariants = {
  default: { containerClass: "", Icon: Info },
  red: {
    containerClass: "border-red-500/50 text-red-600 [&>svg]:text-red-600",
    Icon: AlertCircle,
  },
  green: {
    containerClass: "border-green-500/50 text-green-600 [&>svg]:text-green-600",
    Icon: CheckCircle,
  },
  blue: {
    containerClass: "border-blue-500/50 text-blue-600 [&>svg]:text-blue-600",
    Icon: Info,
  },
  yellow: {
    containerClass:
      "border-yellow-500/50 text-yellow-600 [&>svg]:text-yellow-600",
    Icon: AlertTriangle,
  },
};

interface ExtendedAlertProps extends AlertProps {
  subtitle?: string;
}

export function Alert({
  label,
  subtitle,
  color = "default",
  className,
}: ExtendedAlertProps) {
  const t = useTranslate();
  const variant = colorVariants[color];
  const Icon = variant.Icon;

  return (
    <AlertUI data-ui="alert" className={cn(variant.containerClass, className)}>
      <Icon className="h-4 w-4" />
      <AlertTitle>{t(label)}</AlertTitle>
      {subtitle && <AlertDescription>{t(subtitle)}</AlertDescription>}
    </AlertUI>
  );
}
