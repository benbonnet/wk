import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "../provider";
import { DynamicRenderer } from "../renderer";
import { TooltipProvider } from "@ui/components/tooltip";
import type { UIServices } from "../registry";
import type { UISchema } from "../types";

const mockServices: UIServices = {
  fetch: vi.fn().mockResolvedValue({ data: {} }),
  navigate: vi.fn(),
  toast: vi.fn(),
  confirm: vi.fn().mockResolvedValue(true),
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <UIProvider services={mockServices} locale="en">
      <TooltipProvider>{children}</TooltipProvider>
    </UIProvider>
  </QueryClientProvider>
);

describe("DynamicRenderer", () => {
  describe("VIEW type", () => {
    it("renders VIEW with children", () => {
      const schema: UISchema = {
        type: "VIEW",
        elements: [{ type: "PAGE", title: "Test Page" }],
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(document.querySelector("[data-ui='view']")).toBeInTheDocument();
      expect(document.querySelector("[data-ui='page']")).toBeInTheDocument();
      expect(screen.getByText("Test Page")).toBeInTheDocument();
    });
  });

  describe("PAGE type", () => {
    it("renders PAGE with title and elements", () => {
      const schema: UISchema = {
        type: "VIEW",
        elements: [
          {
            type: "PAGE",
            title: "My Page",
            elements: [{ type: "GROUP", label: "Details", elements: [] }],
          },
        ],
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(document.querySelector("[data-ui='page']")).toBeInTheDocument();
      expect(screen.getByText("My Page")).toBeInTheDocument();
      expect(document.querySelector("[data-ui='group']")).toBeInTheDocument();
    });
  });

  describe("FORM type", () => {
    it("renders FORM with field elements", () => {
      const schema: UISchema = {
        type: "VIEW",
        elements: [
          {
            type: "FORM",
            elements: [
              { type: "INPUT_TEXT", name: "first_name", label: "First Name" },
              { type: "INPUT_TEXT", name: "last_name", label: "Last Name" },
              { type: "SUBMIT", label: "Save" },
            ],
          },
        ],
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(document.querySelector("[data-ui='form']")).toBeInTheDocument();
      expect(screen.getByLabelText("First Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });
  });

  describe("TABLE type", () => {
    it("renders TABLE with columns", () => {
      const schema: UISchema = {
        type: "VIEW",
        elements: [
          {
            type: "TABLE",
            columns: [
              { name: "name", type: "DISPLAY_TEXT", label: "Name" },
              { name: "email", type: "DISPLAY_TEXT", label: "Email" },
            ],
            data: [],
          },
        ],
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(document.querySelector("[data-ui='table']")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
    });
  });

  describe("INPUT types", () => {
    it("routes to correct input component", () => {
      const schema: UISchema = {
        type: "VIEW",
        elements: [
          {
            type: "FORM",
            elements: [
              { type: "INPUT_TEXT", name: "email", label: "Email Address" },
            ],
          },
        ],
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("handles INPUT_TEXTAREA", () => {
      const schema: UISchema = {
        type: "VIEW",
        elements: [
          {
            type: "FORM",
            elements: [{ type: "INPUT_TEXTAREA", name: "bio", label: "Bio" }],
          },
        ],
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(screen.getByLabelText("Bio")).toBeInTheDocument();
    });

    it("handles INPUT_SELECT", () => {
      const schema: UISchema = {
        type: "VIEW",
        elements: [
          {
            type: "FORM",
            elements: [
              {
                type: "INPUT_SELECT",
                name: "status",
                label: "Status",
                options: [
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ],
              },
            ],
          },
        ],
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("handles INPUT_CHECKBOX", () => {
      const schema: UISchema = {
        type: "VIEW",
        elements: [
          {
            type: "FORM",
            elements: [
              { type: "INPUT_CHECKBOX", name: "active", label: "Active" },
            ],
          },
        ],
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("handles INPUT_DATE", () => {
      const schema: UISchema = {
        type: "VIEW",
        elements: [
          {
            type: "FORM",
            elements: [
              { type: "INPUT_DATE", name: "birth_date", label: "Birth Date" },
            ],
          },
        ],
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(screen.getByText("Birth Date")).toBeInTheDocument();
    });
  });

  describe("DISPLAY types", () => {
    it("routes to correct display component", () => {
      const schema: UISchema = {
        type: "VIEW",
        elements: [
          {
            type: "SHOW",
            elements: [{ type: "DISPLAY_TEXT", name: "name", label: "Name" }],
          },
        ],
      };
      const data = { name: "John Doe" };

      render(<DynamicRenderer schema={schema} data={data} />, { wrapper });

      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("handles DISPLAY_NUMBER", () => {
      const schema: UISchema = {
        type: "VIEW",
        elements: [
          {
            type: "SHOW",
            elements: [{ type: "DISPLAY_NUMBER", name: "count", label: "Count" }],
          },
        ],
      };
      const data = { count: 42 };

      render(<DynamicRenderer schema={schema} data={data} />, { wrapper });

      expect(screen.getByText("Count")).toBeInTheDocument();
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("handles DISPLAY_BOOLEAN", () => {
      const schema: UISchema = {
        type: "VIEW",
        elements: [
          {
            type: "SHOW",
            elements: [{ type: "DISPLAY_BOOLEAN", name: "active", label: "Active" }],
          },
        ],
      };
      const data = { active: true };

      render(<DynamicRenderer schema={schema} data={data} />, { wrapper });

      expect(screen.getByText("Active")).toBeInTheDocument();
      expect(screen.getByText("Yes")).toBeInTheDocument();
    });
  });

  describe("nested structures", () => {
    it("renders deeply nested elements", () => {
      const schema: UISchema = {
        type: "VIEW",
        elements: [
          {
            type: "PAGE",
            title: "Contact",
            elements: [
              {
                type: "GROUP",
                label: "Personal Info",
                elements: [
                  { type: "DISPLAY_TEXT", name: "first_name" },
                  { type: "DISPLAY_TEXT", name: "last_name" },
                ],
              },
            ],
          },
        ],
      };
      const data = { first_name: "John", last_name: "Doe" };

      render(<DynamicRenderer schema={schema} data={data} />, { wrapper });

      expect(document.querySelector("[data-ui='view']")).toBeInTheDocument();
      expect(document.querySelector("[data-ui='page']")).toBeInTheDocument();
      expect(document.querySelector("[data-ui='group']")).toBeInTheDocument();
      expect(screen.getByText("Personal Info")).toBeInTheDocument();
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Doe")).toBeInTheDocument();
    });
  });

  describe("leaf components", () => {
    it("renders ALERT", () => {
      const schema: UISchema = {
        type: "VIEW",
        elements: [
          {
            type: "ALERT",
            label: "Warning message",
            color: "yellow",
          },
        ],
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(document.querySelector("[data-ui='alert']")).toBeInTheDocument();
      expect(screen.getByText("Warning message")).toBeInTheDocument();
    });

    it("renders LINK", () => {
      const schema: UISchema = {
        type: "VIEW",
        elements: [{ type: "LINK", label: "Go Home", href: "/home" }],
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(document.querySelector("[data-ui='link']")).toBeInTheDocument();
      expect(screen.getByText("Go Home")).toBeInTheDocument();
    });

    it("renders BUTTON", () => {
      const schema: UISchema = {
        type: "VIEW",
        elements: [{ type: "BUTTON", label: "Click Me" }],
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(document.querySelector("[data-ui='button']")).toBeInTheDocument();
      expect(screen.getByText("Click Me")).toBeInTheDocument();
    });

    it("renders SEARCH", () => {
      const schema: UISchema = {
        type: "VIEW",
        elements: [{ type: "SEARCH", placeholder: "Search..." }],
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(document.querySelector("[data-ui='search']")).toBeInTheDocument();
    });
  });

  describe("unknown types", () => {
    it("returns null for unknown component type", () => {
      const schema = {
        type: "UNKNOWN_TYPE",
      } as unknown as UISchema;

      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const { container } = render(<DynamicRenderer schema={schema} />, {
        wrapper,
      });

      expect(container.firstChild).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Unknown component type: UNKNOWN_TYPE"
      );

      consoleSpy.mockRestore();
    });
  });
});
