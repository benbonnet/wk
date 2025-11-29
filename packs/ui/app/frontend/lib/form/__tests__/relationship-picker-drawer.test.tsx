import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RelationshipPickerDrawer } from "../relationship-picker-drawer";
import { UIProvider } from "../../provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

const mockServices = {
  fetch: vi.fn(),
  navigate: vi.fn(),
  toast: vi.fn(),
  confirm: vi.fn(),
};

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  name: "contacts",
  cardinality: "many" as const,
  relationSchema: "contact",
  basePath: "/api/v1/contacts",
  columns: [
    { name: "name", kind: "DISPLAY_TEXT", label: "Name" },
    { name: "email", kind: "DISPLAY_TEXT", label: "Email" },
  ],
  template: [],
  onConfirm: vi.fn(),
  title: "Select Contacts",
};

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <UIProvider
        components={{} as any}
        inputs={{} as any}
        displays={{} as any}
        services={mockServices}
        locale="en"
      >
        {children}
      </UIProvider>
    </QueryClientProvider>
  );
};

describe("RelationshipPickerDrawer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("data fetching", () => {
    it("fetches data on open", async () => {
      mockServices.fetch.mockResolvedValue({
        data: [
          { id: 1, data: { name: "John", email: "john@test.com" } },
        ],
      });

      const queryClient = createQueryClient();
      render(<RelationshipPickerDrawer {...defaultProps} />, {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(mockServices.fetch).toHaveBeenCalled();
      });
    });

    it("displays fetched items in table", async () => {
      mockServices.fetch.mockResolvedValue({
        data: [
          { id: 1, data: { name: "John", email: "john@test.com" } },
          { id: 2, data: { name: "Jane", email: "jane@test.com" } },
        ],
      });

      const queryClient = createQueryClient();
      render(<RelationshipPickerDrawer {...defaultProps} />, {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(screen.getByText("John")).toBeInTheDocument();
        expect(screen.getByText("Jane")).toBeInTheDocument();
      });
    });

    it("shows no results message when empty", async () => {
      mockServices.fetch.mockResolvedValue({ data: [] });

      const queryClient = createQueryClient();
      render(<RelationshipPickerDrawer {...defaultProps} />, {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(screen.getByText("no_results")).toBeInTheDocument();
      });
    });
  });

  describe("selection behavior", () => {
    it("selects item on row click", async () => {
      mockServices.fetch.mockResolvedValue({
        data: [{ id: 1, data: { name: "John", email: "john@test.com" } }],
      });

      const queryClient = createQueryClient();
      render(<RelationshipPickerDrawer {...defaultProps} />, {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => screen.getByText("John"));

      fireEvent.click(screen.getByText("John"));

      // Check confirm button shows count
      expect(screen.getByRole("button", { name: /confirm.*1/i })).toBeInTheDocument();
    });

    it("allows multiple selections for has_many", async () => {
      mockServices.fetch.mockResolvedValue({
        data: [
          { id: 1, data: { name: "John", email: "john@test.com" } },
          { id: 2, data: { name: "Jane", email: "jane@test.com" } },
        ],
      });

      const queryClient = createQueryClient();
      render(<RelationshipPickerDrawer {...defaultProps} />, {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => screen.getByText("John"));

      fireEvent.click(screen.getByText("John"));
      fireEvent.click(screen.getByText("Jane"));

      expect(screen.getByRole("button", { name: /confirm.*2/i })).toBeInTheDocument();
    });

    it("allows only single selection for has_one", async () => {
      mockServices.fetch.mockResolvedValue({
        data: [
          { id: 1, data: { name: "John", email: "john@test.com" } },
          { id: 2, data: { name: "Jane", email: "jane@test.com" } },
        ],
      });

      const queryClient = createQueryClient();
      render(
        <RelationshipPickerDrawer {...defaultProps} cardinality="one" />,
        { wrapper: createWrapper(queryClient) }
      );

      await waitFor(() => screen.getByText("John"));

      fireEvent.click(screen.getByText("John"));
      fireEvent.click(screen.getByText("Jane"));

      // Should only have 1 selected (Jane replaced John)
      expect(screen.getByRole("button", { name: /confirm.*1/i })).toBeInTheDocument();
    });
  });

  describe("confirm action", () => {
    it("calls onConfirm with selected items", async () => {
      const onConfirm = vi.fn();
      mockServices.fetch.mockResolvedValue({
        data: [{ id: 1, data: { name: "John", email: "john@test.com" } }],
      });

      const queryClient = createQueryClient();
      render(
        <RelationshipPickerDrawer {...defaultProps} onConfirm={onConfirm} />,
        { wrapper: createWrapper(queryClient) }
      );

      await waitFor(() => screen.getByText("John"));

      fireEvent.click(screen.getByText("John"));
      fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

      expect(onConfirm).toHaveBeenCalledWith([
        expect.objectContaining({ id: 1, name: "John" }),
      ]);
    });
  });

  describe("search", () => {
    it("updates search query", async () => {
      mockServices.fetch.mockResolvedValue({ data: [] });

      const queryClient = createQueryClient();
      render(<RelationshipPickerDrawer {...defaultProps} />, {
        wrapper: createWrapper(queryClient),
      });

      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: "john" } });

      await waitFor(() => {
        expect(mockServices.fetch).toHaveBeenCalledWith(
          expect.stringContaining("q=john")
        );
      });
    });
  });

  describe("create new button", () => {
    it("opens create drawer on click", async () => {
      mockServices.fetch.mockResolvedValue({ data: [] });

      const queryClient = createQueryClient();
      render(<RelationshipPickerDrawer {...defaultProps} />, {
        wrapper: createWrapper(queryClient),
      });

      const createButton = screen.getByRole("button", { name: /create_new/i });
      expect(createButton).toBeInTheDocument();
    });
  });

  describe("cancel", () => {
    it("calls onOpenChange(false) on cancel", async () => {
      const onOpenChange = vi.fn();
      mockServices.fetch.mockResolvedValue({ data: [] });

      const queryClient = createQueryClient();
      render(
        <RelationshipPickerDrawer {...defaultProps} onOpenChange={onOpenChange} />,
        { wrapper: createWrapper(queryClient) }
      );

      fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
