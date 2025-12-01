import { createContext, useContext } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@ui/components/card";
import { cn } from "@ui/lib/utils";
import { useTranslate } from "@ui/lib/ui-renderer/provider";
import type { ShowProps } from "@ui/lib/ui-renderer/registry";
import { useDrawerData } from "@ui/adapters/custom/view";

interface ShowContextValue {
  data: Record<string, unknown>;
}

export const ShowContext = createContext<ShowContextValue | null>(null);

export function useShowData(): Record<string, unknown> {
  const ctx = useContext(ShowContext);
  if (!ctx) {
    return {};
  }
  return ctx.data;
}

interface ExtendedShowProps extends ShowProps {
  title?: string;
  data?: Record<string, unknown>;
}

export function Show({
  title,
  record,
  data,
  className,
  children,
}: ExtendedShowProps) {
  const t = useTranslate();
  const drawerData = useDrawerData();

  // drawerData is { id, data: {...} } structure from table row
  // Extract the nested data, or use the whole object if no nested data
  const contextData = drawerData?.data ?? drawerData;

  // Priority: drawerData (from context) > data prop > record prop
  const showData = contextData ?? data ?? record ?? {};

  return (
    <ShowContext.Provider value={{ data: showData }}>
      {title ? (
        <Card data-ui="show" className={className}>
          <CardHeader>
            <CardTitle>{t(title)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">{children}</CardContent>
        </Card>
      ) : (
        <div data-ui="show" className={cn("space-y-6", className)}>
          {children}
        </div>
      )}
    </ShowContext.Provider>
  );
}
