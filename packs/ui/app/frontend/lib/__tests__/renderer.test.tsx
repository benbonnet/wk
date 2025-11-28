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

// Mock components that render their type
const mockComponents: ComponentRegistry = {
  VIEW: ({ children }) => <div data-testid="view">{children}</div>,
  PAGE: ({ schema, children }) => (
    <div data-testid="page">
      <h1>{schema.title}</h1>
      {children}
    </div>
  ),
  DRAWER: ({ children }) => <div data-testid="drawer">{children}</div>,
  FORM: ({ children }) => <form data-testid="form">{children}</form>,
  TABLE: ({ schema }) => (
    <table data-testid="table">
      <thead>
        <tr>
          {schema.columns?.map((col) => (
            <th key={col.name}>{col.label || col.name}</th>
          ))}
        </tr>
      </thead>
    </table>
  ),
  SHOW: ({ children }) => <div data-testid="show">{children}</div>,
  ACTIONS: ({ children }) => <div data-testid="actions">{children}</div>,
  GROUP: ({ schema, children }) => (
    <div data-testid="group">
      {schema.label && <h3>{schema.label}</h3>}
      {children}
    </div>
  ),
  CARD_GROUP: ({ children }) => <div data-testid="card-group">{children}</div>,
  MULTISTEP: ({ children }) => <div data-testid="multistep">{children}</div>,
  STEP: ({ schema }) => <div data-testid="step">{schema.label}</div>,
  FORM_ARRAY: ({ children }) => <div data-testid="form-array">{children}</div>,
  DISPLAY_ARRAY: ({ children }) => <div data-testid="display-array">{children}</div>,
  ALERT: ({ schema }) => <div data-testid="alert">{schema.label}</div>,
  LINK: ({ schema }) => <button data-testid="link">{schema.label}</button>,
  BUTTON: ({ schema }) => <button data-testid="button">{schema.label}</button>,
  DROPDOWN: ({ children }) => <div data-testid="dropdown">{children}</div>,
  OPTION: ({ schema }) => <div data-testid="option">{schema.label}</div>,
  SEARCH: () => <input data-testid="search" type="search" />,
  SUBMIT: ({ schema }) => <button data-testid="submit">{schema.label}</button>,
  COMPONENT: ({ children }) => <div data-testid="component">{children}</div>,
  RELATIONSHIP_PICKER: () => <div data-testid="relationship-picker" />,
} as unknown as ComponentRegistry;

const mockInputs: InputRegistry = {
  INPUT_TEXT: ({ name, label }) => (
    <div data-testid={`input-text-${name}`}>
      {label && <label>{label}</label>}
      <input type="text" name={name} />
    </div>
  ),
  INPUT_TEXTAREA: ({ name }) => <textarea data-testid={`input-textarea-${name}`} name={name} />,
  INPUT_SELECT: ({ name }) => <select data-testid={`input-select-${name}`} name={name} />,
  INPUT_CHECKBOX: ({ name }) => <input data-testid={`input-checkbox-${name}`} type="checkbox" name={name} />,
  INPUT_CHECKBOXES: ({ name }) => <div data-testid={`input-checkboxes-${name}`} />,
  INPUT_RADIOS: ({ name }) => <div data-testid={`input-radios-${name}`} />,
  INPUT_DATE: ({ name }) => <input data-testid={`input-date-${name}`} type="date" name={name} />,
  INPUT_DATETIME: ({ name }) => <input data-testid={`input-datetime-${name}`} type="datetime-local" name={name} />,
  INPUT_TAGS: ({ name }) => <div data-testid={`input-tags-${name}`} />,
  INPUT_AI_RICH_TEXT: ({ name }) => <div data-testid={`input-richtext-${name}`} />,
} as unknown as InputRegistry;

const mockDisplays: DisplayRegistry = {
  DISPLAY_TEXT: ({ name, value }) => <span data-testid={`display-text-${name}`}>{String(value)}</span>,
  DISPLAY_LONGTEXT: ({ name, value }) => <p data-testid={`display-longtext-${name}`}>{String(value)}</p>,
  DISPLAY_NUMBER: ({ name, value }) => <span data-testid={`display-number-${name}`}>{String(value)}</span>,
  DISPLAY_DATE: ({ name, value }) => <span data-testid={`display-date-${name}`}>{String(value)}</span>,
  DISPLAY_DATETIME: ({ name, value }) => <span data-testid={`display-datetime-${name}`}>{String(value)}</span>,
  DISPLAY_BADGE: ({ name, value }) => <span data-testid={`display-badge-${name}`}>{String(value)}</span>,
  DISPLAY_TAGS: ({ name }) => <span data-testid={`display-tags-${name}`} />,
  DISPLAY_BOOLEAN: ({ name, value }) => <span data-testid={`display-boolean-${name}`}>{value ? "Yes" : "No"}</span>,
  DISPLAY_SELECT: ({ name, value }) => <span data-testid={`display-select-${name}`}>{String(value)}</span>,
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

describe("DynamicRenderer", () => {
  describe("VIEW type", () => {
    it("renders VIEW with children", () => {
      const schema: UISchema = {
        type: "VIEW",
        elements: [
          { type: "PAGE", title: "Test Page" },
        ],
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(screen.getByTestId("view")).toBeInTheDocument();
      expect(screen.getByTestId("page")).toBeInTheDocument();
      expect(screen.getByText("Test Page")).toBeInTheDocument();
    });
  });

  describe("PAGE type", () => {
    it("renders PAGE with title and elements", () => {
      const schema: UISchema = {
        type: "PAGE",
        title: "My Page",
        elements: [
          { type: "GROUP", label: "Details" },
        ],
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(screen.getByTestId("page")).toBeInTheDocument();
      expect(screen.getByText("My Page")).toBeInTheDocument();
      expect(screen.getByTestId("group")).toBeInTheDocument();
    });
  });

  describe("FORM type", () => {
    it("renders FORM with field elements", () => {
      const schema: UISchema = {
        type: "FORM",
        elements: [
          { type: "COMPONENT", name: "first_name", kind: "INPUT_TEXT" },
          { type: "COMPONENT", name: "last_name", kind: "INPUT_TEXT" },
          { type: "SUBMIT", label: "Save" },
        ],
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(screen.getByTestId("form")).toBeInTheDocument();
      expect(screen.getByTestId("input-text-first_name")).toBeInTheDocument();
      expect(screen.getByTestId("input-text-last_name")).toBeInTheDocument();
      expect(screen.getByTestId("submit")).toBeInTheDocument();
    });
  });

  describe("TABLE type", () => {
    it("renders TABLE with columns", () => {
      const schema: UISchema = {
        type: "TABLE",
        columns: [
          { name: "name", kind: "DISPLAY_TEXT", label: "Name" },
          { name: "email", kind: "DISPLAY_TEXT", label: "Email" },
        ],
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(screen.getByTestId("table")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
    });
  });

  describe("COMPONENT type with INPUT kind", () => {
    it("routes to correct input component", () => {
      const schema: UISchema = {
        type: "COMPONENT",
        name: "email",
        kind: "INPUT_TEXT",
        label: "Email Address",
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(screen.getByTestId("input-text-email")).toBeInTheDocument();
    });

    it("handles INPUT_TEXTAREA", () => {
      const schema: UISchema = {
        type: "COMPONENT",
        name: "bio",
        kind: "INPUT_TEXTAREA",
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(screen.getByTestId("input-textarea-bio")).toBeInTheDocument();
    });

    it("handles INPUT_SELECT", () => {
      const schema: UISchema = {
        type: "COMPONENT",
        name: "status",
        kind: "INPUT_SELECT",
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(screen.getByTestId("input-select-status")).toBeInTheDocument();
    });

    it("handles INPUT_CHECKBOX", () => {
      const schema: UISchema = {
        type: "COMPONENT",
        name: "active",
        kind: "INPUT_CHECKBOX",
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(screen.getByTestId("input-checkbox-active")).toBeInTheDocument();
    });

    it("handles INPUT_DATE", () => {
      const schema: UISchema = {
        type: "COMPONENT",
        name: "birth_date",
        kind: "INPUT_DATE",
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(screen.getByTestId("input-date-birth_date")).toBeInTheDocument();
    });
  });

  describe("COMPONENT type with DISPLAY kind", () => {
    it("routes to correct display component", () => {
      const schema: UISchema = {
        type: "COMPONENT",
        name: "name",
        kind: "DISPLAY_TEXT",
      };
      const data = { name: "John Doe" };

      render(<DynamicRenderer schema={schema} data={data} />, { wrapper });

      expect(screen.getByTestId("display-text-name")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("handles DISPLAY_NUMBER", () => {
      const schema: UISchema = {
        type: "COMPONENT",
        name: "count",
        kind: "DISPLAY_NUMBER",
      };
      const data = { count: 42 };

      render(<DynamicRenderer schema={schema} data={data} />, { wrapper });

      expect(screen.getByTestId("display-number-count")).toBeInTheDocument();
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("handles DISPLAY_BOOLEAN", () => {
      const schema: UISchema = {
        type: "COMPONENT",
        name: "active",
        kind: "DISPLAY_BOOLEAN",
      };
      const data = { active: true };

      render(<DynamicRenderer schema={schema} data={data} />, { wrapper });

      expect(screen.getByTestId("display-boolean-active")).toBeInTheDocument();
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
                  { type: "COMPONENT", name: "first_name", kind: "DISPLAY_TEXT" },
                  { type: "COMPONENT", name: "last_name", kind: "DISPLAY_TEXT" },
                ],
              },
            ],
          },
        ],
      };
      const data = { first_name: "John", last_name: "Doe" };

      render(<DynamicRenderer schema={schema} data={data} />, { wrapper });

      expect(screen.getByTestId("view")).toBeInTheDocument();
      expect(screen.getByTestId("page")).toBeInTheDocument();
      expect(screen.getByTestId("group")).toBeInTheDocument();
      expect(screen.getByText("Personal Info")).toBeInTheDocument();
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Doe")).toBeInTheDocument();
    });
  });

  describe("template rendering", () => {
    it("renders FORM_ARRAY with template", () => {
      const schema: UISchema = {
        type: "FORM_ARRAY",
        name: "items",
        template: [
          { type: "COMPONENT", name: "name", kind: "INPUT_TEXT" },
        ],
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(screen.getByTestId("form-array")).toBeInTheDocument();
      expect(screen.getByTestId("input-text-name")).toBeInTheDocument();
    });
  });

  describe("leaf components", () => {
    it("renders ALERT", () => {
      const schema: UISchema = {
        type: "ALERT",
        label: "Warning message",
        color: "yellow",
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(screen.getByTestId("alert")).toBeInTheDocument();
      expect(screen.getByText("Warning message")).toBeInTheDocument();
    });

    it("renders LINK", () => {
      const schema: UISchema = {
        type: "LINK",
        label: "Go Home",
        href: "/home",
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(screen.getByTestId("link")).toBeInTheDocument();
      expect(screen.getByText("Go Home")).toBeInTheDocument();
    });

    it("renders BUTTON", () => {
      const schema: UISchema = {
        type: "BUTTON",
        label: "Click Me",
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(screen.getByTestId("button")).toBeInTheDocument();
      expect(screen.getByText("Click Me")).toBeInTheDocument();
    });

    it("renders SEARCH", () => {
      const schema: UISchema = {
        type: "SEARCH",
        placeholder: "Search...",
      };

      render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(screen.getByTestId("search")).toBeInTheDocument();
    });
  });

  describe("unknown types", () => {
    it("returns null for unknown component type", () => {
      const schema = {
        type: "UNKNOWN_TYPE",
      } as unknown as UISchema;

      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const { container } = render(<DynamicRenderer schema={schema} />, { wrapper });

      expect(container.firstChild).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith("Unknown component type: UNKNOWN_TYPE");

      consoleSpy.mockRestore();
    });
  });
});
