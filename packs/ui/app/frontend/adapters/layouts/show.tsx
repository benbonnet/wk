import { createContext, useContext } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@ui-components/ui/card";
import { cn } from "@ui/utils";
import { useTranslate } from "@ui/provider";
import type { ShowProps } from "@ui/registry";

interface ShowContextValue {
  data: Record<string, unknown>;
}

export const ShowContext = createContext<ShowContextValue | null>(null);

export function useShowData(): Record<string, unknown> {
  const ctx = useContext(ShowContext);
  if (!ctx) {
    // Return empty object as fallback when not in ShowContext
    return {};
  }
  return ctx.data;
}

export function SHOW({ schema, record = {}, children }: ShowProps) {
  const t = useTranslate();

  const showTitle = schema.title;

  return (
    <ShowContext.Provider value={{ data: record }}>
      {showTitle ? (
        <Card data-ui="show" className={schema.className}>
          <CardHeader>
            <CardTitle>{t(showTitle)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">{children}</CardContent>
        </Card>
      ) : (
        <div data-ui="show" className={cn("space-y-6", schema.className)}>
          {children}
        </div>
      )}
    </ShowContext.Provider>
  );
}
