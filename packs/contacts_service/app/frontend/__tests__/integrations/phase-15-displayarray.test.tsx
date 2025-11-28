import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/provider";
import { TooltipProvider } from "@ui-components/ui/tooltip";
import { VIEW, SHOW, DISPLAY_ARRAY, GROUP } from "@ui/adapters/layouts";
import { DISPLAY_TEXT, DISPLAY_DATE, DISPLAY_TAGS } from "@ui/adapters/displays";
import { COMPONENT } from "@ui/adapters/primitives";
import type { UIServices, ComponentRegistry, DisplayRegistry } from "@ui/registry";
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
  SHOW,
  DISPLAY_ARRAY,
  GROUP,
  COMPONENT,
} as ComponentRegistry;

const mockDisplays: DisplayRegistry = {
  DISPLAY_TEXT,
  DISPLAY_DATE,
  DISPLAY_TAGS,
} as DisplayRegistry;

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
        inputs={{} as never}
        displays={mockDisplays}
        services={services}
        translations={{ views: translations, schemas: {}, common: {} }}
        locale="en"
      >
        <TooltipProvider>{children}</TooltipProvider>
      </UIProvider>
    </QueryClientProvider>
  );
}

describe("Phase 15: DISPLAY_ARRAY (Read-only Arrays)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("15.1 Array Rendering", () => {
    it("DISPLAY_ARRAY renders items from data array", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <SHOW
              schema={{ type: "SHOW" }}
              record={{
                addresses: [
                  { street: "123 Main St" },
                  { street: "456 Oak Ave" },
                ],
              }}
            >
              <DISPLAY_ARRAY
                schema={{
                  type: "DISPLAY_ARRAY",
                  name: "addresses",
                  template: [
                    { type: "COMPONENT", kind: "DISPLAY_TEXT", name: "street", label: "Street" },
                  ],
                }}
                name="addresses"
              />
            </SHOW>
          </VIEW>
        </TestWrapper>
      );

      expect(screen.getByText("123 Main St")).toBeInTheDocument();
      expect(screen.getByText("456 Oak Ave")).toBeInTheDocument();
    });

    it("DISPLAY_ARRAY renders empty state when array empty", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <SHOW
              schema={{ type: "SHOW" }}
              record={{ items: [] }}
            >
              <DISPLAY_ARRAY
                schema={{
                  type: "DISPLAY_ARRAY",
                  name: "items",
                  emptyMessage: "No items found",
                  template: [
                    { type: "COMPONENT", kind: "DISPLAY_TEXT", name: "name", label: "Name" },
                  ],
                }}
                name="items"
              />
            </SHOW>
          </VIEW>
        </TestWrapper>
      );

      expect(screen.getByText("No items found")).toBeInTheDocument();
    });

    it("DISPLAY_ARRAY renders label from schema", () => {
      render(
        <TestWrapper translations={{ addresses_label: "Shipping Addresses" }}>
          <VIEW schema={{ type: "VIEW" }}>
            <SHOW
              schema={{ type: "SHOW" }}
              record={{ addresses: [] }}
            >
              <DISPLAY_ARRAY
                schema={{
                  type: "DISPLAY_ARRAY",
                  name: "addresses",
                  label: "addresses_label",
                  emptyMessage: "None",
                  template: [],
                }}
                name="addresses"
              />
            </SHOW>
          </VIEW>
        </TestWrapper>
      );

      expect(screen.getByText("Shipping Addresses")).toBeInTheDocument();
    });

    it("DISPLAY_ARRAY renders translated empty message", () => {
      render(
        <TestWrapper translations={{ no_items: "Nothing to display" }}>
          <VIEW schema={{ type: "VIEW" }}>
            <SHOW
              schema={{ type: "SHOW" }}
              record={{ items: [] }}
            >
              <DISPLAY_ARRAY
                schema={{
                  type: "DISPLAY_ARRAY",
                  name: "items",
                  emptyMessage: "no_items",
                  template: [],
                }}
                name="items"
              />
            </SHOW>
          </VIEW>
        </TestWrapper>
      );

      expect(screen.getByText("Nothing to display")).toBeInTheDocument();
    });
  });

  describe("15.2 Template Rendering", () => {
    it("DISPLAY_ARRAY renders multiple fields per item", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <SHOW
              schema={{ type: "SHOW" }}
              record={{
                contacts: [
                  { name: "John", email: "john@test.com" },
                  { name: "Jane", email: "jane@test.com" },
                ],
              }}
            >
              <DISPLAY_ARRAY
                schema={{
                  type: "DISPLAY_ARRAY",
                  name: "contacts",
                  template: [
                    { type: "COMPONENT", kind: "DISPLAY_TEXT", name: "name", label: "Name" },
                    { type: "COMPONENT", kind: "DISPLAY_TEXT", name: "email", label: "Email" },
                  ],
                }}
                name="contacts"
              />
            </SHOW>
          </VIEW>
        </TestWrapper>
      );

      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("john@test.com")).toBeInTheDocument();
      expect(screen.getByText("Jane")).toBeInTheDocument();
      expect(screen.getByText("jane@test.com")).toBeInTheDocument();
    });

    it("DISPLAY_ARRAY renders different display types", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <SHOW
              schema={{ type: "SHOW" }}
              record={{
                events: [
                  { title: "Meeting", tags: ["work", "important"] },
                ],
              }}
            >
              <DISPLAY_ARRAY
                schema={{
                  type: "DISPLAY_ARRAY",
                  name: "events",
                  template: [
                    { type: "COMPONENT", kind: "DISPLAY_TEXT", name: "title", label: "Title" },
                    { type: "COMPONENT", kind: "DISPLAY_TAGS", name: "tags", label: "Tags" },
                  ],
                }}
                name="events"
              />
            </SHOW>
          </VIEW>
        </TestWrapper>
      );

      expect(screen.getByText("Meeting")).toBeInTheDocument();
      expect(screen.getByText("work")).toBeInTheDocument();
      expect(screen.getByText("important")).toBeInTheDocument();
    });

    it("DISPLAY_ARRAY renders each item in separate container", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <SHOW
              schema={{ type: "SHOW" }}
              record={{
                items: [
                  { name: "Item A" },
                  { name: "Item B" },
                  { name: "Item C" },
                ],
              }}
            >
              <DISPLAY_ARRAY
                schema={{
                  type: "DISPLAY_ARRAY",
                  name: "items",
                  template: [
                    { type: "COMPONENT", kind: "DISPLAY_TEXT", name: "name", label: "Name" },
                  ],
                }}
                name="items"
              />
            </SHOW>
          </VIEW>
        </TestWrapper>
      );

      // All three items should render
      expect(screen.getByText("Item A")).toBeInTheDocument();
      expect(screen.getByText("Item B")).toBeInTheDocument();
      expect(screen.getByText("Item C")).toBeInTheDocument();
    });
  });

  describe("15.3 Read-Only Behavior", () => {
    it("DISPLAY_ARRAY does not have add button", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <SHOW
              schema={{ type: "SHOW" }}
              record={{ items: [{ name: "Test" }] }}
            >
              <DISPLAY_ARRAY
                schema={{
                  type: "DISPLAY_ARRAY",
                  name: "items",
                  template: [
                    { type: "COMPONENT", kind: "DISPLAY_TEXT", name: "name", label: "Name" },
                  ],
                }}
                name="items"
              />
            </SHOW>
          </VIEW>
        </TestWrapper>
      );

      // Should not have any add buttons
      expect(screen.queryByRole("button", { name: /add/i })).not.toBeInTheDocument();
    });

    it("DISPLAY_ARRAY does not have remove buttons", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <SHOW
              schema={{ type: "SHOW" }}
              record={{
                items: [{ name: "Item 1" }, { name: "Item 2" }],
              }}
            >
              <DISPLAY_ARRAY
                schema={{
                  type: "DISPLAY_ARRAY",
                  name: "items",
                  template: [
                    { type: "COMPONENT", kind: "DISPLAY_TEXT", name: "name", label: "Name" },
                  ],
                }}
                name="items"
              />
            </SHOW>
          </VIEW>
        </TestWrapper>
      );

      // Should not have any remove/delete buttons
      expect(screen.queryByRole("button", { name: /remove/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
    });

    it("DISPLAY_ARRAY content is not editable", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <SHOW
              schema={{ type: "SHOW" }}
              record={{ items: [{ name: "Test Value" }] }}
            >
              <DISPLAY_ARRAY
                schema={{
                  type: "DISPLAY_ARRAY",
                  name: "items",
                  template: [
                    { type: "COMPONENT", kind: "DISPLAY_TEXT", name: "name", label: "Name" },
                  ],
                }}
                name="items"
              />
            </SHOW>
          </VIEW>
        </TestWrapper>
      );

      // Should not have any input fields
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });
  });
});
