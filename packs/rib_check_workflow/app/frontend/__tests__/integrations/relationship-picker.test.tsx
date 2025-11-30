import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  beforeAll,
  afterEach,
} from "vitest";
import {
  render,
  screen,
  waitFor,
  within,
  cleanup,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { UIProvider } from "@ui/lib/ui-renderer/provider";
import { TooltipProvider } from "@ui/components/tooltip";
import { DynamicRenderer } from "@ui/lib/ui-renderer/renderer";
import { ViewContext } from "@ui/adapters";
import type { UIServices } from "@ui/lib/ui-renderer/registry";

import formSchema from "../mocks/views/rib_check_requests_form.json";

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

function createQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

function createMockServices(): UIServices {
  return {
    fetch: vi.fn(),
    navigate: vi.fn(),
    toast: vi.fn(),
    confirm: vi.fn().mockResolvedValue(true),
  };
}

interface TestWrapperProps {
  children: React.ReactNode;
  services: UIServices;
  queryClient: QueryClient;
}

function TestWrapper({ children, services, queryClient }: TestWrapperProps) {
  const viewConfig = {
    url: "/api/v1/workspaces/rib_check_requests",
    api: formSchema.api,
    executeApi: vi.fn(),
  };

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <UIProvider
          services={services}
          translations={{
            views: formSchema.translations.en,
            schemas: {},
            common: {},
          }}
          locale="en"
        >
          <TooltipProvider>
            <ViewContext.Provider value={viewConfig}>
              {children}
            </ViewContext.Provider>
          </TooltipProvider>
        </UIProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("RelationshipPicker Integration", () => {
  let services: UIServices;
  let queryClient: QueryClient;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    services = createMockServices();
    queryClient = createQueryClient();
    mockFetch = services.fetch as ReturnType<typeof vi.fn>;
  });

  afterEach(() => {
    cleanup();
  });

  describe("Layer 3: Create new recipient flow", () => {
    it("creates recipient and auto-selects it", async () => {
      const user = userEvent.setup();

      // Setup mock: distinguish GET vs POST by checking options
      mockFetch.mockImplementation((url: string, options?: RequestInit) => {
        if (options?.method === "POST") {
          return Promise.resolve({
            data: {
              id: 42,
              data: {
                first_name: "Bob",
                last_name: "Smith",
                email: "bob@example.com",
              },
            },
          });
        }
        // GET returns empty
        return Promise.resolve({ data: [] });
      });

      render(
        <TestWrapper services={services} queryClient={queryClient}>
          <DynamicRenderer schema={formSchema} data={{}} />
        </TestWrapper>,
      );

      // Open picker drawer
      const addButton = screen.getByRole("button", { name: /add/i });
      await user.click(addButton);

      // Wait for GET to be called
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          "/api/v1/workspaces/contacts?page=1&per_page=10",
        );
      });

      // Click "Create New"
      await waitFor(() => {
        expect(screen.getByText("no_results")).toBeInTheDocument();
      });
      await user.click(screen.getByRole("button", { name: /create_new/i }));

      // Wait for create drawer
      await waitFor(() => {
        expect(
          screen.getByTestId(
            "relationship-create-drawer-recipients_attributes",
          ),
        ).toBeInTheDocument();
      });

      const createDrawer = screen.getByTestId(
        "relationship-create-drawer-recipients_attributes",
      );

      // Fill form
      await user.type(within(createDrawer).getByLabelText("first_name"), "Bob");
      await user.type(
        within(createDrawer).getByLabelText("last_name"),
        "Smith",
      );
      await user.type(
        within(createDrawer).getByLabelText("email"),
        "bob@example.com",
      );

      // Submit
      await user.click(
        within(createDrawer).getByRole("button", { name: /add/i }),
      );

      // Verify POST payload
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          "/api/v1/workspaces/contacts",
          expect.objectContaining({
            method: "POST",
            body: JSON.stringify({
              data: {
                first_name: "Bob",
                last_name: "Smith",
                email: "bob@example.com",
              },
            }),
          }),
        );
      });

      // Create drawer closes
      await waitFor(() => {
        expect(
          screen.queryByTestId(
            "relationship-create-drawer-recipients_attributes",
          ),
        ).not.toBeInTheDocument();
      });

      // Confirm button shows 1 selected
      expect(
        screen.getByRole("button", { name: /confirm.*1/i }),
      ).toBeInTheDocument();
    });

    it("makes exactly ONE POST call when submitting", async () => {
      const user = userEvent.setup();

      mockFetch.mockImplementation((url: string, options?: RequestInit) => {
        if (options?.method === "POST") {
          return Promise.resolve({
            data: {
              id: 42,
              data: {
                first_name: "Bob",
                last_name: "Smith",
                email: "bob@example.com",
              },
            },
          });
        }
        return Promise.resolve({ data: [] });
      });

      render(
        <TestWrapper services={services} queryClient={queryClient}>
          <DynamicRenderer schema={formSchema} data={{}} />
        </TestWrapper>,
      );

      await user.click(screen.getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(screen.getByText("no_results")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: /create_new/i }));

      await waitFor(() => {
        expect(
          screen.getByTestId(
            "relationship-create-drawer-recipients_attributes",
          ),
        ).toBeInTheDocument();
      });

      const createDrawer = screen.getByTestId(
        "relationship-create-drawer-recipients_attributes",
      );

      await user.type(within(createDrawer).getByLabelText("first_name"), "Bob");
      await user.type(
        within(createDrawer).getByLabelText("last_name"),
        "Smith",
      );
      await user.type(
        within(createDrawer).getByLabelText("email"),
        "bob@example.com",
      );

      await user.click(
        within(createDrawer).getByRole("button", { name: /add/i }),
      );

      // Wait for drawer to close
      await waitFor(() => {
        expect(
          screen.queryByTestId(
            "relationship-create-drawer-recipients_attributes",
          ),
        ).not.toBeInTheDocument();
      });

      // Count POST calls
      const postCalls = mockFetch.mock.calls.filter(
        (call) => call[1]?.method === "POST",
      );
      expect(postCalls).toHaveLength(1);
    });
  });

  describe("Layer 2: Select existing contacts", () => {
    it("fetches and displays contacts, allows selection", async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValue({
        data: [
          {
            id: 1,
            data: {
              first_name: "John",
              last_name: "Doe",
              email: "john@example.com",
            },
          },
          {
            id: 2,
            data: {
              first_name: "Jane",
              last_name: "Doe",
              email: "jane@example.com",
            },
          },
        ],
      });

      render(
        <TestWrapper services={services} queryClient={queryClient}>
          <DynamicRenderer schema={formSchema} data={{}} />
        </TestWrapper>,
      );

      await user.click(screen.getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(screen.getByText("John")).toBeInTheDocument();
        expect(screen.getByText("Jane")).toBeInTheDocument();
      });

      // Select both
      await user.click(screen.getByText("John"));
      await user.click(screen.getByText("Jane"));

      // Confirm shows 2
      expect(
        screen.getByRole("button", { name: /confirm.*2/i }),
      ).toBeInTheDocument();

      // No POST calls - only GET
      const postCalls = mockFetch.mock.calls.filter(
        (call) => call[1]?.method === "POST",
      );
      expect(postCalls).toHaveLength(0);
    });
  });

  describe("Search", () => {
    it("makes GET request with q parameter", async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValue({ data: [] });

      render(
        <TestWrapper services={services} queryClient={queryClient}>
          <DynamicRenderer schema={formSchema} data={{}} />
        </TestWrapper>,
      );

      await user.click(screen.getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          "/api/v1/workspaces/contacts?page=1&per_page=10",
        );
      });

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, "bob");

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining("q=bob"),
        );
      });

      // No POST
      const postCalls = mockFetch.mock.calls.filter(
        (call) => call[1]?.method === "POST",
      );
      expect(postCalls).toHaveLength(0);
    });
  });

  describe("Cancel", () => {
    it("discards selections without API calls", async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValue({
        data: [
          {
            id: 1,
            data: {
              first_name: "John",
              last_name: "Doe",
              email: "john@example.com",
            },
          },
        ],
      });

      render(
        <TestWrapper services={services} queryClient={queryClient}>
          <DynamicRenderer schema={formSchema} data={{}} />
        </TestWrapper>,
      );

      await user.click(screen.getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(screen.getByText("John")).toBeInTheDocument();
      });

      await user.click(screen.getByText("John"));
      await user.click(screen.getByRole("button", { name: /cancel/i }));

      await waitFor(() => {
        expect(screen.getByText("no_selection")).toBeInTheDocument();
      });

      // Only 1 GET call
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
