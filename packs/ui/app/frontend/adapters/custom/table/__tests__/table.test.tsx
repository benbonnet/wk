import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@ui/components/tooltip";
import { UIProvider } from "@ui/lib/ui-renderer/provider";
import { DrawerContext, ViewContext } from "../../view";
import { Table } from "../table";
import type { UIServices } from "@ui/lib/ui-renderer/registry";

const mockServices: UIServices = {
  fetch: vi.fn().mockResolvedValue({ data: [] }),
  navigate: vi.fn(),
  toast: vi.fn(),
  confirm: vi.fn().mockResolvedValue(true),
};

const mockDrawerContext = {
  openDrawer: vi.fn(),
  closeDrawer: vi.fn(),
  drawerData: null,
  setDrawerData: vi.fn(),
};

const mockViewConfig = {
  url: "/api/test",
  api: {},
  executeApi: vi.fn().mockResolvedValue({ success: true }),
};

interface WrapperOptions {
  translations?: {
    global?: Record<string, Record<string, string>>;
    views?: Record<string, Record<string, string>>;
  };
}

function createWrapper(options: WrapperOptions = {}) {
  const { translations = { global: {}, views: {} } } = options;
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <UIProvider services={mockServices} translations={translations} locale="en">
          <ViewContext.Provider value={mockViewConfig}>
            <DrawerContext.Provider value={mockDrawerContext}>
              <TooltipProvider>{children}</TooltipProvider>
            </DrawerContext.Provider>
          </ViewContext.Provider>
        </UIProvider>
      </QueryClientProvider>
    );
  };
}

function renderTable(
  props: React.ComponentProps<typeof Table>,
  options: WrapperOptions = {}
) {
  return render(<Table {...props} />, { wrapper: createWrapper(options) });
}

describe("Table", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("basic rendering", () => {
    it("renders table with data", () => {
      renderTable({
        columns: [{ name: "name", type: "DISPLAY_TEXT", label: "Name" }],
        data: [{ id: 1, name: "John" }],
      });

      expect(screen.getByText("John")).toBeInTheDocument();
    });

    it("renders empty state when no data", () => {
      renderTable({
        columns: [{ name: "name", type: "DISPLAY_TEXT", label: "Name" }],
        data: [],
      });

      expect(screen.getByText("No results.")).toBeInTheDocument();
    });

    it("renders dash for null values", () => {
      renderTable({
        columns: [{ name: "status", type: "DISPLAY_TEXT", label: "Status" }],
        data: [{ id: 1, status: null }],
      });

      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  describe("column header translations", () => {
    it("translates column labels", () => {
      renderTable(
        {
          columns: [{ name: "status", type: "DISPLAY_TEXT", label: "status_label" }],
          data: [{ id: 1, status: "active" }],
        },
        {
          translations: {
            global: {},
            views: { en: { status_label: "Current Status" } },
          },
        }
      );

      expect(screen.getByText("Current Status")).toBeInTheDocument();
    });
  });

  describe("select column translations", () => {
    const selectOptions = [
      { value: "draft", label: "draft" },
      { value: "pending", label: "pending" },
      { value: "completed", label: "completed" },
    ];

    it("translates select option labels in cells", () => {
      renderTable(
        {
          columns: [
            {
              name: "status",
              type: "DISPLAY_SELECT",
              label: "Status",
              options: selectOptions,
            },
          ],
          data: [
            { id: 1, status: "draft" },
            { id: 2, status: "pending" },
            { id: 3, status: "completed" },
          ],
        },
        {
          translations: {
            global: {},
            views: {
              en: {
                draft: "Draft",
                pending: "Pending",
                completed: "Completed",
              },
            },
          },
        }
      );

      expect(screen.getByText("Draft")).toBeInTheDocument();
      expect(screen.getByText("Pending")).toBeInTheDocument();
      expect(screen.getByText("Completed")).toBeInTheDocument();
    });

    it("displays raw value when option not found", () => {
      renderTable(
        {
          columns: [
            {
              name: "status",
              type: "DISPLAY_SELECT",
              label: "Status",
              options: selectOptions,
            },
          ],
          data: [{ id: 1, status: "unknown_status" }],
        },
        {
          translations: {
            global: {},
            views: { en: { draft: "Draft", pending: "Pending" } },
          },
        }
      );

      expect(screen.getByText("unknown_status")).toBeInTheDocument();
    });

    it("returns translation key when translation not found", () => {
      renderTable(
        {
          columns: [
            {
              name: "status",
              type: "DISPLAY_SELECT",
              label: "Status",
              options: selectOptions,
            },
          ],
          data: [{ id: 1, status: "draft" }],
        },
        {
          translations: {
            global: {},
            views: {},
          },
        }
      );

      // When no translation exists, should show the key itself ("draft")
      expect(screen.getByText("draft")).toBeInTheDocument();
    });
  });

  describe("badge column translations", () => {
    const badgeOptions = [
      { value: "active", label: "active_status" },
      { value: "inactive", label: "inactive_status" },
    ];

    it("translates badge option labels in cells", () => {
      renderTable(
        {
          columns: [
            {
              name: "status",
              type: "DISPLAY_BADGE",
              label: "Status",
              options: badgeOptions,
            },
          ],
          data: [
            { id: 1, status: "active" },
            { id: 2, status: "inactive" },
          ],
        },
        {
          translations: {
            global: {},
            views: {
              en: {
                active_status: "Active",
                inactive_status: "Inactive",
              },
            },
          },
        }
      );

      expect(screen.getByText("Active")).toBeInTheDocument();
      expect(screen.getByText("Inactive")).toBeInTheDocument();
    });
  });

  describe("multiple columns with mixed types", () => {
    it("renders columns with different types correctly", () => {
      const typeOptions = [
        { value: "individual", label: "type_individual" },
        { value: "common", label: "type_common" },
      ];

      renderTable(
        {
          columns: [
            { name: "name", type: "DISPLAY_TEXT", label: "Name" },
            {
              name: "request_type",
              type: "DISPLAY_SELECT",
              label: "Type",
              options: typeOptions,
            },
          ],
          data: [
            { id: 1, name: "Request 1", request_type: "individual" },
            { id: 2, name: "Request 2", request_type: "common" },
          ],
        },
        {
          translations: {
            global: {},
            views: {
              en: {
                type_individual: "Individual Request",
                type_common: "Common Request",
              },
            },
          },
        }
      );

      // Text columns render as-is
      expect(screen.getByText("Request 1")).toBeInTheDocument();
      expect(screen.getByText("Request 2")).toBeInTheDocument();

      // Select columns translate their values
      expect(screen.getByText("Individual Request")).toBeInTheDocument();
      expect(screen.getByText("Common Request")).toBeInTheDocument();
    });
  });

  describe("boolean column translations", () => {
    it("translates Yes/No values", () => {
      renderTable(
        {
          columns: [{ name: "active", type: "DISPLAY_BOOLEAN", label: "Active" }],
          data: [
            { id: 1, active: true },
            { id: 2, active: false },
          ],
        },
        {
          translations: {
            global: {},
            views: { en: { Yes: "Oui", No: "Non" } },
          },
        }
      );

      expect(screen.getByText("Oui")).toBeInTheDocument();
      expect(screen.getByText("Non")).toBeInTheDocument();
    });
  });

  describe("columns without options", () => {
    it("renders string value directly when no options provided", () => {
      renderTable({
        columns: [{ name: "status", type: "DISPLAY_TEXT", label: "Status" }],
        data: [{ id: 1, status: "some_value" }],
      });

      expect(screen.getByText("some_value")).toBeInTheDocument();
    });

    it("renders string value directly when options is empty array", () => {
      renderTable({
        columns: [
          { name: "status", type: "DISPLAY_SELECT", label: "Status", options: [] },
        ],
        data: [{ id: 1, status: "some_value" }],
      });

      expect(screen.getByText("some_value")).toBeInTheDocument();
    });
  });
});
