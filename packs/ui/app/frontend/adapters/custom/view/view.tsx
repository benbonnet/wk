import { useState, createContext, useContext, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@ui/components/sheet";
import { cn } from "@ui/lib/utils";
import { useServices, useLocale, UIProvider } from "@ui/lib/ui-renderer/provider";
import type { ViewProps } from "@ui/lib/ui-renderer/registry";
import type { UISchema } from "@ui/lib/ui-renderer/types";
import { DynamicRenderer } from "@ui/lib/ui-renderer/renderer";

interface DrawerContextValue {
  openDrawer: (name: string, data?: Record<string, unknown>) => void;
  closeDrawer: () => void;
  drawerData: Record<string, unknown> | null;
  setDrawerData: (data: Record<string, unknown> | null) => void;
}

interface ExecuteApiParams {
  action: string;
  url_parameters?: Record<string, unknown>;
  body?: Record<string, unknown>;
  notification?: {
    success?: string;
    error?: string;
  };
}

interface ViewContextValue {
  url: string;
  api: Record<string, { method: string; path: string }>;
  executeApi: (
    params: ExecuteApiParams,
  ) => Promise<{ success: boolean; data?: unknown; error?: unknown }>;
}

export const DrawerContext = createContext<DrawerContextValue | null>(null);
export const ViewContext = createContext<ViewContextValue | null>(null);

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("useDrawer must be used within View");
  return ctx;
}

/** Safe version that returns null when outside View context */
export function useDrawerData(): Record<string, unknown> | null {
  const ctx = useContext(DrawerContext);
  return ctx?.drawerData ?? null;
}

export function useViewConfig() {
  const ctx = useContext(ViewContext);
  if (!ctx) throw new Error("useViewConfig must be used within View");
  return ctx;
}

export function View({
  url = "",
  api = {},
  drawers = {},
  translations = {},
  className,
  children,
}: ViewProps) {
  const services = useServices();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [drawerData, setDrawerData] = useState<Record<string, unknown> | null>(
    null,
  );

  // Build translations map - supports both old and new format
  // Old format from schema.translations: { en: { key: "value" }, fr: { key: "valeur" } }
  // New format from backend: { global: { en: {...} }, views: { en: {...} } }
  const translationsMap = useMemo(() => {
    // Check if new format (has global or views at top level)
    if (translations.global || translations.views) {
      return translations as { global: Record<string, Record<string, string>>; views: Record<string, Record<string, string>> };
    }
    // Old format - wrap in new structure
    return {
      global: {},
      views: translations as Record<string, Record<string, string>>,
    };
  }, [translations]);

  // Local translate function for this view
  const t = useCallback(
    (key: string): string => {
      const viewValue = translationsMap.views?.[locale]?.[key];
      if (viewValue) return viewValue;
      const globalValue = translationsMap.global?.[locale]?.[key];
      if (globalValue) return globalValue;
      return key;
    },
    [translationsMap, locale],
  );

  const drawerConfig = drawers[activeDrawer || ""];

  const handleOpenDrawer = (name: string, data?: Record<string, unknown>) => {
    setActiveDrawer(name);
    setDrawerData(data || null);
  };

  const handleCloseDrawer = () => {
    setActiveDrawer(null);
    setDrawerData(null);
  };

  const executeApi = useCallback(
    async ({
      action,
      url_parameters,
      body,
      notification,
    }: ExecuteApiParams): Promise<{
      success: boolean;
      data?: unknown;
      error?: unknown;
    }> => {
      let resolvedAction = action;
      if (action === "save") {
        resolvedAction = url_parameters?.id ? "update" : "create";
      }

      const endpoint = api[resolvedAction];
      if (!endpoint) {
        return { success: false, error: `No endpoint for ${resolvedAction}` };
      }

      let path = endpoint.path;
      if (url_parameters) {
        path = path.replace(
          /:(\w+)/g,
          (_, key) => String(url_parameters[key] ?? ""),
        );
      }

      const fullUrl = `${url}${path ? `/${path}` : ""}`;

      try {
        const result = await services.fetch(fullUrl, {
          method: endpoint.method,
          data: body,
        });

        if (result?.data) {
          setDrawerData(result.data as Record<string, unknown>);
        }

        await queryClient.invalidateQueries({ queryKey: ["table", url] });

        if (notification?.success) {
          services.toast({ type: "success", message: t(notification.success) });
        }

        return { success: true, data: result };
      } catch (error) {
        if (notification?.error) {
          services.toast({ type: "error", message: t(notification.error) });
        }
        return { success: false, error };
      }
    },
    [api, url, services, queryClient, t],
  );

  const viewConfig: ViewContextValue = {
    url,
    api,
    executeApi,
  };

  return (
    <UIProvider services={services} translations={translationsMap} locale={locale}>
      <ViewContext.Provider value={viewConfig}>
        <DrawerContext.Provider
          value={{
            openDrawer: handleOpenDrawer,
            closeDrawer: handleCloseDrawer,
            drawerData,
            setDrawerData,
          }}
        >
          <div data-ui="view" className={cn("min-h-screen", className)}>
            {children}

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
                          <DynamicRenderer key={index} schema={element} />
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
    </UIProvider>
  );
}
