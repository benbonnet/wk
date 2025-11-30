import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/lib/ui-renderer/provider";
import { TooltipProvider } from "@ui/components/tooltip";
import { DynamicRenderer } from "@ui/lib/ui-renderer/renderer";
import type { UIServices } from "@ui/lib/ui-renderer/registry";
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
      // Table data (no query params)
      if (url.includes("/api/v1/workspaces/contacts") && !url.includes("?")) {
        return Promise.resolve({ data: mockData.items });
      }
      // Relationship picker data (has query params for search/pagination)
      // Picker derives path from view URL: /api/v1/workspaces + /contacts
      if (url.includes("/api/v1/workspaces/contacts") && url.includes("?")) {
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
        services={services}
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
        </TestWrapper>,
      );

      // Wait for page to load
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "New Contact" }),
        ).toBeInTheDocument();
      });

      // Open new contact drawer
      await user.click(screen.getByRole("button", { name: "New Contact" }));

      // Wait for drawer to open
      await waitFor(() => {
        expect(screen.getByTestId("drawer-new_drawer")).toBeInTheDocument();
      });

      // RELATIONSHIP_PICKER should render with data-ui attribute
      const drawer = screen.getByTestId("drawer-new_drawer");
      const picker = within(drawer).getByTestId(
        "relationship-picker-children_attributes",
      );
      expect(picker).toBeInTheDocument();
    });

    it("RELATIONSHIP_PICKER shows empty state with Add button", async () => {
      const user = userEvent.setup();
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "New Contact" }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "New Contact" }));

      await waitFor(() => {
        expect(screen.getByTestId("drawer-new_drawer")).toBeInTheDocument();
      });

      const drawer = screen.getByTestId("drawer-new_drawer");
      const picker = within(drawer).getByTestId(
        "relationship-picker-children_attributes",
      );

      // Empty state should have Add button
      expect(
        within(picker).getByRole("button", { name: /add/i }),
      ).toBeInTheDocument();
    });
  });

  describe("13.2 Picker Drawer Opens", () => {
    it("Click Add button opens picker drawer", async () => {
      const user = userEvent.setup();
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "New Contact" }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "New Contact" }));

      await waitFor(() => {
        expect(screen.getByTestId("drawer-new_drawer")).toBeInTheDocument();
      });

      const drawer = screen.getByTestId("drawer-new_drawer");
      const picker = within(drawer).getByTestId(
        "relationship-picker-children_attributes",
      );
      const addButton = within(picker).getByRole("button", { name: /add/i });

      await user.click(addButton);

      // Picker drawer should open
      await waitFor(() => {
        expect(
          screen.getByTestId("relationship-picker-drawer-children_attributes"),
        ).toBeInTheDocument();
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
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "New Contact" }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "New Contact" }));

      await waitFor(() => {
        expect(screen.getByTestId("drawer-new_drawer")).toBeInTheDocument();
      });

      const drawer = screen.getByTestId("drawer-new_drawer");
      const addButton = within(within(drawer).getByTestId("relationship-picker-children_attributes")).getByRole("button", { name: /add/i });

      await user.click(addButton);

      // Wait for picker drawer to open and data to load
      await waitFor(() => {
        expect(
          screen.getByTestId("relationship-picker-drawer-children_attributes"),
        ).toBeInTheDocument();
      });

      // Verify API was called for the picker data
      // Picker derives path from view URL: /api/v1/workspaces/contacts
      await waitFor(() => {
        const calls = mockFetch.mock.calls.map((c) => c[0]);
        expect(
          calls.some(
            (url: string) =>
              url.includes("/api/v1/workspaces/contacts") && url.includes("?"),
          ),
        ).toBe(true);
      });
    });

    it("Picker drawer shows search input", async () => {
      const user = userEvent.setup();
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "New Contact" }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "New Contact" }));

      await waitFor(() => {
        expect(screen.getByTestId("drawer-new_drawer")).toBeInTheDocument();
      });

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(within(drawer).getByTestId("relationship-picker-children_attributes")).getByRole("button", { name: /add/i }));

      await waitFor(() => {
        const pickerDrawer = screen.getByTestId(
          "relationship-picker-drawer-children_attributes",
        );
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
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "New Contact" }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "New Contact" }));

      await waitFor(() => {
        expect(screen.getByTestId("drawer-new_drawer")).toBeInTheDocument();
      });

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(within(drawer).getByTestId("relationship-picker-children_attributes")).getByRole("button", { name: /add/i }));

      // Wait for data to load in picker drawer
      await waitFor(() => {
        const pickerDrawer = screen.getByTestId(
          "relationship-picker-drawer-children_attributes",
        );
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
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "New Contact" }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "New Contact" }));

      await waitFor(() => {
        expect(screen.getByTestId("drawer-new_drawer")).toBeInTheDocument();
      });

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(within(drawer).getByTestId("relationship-picker-children_attributes")).getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(
          screen.getByTestId("relationship-picker-drawer-children_attributes"),
        ).toBeInTheDocument();
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
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "New Contact" }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "New Contact" }));

      await waitFor(() => {
        expect(screen.getByTestId("drawer-new_drawer")).toBeInTheDocument();
      });

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(within(drawer).getByTestId("relationship-picker-children_attributes")).getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(screen.getByText("Alice")).toBeInTheDocument();
      });

      // Select Alice
      const aliceRow = screen.getByText("Alice").closest("tr");
      await user.click(aliceRow!);

      // Confirm button should show count
      const pickerDrawer = screen.getByTestId(
        "relationship-picker-drawer-children_attributes",
      );
      expect(
        within(pickerDrawer).getByRole("button", { name: /confirm.*\(1\)/i }),
      ).toBeInTheDocument();
    });
  });

  describe("13.4 Selection Confirmation", () => {
    it("Confirm adds selected items and closes picker drawer", async () => {
      const user = userEvent.setup();
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "New Contact" }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "New Contact" }));

      await waitFor(() => {
        expect(screen.getByTestId("drawer-new_drawer")).toBeInTheDocument();
      });

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(within(drawer).getByTestId("relationship-picker-children_attributes")).getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(screen.getByText("Alice")).toBeInTheDocument();
      });

      // Select Alice
      const aliceRow = screen.getByText("Alice").closest("tr");
      await user.click(aliceRow!);

      // Click confirm
      const pickerDrawer = screen.getByTestId(
        "relationship-picker-drawer-children_attributes",
      );
      const confirmButton = within(pickerDrawer).getByRole("button", {
        name: /confirm/i,
      });
      await user.click(confirmButton);

      // Picker drawer should close
      await waitFor(() => {
        expect(
          screen.queryByTestId(
            "relationship-picker-drawer-children_attributes",
          ),
        ).not.toBeInTheDocument();
      });

      // Selected item should now appear in the field
      const picker = within(drawer).getByTestId(
        "relationship-picker-children_attributes",
      );
      expect(within(picker).getByText(/Alice/)).toBeInTheDocument();
    });

    it("Multiple selections can be confirmed (has_many)", async () => {
      const user = userEvent.setup();
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "New Contact" }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "New Contact" }));

      await waitFor(() => {
        expect(screen.getByTestId("drawer-new_drawer")).toBeInTheDocument();
      });

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(within(drawer).getByTestId("relationship-picker-children_attributes")).getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(screen.getByText("Alice")).toBeInTheDocument();
      });

      // Select Alice and Bob
      const aliceRow = screen.getByText("Alice").closest("tr");
      const bobRow = screen.getByText("Bob").closest("tr");
      await user.click(aliceRow!);
      await user.click(bobRow!);

      // Confirm button should show (2)
      const pickerDrawer = screen.getByTestId(
        "relationship-picker-drawer-children_attributes",
      );
      expect(
        within(pickerDrawer).getByRole("button", { name: /confirm.*\(2\)/i }),
      ).toBeInTheDocument();

      // Confirm
      await user.click(
        within(pickerDrawer).getByRole("button", { name: /confirm/i }),
      );

      // Both should appear
      await waitFor(() => {
        const picker = within(drawer).getByTestId(
          "relationship-picker-children_attributes",
        );
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
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "New Contact" }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "New Contact" }));

      await waitFor(() => {
        expect(screen.getByTestId("drawer-new_drawer")).toBeInTheDocument();
      });

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(within(drawer).getByTestId("relationship-picker-children_attributes")).getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(screen.getByText("Alice")).toBeInTheDocument();
      });

      // Select and confirm
      const aliceRow = screen.getByText("Alice").closest("tr");
      await user.click(aliceRow!);
      const pickerDrawer = screen.getByTestId(
        "relationship-picker-drawer-children_attributes",
      );
      await user.click(
        within(pickerDrawer).getByRole("button", { name: /confirm/i }),
      );

      // Wait for item to appear
      await waitFor(() => {
        const picker = within(drawer).getByTestId(
          "relationship-picker-children_attributes",
        );
        expect(within(picker).getByText(/Alice/)).toBeInTheDocument();
      });

      // Find and verify remove button exists
      const picker = within(drawer).getByTestId(
        "relationship-picker-children_attributes",
      );
      const itemContainer = within(picker).getByText(/Alice/).closest("div");
      const buttons = within(itemContainer!.parentElement!).getAllByRole(
        "button",
      );
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("Clicking remove removes item from display", async () => {
      const user = userEvent.setup();
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "New Contact" }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "New Contact" }));

      await waitFor(() => {
        expect(screen.getByTestId("drawer-new_drawer")).toBeInTheDocument();
      });

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(within(drawer).getByTestId("relationship-picker-children_attributes")).getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(screen.getByText("Alice")).toBeInTheDocument();
      });

      // Select and confirm
      const aliceRow = screen.getByText("Alice").closest("tr");
      await user.click(aliceRow!);
      const pickerDrawer = screen.getByTestId(
        "relationship-picker-drawer-children_attributes",
      );
      await user.click(
        within(pickerDrawer).getByRole("button", { name: /confirm/i }),
      );

      await waitFor(() => {
        const picker = within(drawer).getByTestId(
          "relationship-picker-children_attributes",
        );
        expect(within(picker).getByText(/Alice/)).toBeInTheDocument();
      });

      // Click remove (X button)
      const picker = within(drawer).getByTestId(
        "relationship-picker-children_attributes",
      );
      const itemRow = within(picker)
        .getByText(/Alice/)
        .closest("div")?.parentElement;
      const removeButton = within(itemRow!)
        .getAllByRole("button")
        .find((btn) => btn.querySelector("svg"));
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
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "New Contact" }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "New Contact" }));

      await waitFor(() => {
        expect(screen.getByTestId("drawer-new_drawer")).toBeInTheDocument();
      });

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(within(drawer).getByTestId("relationship-picker-children_attributes")).getByRole("button", { name: /add/i }));

      await waitFor(() => {
        const pickerDrawer = screen.getByTestId(
          "relationship-picker-drawer-children_attributes",
        );
        expect(
          within(pickerDrawer).getByRole("button", { name: /create.*new/i }),
        ).toBeInTheDocument();
      });
    });

    it("Click Create New opens create drawer", async () => {
      const user = userEvent.setup();
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "New Contact" }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "New Contact" }));

      await waitFor(() => {
        expect(screen.getByTestId("drawer-new_drawer")).toBeInTheDocument();
      });

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(within(drawer).getByTestId("relationship-picker-children_attributes")).getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(
          screen.getByTestId("relationship-picker-drawer-children_attributes"),
        ).toBeInTheDocument();
      });

      const pickerDrawer = screen.getByTestId(
        "relationship-picker-drawer-children_attributes",
      );
      await user.click(
        within(pickerDrawer).getByRole("button", { name: /create.*new/i }),
      );

      // Create drawer should open
      await waitFor(() => {
        expect(
          screen.getByTestId("relationship-create-drawer-children_attributes"),
        ).toBeInTheDocument();
      });
    });

    it("Create drawer allows typing in form fields", async () => {
      const user = userEvent.setup();
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "New Contact" }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "New Contact" }));

      await waitFor(() => {
        expect(screen.getByTestId("drawer-new_drawer")).toBeInTheDocument();
      });

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(within(drawer).getByTestId("relationship-picker-children_attributes")).getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(
          screen.getByTestId("relationship-picker-drawer-children_attributes"),
        ).toBeInTheDocument();
      });

      const pickerDrawer = screen.getByTestId(
        "relationship-picker-drawer-children_attributes",
      );
      await user.click(
        within(pickerDrawer).getByRole("button", { name: /create.*new/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByTestId("relationship-create-drawer-children_attributes"),
        ).toBeInTheDocument();
      });

      const createDrawer = screen.getByTestId(
        "relationship-create-drawer-children_attributes",
      );

      // Find inputs by name attribute within the create drawer form
      const inputs = within(createDrawer).getAllByRole("textbox");
      const firstNameInput = inputs.find(
        (input) => input.getAttribute("name") === "first_name",
      )!;
      const lastNameInput = inputs.find(
        (input) => input.getAttribute("name") === "last_name",
      )!;

      await user.type(firstNameInput, "David");
      expect(firstNameInput).toHaveValue("David");

      await user.type(lastNameInput, "Miller");
      expect(lastNameInput).toHaveValue("Miller");
    });

    it("Submitting create form adds new item to picker", async () => {
      const user = userEvent.setup();
      const mockFetch = vi
        .fn()
        .mockImplementation((url: string, options?: RequestInit) => {
          // Table data (no query params, no method = GET)
          if (
            url.includes("/api/v1/workspaces/contacts") &&
            !url.includes("?") &&
            !options?.method
          ) {
            return Promise.resolve({ data: mockData.items });
          }
          // Relationship picker data (GET with query params)
          if (
            url.includes("/api/v1/workspaces/contacts") &&
            url.includes("?") &&
            (!options?.method || options.method === "GET")
          ) {
            return Promise.resolve(mockRelatedContacts);
          }
          // POST to create new item
          if (
            url.includes("/api/v1/workspaces/contacts") &&
            options?.method === "POST"
          ) {
            const body = JSON.parse(options.body as string);
            // Response structure: { data: { id, data }, meta }
            return Promise.resolve({
              data: { id: 999, data: body.data },
              meta: { created: true },
            });
          }
          return Promise.resolve({ data: [] });
        });
      const services = createMockServices({ fetch: mockFetch });

      render(
        <TestWrapper services={services}>
          <DynamicRenderer schema={contactsIndexSchema as never} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "New Contact" }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "New Contact" }));

      await waitFor(() => {
        expect(screen.getByTestId("drawer-new_drawer")).toBeInTheDocument();
      });

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(within(drawer).getByTestId("relationship-picker-children_attributes")).getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(
          screen.getByTestId("relationship-picker-drawer-children_attributes"),
        ).toBeInTheDocument();
      });

      const pickerDrawer = screen.getByTestId(
        "relationship-picker-drawer-children_attributes",
      );
      await user.click(
        within(pickerDrawer).getByRole("button", { name: /create.*new/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByTestId("relationship-create-drawer-children_attributes"),
        ).toBeInTheDocument();
      });

      const createDrawer = screen.getByTestId(
        "relationship-create-drawer-children_attributes",
      );

      // Fill the form - find inputs by name attribute
      const inputs = within(createDrawer).getAllByRole("textbox");
      const firstNameInput = inputs.find(
        (input) => input.getAttribute("name") === "first_name",
      )!;
      const lastNameInput = inputs.find(
        (input) => input.getAttribute("name") === "last_name",
      )!;
      await user.type(firstNameInput, "David");
      await user.type(lastNameInput, "Miller");

      // Submit the form
      const submitButton = within(createDrawer).getByRole("button", {
        name: /add/i,
      });
      await user.click(submitButton);

      // Create drawer should close, back to picker drawer
      await waitFor(() => {
        expect(
          screen.queryByTestId(
            "relationship-create-drawer-children_attributes",
          ),
        ).not.toBeInTheDocument();
      });

      // The item is auto-selected in picker drawer, confirm button should show (1)
      const pickerDrawerAfterCreate = screen.getByTestId(
        "relationship-picker-drawer-children_attributes",
      );
      await waitFor(() => {
        expect(
          within(pickerDrawerAfterCreate).getByRole("button", {
            name: /confirm.*\(1\)/i,
          }),
        ).toBeInTheDocument();
      });

      // Click confirm to add to picker field
      await user.click(
        within(pickerDrawerAfterCreate).getByRole("button", {
          name: /confirm/i,
        }),
      );

      // Picker drawer should close
      await waitFor(() => {
        expect(
          screen.queryByTestId(
            "relationship-picker-drawer-children_attributes",
          ),
        ).not.toBeInTheDocument();
      });

      // New item should appear in picker field
      const picker = within(drawer).getByTestId(
        "relationship-picker-children_attributes",
      );
      await waitFor(() => {
        expect(within(picker).getByText(/David/)).toBeInTheDocument();
        expect(within(picker).getByText(/Miller/)).toBeInTheDocument();
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
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "New Contact" }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "New Contact" }));

      await waitFor(() => {
        expect(screen.getByTestId("drawer-new_drawer")).toBeInTheDocument();
      });

      const drawer = screen.getByTestId("drawer-new_drawer");
      await user.click(within(within(drawer).getByTestId("relationship-picker-children_attributes")).getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(
          screen.getByTestId("relationship-picker-drawer-children_attributes"),
        ).toBeInTheDocument();
      });

      // Select something but then cancel
      await waitFor(() => {
        expect(screen.getByText("Alice")).toBeInTheDocument();
      });
      const aliceRow = screen.getByText("Alice").closest("tr");
      await user.click(aliceRow!);

      // Click cancel
      const pickerDrawer = screen.getByTestId(
        "relationship-picker-drawer-children_attributes",
      );
      await user.click(
        within(pickerDrawer).getByRole("button", { name: /cancel/i }),
      );

      // Drawer should close
      await waitFor(() => {
        expect(
          screen.queryByTestId(
            "relationship-picker-drawer-children_attributes",
          ),
        ).not.toBeInTheDocument();
      });

      // No item should be added
      const picker = within(drawer).getByTestId(
        "relationship-picker-children_attributes",
      );
      expect(within(picker).queryByText(/Alice/)).not.toBeInTheDocument();
    });
  });
});
