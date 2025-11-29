import { cn } from "@ui/lib/utils";
import type { ActionsProps } from "@ui/lib/ui-renderer/registry";

export function Actions({ className, children }: ActionsProps) {
  return (
    <div data-ui="actions" className={cn("flex items-center gap-2", className)}>
      {children}
    </div>
  );
}
