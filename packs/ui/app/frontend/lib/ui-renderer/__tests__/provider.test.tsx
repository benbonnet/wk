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
  global: {
    en: { confirm_title: "Global Confirm", confirm_cancel: "Cancel" },
    fr: { confirm_title: "Confirmer", confirm_cancel: "Annuler" },
  },
  views: {
    en: { page_title: "Contacts", confirm_title: "View Confirm" },
    fr: { page_title: "Contacts FR" },
  },
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
    it("returns view translation when key exists in views", () => {
      const TestComponent = () => {
        const t = useTranslate();
        return <div data-testid="result">{t("confirm_title")}</div>;
      };

      render(<TestComponent />, { wrapper });

      // views takes precedence over global
      expect(screen.getByTestId("result").textContent).toBe("View Confirm");
    });

    it("falls back to global when key not in views", () => {
      const TestComponent = () => {
        const t = useTranslate();
        return <div data-testid="result">{t("confirm_cancel")}</div>;
      };

      render(<TestComponent />, { wrapper });

      expect(screen.getByTestId("result").textContent).toBe("Cancel");
    });

    it("returns key when not found in views or global", () => {
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

    it("respects locale for translations", () => {
      const frWrapper = ({ children }: { children: React.ReactNode }) => (
        <UIProvider
          services={mockServices}
          translations={mockTranslations}
          locale="fr"
        >
          {children}
        </UIProvider>
      );

      const TestComponent = () => {
        const t = useTranslate();
        return <div data-testid="result">{t("page_title")}</div>;
      };

      render(<TestComponent />, { wrapper: frWrapper });

      expect(screen.getByTestId("result").textContent).toBe("Contacts FR");
    });
  });
});
