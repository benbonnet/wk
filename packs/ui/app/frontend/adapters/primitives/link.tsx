import { Button } from "@ui-components/ui/button";
import * as Icons from "lucide-react";
import { useTranslate, useServices } from "@ui/provider";
import { useDrawer } from "../layouts/view";
import type { LinkProps } from "@ui/registry";

const variantMap = {
  primary: "default",
  secondary: "secondary",
  ghost: "ghost",
  destructive: "destructive",
} as const;

export function LINK({
  schema,
  data,
  label,
  href,
  opens,
  api,
  variant,
  icon,
  confirm: confirmMessage,
}: LinkProps) {
  const t = useTranslate();
  const services = useServices();
  const { openDrawer } = useDrawer();

  const linkLabel = label || schema.label!;
  const linkHref = href || schema.href;
  const linkOpens = opens || schema.opens;
  const linkApi = api || schema.api;
  const linkVariant = variant || schema.variant || "primary";
  const linkIcon = icon || schema.icon;
  const linkConfirm = confirmMessage || schema.confirm;

  // Get icon component dynamically
  const IconComponent = linkIcon
    ? (Icons as Record<string, React.ComponentType<{ className?: string }>>)[
        linkIcon.charAt(0).toUpperCase() + linkIcon.slice(1)
      ]
    : null;

  const handleClick = async () => {
    if (linkConfirm) {
      const confirmed = await services.confirm(t(linkConfirm));
      if (!confirmed) return;
    }

    if (linkOpens) {
      openDrawer(linkOpens, data);
    } else if (linkHref) {
      // Replace path parameters with data values
      const resolvedHref = linkHref.replace(
        /:(\w+)/g,
        (_, key) => String((data as Record<string, unknown>)?.[key] ?? "")
      );
      services.navigate(resolvedHref);
    } else if (linkApi) {
      try {
        let method = "GET";
        let path = "";

        if (typeof linkApi === "string") {
          const parts = linkApi.split(" ");
          if (parts.length > 1) {
            method = parts[0];
            path = parts.slice(1).join(" ");
          } else {
            path = linkApi;
          }
        } else if (typeof linkApi === "object") {
          // Get default action
          const defaultAction = linkApi.default || Object.values(linkApi)[0];
          method = defaultAction?.method || "GET";
          path = defaultAction?.path || "";
        }

        // Replace path parameters
        path = path.replace(
          /:(\w+)/g,
          (_, key) => String((data as Record<string, unknown>)?.[key] ?? "")
        );

        await services.fetch(path, { method });

        if (schema.notification?.success) {
          services.toast(t(schema.notification.success), "success");
        }
      } catch {
        if (schema.notification?.error) {
          services.toast(t(schema.notification.error), "error");
        }
      }
    }
  };

  return (
    <Button
      data-ui="link"
      type="button"
      variant={variantMap[linkVariant]}
      onClick={handleClick}
      className={schema.className}
    >
      {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
      {t(linkLabel)}
    </Button>
  );
}
