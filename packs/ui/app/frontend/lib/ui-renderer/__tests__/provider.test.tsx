import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  UIProvider,
  useUI,
  useServices,
  useTranslate,
  useLocale,
} from "../provider";
import type { UIServices } from "../registry";

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
      const TestComponent = () => {
        const ctx = useUI();
        return (
          <div>
            <span data-testid="has-services">{ctx.services ? "yes" : "no"}</span>
            <span data-testid="locale">{ctx.locale}</span>
          </div>
        );
      };

      render(<TestComponent />, { wrapper });

      expect(screen.getByTestId("has-services").textContent).toBe("yes");
      expect(screen.getByTestId("locale").textContent).toBe("en");
    });
  });

  describe("useServices", () => {
    it("returns services", () => {
      const TestComponent = () => {
        const services = useServices();
        return (
          <div data-testid="has-services">
            {services && typeof services.fetch === "function" ? "yes" : "no"}
          </div>
        );
      };

      render(<TestComponent />, { wrapper });

      expect(screen.getByTestId("has-services").textContent).toBe("yes");
    });
  });

  describe("useLocale", () => {
    it("returns locale", () => {
      const TestComponent = () => {
        const locale = useLocale();
        return <div data-testid="locale">{locale}</div>;
      };

      render(<TestComponent />, { wrapper });

      expect(screen.getByTestId("locale").textContent).toBe("en");
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
