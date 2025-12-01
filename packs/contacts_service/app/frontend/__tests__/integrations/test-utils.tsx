import { ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/lib/ui-renderer/provider";
import { TooltipProvider } from "@ui/components/tooltip";
import type { UIServices } from "@ui/lib/ui-renderer/registry";
import { DrawerContext } from "@ui/adapters";
import viewSchema from "../mocks/views/contacts_index.json";
import mockData from "../mocks/data.json";
import type { UISchema } from "@ui/lib/ui-renderer/types";

// Mock services
export const mockServices: UIServices = {
  fetch: vi.fn().mockResolvedValue(new Response()),
  navigate: vi.fn(),
  toast: vi.fn(),
  confirm: vi.fn().mockResolvedValue(true),
};

// View schema exports
export const schema = viewSchema as unknown as UISchema;
export const pageSchema = schema.elements?.[0] as UISchema;
const groupSchema = pageSchema?.elements?.find(
  (el) => el.type === "GROUP",
) as UISchema;
export const tableSchema = groupSchema?.elements?.find(
  (el) => el.type === "TABLE",
) as UISchema;

// Data exports
export const data = (mockData as { items: unknown[] }).items;

// Helper functions
export const getApiRegistry = () =>
  schema.api as Record<string, { method: string; path: string }>;
export const getDrawersRegistry = () => schema.drawers || {};
export const getBasePath = () => schema.url as string;
export const getTranslations = () => schema.translations || {};

// Mock drawer context
const mockDrawerContext = {
  openDrawer: vi.fn(),
  closeDrawer: vi.fn(),
  drawerData: null,
  setDrawerData: vi.fn(),
};

interface WrapperProps {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

export function createWrapper(locale = "en") {
  const translations = getTranslations();

  return function Wrapper({ children }: WrapperProps) {
    return (
      <QueryClientProvider client={queryClient}>
        <UIProvider
          services={mockServices}
          translations={translations}
          locale={locale}
        >
          <DrawerContext.Provider value={mockDrawerContext}>
            <TooltipProvider>{children}</TooltipProvider>
          </DrawerContext.Provider>
        </UIProvider>
      </QueryClientProvider>
    );
  };
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & { locale?: string },
) {
  const { locale = "en", ...renderOptions } = options || {};
  return render(ui, { wrapper: createWrapper(locale), ...renderOptions });
}

export function resetMocks() {
  vi.clearAllMocks();
}
