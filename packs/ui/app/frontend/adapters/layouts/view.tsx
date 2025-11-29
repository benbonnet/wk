import { useState, createContext, useContext, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@ui/components/ui/sheet";
import { cn } from "@ui/lib/utils";
import { useTranslate, useServices } from "@ui/lib/provider";
import type { BaseComponentProps } from "@ui/lib/registry";
import type { UISchema } from "@ui/lib/types";
import { DynamicRenderer } from "@ui/lib/renderer";

interface DrawerContextValue {
  openDrawer: (name: string, data?: Record<string, unknown>) => void;
  closeDrawer: () => void;
  drawerData: Record<string, unknown> | null;
  setDrawerData: (data: Record<string, unknown> | null) => void;
}

interface ExecuteApiOptions {
  data?: Record<string, unknown>;
}

interface ExecuteApiNotification {
  success?: string;
  error?: string;
}

interface ViewContextValue {
  url: string;
  api: Record<string, { method: string; path: string }>;
  executeApi: (
    action: string,
    item: Record<string, unknown> | null,
    options?: ExecuteApiOptions,
    notification?: ExecuteApiNotification,
  ) => Promise<{ success: boolean; data?: unknown; error?: unknown }>;
}

export const DrawerContext = createContext<DrawerContextValue | null>(null);
export const ViewContext = createContext<ViewContextValue | null>(null);

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("useDrawer must be used within ViewAdapter");
  return ctx;
}

export function useViewConfig() {
  const ctx = useContext(ViewContext);
  if (!ctx) throw new Error("useViewConfig must be used within VIEW");
  return ctx;
}

export function VIEW({ schema, children }: BaseComponentProps) {
  const t = useTranslate();
  const services = useServices();
  const queryClient = useQueryClient();
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [drawerData, setDrawerData] = useState<Record<string, unknown> | null>(
    null,
  );

  const drawerConfig = schema.drawers?.[activeDrawer || ""];
  const baseUrl = schema.url || "";
  const apiRegistry = (schema.api as Record<string, { method: string; path: string }>) || {};

  const handleOpenDrawer = (name: string, data?: Record<string, unknown>) => {
    setActiveDrawer(name);
    setDrawerData(data || null);
  };

  const handleCloseDrawer = () => {
    setActiveDrawer(null);
    setDrawerData(null);
  };

  const executeApi = useCallback(
    async (
      action: string,
      item: Record<string, unknown> | null,
      options?: ExecuteApiOptions,
      notification?: ExecuteApiNotification,
    ): Promise<{ success: boolean; data?: unknown; error?: unknown }> => {
      // Resolve action name: "save" -> "create" (no id) or "update" (has id)
      let resolvedAction = action;
      if (action === "save") {
        resolvedAction = item?.id ? "update" : "create";
      }

      const endpoint = apiRegistry[resolvedAction];
      if (!endpoint) {
        console.error(`No API endpoint found for action: ${resolvedAction}`);
        return { success: false, error: `No endpoint for ${resolvedAction}` };
      }

      // Interpolate path with item data
      let path = endpoint.path;
      if (item) {
        path = path.replace(/:(\w+)/g, (_, key) => String(item[key] ?? ""));
      }

      const url = `${baseUrl}${path ? `/${path}` : ""}`;

      try {
        const result = await services.fetch(url, {
          method: endpoint.method,
          body: options?.data,
        });

        // Update drawerData with response so next save is PATCH not POST
        if (result?.data) {
          setDrawerData(result.data as Record<string, unknown>);
        }

        // Invalidate table queries
        await queryClient.invalidateQueries({ queryKey: ["table", baseUrl] });

        // Show success toast
        if (notification?.success) {
          services.toast({ type: "success", message: t(notification.success) });
        }

        return { success: true, data: result };
      } catch (error) {
        // Show error toast
        if (notification?.error) {
          services.toast({ type: "error", message: t(notification.error) });
        }
        return { success: false, error };
      }
    },
    [apiRegistry, baseUrl, services, queryClient, t],
  );

  const viewConfig: ViewContextValue = {
    url: baseUrl,
    api: apiRegistry,
    executeApi,
  };

  return (
    <ViewContext.Provider value={viewConfig}>
      <DrawerContext.Provider
        value={{
          openDrawer: handleOpenDrawer,
          closeDrawer: handleCloseDrawer,
          drawerData,
          setDrawerData,
        }}
      >
      <div data-ui="view" className={cn("min-h-screen", schema.className)}>
        {children}

        {/* Render drawers defined in schema */}
        <Sheet
          open={!!activeDrawer}
          onOpenChange={(open) => !open && handleCloseDrawer()}
        >
          <SheetContent
            className="flex flex-col overflow-y-auto sm:max-w-lg"
            data-testid={activeDrawer ? `drawer-${activeDrawer}` : undefined}
          >
            {drawerConfig && (
              <>
                <SheetHeader>
                  {drawerConfig.title && (
                    <SheetTitle>{t(drawerConfig.title)}</SheetTitle>
                  )}
                  {drawerConfig.description ? (
                    <SheetDescription>
                      {t(drawerConfig.description)}
                    </SheetDescription>
                  ) : (
                    <SheetDescription className="sr-only">
                      Drawer content
                    </SheetDescription>
                  )}
                </SheetHeader>
                <div className="flex-1 py-4">
                  {drawerConfig.elements?.map(
                    (element: UISchema, index: number) => (
                      <DynamicRenderer
                        key={index}
                        schema={element}
                        data={drawerData || undefined}
                      />
                    ),
                  )}
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
      </DrawerContext.Provider>
    </ViewContext.Provider>
  );
}
