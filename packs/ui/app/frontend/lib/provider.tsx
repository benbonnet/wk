import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { UIServices, UIContextValue } from "./registry";
import type { TranslationsMap } from "./types";

const UIContext = createContext<UIContextValue | null>(null);

interface UIProviderProps {
  children: ReactNode;
  services: UIServices;
  translations?: TranslationsMap;
  locale?: string;
}

export function UIProvider({
  children,
  services,
  translations,
  locale = "en",
}: UIProviderProps) {
  const t = useMemo(() => {
    return (key: string, namespace?: string): string => {
      if (!translations) return key;

      if (translations.views?.[key]) {
        return translations.views[key];
      }

      if (translations.common?.[key]) {
        return translations.common[key];
      }

      if (namespace && translations.schemas?.[namespace]?.[key]) {
        return translations.schemas[namespace][key];
      }

      return key;
    };
  }, [translations]);

  const value = useMemo<UIContextValue>(
    () => ({
      services,
      translations,
      locale,
      t,
    }),
    [services, translations, locale, t],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIContextValue {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}

export function useServices(): UIServices {
  return useUI().services;
}

export function useTranslate(): (key: string, namespace?: string) => string {
  return useUI().t;
}

export function useLocale(): string {
  return useUI().locale;
}
