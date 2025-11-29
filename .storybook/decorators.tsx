import React from "react";
import type { Decorator } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/lib/provider";
import { TooltipProvider } from "@ui/components/ui/tooltip";
import type {
  ComponentRegistry,
  InputRegistry,
  DisplayRegistry,
  UIServices,
} from "@ui/lib/registry";
import * as LayoutAdapters from "@ui/adapters/layouts";
import * as PrimitiveAdapters from "@ui/adapters/primitives";
import * as InputAdapters from "@ui/adapters/inputs";
import * as DisplayAdapters from "@ui/adapters/displays";
import { DrawerContext } from "@ui/adapters/layouts/view";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: Infinity } },
});

const services: UIServices = {
  fetch: async (url, options) => {
    const response = await fetch(url, options);
    return response.json();
  },
  navigate: (path) => console.log("Navigate to:", path),
  toast: (message, type) => console.log(`Toast [${type}]:`, message),
  confirm: (message) => Promise.resolve(window.confirm(message)),
};

const components: ComponentRegistry = {
  VIEW: LayoutAdapters.VIEW,
  PAGE: LayoutAdapters.PAGE,
  DRAWER: LayoutAdapters.DRAWER,
  FORM: LayoutAdapters.FORM,
  TABLE: LayoutAdapters.TABLE,
  SHOW: LayoutAdapters.SHOW,
  ACTIONS: LayoutAdapters.ACTIONS,
  GROUP: LayoutAdapters.GROUP,
  CARD_GROUP: LayoutAdapters.CARD_GROUP,
  MULTISTEP: LayoutAdapters.MULTISTEP,
  STEP: LayoutAdapters.STEP,
  FORM_ARRAY: LayoutAdapters.FORM_ARRAY,
  DISPLAY_ARRAY: LayoutAdapters.DISPLAY_ARRAY,
  ALERT: LayoutAdapters.ALERT,
  BUTTON: PrimitiveAdapters.BUTTON,
  LINK: PrimitiveAdapters.LINK,
  DROPDOWN: PrimitiveAdapters.DROPDOWN,
  OPTION: PrimitiveAdapters.OPTION,
  SEARCH: PrimitiveAdapters.SEARCH,
  SUBMIT: PrimitiveAdapters.SUBMIT,
  COMPONENT: PrimitiveAdapters.COMPONENT,
  RELATIONSHIP_PICKER: PrimitiveAdapters.RELATIONSHIP_PICKER,
};

const inputs: InputRegistry = {
  INPUT_TEXT: InputAdapters.INPUT_TEXT,
  INPUT_TEXTAREA: InputAdapters.INPUT_TEXTAREA,
  INPUT_SELECT: InputAdapters.INPUT_SELECT,
  INPUT_CHECKBOX: InputAdapters.INPUT_CHECKBOX,
  INPUT_CHECKBOXES: InputAdapters.INPUT_CHECKBOXES,
  INPUT_RADIOS: InputAdapters.INPUT_RADIOS,
  INPUT_DATE: InputAdapters.INPUT_DATE,
  INPUT_DATETIME: InputAdapters.INPUT_DATETIME,
  INPUT_TAGS: InputAdapters.INPUT_TAGS,
  INPUT_AI_RICH_TEXT: InputAdapters.INPUT_AI_RICH_TEXT,
};

const displays: DisplayRegistry = {
  DISPLAY_TEXT: DisplayAdapters.DISPLAY_TEXT,
  DISPLAY_LONGTEXT: DisplayAdapters.DISPLAY_LONGTEXT,
  DISPLAY_NUMBER: DisplayAdapters.DISPLAY_NUMBER,
  DISPLAY_DATE: DisplayAdapters.DISPLAY_DATE,
  DISPLAY_DATETIME: DisplayAdapters.DISPLAY_DATETIME,
  DISPLAY_BADGE: DisplayAdapters.DISPLAY_BADGE,
  DISPLAY_TAGS: DisplayAdapters.DISPLAY_TAGS,
  DISPLAY_BOOLEAN: DisplayAdapters.DISPLAY_BOOLEAN,
  DISPLAY_SELECT: DisplayAdapters.DISPLAY_SELECT,
};

const translations = {
  schemas: {},
  views: {},
  common: {},
};

const drawerContext = {
  openDrawer: (name: string, data?: Record<string, unknown>) =>
    console.log("Open drawer:", name, data),
  closeDrawer: () => console.log("Close drawer"),
  drawerData: null,
};

export const withProviders: Decorator = (Story) => (
  <QueryClientProvider client={queryClient}>
    <UIProvider
      components={components}
      inputs={inputs}
      displays={displays}
      services={services}
      translations={translations}
      locale="en"
    >
      <DrawerContext.Provider value={drawerContext}>
        <TooltipProvider>
          <Story />
        </TooltipProvider>
      </DrawerContext.Provider>
    </UIProvider>
  </QueryClientProvider>
);
