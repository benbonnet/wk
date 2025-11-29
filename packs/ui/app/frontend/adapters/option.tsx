import { DropdownMenuItem } from "@ui-components/dropdown-menu";
import * as Icons from "lucide-react";
import { cn } from "@ui/utils";
import { useTranslate, useServices } from "@ui/provider";
import { useDrawer } from "./custom/view";
import type { OptionProps } from "@ui/registry";

export function Option({
  label,
  href,
  opens,
  api,
  icon,
  confirm: confirmMessage,
  variant,
  className,
  data,
}: OptionProps) {
  const t = useTranslate();
  const services = useServices();
  const { openDrawer } = useDrawer();

  const IconComponent = icon
    ? (Icons as Record<string, React.ComponentType<{ className?: string }>>)[
        icon.charAt(0).toUpperCase() + icon.slice(1)
      ]
    : null;

  const handleClick = async () => {
    if (confirmMessage) {
      const confirmed = await services.confirm(t(confirmMessage));
      if (!confirmed) return;
    }

    if (opens) {
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
      } catch {
        // Error handling done by service
      }
    }
  };

  return (
    <DropdownMenuItem
      data-ui="option"
      onClick={handleClick}
      className={cn(
        variant === "destructive" && "text-destructive focus:text-destructive",
        className,
      )}
    >
      {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
      {t(label)}
    </DropdownMenuItem>
  );
}
