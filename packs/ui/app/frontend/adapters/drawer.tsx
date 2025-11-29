import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@ui/components/sheet";
import { Button } from "@ui/components/button";
import { cn } from "@ui/lib/utils";
import { useTranslate } from "@ui/lib/ui-renderer/provider";
import type { DrawerProps } from "@ui/lib/ui-renderer/registry";

export function Drawer({
  title,
  description,
  open,
  onClose,
  className,
  children,
}: DrawerProps) {
  const t = useTranslate();

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      <SheetContent className={cn("flex flex-col sm:max-w-lg", className)}>
        <SheetHeader>
          {title && <SheetTitle>{t(title)}</SheetTitle>}
          {description && <SheetDescription>{t(description)}</SheetDescription>}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4" data-ui="drawer-content">
          {children}
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">{t("Cancel")}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
