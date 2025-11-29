import { cn } from "@ui/lib/utils";
import type { BaseComponentProps } from "@ui/lib/registry";

export function ACTIONS({ schema, children }: BaseComponentProps) {
  return (
    <div
      data-ui="actions"
      className={cn("flex items-center gap-2", schema.className)}
    >
      {children}
    </div>
  );
}
