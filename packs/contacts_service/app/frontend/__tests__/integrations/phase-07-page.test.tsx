import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/lib/ui-renderer/provider";
import { TooltipProvider } from "@ui/components/tooltip";
import { DynamicRenderer } from "@ui/lib/ui-renderer/renderer";
import { VIEW, PAGE } from "@ui/adapters";
import { LINK, DROPDOWN, OPTION } from "@ui/adapters";
import type { AdapterRegistry, UIServices } from "@ui/lib/ui-renderer/registry";
import type { ReactNode } from "react";

const mockServices: UIServices = {
  fetch: vi.fn().mockResolvedValue({ data: {} }),
  navigate: vi.fn(),
  toast: vi.fn(),
  confirm: vi.fn(),
};

const mockAdapters: AdapterRegistry = {
  VIEW,
  PAGE,
  LINK,
  DROPDOWN,
  OPTION,
} as AdapterRegistry;

interface WrapperProps {
  children: ReactNode;
}

function TestWrapper({ children }: WrapperProps) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  // View component handles translations from schema - no manual wiring needed
  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider adapters={mockAdapters} services={mockServices} locale="en">
        <TooltipProvider>{children}</TooltipProvider>
      </UIProvider>
    </QueryClientProvider>
  );
}

describe("Phase 7: PAGE Adapter", () => {
  describe("7.1 Page Structure", () => {
    it("renders title from schema", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "PAGE",
                  title: "Dashboard",
                },
              ],
            }}
          />
        </TestWrapper>
      );
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Dashboard");
    });

    it("renders description from schema", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "PAGE",
                  title: "Settings",
                  description: "Manage your account settings",
                },
              ],
            }}
          />
        </TestWrapper>
      );
      expect(screen.getByText("Manage your account settings")).toBeInTheDocument();
    });

    it("renders children in content area", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "PAGE",
                  title: "Test",
                  elements: [
                    {
                      type: "LINK",
                      label: "Child Button",
                    },
                  ],
                },
              ],
            }}
          />
        </TestWrapper>
      );
      expect(screen.getByRole("button", { name: "Child Button" })).toBeInTheDocument();
    });

    it("applies className from schema", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "PAGE",
                  title: "Styled Page",
                  className: "custom-page-class",
                },
              ],
            }}
          />
        </TestWrapper>
      );
      const pageElement = document.querySelector("[data-ui='page']");
      expect(pageElement).toHaveClass("custom-page-class");
    });

    it("renders without title when not provided", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "PAGE",
                  description: "Just a description",
                },
              ],
            }}
          />
        </TestWrapper>
      );
      expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
      expect(screen.getByText("Just a description")).toBeInTheDocument();
    });
  });

  describe("7.2 Page Actions", () => {
    it("renders actions in header", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "PAGE",
                  title: "Contacts",
                  actions: [
                    {
                      type: "LINK",
                      label: "Add New",
                    },
                  ],
                },
              ],
            }}
          />
        </TestWrapper>
      );
      expect(screen.getByRole("button", { name: "Add New" })).toBeInTheDocument();
    });

    it("renders LINK action", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "PAGE",
                  title: "Users",
                  actions: [
                    {
                      type: "LINK",
                      label: "Create User",
                      opens: "new_drawer",
                    },
                  ],
                },
              ],
            }}
          />
        </TestWrapper>
      );
      expect(screen.getByTestId("link-opens-new_drawer")).toBeInTheDocument();
    });

    it("renders DROPDOWN action", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "PAGE",
                  title: "Reports",
                  actions: [
                    {
                      type: "DROPDOWN",
                      label: "Export",
                      elements: [
                        { type: "OPTION", label: "CSV" },
                        { type: "OPTION", label: "PDF" },
                      ],
                    },
                  ],
                },
              ],
            }}
          />
        </TestWrapper>
      );
      expect(screen.getByRole("button", { name: /Export/i })).toBeInTheDocument();
    });

    it("renders multiple actions", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "PAGE",
                  title: "Items",
                  actions: [
                    { type: "LINK", label: "Add" },
                    { type: "LINK", label: "Import" },
                    { type: "DROPDOWN", label: "More" },
                  ],
                },
              ],
            }}
          />
        </TestWrapper>
      );
      expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Import" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /More/i })).toBeInTheDocument();
    });

    it("renders no actions when not provided", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "PAGE",
                  title: "Simple Page",
                },
              ],
            }}
          />
        </TestWrapper>
      );
      // Only the heading should be present, no action buttons
      const buttons = screen.queryAllByRole("button");
      expect(buttons).toHaveLength(0);
    });
  });

  describe("7.3 Page Translations", () => {
    it("translates title via t()", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              translations: { global: {}, views: { en: { page_title: "Translated Title" } } },
              elements: [
                {
                  type: "PAGE",
                  title: "page_title",
                },
              ],
            }}
          />
        </TestWrapper>
      );
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Translated Title");
    });

    it("translates description via t()", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              translations: { global: {}, views: { en: { page_desc: "Translated Description" } } },
              elements: [
                {
                  type: "PAGE",
                  title: "Title",
                  description: "page_desc",
                },
              ],
            }}
          />
        </TestWrapper>
      );
      expect(screen.getByText("Translated Description")).toBeInTheDocument();
    });

    it("actions have translated labels", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              translations: { global: {}, views: { en: { new_contact: "New Contact" } } },
              elements: [
                {
                  type: "PAGE",
                  title: "Contacts",
                  actions: [
                    {
                      type: "LINK",
                      label: "new_contact",
                    },
                  ],
                },
              ],
            }}
          />
        </TestWrapper>
      );
      expect(screen.getByRole("button", { name: "New Contact" })).toBeInTheDocument();
    });

    it("falls back to key when translation missing", () => {
      render(
        <TestWrapper>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              elements: [
                {
                  type: "PAGE",
                  title: "untranslated_key",
                },
              ],
            }}
          />
        </TestWrapper>
      );
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("untranslated_key");
    });
  });
});
