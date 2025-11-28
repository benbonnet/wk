import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/provider";
import { TooltipProvider } from "@ui-components/ui/tooltip";
import { VIEW, TABLE } from "@ui/adapters/layouts";
import type { UIServices, ComponentRegistry } from "@ui/registry";
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

const mockComponents: ComponentRegistry = {
  VIEW,
  TABLE,
} as ComponentRegistry;

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

describe("Phase 8: TABLE Adapter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("8.1 Table Structure", () => {
    it("renders column headers from schema", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{
                type: "TABLE",
                columns: [
                  { name: "first_name", label: "First Name" },
                  { name: "last_name", label: "Last Name" },
                  { name: "email", label: "Email" },
                ],
              }}
              data={mockData}
            />
          </VIEW>
        </TestWrapper>
      );

      expect(screen.getByText("First Name")).toBeInTheDocument();
      expect(screen.getByText("Last Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
    });

    it("translates column labels", () => {
      render(
        <TestWrapper translations={{ first_name: "Prénom", last_name: "Nom" }}>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{
                type: "TABLE",
                columns: [
                  { name: "first_name", label: "first_name" },
                  { name: "last_name", label: "last_name" },
                ],
              }}
              data={mockData}
            />
          </VIEW>
        </TestWrapper>
      );

      expect(screen.getByText("Prénom")).toBeInTheDocument();
      expect(screen.getByText("Nom")).toBeInTheDocument();
    });

    it("renders sortable column with sort button", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{
                type: "TABLE",
                columns: [{ name: "first_name", label: "First Name", sortable: true }],
              }}
              data={mockData}
            />
          </VIEW>
        </TestWrapper>
      );

      // Sortable columns are rendered as buttons
      expect(screen.getByRole("button", { name: /First Name/i })).toBeInTheDocument();
    });

    it("renders non-sortable column as plain text", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{
                type: "TABLE",
                columns: [{ name: "email", label: "Email", sortable: false }],
              }}
              data={mockData}
            />
          </VIEW>
        </TestWrapper>
      );

      // Non-sortable columns are just spans
      expect(screen.queryByRole("button", { name: /Email/i })).not.toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
    });
  });

  describe("8.2 Table Data", () => {
    it("renders rows from data prop", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{
                type: "TABLE",
                columns: [{ name: "first_name", label: "First Name" }],
              }}
              data={mockData}
            />
          </VIEW>
        </TestWrapper>
      );

      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Jane")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    it("renders cell values", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{
                type: "TABLE",
                columns: [
                  { name: "first_name", label: "First Name" },
                  { name: "email", label: "Email" },
                ],
              }}
              data={mockData}
            />
          </VIEW>
        </TestWrapper>
      );

      expect(screen.getByText("john@example.com")).toBeInTheDocument();
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    });

    it("renders empty state when no data", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{
                type: "TABLE",
                columns: [{ name: "first_name", label: "First Name" }],
              }}
              data={[]}
            />
          </VIEW>
        </TestWrapper>
      );

      expect(screen.getByText("No results.")).toBeInTheDocument();
    });

    it("renders — for null values", () => {
      const dataWithNull = [{ id: 1, first_name: null, email: "test@test.com" }];

      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{
                type: "TABLE",
                columns: [{ name: "first_name", label: "First Name" }],
              }}
              data={dataWithNull}
            />
          </VIEW>
        </TestWrapper>
      );

      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  describe("8.3 Table Selection", () => {
    it("renders checkbox column when selectable=true", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{ type: "TABLE", columns: [{ name: "first_name" }] }}
              data={mockData}
              selectable
            />
          </VIEW>
        </TestWrapper>
      );

      // Header checkbox + 3 row checkboxes
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes.length).toBe(4);
    });

    it("header checkbox selects all rows", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{ type: "TABLE", columns: [{ name: "first_name" }] }}
              data={mockData}
              selectable
            />
          </VIEW>
        </TestWrapper>
      );

      const headerCheckbox = screen.getByLabelText("Select all");
      await user.click(headerCheckbox);

      const rowCheckboxes = screen.getAllByLabelText("Select row");
      rowCheckboxes.forEach((checkbox) => {
        expect(checkbox).toBeChecked();
      });
    });

    it("row checkbox selects single row", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{ type: "TABLE", columns: [{ name: "first_name" }] }}
              data={mockData}
              selectable
            />
          </VIEW>
        </TestWrapper>
      );

      const rowCheckboxes = screen.getAllByLabelText("Select row");
      await user.click(rowCheckboxes[0]);

      expect(rowCheckboxes[0]).toBeChecked();
      expect(rowCheckboxes[1]).not.toBeChecked();
      expect(rowCheckboxes[2]).not.toBeChecked();
    });

    it("tracks selected row count", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{ type: "TABLE", columns: [{ name: "first_name" }] }}
              data={mockData}
              selectable
            />
          </VIEW>
        </TestWrapper>
      );

      const rowCheckboxes = screen.getAllByLabelText("Select row");
      await user.click(rowCheckboxes[0]);
      await user.click(rowCheckboxes[1]);

      expect(screen.getByText(/2 of 3 row\(s\) selected/)).toBeInTheDocument();
    });
  });

  describe("8.4 Table Search", () => {
    it("renders search input when searchable=true", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{ type: "TABLE", columns: [{ name: "first_name" }] }}
              data={mockData}
              searchable
            />
          </VIEW>
        </TestWrapper>
      );

      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });

    it("filters rows on search input", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{ type: "TABLE", columns: [{ name: "first_name" }] }}
              data={mockData}
              searchable
            />
          </VIEW>
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText("Search...");
      await user.type(searchInput, "Jane");

      await waitFor(() => {
        expect(screen.getByText("Jane")).toBeInTheDocument();
        expect(screen.queryByText("John")).not.toBeInTheDocument();
        expect(screen.queryByText("Bob")).not.toBeInTheDocument();
      });
    });

    it("shows search placeholder from schema", () => {
      render(
        <TestWrapper translations={{ search_contacts: "Search contacts..." }}>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{
                type: "TABLE",
                columns: [{ name: "first_name" }],
                search_placeholder: "search_contacts",
              }}
              data={mockData}
              searchable
            />
          </VIEW>
        </TestWrapper>
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
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{ type: "TABLE", columns: [{ name: "first_name" }] }}
              data={manyRows}
              pageSize={10}
            />
          </VIEW>
        </TestWrapper>
      );

      // Should only show first 10 rows
      expect(screen.getByText("User1")).toBeInTheDocument();
      expect(screen.getByText("User10")).toBeInTheDocument();
      expect(screen.queryByText("User11")).not.toBeInTheDocument();
    });

    it("shows page count", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{ type: "TABLE", columns: [{ name: "first_name" }] }}
              data={manyRows}
              pageSize={10}
            />
          </VIEW>
        </TestWrapper>
      );

      expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    });

    it("Previous button disabled on first page", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{ type: "TABLE", columns: [{ name: "first_name" }] }}
              data={manyRows}
              pageSize={10}
            />
          </VIEW>
        </TestWrapper>
      );

      expect(screen.getByRole("button", { name: /Previous/i })).toBeDisabled();
    });

    it("Next button disabled on last page", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{ type: "TABLE", columns: [{ name: "first_name" }] }}
              data={manyRows}
              pageSize={10}
            />
          </VIEW>
        </TestWrapper>
      );

      // Go to last page
      await user.click(screen.getByRole("button", { name: /Next/i }));
      await user.click(screen.getByRole("button", { name: /Next/i }));

      expect(screen.getByRole("button", { name: /Next/i })).toBeDisabled();
    });

    it("navigates pages on button click", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{ type: "TABLE", columns: [{ name: "first_name" }] }}
              data={manyRows}
              pageSize={10}
            />
          </VIEW>
        </TestWrapper>
      );

      await user.click(screen.getByRole("button", { name: /Next/i }));

      expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
      expect(screen.getByText("User11")).toBeInTheDocument();
      expect(screen.queryByText("User1")).not.toBeInTheDocument();
    });
  });

  describe("8.6 Table Sorting", () => {
    it("sorts ascending on column header click", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{
                type: "TABLE",
                columns: [{ name: "first_name", label: "First Name", sortable: true }],
              }}
              data={mockData}
            />
          </VIEW>
        </TestWrapper>
      );

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

      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{
                type: "TABLE",
                columns: [{ name: "first_name", label: "First Name", sortable: true }],
              }}
              data={mockData}
            />
          </VIEW>
        </TestWrapper>
      );

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

      render(
        <TestWrapper>
          <VIEW
            schema={{
              type: "VIEW",
              drawers: {
                view_drawer: { title: "View Contact", elements: [] },
              },
            }}
          >
            <TABLE
              schema={{
                type: "TABLE",
                columns: [{ name: "first_name" }],
              }}
              data={mockData}
              rowClick={{ opens: "view_drawer" }}
            />
          </VIEW>
        </TestWrapper>
      );

      const row = screen.getByText("John").closest("tr");
      await user.click(row!);

      expect(screen.getByTestId("drawer-view_drawer")).toBeInTheDocument();
    });

    it("calls onRowClick callback when provided", async () => {
      const user = userEvent.setup();
      const handleRowClick = vi.fn();

      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <TABLE
              schema={{
                type: "TABLE",
                columns: [{ name: "first_name" }],
              }}
              data={mockData}
              onRowClick={handleRowClick}
            />
          </VIEW>
        </TestWrapper>
      );

      const row = screen.getByText("John").closest("tr");
      await user.click(row!);

      expect(handleRowClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, first_name: "John" })
      );
    });
  });
});
