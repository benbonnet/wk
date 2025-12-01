import { createContext, useContext, useMemo, useCallback, type ReactNode } from "react";
import type { UIServices, UIContextValue } from "./registry";
import type { TranslationsMap } from "./types";

const UIContext = createContext<UIContextValue | null>(null);

export const DEFAULT_LOCALE = "fr";

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
  locale = DEFAULT_LOCALE,
}: UIProviderProps) {
  const t = useCallback(
    (key: string): string => {
      if (!translations) return key;

      // Try views first (view-specific translations)
      const viewValue = translations.views?.[locale]?.[key];
      if (viewValue) return viewValue;

      // Fall back to global (from config/locales/*.yml)
      const globalValue = translations.global?.[locale]?.[key];
      if (globalValue) return globalValue;

      return key;
    },
    [translations, locale]
  );

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

export function useTranslate(): (key: string) => string {
  return useUI().t;
}

export function useLocale(): string {
  return useUI().locale;
}
