import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@ui/components/ui/sheet";
import { Button } from "@ui/components/ui/button";
import { cn } from "@ui/lib/utils";
import { useTranslate } from "@ui/lib/provider";
import type { DrawerProps } from "@ui/lib/registry";

export function DRAWER({
  schema,
  title,
  description,
  open,
  onClose,
  children,
}: DrawerProps) {
  const t = useTranslate();

  const drawerTitle = title || schema.title;
  const drawerDescription = description || schema.description;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      <SheetContent
        className={cn("flex flex-col sm:max-w-lg", schema.className)}
      >
        <SheetHeader>
          {drawerTitle && <SheetTitle>{t(drawerTitle)}</SheetTitle>}
          {drawerDescription && (
            <SheetDescription>{t(drawerDescription)}</SheetDescription>
          )}
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
