import { DropdownMenuItem } from "@ui-components/ui/dropdown-menu";
import * as Icons from "lucide-react";
import { cn } from "@ui/utils";
import { useTranslate, useServices } from "@ui/provider";
import { useDrawer } from "../layouts/view";
import type { OptionProps } from "@ui/registry";

export function OPTION({
  schema,
  data,
  label,
  href,
  opens,
  api,
  icon,
  confirm: confirmMessage,
  variant,
}: OptionProps) {
  const t = useTranslate();
  const services = useServices();
  const { openDrawer } = useDrawer();

  const optionLabel = label || schema.label!;
  const optionHref = href || schema.href;
  const optionOpens = opens || schema.opens;
  const optionApi = api || schema.api;
  const optionIcon = icon || schema.icon;
  const optionConfirm = confirmMessage || schema.confirm;
  const optionVariant = variant || schema.variant;

  // Get icon component dynamically
  const IconComponent = optionIcon
    ? (Icons as Record<string, React.ComponentType<{ className?: string }>>)[
        optionIcon.charAt(0).toUpperCase() + optionIcon.slice(1)
      ]
    : null;

  const handleClick = async () => {
    if (optionConfirm) {
      const confirmed = await services.confirm(t(optionConfirm));
      if (!confirmed) return;
    }

    if (optionOpens) {
      openDrawer(optionOpens, data);
    } else if (optionHref) {
      const resolvedHref = optionHref.replace(
        /:(\w+)/g,
        (_, key) => String((data as Record<string, unknown>)?.[key] ?? "")
      );
      services.navigate(resolvedHref);
    } else if (optionApi) {
      try {
        let method = "GET";
        let path = "";

        if (typeof optionApi === "string") {
          const parts = optionApi.split(" ");
          if (parts.length > 1) {
            method = parts[0];
            path = parts.slice(1).join(" ");
          } else {
            path = optionApi;
          }
        }

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
    <DropdownMenuItem
      data-ui="option"
      onClick={handleClick}
      className={cn(
        optionVariant === "destructive" && "text-destructive focus:text-destructive",
        schema.className
      )}
    >
      {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
      {t(optionLabel)}
    </DropdownMenuItem>
  );
}
