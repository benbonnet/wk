import { Button } from "@ui-components/ui/button";
import * as Icons from "lucide-react";
import { cn } from "@ui/utils";
import { useTranslate } from "@ui/provider";
import type { ButtonProps } from "@ui/registry";

const variantMap = {
  primary: "default",
  secondary: "secondary",
  ghost: "ghost",
  destructive: "destructive",
} as const;

export function BUTTON({
  schema,
  label,
  variant,
  icon,
  onClick,
}: ButtonProps) {
  const t = useTranslate();

  const buttonLabel = label || schema.label!;
  const buttonVariant = variant || schema.variant || "primary";
  const buttonIcon = icon || schema.icon;

  // Get icon component dynamically
  const IconComponent = buttonIcon
    ? (Icons as Record<string, React.ComponentType<{ className?: string }>>)[
        buttonIcon.charAt(0).toUpperCase() + buttonIcon.slice(1)
      ]
    : null;

  return (
    <Button
      data-ui="button"
      type="button"
      variant={variantMap[buttonVariant]}
      onClick={onClick}
      className={schema.className}
    >
      {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
      {t(buttonLabel)}
    </Button>
  );
}
