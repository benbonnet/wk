import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/provider";
import { TooltipProvider } from "@ui-components/tooltip";
import { DynamicRenderer } from "@ui/renderer";
import type { UIServices } from "@ui/registry";
import type { ReactNode } from "react";

const mockServices: UIServices = {
  fetch: vi.fn().mockResolvedValue({ data: {} }),
  navigate: vi.fn(),
  toast: vi.fn(),
  confirm: vi.fn(),
};

function TestWrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider services={mockServices} locale="en">
        <TooltipProvider>{children}</TooltipProvider>
      </UIProvider>
    </QueryClientProvider>
  );
}

describe("Phase 6: DynamicRenderer", () => {
  describe("6.1 Type Routing", () => {
    it("routes VIEW type to VIEW component", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [],
            }}
          />
        </TestWrapper>
      );
      // VIEW uses data-ui="view" attribute
      const viewElement = document.querySelector("[data-ui='view']");
      expect(viewElement).toBeInTheDocument();
    });

    it("routes PAGE type to PAGE component", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "PAGE",
                  title: "Test Page",
                },
              ],
            }}
          />
        </TestWrapper>
      );
      expect(screen.getByText("Test Page")).toBeInTheDocument();
    });

    it("routes GROUP type to GROUP component", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "GROUP",
                  label: "Test Group",
                  elements: [],
                },
              ],
            }}
          />
        </TestWrapper>
      );
      expect(screen.getByText("Test Group")).toBeInTheDocument();
    });

    it("routes FORM type to FORM component", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "FORM",
                  elements: [
                    {
                      type: "INPUT_TEXT",
                      name: "test",
                      label: "Test Field",
                    },
                  ],
                },
              ],
            }}
          />
        </TestWrapper>
      );
      expect(screen.getByLabelText("Test Field")).toBeInTheDocument();
    });
  });

  describe("6.2 Type Routing for Inputs/Displays", () => {
    it("routes INPUT_TEXT to text input", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "FORM",
                  elements: [
                    {
                      type: "INPUT_TEXT",
                      name: "email",
                      label: "Email",
                    },
                  ],
                },
              ],
            }}
          />
        </TestWrapper>
      );
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("routes DISPLAY_TEXT to text display", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "SHOW",
                  elements: [
                    {
                      type: "DISPLAY_TEXT",
                      name: "name",
                      label: "Name",
                    },
                  ],
                },
              ],
            }}
            data={{ name: "John Doe" }}
          />
        </TestWrapper>
      );
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("routes INPUT_SELECT to select input", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
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
            }}
          />
        </TestWrapper>
      );
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("routes DISPLAY_DATE to date display", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "SHOW",
                  elements: [
                    {
                      type: "DISPLAY_DATE",
                      name: "created_at",
                      label: "Created",
                    },
                  ],
                },
              ],
            }}
            data={{ created_at: "2024-01-15" }}
          />
        </TestWrapper>
      );
      expect(screen.getByText("Created")).toBeInTheDocument();
      expect(screen.getByText("January 15th, 2024")).toBeInTheDocument();
    });
  });

  describe("6.3 Nested Rendering", () => {
    it("renders nested elements recursively", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "GROUP",
                  label: "Outer Group",
                  elements: [
                    {
                      type: "GROUP",
                      label: "Inner Group",
                      elements: [
                        {
                          type: "DISPLAY_TEXT",
                          name: "nested",
                          label: "Nested Field",
                        },
                      ],
                    },
                  ],
                },
              ],
            }}
            data={{ nested: "Nested Value" }}
          />
        </TestWrapper>
      );
      expect(screen.getByText("Outer Group")).toBeInTheDocument();
      expect(screen.getByText("Inner Group")).toBeInTheDocument();
      expect(screen.getByText("Nested Field")).toBeInTheDocument();
      expect(screen.getByText("Nested Value")).toBeInTheDocument();
    });

    it("passes data to children", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "SHOW",
                  elements: [
                    {
                      type: "DISPLAY_TEXT",
                      name: "first_name",
                    },
                    {
                      type: "DISPLAY_TEXT",
                      name: "last_name",
                    },
                  ],
                },
              ],
            }}
            data={{ first_name: "Jane", last_name: "Smith" }}
          />
        </TestWrapper>
      );
      expect(screen.getByText("Jane")).toBeInTheDocument();
      expect(screen.getByText("Smith")).toBeInTheDocument();
    });
  });

  describe("6.4 Rule Application", () => {
    it("hides element when HIDE rule matches", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "GROUP",
                  label: "Visible Group",
                  elements: [],
                },
                {
                  type: "GROUP",
                  label: "Hidden Group",
                  rules: [
                    {
                      effect: "HIDE",
                      conditions: [
                        { field: "hide_group", operator: "EQ", values: [true] },
                      ],
                    },
                  ],
                  elements: [],
                },
              ],
            }}
            data={{ hide_group: true }}
          />
        </TestWrapper>
      );
      expect(screen.getByText("Visible Group")).toBeInTheDocument();
      expect(screen.queryByText("Hidden Group")).not.toBeInTheDocument();
    });

    it("shows element when SHOW rule matches", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "GROUP",
                  label: "Conditional Group",
                  rules: [
                    {
                      effect: "SHOW",
                      conditions: [
                        { field: "show_group", operator: "EQ", values: [true] },
                      ],
                    },
                  ],
                  elements: [],
                },
              ],
            }}
            data={{ show_group: true }}
          />
        </TestWrapper>
      );
      expect(screen.getByText("Conditional Group")).toBeInTheDocument();
    });

    it("hides element when SHOW rule does not match", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "GROUP",
                  label: "Conditional Group",
                  rules: [
                    {
                      effect: "SHOW",
                      conditions: [
                        { field: "show_group", operator: "EQ", values: [true] },
                      ],
                    },
                  ],
                  elements: [],
                },
              ],
            }}
            data={{ show_group: false }}
          />
        </TestWrapper>
      );
      expect(screen.queryByText("Conditional Group")).not.toBeInTheDocument();
    });

    it("disables input when DISABLE rule matches", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "FORM",
                  elements: [
                    {
                      type: "INPUT_TEXT",
                      name: "locked_field",
                      label: "Locked Field",
                      rules: [
                        {
                          effect: "DISABLE",
                          conditions: [
                            { field: "is_locked", operator: "EQ", values: [true] },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            }}
            data={{ is_locked: true }}
          />
        </TestWrapper>
      );
      expect(screen.getByLabelText("Locked Field")).toBeDisabled();
    });
  });

  describe("6.5 Unknown Types", () => {
    it("returns null for unknown component type", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "UNKNOWN_TYPE" as never,
            }}
          />
        </TestWrapper>
      );

      expect(consoleSpy).toHaveBeenCalledWith("Unknown component type: UNKNOWN_TYPE");
      consoleSpy.mockRestore();
    });
  });
});
