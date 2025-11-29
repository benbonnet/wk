import React from "react";
import type { Decorator } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/provider";
import { TooltipProvider } from "@ui-components/tooltip";
import type { UIServices } from "@ui/registry";
import { DrawerContext, Form, View } from "@ui/adapters";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: Infinity } },
});

const services: UIServices = {
  fetch: async (url, options) => {
    const response = await fetch(url, options);
    return response.json();
  },
  navigate: (path) => console.log("Navigate to:", path),
  toast: (message) => console.log("Toast:", message),
  confirm: (message) => Promise.resolve(window.confirm(message)),
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
  setDrawerData: () => {},
};

export const withProviders: Decorator = (Story) => (
  <QueryClientProvider client={queryClient}>
    <UIProvider services={services} translations={translations} locale="en">
      <DrawerContext.Provider value={drawerContext}>
        <TooltipProvider>
          <Story />
        </TooltipProvider>
      </DrawerContext.Provider>
    </UIProvider>
  </QueryClientProvider>
);

export const withForm: Decorator = (Story) => (
  <QueryClientProvider client={queryClient}>
    <UIProvider services={services} translations={translations} locale="en">
      <DrawerContext.Provider value={drawerContext}>
        <TooltipProvider>
          <View>
            <Form>
              <Story />
            </Form>
          </View>
        </TooltipProvider>
      </DrawerContext.Provider>
    </UIProvider>
  </QueryClientProvider>
);
