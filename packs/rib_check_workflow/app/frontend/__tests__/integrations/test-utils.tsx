import { ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/lib/ui-renderer/provider";
import { TooltipProvider } from "@ui/components/tooltip";
import type { UIServices } from "@ui/lib/ui-renderer/registry";
import indexSchema from "../mocks/views/rib_check_requests_index.json";
import type { UISchema } from "@ui/lib/ui-renderer/types";

export const mockServices: UIServices = {
  fetch: vi.fn().mockResolvedValue({ data: [] }),
  navigate: vi.fn(),
  toast: vi.fn(),
  confirm: vi.fn().mockResolvedValue(true),
};

export const schema = indexSchema as unknown as UISchema;
export const getTranslations = () => schema.translations || {};

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

interface WrapperProps {
  children: ReactNode;
}

export function createWrapper(locale = "en", queryClient?: QueryClient) {
  const translations = getTranslations()[locale] || {};
  const qc = queryClient || createQueryClient();

  return function Wrapper({ children }: WrapperProps) {
    return (
      <QueryClientProvider client={qc}>
        <UIProvider
          services={mockServices}
          translations={{
            views: translations,
            schemas: {},
            common: {},
          }}
          locale={locale}
        >
          <TooltipProvider>{children}</TooltipProvider>
        </UIProvider>
      </QueryClientProvider>
    );
  };
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & {
    locale?: string;
    queryClient?: QueryClient;
  },
) {
  const { locale = "en", queryClient, ...renderOptions } = options || {};
  return render(ui, {
    wrapper: createWrapper(locale, queryClient),
    ...renderOptions,
  });
}

export function resetMocks() {
  vi.clearAllMocks();
}
