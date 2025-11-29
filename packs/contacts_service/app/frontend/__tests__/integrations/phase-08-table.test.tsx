import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/provider";
import { DynamicRenderer } from "@ui/renderer";
import { TooltipProvider } from "@ui-components/tooltip";
import type { UIServices } from "@ui/registry";
import type { UISchema } from "@ui/types";
import type { ReactNode } from "react";

const mockData = [
  { id: 1, first_name: "John", last_name: "Doe", email: "john@example.com", age: 30 },
  { id: 2, first_name: "Jane", last_name: "Smith", email: "jane@example.com", age: 25 },
  { id: 3, first_name: "Bob", last_name: "Johnson", email: "bob@example.com", age: 35 },
];

function createMockServices(overrides?: Partial<UIServices>): UIServices {
  return {
    fetch: vi.fn().mockResolvedValue({ data: mockData }),
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
  options?: { services?: UIServices; translations?: Record<string, string> }
) {
  const services = options?.services ?? createMockServices();
  return render(
    <TestWrapper services={services} translations={options?.translations}>
      <DynamicRenderer schema={schema} />
    </TestWrapper>
  );
}

describe("Phase 8: TABLE Adapter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("8.1 Table Structure", () => {
    it("renders column headers from schema", () => {
      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "TABLE",
            columns: [
              { name: "first_name", label: "First Name" },
              { name: "last_name", label: "Last Name" },
              { name: "email", label: "Email" },
            ],
            data: mockData,
          },
        ],
      });

      expect(screen.getByText("First Name")).toBeInTheDocument();
      expect(screen.getByText("Last Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
    });

    it("translates column labels", () => {
      renderSchema(
        {
          type: "VIEW",
          elements: [
            {
              type: "TABLE",
              columns: [
                { name: "first_name", label: "first_name" },
                { name: "last_name", label: "last_name" },
              ],
              data: mockData,
            },
          ],
        },
        { translations: { first_name: "Prénom", last_name: "Nom" } }
      );

      expect(screen.getByText("Prénom")).toBeInTheDocument();
      expect(screen.getByText("Nom")).toBeInTheDocument();
    });

    it("renders sortable column with sort button", () => {
      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "TABLE",
            columns: [{ name: "first_name", label: "First Name", sortable: true }],
            data: mockData,
          },
        ],
      });

      // Sortable columns are rendered as buttons
      expect(screen.getByRole("button", { name: /First Name/i })).toBeInTheDocument();
    });

    it("renders non-sortable column as plain text", () => {
      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "TABLE",
            columns: [{ name: "email", label: "Email", sortable: false }],
            data: mockData,
          },
        ],
      });

      // Non-sortable columns are just spans
      expect(screen.queryByRole("button", { name: /Email/i })).not.toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
    });
  });

  describe("8.2 Table Data", () => {
    it("renders rows from data prop", () => {
      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "TABLE",
            columns: [{ name: "first_name", label: "First Name" }],
            data: mockData,
          },
        ],
      });

      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Jane")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    it("renders cell values", () => {
      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "TABLE",
            columns: [
              { name: "first_name", label: "First Name" },
              { name: "email", label: "Email" },
            ],
            data: mockData,
          },
        ],
      });

      expect(screen.getByText("john@example.com")).toBeInTheDocument();
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    });

    it("renders empty state when no data", () => {
      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "TABLE",
            columns: [{ name: "first_name", label: "First Name" }],
            data: [],
          },
        ],
      });

      expect(screen.getByText("No results.")).toBeInTheDocument();
    });

    it("renders — for null values", () => {
      const dataWithNull = [{ id: 1, first_name: null, email: "test@test.com" }];

      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "TABLE",
            columns: [{ name: "first_name", label: "First Name" }],
            data: dataWithNull,
          },
        ],
      });

      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  describe("8.3 Table Selection", () => {
    it("renders checkbox column when selectable=true", () => {
      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "TABLE",
            columns: [{ name: "first_name" }],
            data: mockData,
            selectable: true,
          },
        ],
      });

      // Header checkbox + 3 row checkboxes
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes.length).toBe(4);
    });

    it("header checkbox selects all rows", async () => {
      const user = userEvent.setup();

      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "TABLE",
            columns: [{ name: "first_name" }],
            data: mockData,
            selectable: true,
          },
        ],
      });

      const headerCheckbox = screen.getByLabelText("Select all");
      await user.click(headerCheckbox);

      const rowCheckboxes = screen.getAllByLabelText("Select row");
      rowCheckboxes.forEach((checkbox) => {
        expect(checkbox).toBeChecked();
      });
    });

    it("row checkbox selects single row", async () => {
      const user = userEvent.setup();

      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "TABLE",
            columns: [{ name: "first_name" }],
            data: mockData,
            selectable: true,
          },
        ],
      });

      const rowCheckboxes = screen.getAllByLabelText("Select row");
      await user.click(rowCheckboxes[0]);

      expect(rowCheckboxes[0]).toBeChecked();
      expect(rowCheckboxes[1]).not.toBeChecked();
      expect(rowCheckboxes[2]).not.toBeChecked();
    });

    it("tracks selected row count", async () => {
      const user = userEvent.setup();

      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "TABLE",
            columns: [{ name: "first_name" }],
            data: mockData,
            selectable: true,
          },
        ],
      });

      const rowCheckboxes = screen.getAllByLabelText("Select row");
      await user.click(rowCheckboxes[0]);
      await user.click(rowCheckboxes[1]);

      expect(screen.getByText(/2 of 3 row\(s\) selected/)).toBeInTheDocument();
    });
  });

  describe("8.4 Table Search", () => {
    it("renders search input when searchable=true", () => {
      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "TABLE",
            columns: [{ name: "first_name" }],
            data: mockData,
            searchable: true,
          },
        ],
      });

      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });

    it("filters rows on search input", async () => {
      const user = userEvent.setup();

      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "TABLE",
            columns: [{ name: "first_name" }],
            data: mockData,
            searchable: true,
          },
        ],
      });

      const searchInput = screen.getByPlaceholderText("Search...");
      await user.type(searchInput, "Jane");

      await waitFor(() => {
        expect(screen.getByText("Jane")).toBeInTheDocument();
        expect(screen.queryByText("John")).not.toBeInTheDocument();
        expect(screen.queryByText("Bob")).not.toBeInTheDocument();
      });
    });

    it("shows search placeholder from schema", () => {
      renderSchema(
        {
          type: "VIEW",
          elements: [
            {
              type: "TABLE",
              columns: [{ name: "first_name" }],
              data: mockData,
              searchable: true,
              search_placeholder: "search_contacts",
            },
          ],
        },
        { translations: { search_contacts: "Search contacts..." } }
      );

      expect(screen.getByPlaceholderText("Search contacts...")).toBeInTheDocument();
    });
  });

  describe("8.5 Table Pagination", () => {
    const manyRows = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      first_name: `User${i + 1}`,
    }));

    it("paginates based on pageSize", () => {
      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "TABLE",
            columns: [{ name: "first_name" }],
            data: manyRows,
            pageSize: 10,
          },
        ],
      });

      // Should only show first 10 rows
      expect(screen.getByText("User1")).toBeInTheDocument();
      expect(screen.getByText("User10")).toBeInTheDocument();
      expect(screen.queryByText("User11")).not.toBeInTheDocument();
    });

    it("shows page count", () => {
      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "TABLE",
            columns: [{ name: "first_name" }],
            data: manyRows,
            pageSize: 10,
          },
        ],
      });

      expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    });

    it("Previous button disabled on first page", () => {
      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "TABLE",
            columns: [{ name: "first_name" }],
            data: manyRows,
            pageSize: 10,
          },
        ],
      });

      expect(screen.getByRole("button", { name: /Previous/i })).toBeDisabled();
    });

    it("Next button disabled on last page", async () => {
      const user = userEvent.setup();

      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "TABLE",
            columns: [{ name: "first_name" }],
            data: manyRows,
            pageSize: 10,
          },
        ],
      });

      // Go to last page
      await user.click(screen.getByRole("button", { name: /Next/i }));
      await user.click(screen.getByRole("button", { name: /Next/i }));

      expect(screen.getByRole("button", { name: /Next/i })).toBeDisabled();
    });

    it("navigates pages on button click", async () => {
      const user = userEvent.setup();

      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "TABLE",
            columns: [{ name: "first_name" }],
            data: manyRows,
            pageSize: 10,
          },
        ],
      });

      await user.click(screen.getByRole("button", { name: /Next/i }));

      expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
      expect(screen.getByText("User11")).toBeInTheDocument();
      expect(screen.queryByText("User1")).not.toBeInTheDocument();
    });
  });

  describe("8.6 Table Sorting", () => {
    it("sorts ascending on column header click", async () => {
      const user = userEvent.setup();

      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "TABLE",
            columns: [{ name: "first_name", label: "First Name", sortable: true }],
            data: mockData,
          },
        ],
      });

      await user.click(screen.getByRole("button", { name: /First Name/i }));

      // After first click, should sort ascending (Bob, Jane, John)
      const cells = screen.getAllByRole("cell");
      const firstNameCells = cells.filter(
        (cell) => cell.textContent === "Bob" || cell.textContent === "Jane" || cell.textContent === "John"
      );
      expect(firstNameCells[0]).toHaveTextContent("Bob");
    });

    it("sorts descending on second click", async () => {
      const user = userEvent.setup();

      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "TABLE",
            columns: [{ name: "first_name", label: "First Name", sortable: true }],
            data: mockData,
          },
        ],
      });

      const sortButton = screen.getByRole("button", { name: /First Name/i });
      await user.click(sortButton);
      await user.click(sortButton);

      // After second click, should sort descending (John, Jane, Bob)
      const cells = screen.getAllByRole("cell");
      const firstNameCells = cells.filter(
        (cell) => cell.textContent === "Bob" || cell.textContent === "Jane" || cell.textContent === "John"
      );
      expect(firstNameCells[0]).toHaveTextContent("John");
    });
  });

  describe("8.7 Row Click", () => {
    it("opens drawer on row click when rowClick.opens is set", async () => {
      const user = userEvent.setup();

      renderSchema({
        type: "VIEW",
        drawers: {
          view_drawer: { title: "View Contact", elements: [] },
        },
        elements: [
          {
            type: "TABLE",
            columns: [{ name: "first_name" }],
            data: mockData,
            rowClick: { opens: "view_drawer" },
          },
        ],
      });

      const row = screen.getByText("John").closest("tr");
      await user.click(row!);

      expect(screen.getByTestId("drawer-view_drawer")).toBeInTheDocument();
    });

    it("calls onRowClick callback when provided", async () => {
      // Note: onRowClick is a runtime callback, not part of the schema
      // Testing via schema click behavior that opens drawer
      const user = userEvent.setup();
      const mockNavigate = vi.fn();
      const services = createMockServices({ navigate: mockNavigate });

      renderSchema(
        {
          type: "VIEW",
          elements: [
            {
              type: "TABLE",
              columns: [{ name: "first_name" }],
              data: mockData,
              rowClick: { href: "/contacts/:id" },
            },
          ],
        },
        { services }
      );

      const row = screen.getByText("John").closest("tr");
      await user.click(row!);

      expect(mockNavigate).toHaveBeenCalledWith("/contacts/1");
    });
  });
});
