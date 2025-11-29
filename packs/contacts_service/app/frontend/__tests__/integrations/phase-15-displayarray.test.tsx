import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/provider";
import { DynamicRenderer } from "@ui/renderer";
import { TooltipProvider } from "@ui-components/tooltip";
import type { UIServices } from "@ui/registry";
import type { UISchema } from "@ui/types";
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
  data: Record<string, unknown>,
  options?: { translations?: Record<string, string> }
) {
  return render(
    <TestWrapper translations={options?.translations}>
      <DynamicRenderer schema={schema} data={data} />
    </TestWrapper>
  );
}

describe("Phase 15: DISPLAY_ARRAY (Read-only Arrays)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("15.1 Array Rendering", () => {
    it("DISPLAY_ARRAY renders items from data array", () => {
      renderSchema(
        {
          type: "VIEW",
          elements: [
            {
              type: "SHOW",
              elements: [
                {
                  type: "DISPLAY_ARRAY",
                  name: "addresses",
                  template: [{ type: "DISPLAY_TEXT", name: "street", label: "Street" }],
                },
              ],
            },
          ],
        },
        {
          addresses: [
            { street: "123 Main St" },
            { street: "456 Oak Ave" },
          ],
        }
      );

      expect(screen.getByText("123 Main St")).toBeInTheDocument();
      expect(screen.getByText("456 Oak Ave")).toBeInTheDocument();
    });

    it("DISPLAY_ARRAY renders empty state when array empty", () => {
      renderSchema(
        {
          type: "VIEW",
          elements: [
            {
              type: "SHOW",
              elements: [
                {
                  type: "DISPLAY_ARRAY",
                  name: "items",
                  emptyMessage: "No items found",
                  template: [{ type: "DISPLAY_TEXT", name: "name", label: "Name" }],
                },
              ],
            },
          ],
        },
        { items: [] }
      );

      expect(screen.getByText("No items found")).toBeInTheDocument();
    });

    it("DISPLAY_ARRAY renders label from schema", () => {
      renderSchema(
        {
          type: "VIEW",
          elements: [
            {
              type: "SHOW",
              elements: [
                {
                  type: "DISPLAY_ARRAY",
                  name: "addresses",
                  label: "addresses_label",
                  emptyMessage: "None",
                  template: [],
                },
              ],
            },
          ],
        },
        { addresses: [] },
        { translations: { addresses_label: "Shipping Addresses" } }
      );

      expect(screen.getByText("Shipping Addresses")).toBeInTheDocument();
    });

    it("DISPLAY_ARRAY renders translated empty message", () => {
      renderSchema(
        {
          type: "VIEW",
          elements: [
            {
              type: "SHOW",
              elements: [
                {
                  type: "DISPLAY_ARRAY",
                  name: "items",
                  emptyMessage: "no_items",
                  template: [],
                },
              ],
            },
          ],
        },
        { items: [] },
        { translations: { no_items: "Nothing to display" } }
      );

      expect(screen.getByText("Nothing to display")).toBeInTheDocument();
    });
  });

  describe("15.2 Template Rendering", () => {
    it("DISPLAY_ARRAY renders multiple fields per item", () => {
      renderSchema(
        {
          type: "VIEW",
          elements: [
            {
              type: "SHOW",
              elements: [
                {
                  type: "DISPLAY_ARRAY",
                  name: "contacts",
                  template: [
                    { type: "DISPLAY_TEXT", name: "name", label: "Name" },
                    { type: "DISPLAY_TEXT", name: "email", label: "Email" },
                  ],
                },
              ],
            },
          ],
        },
        {
          contacts: [
            { name: "John", email: "john@test.com" },
            { name: "Jane", email: "jane@test.com" },
          ],
        }
      );

      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("john@test.com")).toBeInTheDocument();
      expect(screen.getByText("Jane")).toBeInTheDocument();
      expect(screen.getByText("jane@test.com")).toBeInTheDocument();
    });

    it("DISPLAY_ARRAY renders different display types", () => {
      renderSchema(
        {
          type: "VIEW",
          elements: [
            {
              type: "SHOW",
              elements: [
                {
                  type: "DISPLAY_ARRAY",
                  name: "events",
                  template: [
                    { type: "DISPLAY_TEXT", name: "title", label: "Title" },
                    { type: "DISPLAY_TAGS", name: "tags", label: "Tags" },
                  ],
                },
              ],
            },
          ],
        },
        {
          events: [{ title: "Meeting", tags: ["work", "important"] }],
        }
      );

      expect(screen.getByText("Meeting")).toBeInTheDocument();
      expect(screen.getByText("work")).toBeInTheDocument();
      expect(screen.getByText("important")).toBeInTheDocument();
    });

    it("DISPLAY_ARRAY renders each item in separate container", () => {
      renderSchema(
        {
          type: "VIEW",
          elements: [
            {
              type: "SHOW",
              elements: [
                {
                  type: "DISPLAY_ARRAY",
                  name: "items",
                  template: [{ type: "DISPLAY_TEXT", name: "name", label: "Name" }],
                },
              ],
            },
          ],
        },
        {
          items: [{ name: "Item A" }, { name: "Item B" }, { name: "Item C" }],
        }
      );

      // All three items should render
      expect(screen.getByText("Item A")).toBeInTheDocument();
      expect(screen.getByText("Item B")).toBeInTheDocument();
      expect(screen.getByText("Item C")).toBeInTheDocument();
    });
  });

  describe("15.3 Read-Only Behavior", () => {
    it("DISPLAY_ARRAY does not have add button", () => {
      renderSchema(
        {
          type: "VIEW",
          elements: [
            {
              type: "SHOW",
              elements: [
                {
                  type: "DISPLAY_ARRAY",
                  name: "items",
                  template: [{ type: "DISPLAY_TEXT", name: "name", label: "Name" }],
                },
              ],
            },
          ],
        },
        { items: [{ name: "Test" }] }
      );

      // Should not have any add buttons
      expect(screen.queryByRole("button", { name: /add/i })).not.toBeInTheDocument();
    });

    it("DISPLAY_ARRAY does not have remove buttons", () => {
      renderSchema(
        {
          type: "VIEW",
          elements: [
            {
              type: "SHOW",
              elements: [
                {
                  type: "DISPLAY_ARRAY",
                  name: "items",
                  template: [{ type: "DISPLAY_TEXT", name: "name", label: "Name" }],
                },
              ],
            },
          ],
        },
        { items: [{ name: "Item 1" }, { name: "Item 2" }] }
      );

      // Should not have any remove/delete buttons
      expect(screen.queryByRole("button", { name: /remove/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
    });

    it("DISPLAY_ARRAY content is not editable", () => {
      renderSchema(
        {
          type: "VIEW",
          elements: [
            {
              type: "SHOW",
              elements: [
                {
                  type: "DISPLAY_ARRAY",
                  name: "items",
                  template: [{ type: "DISPLAY_TEXT", name: "name", label: "Name" }],
                },
              ],
            },
          ],
        },
        { items: [{ name: "Test Value" }] }
      );

      // Should not have any input fields
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });
  });
});
