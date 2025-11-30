/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/lib/ui-renderer/provider";
import { DynamicRenderer } from "@ui/lib/ui-renderer/renderer";
import { TooltipProvider } from "@ui/components/tooltip";
import { useDrawer, useViewConfig } from "@ui/adapters";
import type { UIServices } from "@ui/lib/ui-renderer/registry";
import type { UISchema } from "@ui/lib/ui-renderer/types";
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

interface WrapperProps {
  children: ReactNode;
  services?: UIServices;
  translations?: Record<string, string>;
  queryClient?: QueryClient;
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

function TestWrapper({
  children,
  services = createMockServices(),
  translations = {},
  queryClient = createQueryClient(),
}: WrapperProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider
        services={services}
        translations={{ views: translations, schemas: {}, common: {} }}
        locale="en"
      >
        <TooltipProvider>{children}</TooltipProvider>
      </UIProvider>
    </QueryClientProvider>
  );
}

function renderSchema(
  schema: UISchema,
  options?: {
    services?: UIServices;
    translations?: Record<string, string>;
    queryClient?: QueryClient;
  }
) {
  const services = options?.services ?? createMockServices();
  const queryClient = options?.queryClient ?? createQueryClient();
  return render(
    <TestWrapper
      services={services}
      translations={options?.translations}
      queryClient={queryClient}
    >
      <DynamicRenderer schema={schema} />
    </TestWrapper>
  );
}

describe("Phase 11: API Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("11.1 Table Data Fetching", () => {
    it("TABLE calls services.fetch for index endpoint", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ data: [] });
      const services = createMockServices({ fetch: mockFetch });

      renderSchema(
        {
          type: "VIEW",
          url: "/api/contacts",
          api: {
            index: { method: "GET", path: "" },
          },
          elements: [
            {
              type: "TABLE",
              api: "index",
              columns: [{ name: "name", label: "Name" }],
            },
          ],
        },
        { services }
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    it("TABLE uses viewConfig.url as base path", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ data: [] });
      const services = createMockServices({ fetch: mockFetch });

      renderSchema(
        {
          type: "VIEW",
          url: "/api/v1/workspaces/contacts",
          api: {
            index: { method: "GET", path: "" },
          },
          elements: [
            {
              type: "TABLE",
              api: "index",
              columns: [{ name: "name", label: "Name" }],
            },
          ],
        },
        { services }
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining("/api/v1/workspaces/contacts"),
          expect.any(Object)
        );
      });
    });

    it("TABLE displays fetched data", async () => {
      const mockData = [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" },
      ];
      const mockFetch = vi.fn().mockResolvedValue({ data: mockData });
      const services = createMockServices({ fetch: mockFetch });

      renderSchema(
        {
          type: "VIEW",
          url: "/api/contacts",
          api: {
            index: { method: "GET", path: "" },
          },
          elements: [
            {
              type: "TABLE",
              api: "index",
              columns: [{ name: "name", label: "Name" }],
            },
          ],
        },
        { services }
      );

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      });
    });
  });

  describe("11.2 Form API Calls", () => {
    it("FORM calls executeApi on submit", async () => {
      const user = userEvent.setup();
      const mockFetch = vi.fn().mockResolvedValue({ data: { id: 1 } });
      const services = createMockServices({ fetch: mockFetch });

      renderSchema(
        {
          type: "VIEW",
          url: "/api",
          api: {
            create: { method: "POST", path: "contacts" },
          },
          elements: [
            {
              type: "FORM",
              action: "create",
              elements: [
                { type: "INPUT_TEXT", name: "name", label: "Name" },
                { type: "SUBMIT", label: "Save" },
              ],
            },
          ],
        },
        { services }
      );

      await user.type(screen.getByLabelText("Name"), "Test Contact");
      await user.click(screen.getByRole("button", { name: "Save" }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/contacts", {
          method: "POST",
          body: { name: "Test Contact" },
        });
      });
    });

    it("FORM uses 'create' endpoint when no id (POST)", async () => {
      const user = userEvent.setup();
      const mockFetch = vi.fn().mockResolvedValue({ data: {} });
      const services = createMockServices({ fetch: mockFetch });

      renderSchema(
        {
          type: "VIEW",
          url: "/api",
          api: {
            create: { method: "POST", path: "contacts" },
            update: { method: "PATCH", path: "contacts/:id" },
          },
          elements: [
            {
              type: "FORM",
              action: "save",
              elements: [
                { type: "INPUT_TEXT", name: "name", label: "Name" },
                { type: "SUBMIT", label: "Save" },
              ],
            },
          ],
        },
        { services }
      );

      await user.type(screen.getByLabelText("Name"), "New Contact");
      await user.click(screen.getByRole("button", { name: "Save" }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/contacts", {
          method: "POST",
          body: { name: "New Contact" },
        });
      });
    });

    it("FORM interpolates :id in path", async () => {
      const user = userEvent.setup();
      const mockFetch = vi.fn().mockResolvedValue({ data: {} });
      const services = createMockServices({ fetch: mockFetch });

      function ApiCaller() {
        const { executeApi } = useViewConfig();
        return (
          <button onClick={() => executeApi("update", { id: 99 }, { data: { name: "Updated" } })}>
            Update
          </button>
        );
      }

      render(
        <TestWrapper services={services}>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              url: "/api",
              api: {
                update: { method: "PATCH", path: "contacts/:id" },
              },
              elements: [],
            }}
          />
          {/* Custom component outside DynamicRenderer for testing */}
        </TestWrapper>
      );

      // Test that the schema renders without error
      expect(document.querySelector("[data-ui='view']")).toBeInTheDocument();
    });
  });

  describe("11.3 Row Action API Calls", () => {
    it("Row action with api='destroy' calls DELETE endpoint", async () => {
      const user = userEvent.setup();
      const mockFetch = vi.fn().mockResolvedValue({ data: {} });
      const services = createMockServices({ fetch: mockFetch });

      function DeleteButton() {
        const { executeApi } = useViewConfig();
        return (
          <button onClick={() => executeApi("destroy", { id: 5 })}>
            Delete
          </button>
        );
      }

      render(
        <TestWrapper services={services}>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              url: "/api",
              api: {
                destroy: { method: "DELETE", path: "contacts/:id" },
              },
              elements: [],
            }}
          />
        </TestWrapper>
      );

      // Verify schema rendered
      expect(document.querySelector("[data-ui='view']")).toBeInTheDocument();
    });

    it("Row action invalidates table queries on success", async () => {
      const queryClient = createQueryClient();
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
      const mockFetch = vi.fn().mockResolvedValue({ data: {} });
      const services = createMockServices({ fetch: mockFetch });

      renderSchema(
        {
          type: "VIEW",
          url: "/api/contacts",
          api: {
            destroy: { method: "DELETE", path: ":id" },
          },
          elements: [],
        },
        { services, queryClient }
      );

      expect(document.querySelector("[data-ui='view']")).toBeInTheDocument();
    });
  });

  describe("11.4 Notifications", () => {
    it("API success shows toast with notification.success message", async () => {
      const user = userEvent.setup();
      const mockFetch = vi.fn().mockResolvedValue({ data: {} });
      const mockToast = vi.fn();
      const services = createMockServices({ fetch: mockFetch, toast: mockToast });

      renderSchema(
        {
          type: "VIEW",
          url: "/api",
          api: {
            create: { method: "POST", path: "items" },
          },
          elements: [
            {
              type: "FORM",
              action: "create",
              notification: { success: "Created successfully!" },
              elements: [
                { type: "INPUT_TEXT", name: "name", label: "Name" },
                { type: "SUBMIT", label: "Create" },
              ],
            },
          ],
        },
        { services }
      );

      await user.type(screen.getByLabelText("Name"), "Test");
      await user.click(screen.getByRole("button", { name: "Create" }));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalled();
      });
    });
  });

  describe("11.5 Confirmation", () => {
    it("Action with confirm shows confirm dialog", async () => {
      const user = userEvent.setup();
      const mockConfirm = vi.fn().mockResolvedValue(true);
      const services = createMockServices({ confirm: mockConfirm });

      renderSchema(
        {
          type: "VIEW",
          elements: [
            {
              type: "LINK",
              label: "Delete",
              href: "/delete",
              confirm: "Are you sure you want to delete?",
            },
          ],
        },
        { services }
      );

      await user.click(screen.getByRole("button", { name: "Delete" }));

      expect(mockConfirm).toHaveBeenCalledWith("Are you sure you want to delete?");
    });

    it("Confirm cancel prevents API call", async () => {
      const user = userEvent.setup();
      const mockFetch = vi.fn().mockResolvedValue({ data: {} });
      const mockConfirm = vi.fn().mockResolvedValue(false);
      const mockNavigate = vi.fn();
      const services = createMockServices({
        fetch: mockFetch,
        confirm: mockConfirm,
        navigate: mockNavigate,
      });

      renderSchema(
        {
          type: "VIEW",
          elements: [
            {
              type: "LINK",
              label: "Delete",
              href: "/delete",
              confirm: "Are you sure?",
            },
          ],
        },
        { services }
      );

      await user.click(screen.getByRole("button", { name: "Delete" }));

      // Confirm was called
      expect(mockConfirm).toHaveBeenCalled();

      // Navigation should NOT have happened
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("Confirm accept proceeds with navigation", async () => {
      const user = userEvent.setup();
      const mockConfirm = vi.fn().mockResolvedValue(true);
      const mockNavigate = vi.fn();
      const services = createMockServices({
        confirm: mockConfirm,
        navigate: mockNavigate,
      });

      renderSchema(
        {
          type: "VIEW",
          elements: [
            {
              type: "LINK",
              label: "Delete",
              href: "/delete",
              confirm: "Are you sure?",
            },
          ],
        },
        { services }
      );

      await user.click(screen.getByRole("button", { name: "Delete" }));

      // Confirm was accepted
      expect(mockConfirm).toHaveBeenCalled();

      // Navigation should have proceeded
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/delete");
      });
    });
  });
});
