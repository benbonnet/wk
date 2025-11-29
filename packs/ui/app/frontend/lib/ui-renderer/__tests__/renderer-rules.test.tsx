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

// Helper to wrap input in VIEW + FORM for proper context
function inputSchema(input: UISchema): UISchema {
  return {
    type: "VIEW",
    elements: [{ type: "FORM", elements: [input] }],
  };
}

// Helper to wrap group in VIEW for proper context
function viewSchema(element: UISchema): UISchema {
  return {
    type: "VIEW",
    elements: [element],
  };
}

describe("DynamicRenderer with rules", () => {
  describe("HIDE rule", () => {
    it("hides component when condition is met", () => {
      const schema = inputSchema({
        type: "INPUT_TEXT",
        name: "secret_field",
        label: "Secret",
        rules: [
          {
            effect: "HIDE",
            conditions: [{ field: "role", operator: "NEQ", values: ["admin"] }],
          },
        ],
      });

      render(<DynamicRenderer schema={schema} data={{ role: "user" }} />, {
        wrapper,
      });

      expect(screen.queryByLabelText("Secret")).not.toBeInTheDocument();
    });

    it("shows component when condition is not met", () => {
      const schema = inputSchema({
        type: "INPUT_TEXT",
        name: "secret_field",
        label: "Secret",
        rules: [
          {
            effect: "HIDE",
            conditions: [{ field: "role", operator: "NEQ", values: ["admin"] }],
          },
        ],
      });

      render(<DynamicRenderer schema={schema} data={{ role: "admin" }} />, {
        wrapper,
      });

      expect(screen.getByLabelText("Secret")).toBeInTheDocument();
    });
  });

  describe("SHOW rule", () => {
    it("shows component when condition is met", () => {
      const schema = inputSchema({
        type: "INPUT_TEXT",
        name: "premium_field",
        label: "Premium",
        rules: [
          {
            effect: "SHOW",
            conditions: [{ field: "plan", operator: "EQ", values: ["premium"] }],
          },
        ],
      });

      render(<DynamicRenderer schema={schema} data={{ plan: "premium" }} />, {
        wrapper,
      });

      expect(screen.getByLabelText("Premium")).toBeInTheDocument();
    });

    it("hides component when condition is not met", () => {
      const schema = inputSchema({
        type: "INPUT_TEXT",
        name: "premium_field",
        label: "Premium",
        rules: [
          {
            effect: "SHOW",
            conditions: [{ field: "plan", operator: "EQ", values: ["premium"] }],
          },
        ],
      });

      render(<DynamicRenderer schema={schema} data={{ plan: "free" }} />, {
        wrapper,
      });

      expect(screen.queryByLabelText("Premium")).not.toBeInTheDocument();
    });
  });

  describe("DISABLE rule", () => {
    it("disables component when condition is met", () => {
      const schema = inputSchema({
        type: "INPUT_TEXT",
        name: "locked_field",
        label: "Locked",
        rules: [
          {
            effect: "DISABLE",
            conditions: [{ field: "locked", operator: "EQ", values: [true] }],
          },
        ],
      });

      render(<DynamicRenderer schema={schema} data={{ locked: true }} />, {
        wrapper,
      });

      expect(screen.getByLabelText("Locked")).toBeDisabled();
    });

    it("keeps component enabled when condition is not met", () => {
      const schema = inputSchema({
        type: "INPUT_TEXT",
        name: "locked_field",
        label: "Locked",
        rules: [
          {
            effect: "DISABLE",
            conditions: [{ field: "locked", operator: "EQ", values: [true] }],
          },
        ],
      });

      render(<DynamicRenderer schema={schema} data={{ locked: false }} />, {
        wrapper,
      });

      expect(screen.getByLabelText("Locked")).not.toBeDisabled();
    });
  });

  describe("ENABLE rule", () => {
    it("enables component when condition is met", () => {
      const schema = inputSchema({
        type: "INPUT_TEXT",
        name: "conditional_field",
        label: "Conditional",
        rules: [
          {
            effect: "ENABLE",
            conditions: [{ field: "active", operator: "EQ", values: [true] }],
          },
        ],
      });

      render(<DynamicRenderer schema={schema} data={{ active: true }} />, {
        wrapper,
      });

      expect(screen.getByLabelText("Conditional")).not.toBeDisabled();
    });

    it("disables component when condition is not met", () => {
      const schema = inputSchema({
        type: "INPUT_TEXT",
        name: "conditional_field",
        label: "Conditional",
        rules: [
          {
            effect: "ENABLE",
            conditions: [{ field: "active", operator: "EQ", values: [true] }],
          },
        ],
      });

      render(<DynamicRenderer schema={schema} data={{ active: false }} />, {
        wrapper,
      });

      expect(screen.getByLabelText("Conditional")).toBeDisabled();
    });
  });

  describe("nested elements with rules", () => {
    it("hides entire group when rule condition is met", () => {
      const schema = viewSchema({
        type: "GROUP",
        label: "Details Group",
        rules: [
          {
            effect: "HIDE",
            conditions: [
              { field: "show_details", operator: "EQ", values: [false] },
            ],
          },
        ],
        elements: [],
      });

      render(
        <DynamicRenderer schema={schema} data={{ show_details: false }} />,
        { wrapper }
      );

      expect(screen.queryByText("Details Group")).not.toBeInTheDocument();
    });

    it("shows group when rule condition is not met", () => {
      const schema = viewSchema({
        type: "GROUP",
        label: "Details Group",
        rules: [
          {
            effect: "HIDE",
            conditions: [
              { field: "show_details", operator: "EQ", values: [false] },
            ],
          },
        ],
        elements: [],
      });

      render(
        <DynamicRenderer schema={schema} data={{ show_details: true }} />,
        { wrapper }
      );

      expect(screen.getByText("Details Group")).toBeInTheDocument();
    });
  });

  describe("multiple conditions (AND logic)", () => {
    it("hides when all conditions are met", () => {
      const schema = inputSchema({
        type: "INPUT_TEXT",
        name: "multi_condition",
        label: "Multi",
        rules: [
          {
            effect: "HIDE",
            conditions: [
              { field: "status", operator: "EQ", values: ["draft"] },
              { field: "role", operator: "EQ", values: ["viewer"] },
            ],
          },
        ],
      });

      render(
        <DynamicRenderer
          schema={schema}
          data={{ status: "draft", role: "viewer" }}
        />,
        { wrapper }
      );

      expect(screen.queryByLabelText("Multi")).not.toBeInTheDocument();
    });

    it("shows when one condition is not met", () => {
      const schema = inputSchema({
        type: "INPUT_TEXT",
        name: "multi_condition",
        label: "Multi",
        rules: [
          {
            effect: "HIDE",
            conditions: [
              { field: "status", operator: "EQ", values: ["draft"] },
              { field: "role", operator: "EQ", values: ["viewer"] },
            ],
          },
        ],
      });

      render(
        <DynamicRenderer
          schema={schema}
          data={{ status: "draft", role: "editor" }}
        />,
        { wrapper }
      );

      expect(screen.getByLabelText("Multi")).toBeInTheDocument();
    });
  });

  describe("no rules", () => {
    it("renders component normally without rules", () => {
      const schema = inputSchema({
        type: "INPUT_TEXT",
        name: "normal_field",
        label: "Normal",
      });

      render(<DynamicRenderer schema={schema} data={{}} />, { wrapper });

      expect(screen.getByLabelText("Normal")).toBeInTheDocument();
      expect(screen.getByLabelText("Normal")).not.toBeDisabled();
    });
  });
});
