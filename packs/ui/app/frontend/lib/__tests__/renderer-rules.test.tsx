import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { UIProvider } from "../provider";
import { DynamicRenderer } from "../renderer";
import type {
  ComponentRegistry,
  InputRegistry,
  DisplayRegistry,
  UIServices,
} from "../registry";
import type { UISchema } from "../types";

// Mock components
const mockComponents: ComponentRegistry = {
  VIEW: ({ children }) => <div data-testid="view">{children}</div>,
  PAGE: ({ children }) => <div data-testid="page">{children}</div>,
  DRAWER: ({ children }) => <div data-testid="drawer">{children}</div>,
  FORM: ({ children }) => <form data-testid="form">{children}</form>,
  TABLE: () => <table data-testid="table" />,
  SHOW: ({ children }) => <div data-testid="show">{children}</div>,
  ACTIONS: ({ children }) => <div data-testid="actions">{children}</div>,
  GROUP: ({ children }) => <div data-testid="group">{children}</div>,
  CARD_GROUP: ({ children }) => <div data-testid="card-group">{children}</div>,
  MULTISTEP: ({ children }) => <div data-testid="multistep">{children}</div>,
  STEP: () => <div data-testid="step" />,
  FORM_ARRAY: ({ children }) => <div data-testid="form-array">{children}</div>,
  DISPLAY_ARRAY: ({ children }) => <div data-testid="display-array">{children}</div>,
  ALERT: ({ schema }) => <div data-testid="alert">{schema.label}</div>,
  LINK: ({ schema }) => <button data-testid="link">{schema.label}</button>,
  BUTTON: ({ schema }) => <button data-testid="button">{schema.label}</button>,
  DROPDOWN: ({ children }) => <div data-testid="dropdown">{children}</div>,
  OPTION: () => <div data-testid="option" />,
  SEARCH: () => <input data-testid="search" />,
  SUBMIT: () => <button data-testid="submit" />,
  COMPONENT: ({ children }) => <div data-testid="component">{children}</div>,
  RELATIONSHIP_PICKER: () => <div data-testid="relationship-picker" />,
} as unknown as ComponentRegistry;

const mockInputs: InputRegistry = {
  INPUT_TEXT: ({ name, disabled }) => (
    <input
      data-testid={`input-${name}`}
      data-disabled={disabled}
      disabled={disabled}
    />
  ),
  INPUT_TEXTAREA: ({ name, disabled }) => (
    <textarea data-testid={`textarea-${name}`} disabled={disabled} />
  ),
  INPUT_SELECT: ({ name, disabled }) => (
    <select data-testid={`select-${name}`} disabled={disabled} />
  ),
  INPUT_CHECKBOX: ({ name, disabled }) => (
    <input type="checkbox" data-testid={`checkbox-${name}`} disabled={disabled} />
  ),
  INPUT_CHECKBOXES: ({ name }) => <div data-testid={`checkboxes-${name}`} />,
  INPUT_RADIOS: ({ name }) => <div data-testid={`radios-${name}`} />,
  INPUT_DATE: ({ name }) => <input type="date" data-testid={`date-${name}`} />,
  INPUT_DATETIME: ({ name }) => <input type="datetime-local" data-testid={`datetime-${name}`} />,
  INPUT_TAGS: ({ name }) => <div data-testid={`tags-${name}`} />,
  INPUT_AI_RICH_TEXT: ({ name }) => <div data-testid={`richtext-${name}`} />,
} as unknown as InputRegistry;

const mockDisplays: DisplayRegistry = {
  DISPLAY_TEXT: ({ name, value }) => <span data-testid={`text-${name}`}>{String(value)}</span>,
  DISPLAY_LONGTEXT: ({ name }) => <p data-testid={`longtext-${name}`} />,
  DISPLAY_NUMBER: ({ name }) => <span data-testid={`number-${name}`} />,
  DISPLAY_DATE: ({ name }) => <span data-testid={`date-${name}`} />,
  DISPLAY_DATETIME: ({ name }) => <span data-testid={`datetime-${name}`} />,
  DISPLAY_BADGE: ({ name }) => <span data-testid={`badge-${name}`} />,
  DISPLAY_TAGS: ({ name }) => <span data-testid={`tags-${name}`} />,
  DISPLAY_BOOLEAN: ({ name }) => <span data-testid={`boolean-${name}`} />,
  DISPLAY_SELECT: ({ name }) => <span data-testid={`select-${name}`} />,
} as unknown as DisplayRegistry;

const mockServices: UIServices = {
  fetch: vi.fn(),
  navigate: vi.fn(),
  toast: vi.fn(),
  confirm: vi.fn(),
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <UIProvider
    components={mockComponents}
    inputs={mockInputs}
    displays={mockDisplays}
    services={mockServices}
    locale="en"
  >
    {children}
  </UIProvider>
);

describe("DynamicRenderer with rules", () => {
  describe("HIDE rule", () => {
    it("hides component when condition is met", () => {
      const schema: UISchema = {
        type: "COMPONENT",
        name: "secret_field",
        kind: "INPUT_TEXT",
        rules: [
          {
            effect: "HIDE",
            conditions: [{ field: "role", operator: "NEQ", values: ["admin"] }],
          },
        ],
      };

      const { container } = render(
        <DynamicRenderer schema={schema} data={{ role: "user" }} />,
        { wrapper }
      );

      expect(container.firstChild).toBeNull();
    });

    it("shows component when condition is not met", () => {
      const schema: UISchema = {
        type: "COMPONENT",
        name: "secret_field",
        kind: "INPUT_TEXT",
        rules: [
          {
            effect: "HIDE",
            conditions: [{ field: "role", operator: "NEQ", values: ["admin"] }],
          },
        ],
      };

      render(
        <DynamicRenderer schema={schema} data={{ role: "admin" }} />,
        { wrapper }
      );

      expect(screen.getByTestId("input-secret_field")).toBeInTheDocument();
    });
  });

  describe("SHOW rule", () => {
    it("shows component when condition is met", () => {
      const schema: UISchema = {
        type: "COMPONENT",
        name: "premium_field",
        kind: "INPUT_TEXT",
        rules: [
          {
            effect: "SHOW",
            conditions: [{ field: "plan", operator: "EQ", values: ["premium"] }],
          },
        ],
      };

      render(
        <DynamicRenderer schema={schema} data={{ plan: "premium" }} />,
        { wrapper }
      );

      expect(screen.getByTestId("input-premium_field")).toBeInTheDocument();
    });

    it("hides component when condition is not met", () => {
      const schema: UISchema = {
        type: "COMPONENT",
        name: "premium_field",
        kind: "INPUT_TEXT",
        rules: [
          {
            effect: "SHOW",
            conditions: [{ field: "plan", operator: "EQ", values: ["premium"] }],
          },
        ],
      };

      const { container } = render(
        <DynamicRenderer schema={schema} data={{ plan: "free" }} />,
        { wrapper }
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe("DISABLE rule", () => {
    it("disables component when condition is met", () => {
      const schema: UISchema = {
        type: "COMPONENT",
        name: "locked_field",
        kind: "INPUT_TEXT",
        rules: [
          {
            effect: "DISABLE",
            conditions: [{ field: "locked", operator: "EQ", values: [true] }],
          },
        ],
      };

      render(
        <DynamicRenderer schema={schema} data={{ locked: true }} />,
        { wrapper }
      );

      const input = screen.getByTestId("input-locked_field");
      expect(input).toBeDisabled();
    });

    it("keeps component enabled when condition is not met", () => {
      const schema: UISchema = {
        type: "COMPONENT",
        name: "locked_field",
        kind: "INPUT_TEXT",
        rules: [
          {
            effect: "DISABLE",
            conditions: [{ field: "locked", operator: "EQ", values: [true] }],
          },
        ],
      };

      render(
        <DynamicRenderer schema={schema} data={{ locked: false }} />,
        { wrapper }
      );

      const input = screen.getByTestId("input-locked_field");
      expect(input).not.toBeDisabled();
    });
  });

  describe("ENABLE rule", () => {
    it("enables component when condition is met", () => {
      const schema: UISchema = {
        type: "COMPONENT",
        name: "conditional_field",
        kind: "INPUT_TEXT",
        rules: [
          {
            effect: "ENABLE",
            conditions: [{ field: "active", operator: "EQ", values: [true] }],
          },
        ],
      };

      render(
        <DynamicRenderer schema={schema} data={{ active: true }} />,
        { wrapper }
      );

      const input = screen.getByTestId("input-conditional_field");
      expect(input).not.toBeDisabled();
    });

    it("disables component when condition is not met", () => {
      const schema: UISchema = {
        type: "COMPONENT",
        name: "conditional_field",
        kind: "INPUT_TEXT",
        rules: [
          {
            effect: "ENABLE",
            conditions: [{ field: "active", operator: "EQ", values: [true] }],
          },
        ],
      };

      render(
        <DynamicRenderer schema={schema} data={{ active: false }} />,
        { wrapper }
      );

      const input = screen.getByTestId("input-conditional_field");
      expect(input).toBeDisabled();
    });
  });

  describe("nested elements with rules", () => {
    it("hides entire group when rule condition is met", () => {
      const schema: UISchema = {
        type: "GROUP",
        rules: [
          {
            effect: "HIDE",
            conditions: [{ field: "show_details", operator: "EQ", values: [false] }],
          },
        ],
        elements: [
          { type: "COMPONENT", name: "field1", kind: "INPUT_TEXT" },
          { type: "COMPONENT", name: "field2", kind: "INPUT_TEXT" },
        ],
      };

      const { container } = render(
        <DynamicRenderer schema={schema} data={{ show_details: false }} />,
        { wrapper }
      );

      expect(container.firstChild).toBeNull();
    });

    it("shows group and children when rule condition is not met", () => {
      const schema: UISchema = {
        type: "GROUP",
        rules: [
          {
            effect: "HIDE",
            conditions: [{ field: "show_details", operator: "EQ", values: [false] }],
          },
        ],
        elements: [
          { type: "COMPONENT", name: "field1", kind: "INPUT_TEXT" },
          { type: "COMPONENT", name: "field2", kind: "INPUT_TEXT" },
        ],
      };

      render(
        <DynamicRenderer schema={schema} data={{ show_details: true }} />,
        { wrapper }
      );

      expect(screen.getByTestId("group")).toBeInTheDocument();
      expect(screen.getByTestId("input-field1")).toBeInTheDocument();
      expect(screen.getByTestId("input-field2")).toBeInTheDocument();
    });
  });

  describe("multiple conditions (AND logic)", () => {
    it("hides when all conditions are met", () => {
      const schema: UISchema = {
        type: "COMPONENT",
        name: "multi_condition",
        kind: "INPUT_TEXT",
        rules: [
          {
            effect: "HIDE",
            conditions: [
              { field: "status", operator: "EQ", values: ["draft"] },
              { field: "role", operator: "EQ", values: ["viewer"] },
            ],
          },
        ],
      };

      const { container } = render(
        <DynamicRenderer schema={schema} data={{ status: "draft", role: "viewer" }} />,
        { wrapper }
      );

      expect(container.firstChild).toBeNull();
    });

    it("shows when one condition is not met", () => {
      const schema: UISchema = {
        type: "COMPONENT",
        name: "multi_condition",
        kind: "INPUT_TEXT",
        rules: [
          {
            effect: "HIDE",
            conditions: [
              { field: "status", operator: "EQ", values: ["draft"] },
              { field: "role", operator: "EQ", values: ["viewer"] },
            ],
          },
        ],
      };

      render(
        <DynamicRenderer schema={schema} data={{ status: "draft", role: "editor" }} />,
        { wrapper }
      );

      expect(screen.getByTestId("input-multi_condition")).toBeInTheDocument();
    });
  });

  describe("no rules", () => {
    it("renders component normally without rules", () => {
      const schema: UISchema = {
        type: "COMPONENT",
        name: "normal_field",
        kind: "INPUT_TEXT",
      };

      render(
        <DynamicRenderer schema={schema} data={{}} />,
        { wrapper }
      );

      expect(screen.getByTestId("input-normal_field")).toBeInTheDocument();
      expect(screen.getByTestId("input-normal_field")).not.toBeDisabled();
    });
  });
});
