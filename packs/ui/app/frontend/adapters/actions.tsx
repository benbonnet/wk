import { cn } from "@ui/utils";
import type { ActionsProps } from "@ui/registry";

export function Actions({ className, children }: ActionsProps) {
  return (
    <div data-ui="actions" className={cn("flex items-center gap-2", className)}>
      {children}
    </div>
  );
}
