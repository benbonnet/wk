import { Button as ButtonUI } from "@ui/components/button";
import * as Icons from "lucide-react";
import { useTranslate } from "@ui/lib/ui-renderer/provider";
import type { ButtonProps } from "@ui/lib/ui-renderer/registry";

const variantMap = {
  primary: "default",
  secondary: "secondary",
  ghost: "ghost",
  destructive: "destructive",
} as const;

export function Button({
  label,
  variant = "primary",
  icon,
  onClick,
  className,
}: ButtonProps) {
  const t = useTranslate();

  const IconComponent = icon
    ? (Icons as Record<string, React.ComponentType<{ className?: string }>>)[
        icon.charAt(0).toUpperCase() + icon.slice(1)
      ]
    : null;

  return (
    <ButtonUI
      data-ui="button"
      type="button"
      variant={variantMap[variant]}
      onClick={onClick}
      className={className}
    >
      {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
      {t(label)}
    </ButtonUI>
  );
}
