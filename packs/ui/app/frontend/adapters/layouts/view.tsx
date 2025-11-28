import { useState, createContext, useContext } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@ui-components/ui/sheet";
import { cn } from "@ui/utils";
import type { BaseComponentProps } from "@ui/registry";
import type { UISchema } from "@ui/types";
import { DynamicRenderer } from "@ui/renderer";

interface DrawerContextValue {
  openDrawer: (name: string, data?: Record<string, unknown>) => void;
  closeDrawer: () => void;
  drawerData: Record<string, unknown> | null;
}

export const DrawerContext = createContext<DrawerContextValue | null>(null);

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("useDrawer must be used within ViewAdapter");
  return ctx;
}

export function VIEW({ schema, children }: BaseComponentProps) {
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [drawerData, setDrawerData] = useState<Record<string, unknown> | null>(null);

  const drawerConfig = schema.drawers?.[activeDrawer || ""];

  const handleOpenDrawer = (name: string, data?: Record<string, unknown>) => {
    setActiveDrawer(name);
    setDrawerData(data || null);
  };

  const handleCloseDrawer = () => {
    setActiveDrawer(null);
    setDrawerData(null);
  };

  return (
    <DrawerContext.Provider
      value={{
        openDrawer: handleOpenDrawer,
        closeDrawer: handleCloseDrawer,
        drawerData,
      }}
    >
      <div data-ui="view" className={cn("min-h-screen", schema.className)}>
        {children}

        {/* Render drawers defined in schema */}
        <Sheet open={!!activeDrawer} onOpenChange={(open) => !open && handleCloseDrawer()}>
          <SheetContent className="flex flex-col overflow-y-auto sm:max-w-lg">
            {drawerConfig && (
              <>
                <SheetHeader>
                  {drawerConfig.title && (
                    <SheetTitle>{drawerConfig.title}</SheetTitle>
                  )}
                  {drawerConfig.description && (
                    <SheetDescription>{drawerConfig.description}</SheetDescription>
                  )}
                </SheetHeader>
                <div className="flex-1 py-4">
                  {drawerConfig.elements?.map((element: UISchema, index: number) => (
                    <DynamicRenderer key={index} schema={element} data={drawerData || undefined} />
                  ))}
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </DrawerContext.Provider>
  );
}
