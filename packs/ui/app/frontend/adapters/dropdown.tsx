import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Button } from "@ui/components/button";
import { MoreVertical, ChevronDown } from "lucide-react";
import { useTranslate } from "@ui/lib/ui-renderer/provider";
import type { DropdownProps } from "@ui/lib/ui-renderer/registry";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Dropdown({ label, icon, children, className }: DropdownProps) {
  const t = useTranslate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {label ? (
          <Button data-ui="dropdown" variant="outline" className={className}>
            {t(label)}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            data-ui="dropdown"
            variant="ghost"
            size="icon"
            className={className}
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
