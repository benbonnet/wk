import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/provider";
import { TooltipProvider } from "@ui-components/ui/tooltip";
import { VIEW, FORM, useDrawer } from "@ui/adapters/layouts";
import { useViewConfig } from "@ui/adapters/layouts/view";
import { INPUT_TEXT } from "@ui/adapters/inputs";
import { COMPONENT, LINK, SUBMIT } from "@ui/adapters/primitives";
import type { UIServices, ComponentRegistry, InputRegistry } from "@ui/registry";
import type { ReactNode } from "react";

function createMockServices(overrides?: Partial<UIServices>): UIServices {
  return {
    fetch: vi.fn().mockResolvedValue({ data: {} }),
    navigate: vi.fn(),
    toast: vi.fn(),
    confirm: vi.fn().mockResolvedValue(true),
    ...overrides,
  };
}

const mockComponents: ComponentRegistry = {
  VIEW,
  FORM,
  COMPONENT,
  LINK,
  SUBMIT,
} as ComponentRegistry;

const mockInputs: InputRegistry = {
  INPUT_TEXT,
} as InputRegistry;

interface WrapperProps {
  children: ReactNode;
  services?: UIServices;
  translations?: Record<string, string>;
}

function TestWrapper({
  children,
  services = createMockServices(),
  translations = {},
}: WrapperProps) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider
        components={mockComponents}
        inputs={mockInputs}
        displays={{} as never}
        services={services}
        translations={{ views: translations, schemas: {}, common: {} }}
        locale="en"
      >
        <TooltipProvider>{children}</TooltipProvider>
      </UIProvider>
    </QueryClientProvider>
  );
}

describe("Phase 10: VIEW Adapter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("10.1 View Structure", () => {
    it("VIEW renders children", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <div data-testid="child-content">Hello World</div>
          </VIEW>
        </TestWrapper>
      );

      expect(screen.getByTestId("child-content")).toBeInTheDocument();
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });

    it("VIEW provides DrawerContext", () => {
      // Component that uses DrawerContext
      function DrawerConsumer() {
        const { openDrawer, closeDrawer, drawerData } = useDrawer();
        return (
          <div>
            <span data-testid="drawer-context-exists">Context exists</span>
            <button onClick={() => openDrawer("test")}>Open</button>
          </div>
        );
      }

      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <DrawerConsumer />
          </VIEW>
        </TestWrapper>
      );

      expect(screen.getByTestId("drawer-context-exists")).toBeInTheDocument();
    });

    it("VIEW provides ViewContext", () => {
      // Component that uses ViewContext
      function ViewConsumer() {
        const { url, api, executeApi } = useViewConfig();
        return (
          <div>
            <span data-testid="view-context-exists">Context exists</span>
            <span data-testid="view-url">{url || "no-url"}</span>
          </div>
        );
      }

      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW", url: "/api/contacts" }}>
            <ViewConsumer />
          </VIEW>
        </TestWrapper>
      );

      expect(screen.getByTestId("view-context-exists")).toBeInTheDocument();
      expect(screen.getByTestId("view-url")).toHaveTextContent("/api/contacts");
    });

    it("VIEW applies className from schema", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW", className: "custom-view-class" }}>
            <div>Content</div>
          </VIEW>
        </TestWrapper>
      );

      const viewElement = document.querySelector("[data-ui='view']");
      expect(viewElement).toHaveClass("custom-view-class");
    });
  });

  describe("10.2 Drawer State", () => {
    it("VIEW openDrawer() sets activeDrawer", async () => {
      const user = userEvent.setup();

      function DrawerOpener() {
        const { openDrawer } = useDrawer();
        return <button onClick={() => openDrawer("my_drawer")}>Open Drawer</button>;
      }

      render(
        <TestWrapper>
          <VIEW
            schema={{
              type: "VIEW",
              drawers: {
                my_drawer: {
                  title: "My Drawer",
                  elements: [],
                },
              },
            }}
          >
            <DrawerOpener />
          </VIEW>
        </TestWrapper>
      );

      await user.click(screen.getByRole("button", { name: "Open Drawer" }));

      expect(screen.getByTestId("drawer-my_drawer")).toBeInTheDocument();
    });

    it("VIEW closeDrawer() clears activeDrawer", async () => {
      const user = userEvent.setup();

      function DrawerControls() {
        const { openDrawer, closeDrawer } = useDrawer();
        return (
          <>
            <button onClick={() => openDrawer("test_drawer")}>Open</button>
            <button onClick={() => closeDrawer()}>Close</button>
          </>
        );
      }

      render(
        <TestWrapper>
          <VIEW
            schema={{
              type: "VIEW",
              drawers: {
                test_drawer: {
                  title: "Test Drawer",
                  elements: [],
                },
              },
            }}
          >
            <DrawerControls />
          </VIEW>
        </TestWrapper>
      );

      // Open drawer
      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByTestId("drawer-test_drawer")).toBeInTheDocument();

      // Close drawer
      await user.click(screen.getByRole("button", { name: "Close" }));

      await waitFor(() => {
        expect(screen.queryByTestId("drawer-test_drawer")).not.toBeInTheDocument();
      });
    });

    it("VIEW passes drawerData to drawer content", async () => {
      const user = userEvent.setup();

      function DrawerDataDisplay() {
        const { drawerData } = useDrawer();
        return (
          <div data-testid="drawer-data">
            {drawerData ? JSON.stringify(drawerData) : "no data"}
          </div>
        );
      }

      function DrawerOpener() {
        const { openDrawer } = useDrawer();
        return (
          <button onClick={() => openDrawer("data_drawer", { id: 123, name: "Test" })}>
            Open With Data
          </button>
        );
      }

      render(
        <TestWrapper>
          <VIEW
            schema={{
              type: "VIEW",
              drawers: {
                data_drawer: {
                  title: "Data Drawer",
                  elements: [],
                },
              },
            }}
          >
            <DrawerOpener />
            <DrawerDataDisplay />
          </VIEW>
        </TestWrapper>
      );

      await user.click(screen.getByRole("button", { name: "Open With Data" }));

      await waitFor(() => {
        expect(screen.getByTestId("drawer-data")).toHaveTextContent('{"id":123,"name":"Test"}');
      });
    });
  });

  describe("10.3 Drawer Rendering", () => {
    it("VIEW renders Sheet when drawer active", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VIEW
            schema={{
              type: "VIEW",
              drawers: {
                sheet_drawer: {
                  title: "Sheet Title",
                  elements: [],
                },
              },
            }}
          >
            <LINK schema={{ type: "LINK", label: "Open Sheet", opens: "sheet_drawer" }} />
          </VIEW>
        </TestWrapper>
      );

      await user.click(screen.getByRole("button", { name: "Open Sheet" }));

      // Sheet should be open with the drawer content
      expect(screen.getByTestId("drawer-sheet_drawer")).toBeInTheDocument();
    });

    it("VIEW renders drawer title from drawers registry", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper translations={{ edit_contact: "Edit Contact" }}>
          <VIEW
            schema={{
              type: "VIEW",
              drawers: {
                edit_drawer: {
                  title: "edit_contact",
                  elements: [],
                },
              },
            }}
          >
            <LINK schema={{ type: "LINK", label: "Edit", opens: "edit_drawer" }} />
          </VIEW>
        </TestWrapper>
      );

      await user.click(screen.getByRole("button", { name: "Edit" }));

      expect(screen.getByText("Edit Contact")).toBeInTheDocument();
    });

    it("VIEW renders drawer description when provided", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VIEW
            schema={{
              type: "VIEW",
              drawers: {
                desc_drawer: {
                  title: "Drawer Title",
                  description: "This is the drawer description",
                  elements: [],
                },
              },
            }}
          >
            <LINK schema={{ type: "LINK", label: "Open", opens: "desc_drawer" }} />
          </VIEW>
        </TestWrapper>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));

      expect(screen.getByText("This is the drawer description")).toBeInTheDocument();
    });

    it("VIEW closes drawer on Sheet close button", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VIEW
            schema={{
              type: "VIEW",
              drawers: {
                closable_drawer: {
                  title: "Closable Drawer",
                  elements: [],
                },
              },
            }}
          >
            <LINK schema={{ type: "LINK", label: "Open", opens: "closable_drawer" }} />
          </VIEW>
        </TestWrapper>
      );

      // Open drawer
      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByTestId("drawer-closable_drawer")).toBeInTheDocument();

      // Click the close button (X button in Sheet)
      const closeButton = screen.getByRole("button", { name: /close/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId("drawer-closable_drawer")).not.toBeInTheDocument();
      });
    });
  });

  describe("10.4 View API Registry", () => {
    it("VIEW provides api registry via ViewContext", () => {
      function ApiDisplay() {
        const { api } = useViewConfig();
        return (
          <div data-testid="api-registry">
            {Object.keys(api).join(",")}
          </div>
        );
      }

      render(
        <TestWrapper>
          <VIEW
            schema={{
              type: "VIEW",
              api: {
                index: { method: "GET", path: "/contacts" },
                create: { method: "POST", path: "/contacts" },
                update: { method: "PATCH", path: "/contacts/:id" },
                destroy: { method: "DELETE", path: "/contacts/:id" },
              },
            }}
          >
            <ApiDisplay />
          </VIEW>
        </TestWrapper>
      );

      expect(screen.getByTestId("api-registry")).toHaveTextContent("index,create,update,destroy");
    });

    it("VIEW executeApi calls services.fetch with correct params", async () => {
      const user = userEvent.setup();
      const mockFetch = vi.fn().mockResolvedValue({ data: { id: 1 } });
      const services = createMockServices({ fetch: mockFetch });

      function ApiCaller() {
        const { executeApi } = useViewConfig();
        return (
          <button
            onClick={() =>
              executeApi("create", null, { data: { name: "New Contact" } })
            }
          >
            Create
          </button>
        );
      }

      render(
        <TestWrapper services={services}>
          <VIEW
            schema={{
              type: "VIEW",
              url: "/api",
              api: {
                create: { method: "POST", path: "contacts" },
              },
            }}
          >
            <ApiCaller />
          </VIEW>
        </TestWrapper>
      );

      await user.click(screen.getByRole("button", { name: "Create" }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/contacts", {
          method: "POST",
          body: { name: "New Contact" },
        });
      });
    });

    it("VIEW executeApi interpolates :id in path", async () => {
      const user = userEvent.setup();
      const mockFetch = vi.fn().mockResolvedValue({ data: {} });
      const services = createMockServices({ fetch: mockFetch });

      function ApiCaller() {
        const { executeApi } = useViewConfig();
        return (
          <button
            onClick={() =>
              executeApi("update", { id: 42 }, { data: { name: "Updated" } })
            }
          >
            Update
          </button>
        );
      }

      render(
        <TestWrapper services={services}>
          <VIEW
            schema={{
              type: "VIEW",
              url: "/api",
              api: {
                update: { method: "PATCH", path: "contacts/:id" },
              },
            }}
          >
            <ApiCaller />
          </VIEW>
        </TestWrapper>
      );

      await user.click(screen.getByRole("button", { name: "Update" }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/contacts/42", {
          method: "PATCH",
          body: { name: "Updated" },
        });
      });
    });
  });
});
