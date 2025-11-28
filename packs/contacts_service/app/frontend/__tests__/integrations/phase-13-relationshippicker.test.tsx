import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/provider";
import { TooltipProvider } from "@ui-components/ui/tooltip";
import { DynamicRenderer } from "@ui/renderer";
import {
  VIEW,
  FORM,
  TABLE,
  PAGE,
  GROUP,
  SHOW,
  DISPLAY_ARRAY,
} from "@ui/adapters/layouts";
import {
  INPUT_TEXT,
  INPUT_SELECT,
  INPUT_DATE,
} from "@ui/adapters/inputs";
import {
  DISPLAY_TEXT,
  DISPLAY_DATE,
  DISPLAY_SELECT,
  DISPLAY_TAGS,
} from "@ui/adapters/displays";
import {
  COMPONENT,
  LINK,
  SUBMIT,
  OPTION,
  DROPDOWN,
  RELATIONSHIP_PICKER,
} from "@ui/adapters/primitives";
import type { UIServices, ComponentRegistry, InputRegistry, DisplayRegistry } from "@ui/registry";
import type { ReactNode } from "react";

// Import the full schema
import contactsIndexSchema from "../mocks/views/contacts_index.json";
import mockData from "../mocks/data.json";

// Mock ResizeObserver for radix ScrollArea
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

// Mock data for relationship picker API
const mockRelatedContacts = {
  data: [
    { id: 101, data: { first_name: "Alice", last_name: "Johnson" } },
    { id: 102, data: { first_name: "Bob", last_name: "Williams" } },
    { id: 103, data: { first_name: "Charlie", last_name: "Brown" } },
  ],
  pagination: { total_pages: 1, current_page: 1 },
};

function createMockServices(overrides?: Partial<UIServices>): UIServices {
  return {
    fetch: vi.fn().mockImplementation((url: string) => {
      // Table data
      if (url.includes("/api/v1/workspaces/contacts") && !url.includes("?")) {
        return Promise.resolve({ data: mockData.items });
      }
      // Relationship picker data (search for contacts)
      if (url.includes("/api/v1/contacts")) {
        return Promise.resolve(mockRelatedContacts);
      }
      return Promise.resolve({ data: [] });
    }),
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
} as ComponentRegistry;

const mockInputs: InputRegistry = {
  INPUT_TEXT,
  INPUT_SELECT,
  INPUT_DATE,
} as InputRegistry;

const mockDisplays: DisplayRegistry = {
  DISPLAY_TEXT,
  DISPLAY_DATE,
  DISPLAY_SELECT,
  DISPLAY_TAGS,
} as DisplayRegistry;

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
  const translations = contactsIndexSchema.translations?.en || {};

  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider
        components={mockComponents}
        inputs={mockInputs}
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

describe("Phase 13: RELATIONSHIP_PICKER Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("13.1 RELATIONSHIP_PICKER Renders in Form", () => {
    it("New Contact drawer contains RELATIONSHIP_PICKER component", async () => {
      const user = userEvent.setup();
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>
      );

      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByRole("button", { name: "New Contact" })).toBeInTheDocument();
      });

      // Open new contact drawer
      await user.click(screen.getByRole("button", { name: "New Contact" }));

      // Wait for drawer to open
      await waitFor(() => {
        expect(screen.getByTestId("drawer-new_drawer")).toBeInTheDocument();
      });

      // RELATIONSHIP_PICKER should render with data-ui attribute
      const drawer = screen.getByTestId("drawer-new_drawer");
      const picker = within(drawer).getByTestId("relationship-picker-children_attributes");
      expect(picker).toBeInTheDocument();
    });

    it("RELATIONSHIP_PICKER shows empty state with Add button", async () => {
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

      const drawer = screen.getByTestId("drawer-new_drawer");
      const picker = within(drawer).getByTestId("relationship-picker-children_attributes");

      // Empty state should have Add button
      expect(within(picker).getByRole("button", { name: /add/i })).toBeInTheDocument();
    });
  });

  describe("13.2 Picker Drawer Opens", () => {
    it("Click Add button opens picker drawer", async () => {
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

      const drawer = screen.getByTestId("drawer-new_drawer");
      const addButton = within(drawer).getByRole("button", { name: /add/i });

      await user.click(addButton);

      // Picker drawer should open
      await waitFor(() => {
        expect(screen.getByTestId("relationship-picker-drawer-children_attributes")).toBeInTheDocument();
      });
    });

    it("Picker drawer fetches data from API", async () => {
      const user = userEvent.setup();
      const mockFetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes("/api/v1/workspaces/contacts")) {
          return Promise.resolve({ data: mockData.items });
        }
        if (url.includes("/api/v1/contacts")) {
          return Promise.resolve(mockRelatedContacts);
        }
        return Promise.resolve({ data: [] });
      });
      const services = createMockServices({ fetch: mockFetch });

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

      const drawer = screen.getByTestId("drawer-new_drawer");
      const addButton = within(drawer).getByRole("button", { name: /add/i });

      await user.click(addButton);

      // Wait for picker drawer to open and data to load
      await waitFor(() => {
        expect(screen.getByTestId("relationship-picker-drawer-children_attributes")).toBeInTheDocument();
      });

      // Verify API was called for the picker data
      await waitFor(() => {
        const calls = mockFetch.mock.calls.map(c => c[0]);
        expect(calls.some((url: string) => url.includes("/api/v1/contacts"))).toBe(true);
      });
    });

    it("Picker drawer shows search input", async () => {
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

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(drawer).getByRole("button", { name: /add/i }));

      await waitFor(() => {
        const pickerDrawer = screen.getByTestId("relationship-picker-drawer-children_attributes");
        expect(within(pickerDrawer).getByRole("textbox")).toBeInTheDocument();
      });
    });
  });

  describe("13.3 Picker Table and Selection", () => {
    it("Picker drawer displays fetched items in table", async () => {
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

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(drawer).getByRole("button", { name: /add/i }));

      // Wait for data to load in picker drawer
      await waitFor(() => {
        const pickerDrawer = screen.getByTestId("relationship-picker-drawer-children_attributes");
        expect(within(pickerDrawer).getByText("Alice")).toBeInTheDocument();
        expect(within(pickerDrawer).getByText("Bob")).toBeInTheDocument();
        expect(within(pickerDrawer).getByText("Charlie")).toBeInTheDocument();
      });
    });

    it("Clicking row toggles checkbox selection", async () => {
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

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(drawer).getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(screen.getByTestId("relationship-picker-drawer-children_attributes")).toBeInTheDocument();
      });

      // Wait for table data
      await waitFor(() => {
        expect(screen.getByText("Alice")).toBeInTheDocument();
      });

      // Click on a row to select
      const aliceRow = screen.getByText("Alice").closest("tr");
      await user.click(aliceRow!);

      // Checkbox should be checked
      const checkboxes = within(aliceRow!).getAllByRole("checkbox");
      expect(checkboxes[0]).toBeChecked();
    });

    it("Confirm button shows selection count", async () => {
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

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(drawer).getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(screen.getByText("Alice")).toBeInTheDocument();
      });

      // Select Alice
      const aliceRow = screen.getByText("Alice").closest("tr");
      await user.click(aliceRow!);

      // Confirm button should show count
      const pickerDrawer = screen.getByTestId("relationship-picker-drawer-children_attributes");
      expect(within(pickerDrawer).getByRole("button", { name: /confirm.*\(1\)/i })).toBeInTheDocument();
    });
  });

  describe("13.4 Selection Confirmation", () => {
    it("Confirm adds selected items and closes picker drawer", async () => {
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

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(drawer).getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(screen.getByText("Alice")).toBeInTheDocument();
      });

      // Select Alice
      const aliceRow = screen.getByText("Alice").closest("tr");
      await user.click(aliceRow!);

      // Click confirm
      const pickerDrawer = screen.getByTestId("relationship-picker-drawer-children_attributes");
      const confirmButton = within(pickerDrawer).getByRole("button", { name: /confirm/i });
      await user.click(confirmButton);

      // Picker drawer should close
      await waitFor(() => {
        expect(screen.queryByTestId("relationship-picker-drawer-children_attributes")).not.toBeInTheDocument();
      });

      // Selected item should now appear in the field
      const picker = within(drawer).getByTestId("relationship-picker-children_attributes");
      expect(within(picker).getByText(/Alice/)).toBeInTheDocument();
    });

    it("Multiple selections can be confirmed (has_many)", async () => {
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

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(drawer).getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(screen.getByText("Alice")).toBeInTheDocument();
      });

      // Select Alice and Bob
      const aliceRow = screen.getByText("Alice").closest("tr");
      const bobRow = screen.getByText("Bob").closest("tr");
      await user.click(aliceRow!);
      await user.click(bobRow!);

      // Confirm button should show (2)
      const pickerDrawer = screen.getByTestId("relationship-picker-drawer-children_attributes");
      expect(within(pickerDrawer).getByRole("button", { name: /confirm.*\(2\)/i })).toBeInTheDocument();

      // Confirm
      await user.click(within(pickerDrawer).getByRole("button", { name: /confirm/i }));

      // Both should appear
      await waitFor(() => {
        const picker = within(drawer).getByTestId("relationship-picker-children_attributes");
        expect(within(picker).getByText(/Alice/)).toBeInTheDocument();
        expect(within(picker).getByText(/Bob/)).toBeInTheDocument();
      });
    });
  });

  describe("13.5 Remove Selected Items", () => {
    it("Selected items have remove button", async () => {
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

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(drawer).getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(screen.getByText("Alice")).toBeInTheDocument();
      });

      // Select and confirm
      const aliceRow = screen.getByText("Alice").closest("tr");
      await user.click(aliceRow!);
      const pickerDrawer = screen.getByTestId("relationship-picker-drawer-children_attributes");
      await user.click(within(pickerDrawer).getByRole("button", { name: /confirm/i }));

      // Wait for item to appear
      await waitFor(() => {
        const picker = within(drawer).getByTestId("relationship-picker-children_attributes");
        expect(within(picker).getByText(/Alice/)).toBeInTheDocument();
      });

      // Find and verify remove button exists
      const picker = within(drawer).getByTestId("relationship-picker-children_attributes");
      const itemContainer = within(picker).getByText(/Alice/).closest("div");
      const buttons = within(itemContainer!.parentElement!).getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("Clicking remove removes item from display", async () => {
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

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(drawer).getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(screen.getByText("Alice")).toBeInTheDocument();
      });

      // Select and confirm
      const aliceRow = screen.getByText("Alice").closest("tr");
      await user.click(aliceRow!);
      const pickerDrawer = screen.getByTestId("relationship-picker-drawer-children_attributes");
      await user.click(within(pickerDrawer).getByRole("button", { name: /confirm/i }));

      await waitFor(() => {
        const picker = within(drawer).getByTestId("relationship-picker-children_attributes");
        expect(within(picker).getByText(/Alice/)).toBeInTheDocument();
      });

      // Click remove (X button)
      const picker = within(drawer).getByTestId("relationship-picker-children_attributes");
      const itemRow = within(picker).getByText(/Alice/).closest("div")?.parentElement;
      const removeButton = within(itemRow!).getAllByRole("button").find(btn =>
        btn.querySelector("svg")
      );
      await user.click(removeButton!);

      // Item should be removed from display
      await waitFor(() => {
        expect(within(picker).queryByText(/Alice/)).not.toBeInTheDocument();
      });
    });
  });

  describe("13.6 Create New in Picker", () => {
    it("Picker drawer has Create New button", async () => {
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

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(drawer).getByRole("button", { name: /add/i }));

      await waitFor(() => {
        const pickerDrawer = screen.getByTestId("relationship-picker-drawer-children_attributes");
        expect(within(pickerDrawer).getByRole("button", { name: /create.*new/i })).toBeInTheDocument();
      });
    });

    it("Click Create New opens create drawer", async () => {
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

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(drawer).getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(screen.getByTestId("relationship-picker-drawer-children_attributes")).toBeInTheDocument();
      });

      const pickerDrawer = screen.getByTestId("relationship-picker-drawer-children_attributes");
      await user.click(within(pickerDrawer).getByRole("button", { name: /create.*new/i }));

      // Create drawer should open
      await waitFor(() => {
        expect(screen.getByTestId("relationship-create-drawer-children_attributes")).toBeInTheDocument();
      });
    });
  });

  describe("13.7 Cancel Behavior", () => {
    it("Cancel button closes picker drawer without selection", async () => {
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

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(drawer).getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(screen.getByTestId("relationship-picker-drawer-children_attributes")).toBeInTheDocument();
      });

      // Select something but then cancel
      await waitFor(() => {
        expect(screen.getByText("Alice")).toBeInTheDocument();
      });
      const aliceRow = screen.getByText("Alice").closest("tr");
      await user.click(aliceRow!);

      // Click cancel
      const pickerDrawer = screen.getByTestId("relationship-picker-drawer-children_attributes");
      await user.click(within(pickerDrawer).getByRole("button", { name: /cancel/i }));

      // Drawer should close
      await waitFor(() => {
        expect(screen.queryByTestId("relationship-picker-drawer-children_attributes")).not.toBeInTheDocument();
      });

      // No item should be added
      const picker = within(drawer).getByTestId("relationship-picker-children_attributes");
      expect(within(picker).queryByText(/Alice/)).not.toBeInTheDocument();
    });
  });
});
