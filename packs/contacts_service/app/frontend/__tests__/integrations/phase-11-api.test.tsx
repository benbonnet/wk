import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/provider";
import { TooltipProvider } from "@ui-components/ui/tooltip";
import { VIEW, FORM, TABLE, useDrawer } from "@ui/adapters/layouts";
import { useViewConfig } from "@ui/adapters/layouts/view";
import { INPUT_TEXT } from "@ui/adapters/inputs";
import { COMPONENT, LINK, SUBMIT, OPTION, DROPDOWN } from "@ui/adapters/primitives";
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
  TABLE,
  COMPONENT,
  LINK,
  SUBMIT,
  OPTION,
  DROPDOWN,
} as ComponentRegistry;

const mockInputs: InputRegistry = {
  INPUT_TEXT,
} as InputRegistry;

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

describe("Phase 11: API Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("11.1 Table Data Fetching", () => {
    it("TABLE calls services.fetch for index endpoint", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ data: [] });
      const services = createMockServices({ fetch: mockFetch });

      render(
        <TestWrapper services={services}>
          <VIEW
            schema={{
              type: "VIEW",
              url: "/api/contacts",
              api: {
                index: { method: "GET", path: "" },
              },
            }}
          >
            <TABLE
              schema={{
                type: "TABLE",
                columns: [{ name: "name", label: "Name" }],
              }}
              api="index"
            />
          </VIEW>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    it("TABLE uses viewConfig.url as base path", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ data: [] });
      const services = createMockServices({ fetch: mockFetch });

      render(
        <TestWrapper services={services}>
          <VIEW
            schema={{
              type: "VIEW",
              url: "/api/v1/workspaces/contacts",
              api: {
                index: { method: "GET", path: "" },
              },
            }}
          >
            <TABLE
              schema={{
                type: "TABLE",
                columns: [{ name: "name", label: "Name" }],
              }}
              api="index"
            />
          </VIEW>
        </TestWrapper>
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

      render(
        <TestWrapper services={services}>
          <VIEW
            schema={{
              type: "VIEW",
              url: "/api/contacts",
              api: {
                index: { method: "GET", path: "" },
              },
            }}
          >
            <TABLE
              schema={{
                type: "TABLE",
                columns: [{ name: "name", label: "Name" }],
              }}
              api="index"
            />
          </VIEW>
        </TestWrapper>
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
            <FORM schema={{ type: "FORM", action: "create" }}>
              <COMPONENT
                schema={{ type: "COMPONENT", kind: "INPUT_TEXT", name: "name", label: "Name" }}
                name="name"
                kind="INPUT_TEXT"
              />
              <SUBMIT schema={{ type: "SUBMIT", label: "Save" }} />
            </FORM>
          </VIEW>
        </TestWrapper>
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

      render(
        <TestWrapper services={services}>
          <VIEW
            schema={{
              type: "VIEW",
              url: "/api",
              api: {
                create: { method: "POST", path: "contacts" },
                update: { method: "PATCH", path: "contacts/:id" },
              },
            }}
          >
            <FORM schema={{ type: "FORM", action: "save" }}>
              <COMPONENT
                schema={{ type: "COMPONENT", kind: "INPUT_TEXT", name: "name", label: "Name" }}
                name="name"
                kind="INPUT_TEXT"
              />
              <SUBMIT schema={{ type: "SUBMIT", label: "Save" }} />
            </FORM>
          </VIEW>
        </TestWrapper>
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

    it("FORM uses 'update' endpoint when id present (PATCH)", async () => {
      const user = userEvent.setup();
      const mockFetch = vi.fn().mockResolvedValue({ data: {} });
      const services = createMockServices({ fetch: mockFetch });

      // Helper that sets drawer data without opening actual drawer
      function SetDrawerData() {
        const { setDrawerData } = useDrawer();
        return (
          <button onClick={() => setDrawerData({ id: 42, name: "Existing" })}>
            Set Data
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
                update: { method: "PATCH", path: "contacts/:id" },
              },
            }}
          >
            <SetDrawerData />
            <FORM schema={{ type: "FORM", action: "save", use_record: true }}>
              <COMPONENT
                schema={{ type: "COMPONENT", kind: "INPUT_TEXT", name: "name", label: "Name" }}
                name="name"
                kind="INPUT_TEXT"
              />
              <SUBMIT schema={{ type: "SUBMIT", label: "Save" }} />
            </FORM>
          </VIEW>
        </TestWrapper>
      );

      // Set drawer data (simulating edit mode with existing record)
      await user.click(screen.getByRole("button", { name: "Set Data" }));

      // Wait for form to populate with drawer data
      await waitFor(() => {
        expect(screen.getByLabelText("Name")).toHaveValue("Existing");
      });

      // Submit the form - should use update endpoint since id is present
      await user.click(screen.getByRole("button", { name: "Save" }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/contacts/42", {
          method: "PATCH",
          body: { id: 42, name: "Existing" },
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
        expect(mockFetch).toHaveBeenCalledWith("/api/contacts/99", {
          method: "PATCH",
          body: { name: "Updated" },
        });
      });
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
          <VIEW
            schema={{
              type: "VIEW",
              url: "/api",
              api: {
                destroy: { method: "DELETE", path: "contacts/:id" },
              },
            }}
          >
            <DeleteButton />
          </VIEW>
        </TestWrapper>
      );

      await user.click(screen.getByRole("button", { name: "Delete" }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/contacts/5", {
          method: "DELETE",
          body: undefined,
        });
      });
    });

    it("Row action interpolates :id from row data", async () => {
      const user = userEvent.setup();
      const mockFetch = vi.fn().mockResolvedValue({ data: {} });
      const services = createMockServices({ fetch: mockFetch });

      function ActionButton({ rowData }: { rowData: { id: number } }) {
        const { executeApi } = useViewConfig();
        return (
          <button onClick={() => executeApi("destroy", rowData)}>
            Delete Row {rowData.id}
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
                destroy: { method: "DELETE", path: "contacts/:id" },
              },
            }}
          >
            <ActionButton rowData={{ id: 123 }} />
          </VIEW>
        </TestWrapper>
      );

      await user.click(screen.getByRole("button", { name: "Delete Row 123" }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/contacts/123", expect.any(Object));
      });
    });

    it("Row action invalidates table queries on success", async () => {
      const user = userEvent.setup();
      const queryClient = createQueryClient();
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
      const mockFetch = vi.fn().mockResolvedValue({ data: {} });
      const services = createMockServices({ fetch: mockFetch });

      function DeleteButton() {
        const { executeApi } = useViewConfig();
        return (
          <button onClick={() => executeApi("destroy", { id: 1 })}>
            Delete
          </button>
        );
      }

      render(
        <TestWrapper services={services} queryClient={queryClient}>
          <VIEW
            schema={{
              type: "VIEW",
              url: "/api/contacts",
              api: {
                destroy: { method: "DELETE", path: ":id" },
              },
            }}
          >
            <DeleteButton />
          </VIEW>
        </TestWrapper>
      );

      await user.click(screen.getByRole("button", { name: "Delete" }));

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["table", "/api/contacts"] });
      });
    });
  });

  describe("11.4 Notifications", () => {
    it("API success shows toast with notification.success message", async () => {
      const user = userEvent.setup();
      const mockFetch = vi.fn().mockResolvedValue({ data: {} });
      const mockToast = vi.fn();
      const services = createMockServices({ fetch: mockFetch, toast: mockToast });

      function ApiCaller() {
        const { executeApi } = useViewConfig();
        return (
          <button
            onClick={() =>
              executeApi("create", null, { data: {} }, { success: "Created successfully!" })
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
                create: { method: "POST", path: "items" },
              },
            }}
          >
            <ApiCaller />
          </VIEW>
        </TestWrapper>
      );

      await user.click(screen.getByRole("button", { name: "Create" }));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          type: "success",
          message: "Created successfully!",
        });
      });
    });

    it("API error shows toast with notification.error message", async () => {
      const user = userEvent.setup();
      const mockFetch = vi.fn().mockRejectedValue(new Error("Server error"));
      const mockToast = vi.fn();
      const services = createMockServices({ fetch: mockFetch, toast: mockToast });

      function ApiCaller() {
        const { executeApi } = useViewConfig();
        return (
          <button
            onClick={() =>
              executeApi("create", null, { data: {} }, { error: "Failed to create!" })
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
                create: { method: "POST", path: "items" },
              },
            }}
          >
            <ApiCaller />
          </VIEW>
        </TestWrapper>
      );

      await user.click(screen.getByRole("button", { name: "Create" }));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          type: "error",
          message: "Failed to create!",
        });
      });
    });

    it("Toast uses translated message", async () => {
      const user = userEvent.setup();
      const mockFetch = vi.fn().mockResolvedValue({ data: {} });
      const mockToast = vi.fn();
      const services = createMockServices({ fetch: mockFetch, toast: mockToast });

      function ApiCaller() {
        const { executeApi } = useViewConfig();
        return (
          <button
            onClick={() =>
              executeApi("create", null, { data: {} }, { success: "success_message" })
            }
          >
            Create
          </button>
        );
      }

      render(
        <TestWrapper
          services={services}
          translations={{ success_message: "Contact has been created!" }}
        >
          <VIEW
            schema={{
              type: "VIEW",
              url: "/api",
              api: {
                create: { method: "POST", path: "items" },
              },
            }}
          >
            <ApiCaller />
          </VIEW>
        </TestWrapper>
      );

      await user.click(screen.getByRole("button", { name: "Create" }));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          type: "success",
          message: "Contact has been created!",
        });
      });
    });
  });

  describe("11.5 Confirmation", () => {
    it("Action with confirm shows confirm dialog", async () => {
      const user = userEvent.setup();
      const mockConfirm = vi.fn().mockResolvedValue(true);
      const services = createMockServices({ confirm: mockConfirm });

      render(
        <TestWrapper services={services}>
          <VIEW schema={{ type: "VIEW" }}>
            <LINK
              schema={{
                type: "LINK",
                label: "Delete",
                href: "/delete",
                confirm: "Are you sure you want to delete?",
              }}
            />
          </VIEW>
        </TestWrapper>
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

      render(
        <TestWrapper services={services}>
          <VIEW schema={{ type: "VIEW" }}>
            <LINK
              schema={{
                type: "LINK",
                label: "Delete",
                href: "/delete",
                confirm: "Are you sure?",
              }}
            />
          </VIEW>
        </TestWrapper>
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

      render(
        <TestWrapper services={services}>
          <VIEW schema={{ type: "VIEW" }}>
            <LINK
              schema={{
                type: "LINK",
                label: "Delete",
                href: "/delete",
                confirm: "Are you sure?",
              }}
            />
          </VIEW>
        </TestWrapper>
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
