import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RelationshipPickerField } from "../field";
import { UIProvider } from "@ui/lib";
import { ViewContext } from "../../view";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const mockServices = {
  fetch: vi.fn(),
  navigate: vi.fn(),
  toast: vi.fn(),
  confirm: vi.fn(),
};

const mockViewConfig = {
  url: "/api/v1/workspaces/rib_requests",
  api: {},
  executeApi: vi.fn(),
};

const defaultProps = {
  name: "contacts_attributes",
  cardinality: "many" as const,
  relationSchema: "contact",
  columns: [
    { name: "name", kind: "DISPLAY_TEXT", label: "Name" },
    { name: "email", kind: "DISPLAY_TEXT", label: "Email" },
  ],
  template: [],
  value: [],
  onChange: vi.fn(),
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <UIProvider services={mockServices} locale="en">
      <ViewContext.Provider value={mockViewConfig}>
        {children}
      </ViewContext.Provider>
    </UIProvider>
  </QueryClientProvider>
);

describe("RelationshipPickerField", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("empty state", () => {
    it("renders empty message when no items", () => {
      render(<RelationshipPickerField {...defaultProps} />, { wrapper });
      expect(screen.getByText("no_selection")).toBeInTheDocument();
    });

    it("renders add button in empty state", () => {
      render(<RelationshipPickerField {...defaultProps} />, { wrapper });
      expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    });

    it("shows custom empty message", () => {
      render(
        <RelationshipPickerField
          {...defaultProps}
          emptyMessage="no_contacts_selected"
        />,
        { wrapper }
      );
      expect(screen.getByText("no_contacts_selected")).toBeInTheDocument();
    });
  });

  describe("with items", () => {
    it("displays selected items", () => {
      const items = [
        { id: 1, name: "John", email: "john@test.com" },
        { id: 2, name: "Jane", email: "jane@test.com" },
      ];
      render(
        <RelationshipPickerField {...defaultProps} value={items} />,
        { wrapper }
      );
      expect(screen.getByText("John - john@test.com")).toBeInTheDocument();
      expect(screen.getByText("Jane - jane@test.com")).toBeInTheDocument();
    });

    it("shows remove button for each item", () => {
      const items = [{ id: 1, name: "John", email: "john@test.com" }];
      render(
        <RelationshipPickerField {...defaultProps} value={items} />,
        { wrapper }
      );
      const removeButtons = screen.getAllByRole("button");
      // One remove button + one add button
      expect(removeButtons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("has_one cardinality", () => {
    it("disables add button when item exists", () => {
      const item = { id: 1, name: "John", email: "john@test.com" };
      render(
        <RelationshipPickerField
          {...defaultProps}
          cardinality="one"
          value={item}
        />,
        { wrapper }
      );
      const addButton = screen.getByRole("button", { name: /add/i });
      expect(addButton).toBeDisabled();
    });

    it("enables add button when no item", () => {
      render(
        <RelationshipPickerField
          {...defaultProps}
          cardinality="one"
          value={null}
        />,
        { wrapper }
      );
      const addButton = screen.getByRole("button", { name: /add/i });
      expect(addButton).not.toBeDisabled();
    });
  });

  describe("has_many cardinality", () => {
    it("always enables add button", () => {
      const items = [{ id: 1, name: "John", email: "john@test.com" }];
      render(
        <RelationshipPickerField {...defaultProps} value={items} />,
        { wrapper }
      );
      const addButton = screen.getByRole("button", { name: /add/i });
      expect(addButton).not.toBeDisabled();
    });
  });

  describe("removal behavior", () => {
    it("marks existing items with _destroy", () => {
      const onChange = vi.fn();
      const items = [{ id: 1, name: "John", email: "john@test.com" }];
      render(
        <RelationshipPickerField
          {...defaultProps}
          value={items}
          onChange={onChange}
        />,
        { wrapper }
      );

      // Find and click the remove button (X icon button)
      const removeButton = screen.getAllByRole("button").find(
        (btn) => btn.querySelector("svg")
      );
      if (removeButton) {
        fireEvent.click(removeButton);
      }

      expect(onChange).toHaveBeenCalledWith([
        expect.objectContaining({ id: 1, _destroy: 1 }),
      ]);
    });

    it("removes new items entirely (no id)", () => {
      const onChange = vi.fn();
      const items = [{ name: "New Item", email: "new@test.com" }];
      render(
        <RelationshipPickerField
          {...defaultProps}
          value={items}
          onChange={onChange}
        />,
        { wrapper }
      );

      const removeButton = screen.getAllByRole("button").find(
        (btn) => btn.querySelector("svg")
      );
      if (removeButton) {
        fireEvent.click(removeButton);
      }

      expect(onChange).toHaveBeenCalledWith([]);
    });
  });

  describe("destroyed items", () => {
    it("hides items with _destroy flag", () => {
      const items = [
        { id: 1, name: "Visible", email: "visible@test.com" },
        { id: 2, name: "Hidden", email: "hidden@test.com", _destroy: 1 },
      ];
      render(
        <RelationshipPickerField {...defaultProps} value={items} />,
        { wrapper }
      );

      expect(screen.getByText("Visible - visible@test.com")).toBeInTheDocument();
      expect(screen.queryByText("Hidden - hidden@test.com")).not.toBeInTheDocument();
    });
  });

  describe("label", () => {
    it("renders label when provided", () => {
      render(
        <RelationshipPickerField {...defaultProps} label="contacts" />,
        { wrapper }
      );
      expect(screen.getByText("contacts")).toBeInTheDocument();
    });
  });
});
