import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type {
  ComponentRegistry,
  InputRegistry,
  DisplayRegistry,
  UIServices,
  UIContextValue,
} from "./registry";
import type { TranslationsMap } from "./types";

const UIContext = createContext<UIContextValue | null>(null);

interface UIProviderProps {
  children: ReactNode;
  components: ComponentRegistry;
  inputs: InputRegistry;
  displays: DisplayRegistry;
  services: UIServices;
  translations?: TranslationsMap;
  locale?: string;
}

export function UIProvider({
  children,
  components,
  inputs,
  displays,
  services,
  translations,
  locale = "en",
}: UIProviderProps) {
  const t = useMemo(() => {
    return (key: string, namespace?: string): string => {
      if (!translations) return key;

      // Try views namespace first
      if (translations.views?.[key]) {
        return translations.views[key];
      }

      // Try common namespace
      if (translations.common?.[key]) {
        return translations.common[key];
      }

      // Try schemas namespace with provided namespace
      if (namespace && translations.schemas?.[namespace]?.[key]) {
        return translations.schemas[namespace][key];
      }

      // Return key as fallback
      return key;
    };
  }, [translations]);

  const value = useMemo<UIContextValue>(
    () => ({
      components,
      inputs,
      displays,
      services,
      translations,
      locale,
      t,
    }),
    [components, inputs, displays, services, translations, locale, t]
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

export function useComponents(): ComponentRegistry {
  return useUI().components;
}

export function useInputs(): InputRegistry {
  return useUI().inputs;
}

export function useDisplays(): DisplayRegistry {
  return useUI().displays;
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
