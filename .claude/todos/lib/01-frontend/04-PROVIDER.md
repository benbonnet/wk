# Phase 4: UI Provider

## Goal
Create context provider for dependency injection.

## Files to Create

### 1. packs/ui/app/frontend/lib/provider.tsx

```tsx
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
import type { Translations } from "./types";

// ============================================
// CONTEXT
// ============================================

const UIContext = createContext<UIContextValue | null>(null);

// ============================================
// HOOK
// ============================================

export function useUI(): UIContextValue {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within UIProvider");
  }
  return context;
}

// ============================================
// PROVIDER PROPS
// ============================================

export interface UIProviderProps {
  children: ReactNode;
  components: ComponentRegistry;
  inputs: InputRegistry;
  displays: DisplayRegistry;
  services: UIServices;
  translations?: Translations;
  locale?: string;
}

// ============================================
// PROVIDER
// ============================================

export function UIProvider({
  children,
  components,
  inputs,
  displays,
  services,
  translations = {},
  locale = "en",
}: UIProviderProps) {
  // Translation function
  const t = useMemo(() => {
    const localeTranslations = translations[locale];

    return (namespace: string, key: string): string => {
      if (!localeTranslations) return key;

      // Try views namespace first
      const viewValue = localeTranslations.views?.[namespace]?.[key];
      if (viewValue) return viewValue;

      // Try schemas namespace
      const schemaValue = localeTranslations.schemas?.[namespace]?.[key];
      if (schemaValue) return schemaValue;

      // Fallback to common
      const commonValue = localeTranslations.common?.[key];
      if (commonValue) return commonValue;

      // Return key as fallback
      return key;
    };
  }, [translations, locale]);

  const value = useMemo<UIContextValue>(
    () => ({
      components,
      inputs,
      displays,
      services,
      t,
    }),
    [components, inputs, displays, services, t]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

// ============================================
// CONVENIENCE HOOKS
// ============================================

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

export function useTranslate(): (namespace: string, key: string) => string {
  return useUI().t;
}
```

### 2. packs/ui/app/frontend/lib/index.ts

```ts
// Types
export * from "./types";
export * from "./registry";

// Provider
export { UIProvider, useUI, useComponents, useInputs, useDisplays, useServices, useTranslate } from "./provider";
export type { UIProviderProps } from "./provider";

// Renderer (Phase 5)
export { DynamicRenderer } from "./renderer";
```

## Verification
```bash
npx tsc --noEmit
```
