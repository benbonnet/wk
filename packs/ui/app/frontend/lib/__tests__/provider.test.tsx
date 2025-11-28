import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  UIProvider,
  useUI,
  useComponents,
  useInputs,
  useDisplays,
  useServices,
  useTranslate,
  useLocale,
} from "../provider";
import type {
  ComponentRegistry,
  InputRegistry,
  DisplayRegistry,
  UIServices,
} from "../registry";

// Mock registries
const mockComponents = {
  VIEW: () => <div>VIEW</div>,
  PAGE: () => <div>PAGE</div>,
  DRAWER: () => <div>DRAWER</div>,
  FORM: () => <div>FORM</div>,
  TABLE: () => <div>TABLE</div>,
  SHOW: () => <div>SHOW</div>,
  ACTIONS: () => <div>ACTIONS</div>,
  GROUP: () => <div>GROUP</div>,
  CARD_GROUP: () => <div>CARD_GROUP</div>,
  MULTISTEP: () => <div>MULTISTEP</div>,
  STEP: () => <div>STEP</div>,
  FORM_ARRAY: () => <div>FORM_ARRAY</div>,
  DISPLAY_ARRAY: () => <div>DISPLAY_ARRAY</div>,
  ALERT: () => <div>ALERT</div>,
  LINK: () => <div>LINK</div>,
  BUTTON: () => <div>BUTTON</div>,
  DROPDOWN: () => <div>DROPDOWN</div>,
  OPTION: () => <div>OPTION</div>,
  SEARCH: () => <div>SEARCH</div>,
  SUBMIT: () => <div>SUBMIT</div>,
  COMPONENT: () => <div>COMPONENT</div>,
  RELATIONSHIP_PICKER: () => <div>RELATIONSHIP_PICKER</div>,
} as unknown as ComponentRegistry;

const mockInputs = {
  INPUT_TEXT: () => <input type="text" />,
  INPUT_TEXTAREA: () => <textarea />,
  INPUT_SELECT: () => <select />,
  INPUT_CHECKBOX: () => <input type="checkbox" />,
  INPUT_CHECKBOXES: () => <div>CHECKBOXES</div>,
  INPUT_RADIOS: () => <div>RADIOS</div>,
  INPUT_DATE: () => <input type="date" />,
  INPUT_DATETIME: () => <input type="datetime-local" />,
  INPUT_TAGS: () => <div>TAGS</div>,
  INPUT_AI_RICH_TEXT: () => <div>RICH_TEXT</div>,
} as unknown as InputRegistry;

const mockDisplays = {
  DISPLAY_TEXT: () => <span>TEXT</span>,
  DISPLAY_LONGTEXT: () => <p>LONGTEXT</p>,
  DISPLAY_NUMBER: () => <span>NUMBER</span>,
  DISPLAY_DATE: () => <span>DATE</span>,
  DISPLAY_DATETIME: () => <span>DATETIME</span>,
  DISPLAY_BADGE: () => <span>BADGE</span>,
  DISPLAY_TAGS: () => <span>TAGS</span>,
  DISPLAY_BOOLEAN: () => <span>BOOLEAN</span>,
  DISPLAY_SELECT: () => <span>SELECT</span>,
} as unknown as DisplayRegistry;

const mockServices: UIServices = {
  fetch: vi.fn(),
  navigate: vi.fn(),
  toast: vi.fn(),
  confirm: vi.fn(),
};

const mockTranslations = {
  schemas: { contact: { first_name: "First Name", last_name: "Last Name" } },
  views: { page_title: "Contacts", new_contact: "New Contact" },
  common: { save: "Save", cancel: "Cancel" },
};

describe("UIProvider", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <UIProvider
      components={mockComponents}
      inputs={mockInputs}
      displays={mockDisplays}
      services={mockServices}
      translations={mockTranslations}
      locale="en"
    >
      {children}
    </UIProvider>
  );

  describe("useUI", () => {
    it("throws error when used outside provider", () => {
      const TestComponent = () => {
        useUI();
        return null;
      };

      expect(() => render(<TestComponent />)).toThrow(
        "useUI must be used within a UIProvider"
      );
    });

    it("returns context value when inside provider", () => {
      let contextValue: ReturnType<typeof useUI> | null = null;

      const TestComponent = () => {
        contextValue = useUI();
        return <div>Test</div>;
      };

      render(<TestComponent />, { wrapper });

      expect(contextValue).not.toBeNull();
      expect(contextValue!.components).toBe(mockComponents);
      expect(contextValue!.inputs).toBe(mockInputs);
      expect(contextValue!.displays).toBe(mockDisplays);
      expect(contextValue!.services).toBe(mockServices);
      expect(contextValue!.locale).toBe("en");
    });
  });

  describe("useComponents", () => {
    it("returns component registry", () => {
      let components: ComponentRegistry | null = null;

      const TestComponent = () => {
        components = useComponents();
        return <div>Test</div>;
      };

      render(<TestComponent />, { wrapper });

      expect(components).toBe(mockComponents);
    });
  });

  describe("useInputs", () => {
    it("returns input registry", () => {
      let inputs: InputRegistry | null = null;

      const TestComponent = () => {
        inputs = useInputs();
        return <div>Test</div>;
      };

      render(<TestComponent />, { wrapper });

      expect(inputs).toBe(mockInputs);
    });
  });

  describe("useDisplays", () => {
    it("returns display registry", () => {
      let displays: DisplayRegistry | null = null;

      const TestComponent = () => {
        displays = useDisplays();
        return <div>Test</div>;
      };

      render(<TestComponent />, { wrapper });

      expect(displays).toBe(mockDisplays);
    });
  });

  describe("useServices", () => {
    it("returns services", () => {
      let services: UIServices | null = null;

      const TestComponent = () => {
        services = useServices();
        return <div>Test</div>;
      };

      render(<TestComponent />, { wrapper });

      expect(services).toBe(mockServices);
    });
  });

  describe("useLocale", () => {
    it("returns locale", () => {
      let locale: string | null = null;

      const TestComponent = () => {
        locale = useLocale();
        return <div>Test</div>;
      };

      render(<TestComponent />, { wrapper });

      expect(locale).toBe("en");
    });
  });

  describe("useTranslate", () => {
    it("translates view keys", () => {
      const TestComponent = () => {
        const t = useTranslate();
        return <div data-testid="result">{t("page_title")}</div>;
      };

      render(<TestComponent />, { wrapper });

      expect(screen.getByTestId("result").textContent).toBe("Contacts");
    });

    it("translates common keys", () => {
      const TestComponent = () => {
        const t = useTranslate();
        return <div data-testid="result">{t("save")}</div>;
      };

      render(<TestComponent />, { wrapper });

      expect(screen.getByTestId("result").textContent).toBe("Save");
    });

    it("translates schema keys with namespace", () => {
      const TestComponent = () => {
        const t = useTranslate();
        return <div data-testid="result">{t("first_name", "contact")}</div>;
      };

      render(<TestComponent />, { wrapper });

      expect(screen.getByTestId("result").textContent).toBe("First Name");
    });

    it("returns key when translation not found", () => {
      const TestComponent = () => {
        const t = useTranslate();
        return <div data-testid="result">{t("unknown_key")}</div>;
      };

      render(<TestComponent />, { wrapper });

      expect(screen.getByTestId("result").textContent).toBe("unknown_key");
    });

    it("returns key when no translations provided", () => {
      const noTranslationsWrapper = ({ children }: { children: React.ReactNode }) => (
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

      const TestComponent = () => {
        const t = useTranslate();
        return <div data-testid="result">{t("page_title")}</div>;
      };

      render(<TestComponent />, { wrapper: noTranslationsWrapper });

      expect(screen.getByTestId("result").textContent).toBe("page_title");
    });
  });
});
