import { ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/lib/ui-renderer/provider";
import { TooltipProvider } from "@ui/components/tooltip";
import type { UIServices } from "@ui/lib/ui-renderer/registry";
import { DrawerContext } from "../custom/view";

// Create mock services
export const mockServices: UIServices = {
  fetch: vi.fn().mockResolvedValue(new Response()),
  navigate: vi.fn(),
  toast: vi.fn(),
  confirm: vi.fn().mockResolvedValue(true),
};

export const mockTranslations = {
  schemas: {},
  views: {},
  common: {},
};

interface WrapperProps {
  children: ReactNode;
}

// Mock drawer context value
const mockDrawerContext = {
  openDrawer: vi.fn(),
  closeDrawer: vi.fn(),
  drawerData: null,
  setDrawerData: vi.fn(),
};

export function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return function Wrapper({ children }: WrapperProps) {
    return (
      <QueryClientProvider client={queryClient}>
        <UIProvider
          services={mockServices}
          translations={mockTranslations}
          locale="en"
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
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, { wrapper: createWrapper(), ...options });
}

// Reset mocks before each test
export function resetMocks() {
  vi.clearAllMocks();
}
