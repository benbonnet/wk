import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { Button } from "@ui/components/ui/button";
import { MoreVertical, ChevronDown } from "lucide-react";
import { useTranslate } from "@ui/lib/provider";
import type { DropdownProps } from "@ui/lib/registry";

export function DROPDOWN({ schema, label, icon, children }: DropdownProps) {
  const t = useTranslate();

  const dropdownLabel = label || schema.label;
  const dropdownIcon = icon || schema.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {dropdownLabel ? (
          <Button
            data-ui="dropdown"
            variant="outline"
            className={schema.className}
          >
            {t(dropdownLabel)}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            data-ui="dropdown"
            variant="ghost"
            size="icon"
            className={schema.className}
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}
