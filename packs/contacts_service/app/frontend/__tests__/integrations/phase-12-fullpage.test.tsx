import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from "vitest";

// Mock ResizeObserver for radix ScrollArea (used by RELATIONSHIP_PICKER)
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
import { render, screen, waitFor, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/lib/ui-renderer/provider";
import { TooltipProvider } from "@ui/components/tooltip";
import { DynamicRenderer } from "@ui/lib/ui-renderer/renderer";
import {
  VIEW,
  FORM,
  TABLE,
  PAGE,
  GROUP,
  SHOW,
  DISPLAY_ARRAY,
} from "@ui/adapters";
import {
  INPUT_TEXT,
  INPUT_SELECT,
  INPUT_DATE,
} from "@ui/adapters";
import {
  DISPLAY_TEXT,
  DISPLAY_DATE,
  DISPLAY_SELECT,
  DISPLAY_TAGS,
} from "@ui/adapters";
import {
  COMPONENT,
  LINK,
  SUBMIT,
  OPTION,
  DROPDOWN,
  RELATIONSHIP_PICKER,
} from "@ui/adapters";
import type { AdapterRegistry, UIServices } from "@ui/lib/ui-renderer/registry";
import type { ReactNode } from "react";

// Import mock data and schema
import contactsIndexSchema from "../mocks/views/contacts_index.json";
import mockData from "../mocks/data.json";

function createMockServices(overrides?: Partial<UIServices>): UIServices {
  return {
    fetch: vi.fn().mockResolvedValue({ data: mockData.items }),
    navigate: vi.fn(),
    toast: vi.fn(),
    confirm: vi.fn().mockResolvedValue(true),
    ...overrides,
  };
}

const mockAdapters: AdapterRegistry = {
  VIEW,
  FORM,
  TABLE,
  PAGE,
  GROUP,
  SHOW,
  DISPLAY_ARRAY,
  COMPONENT,
  LINK,
  SUBMIT,
  OPTION,
  DROPDOWN,
  RELATIONSHIP_PICKER,
  INPUT_TEXT,
  INPUT_SELECT,
  INPUT_DATE,
  DISPLAY_TEXT,
  DISPLAY_DATE,
  DISPLAY_SELECT,
  DISPLAY_TAGS,
} as AdapterRegistry;

interface WrapperProps {
  children: ReactNode;
  services?: UIServices;
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
  queryClient = createQueryClient(),
}: WrapperProps) {
  // View component handles translations from schema - no manual wiring needed
  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider
        adapters={mockAdapters}
        services={services}
        locale="en"
      >
        <TooltipProvider>{children}</TooltipProvider>
      </UIProvider>
    </QueryClientProvider>
  );
}

describe("Phase 12: Full Page Integration (contacts_index)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("12.1 Initial Render", () => {
    it("Page renders translated title 'Contacts'", async () => {
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Contacts");
      });
    });

    it("Page renders translated description", async () => {
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Manage your contacts")).toBeInTheDocument();
      });
    });

    it("Page renders 'New Contact' action button", async () => {
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "New Contact" })).toBeInTheDocument();
      });
    });

    it("Page renders 'Actions' dropdown", async () => {
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Actions/i })).toBeInTheDocument();
      });
    });

    it("Table renders all column headers", async () => {
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>
      );

      // Wait for table to render with data
      await waitFor(() => {
        expect(screen.getByText("John")).toBeInTheDocument();
      });

      // Check column headers exist (some have translations, some don't)
      // The column header cells are in thead, check they rendered
      const columnHeaders = screen.getAllByRole("columnheader");
      // Should have: checkbox + first_name + last_name + email + phone + company + job_title + created_at + actions
      expect(columnHeaders.length).toBeGreaterThanOrEqual(7);
    });
  });

  describe("12.2 Table Data Flow", () => {
    it("Table fetches data from /api/v1/workspaces/contacts", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ data: mockData.items });
      const services = createMockServices({ fetch: mockFetch });

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining("/api/v1/workspaces/contacts"),
          expect.any(Object)
        );
      });
    });

    it("Table renders contact rows", async () => {
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("John")).toBeInTheDocument();
        expect(screen.getByText("Doe")).toBeInTheDocument();
        expect(screen.getByText("john@example.com")).toBeInTheDocument();
        expect(screen.getByText("Jane")).toBeInTheDocument();
        expect(screen.getByText("Smith")).toBeInTheDocument();
      });
    });

    it("Table shows search input with placeholder", async () => {
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Search contacts...")).toBeInTheDocument();
      });
    });
  });

  describe("12.3 New Contact Flow", () => {
    it("Click 'New Contact' opens new_drawer", async () => {
      const user = userEvent.setup();
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "New Contact" })).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "New Contact" }));

      await waitFor(() => {
        expect(screen.getByTestId("drawer-new_drawer")).toBeInTheDocument();
      });
    });

    it("Drawer title shows 'New Contact'", async () => {
      const user = userEvent.setup();
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "New Contact" })).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "New Contact" }));

      await waitFor(() => {
        const drawer = screen.getByTestId("drawer-new_drawer");
        expect(within(drawer).getByText("New Contact")).toBeInTheDocument();
      });
    });

    it("Form renders field groups (Basic Info, Professional, Personal)", async () => {
      const user = userEvent.setup();
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "New Contact" })).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "New Contact" }));

      await waitFor(() => {
        const drawer = screen.getByTestId("drawer-new_drawer");
        expect(within(drawer).getByText("basic_info")).toBeInTheDocument();
        expect(within(drawer).getByText("professional_info")).toBeInTheDocument();
        expect(within(drawer).getByText("personal_info")).toBeInTheDocument();
      });
    });
  });

  describe("12.4 View Contact Flow", () => {
    it("Click table row opens view_drawer with contact details", async () => {
      const user = userEvent.setup();
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>
      );

      // Wait for table data to load
      await waitFor(() => {
        expect(screen.getByText("John")).toBeInTheDocument();
      });

      // Click on a row
      const row = screen.getByText("John").closest("tr");
      await user.click(row!);

      await waitFor(() => {
        expect(screen.getByTestId("drawer-view_drawer")).toBeInTheDocument();
      });

      // Verify drawer title
      const drawer = screen.getByTestId("drawer-view_drawer");
      expect(within(drawer).getByText("View Contact")).toBeInTheDocument();

      // Verify read-only display components (label key, not translated)
      expect(within(drawer).getByText("basic_info")).toBeInTheDocument();
    });
  });

  describe("12.5 Actions Dropdown", () => {
    it("Actions dropdown opens on click", async () => {
      const user = userEvent.setup();
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Actions/i })).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: /Actions/i }));

      await waitFor(() => {
        expect(screen.getByRole("menuitem", { name: "Export CSV" })).toBeInTheDocument();
        expect(screen.getByRole("menuitem", { name: "Import" })).toBeInTheDocument();
      });
    });
  });

  describe("12.6 Table Selection", () => {
    it("Table shows checkboxes for selection", async () => {
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("John")).toBeInTheDocument();
      });

      // Header checkbox + row checkboxes should be present
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes.length).toBeGreaterThan(0);
    });
  });
});
