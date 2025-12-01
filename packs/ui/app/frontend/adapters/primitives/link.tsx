import { useContext } from "react";
import { Button } from "@ui/components/button";
import * as Icons from "lucide-react";
import { useTranslate, useServices } from "@ui/lib/ui-renderer/provider";
import { DrawerContext } from "../custom/view";
import type { LinkProps } from "@ui/lib/ui-renderer/registry";

const variantMap = {
  primary: "default",
  secondary: "secondary",
  ghost: "ghost",
  destructive: "destructive",
} as const;

export function Link({
  label,
  href,
  opens,
  api,
  variant = "primary",
  icon,
  confirm: confirmMessage,
  notification,
  className,
  data,
}: LinkProps) {
  const t = useTranslate();
  const services = useServices();
  // Safe access - returns null if outside View context
  const drawerContext = useContext(DrawerContext);
  const openDrawer = drawerContext?.openDrawer;

  const IconComponent = icon
    ? (Icons as Record<string, React.ComponentType<{ className?: string }>>)[
        icon.charAt(0).toUpperCase() + icon.slice(1)
      ]
    : null;

  const handleClick = async () => {
    if (confirmMessage) {
      const confirmed = await services.confirm({
        title: t(confirmMessage.title || "confirm_title"),
        description: t(confirmMessage.description),
        variant: confirmMessage.variant,
        cancelLabel: t(confirmMessage.cancel_label || "confirm_cancel"),
        confirmLabel: t(confirmMessage.confirm_label || "confirm_ok"),
      });
      if (!confirmed) return;
    }

    if (opens && openDrawer) {
      openDrawer(opens, data);
    } else if (href) {
      const resolvedHref = href.replace(/:(\w+)/g, (_, key) =>
        String((data as Record<string, unknown>)?.[key] ?? ""),
      );
      services.navigate(resolvedHref);
    } else if (api) {
      try {
        let method = "GET";
        let path = "";

        if (typeof api === "string") {
          const parts = api.split(" ");
          if (parts.length > 1) {
            method = parts[0];
            path = parts.slice(1).join(" ");
          } else {
            path = api;
          }
        }

        path = path.replace(/:(\w+)/g, (_, key) =>
          String((data as Record<string, unknown>)?.[key] ?? ""),
        );

        await services.fetch(path, { method });

        if (notification?.success) {
          services.toast(t(notification.success), "success");
        }
      } catch {
        if (notification?.error) {
          services.toast(t(notification.error), "error");
        }
      }
    }
  };

  const testId = opens ? `link-opens-${opens}` : undefined;

  return (
    <Button
      data-ui="link"
      data-testid={testId}
      type="button"
      variant={variantMap[variant]}
      onClick={handleClick}
      className={className}
    >
      {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
      {t(label)}
    </Button>
  );
}
