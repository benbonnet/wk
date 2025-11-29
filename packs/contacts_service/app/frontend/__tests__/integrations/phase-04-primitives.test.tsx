import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/lib/ui-renderer/provider";
import { DynamicRenderer } from "@ui/lib/ui-renderer/renderer";
import { TooltipProvider } from "@ui/components/tooltip";
import { FormContext } from "@ui/adapters";
import type { UIServices, FormContextValue } from "@ui/lib/ui-renderer/registry";
import type { UISchema } from "@ui/lib/ui-renderer/types";
import type { ReactNode } from "react";

function createMockServices(overrides?: Partial<UIServices>): UIServices {
  return {
    fetch: vi.fn().mockResolvedValue({ data: {} }),
    navigate: vi.fn(),
    toast: vi.fn(),
    confirm: vi.fn().mockResolvedValue(true),
    ...overrides,
  };
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

interface WrapperProps {
  children: ReactNode;
  services?: UIServices;
  queryClient?: QueryClient;
}

function TestWrapper({
  children,
  services = createMockServices(),
  queryClient = createQueryClient(),
}: WrapperProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider services={services} locale="en">
        <TooltipProvider>{children}</TooltipProvider>
      </UIProvider>
    </QueryClientProvider>
  );
}

function renderSchema(
  schema: UISchema,
  options?: { services?: UIServices; data?: Record<string, unknown> }
) {
  const services = options?.services ?? createMockServices();
  return render(
    <TestWrapper services={services}>
      <DynamicRenderer schema={schema} data={options?.data} />
    </TestWrapper>
  );
}

// Wrap in VIEW for components needing DrawerContext
function renderSchemaInView(
  schema: UISchema,
  options?: { services?: UIServices; data?: Record<string, unknown> }
) {
  const services = options?.services ?? createMockServices();
  return {
    ...render(
      <TestWrapper services={services}>
        <DynamicRenderer
          schema={{ type: "VIEW", elements: [schema] }}
          data={options?.data}
        />
      </TestWrapper>
    ),
    services,
  };
}

describe("Phase 4: Primitive Adapters", () => {
  describe("4.1 Button/Link", () => {
    describe("BUTTON", () => {
      it("renders with label", () => {
        renderSchema({ type: "BUTTON", label: "Click Me" });
        expect(screen.getByRole("button", { name: "Click Me" })).toBeInTheDocument();
      });

      it("renders with primary variant by default", () => {
        renderSchema({ type: "BUTTON", label: "Primary" });
        expect(screen.getByRole("button")).toBeInTheDocument();
      });

      it("renders with destructive variant", () => {
        renderSchema({ type: "BUTTON", label: "Delete", variant: "destructive" });
        const button = screen.getByRole("button");
        expect(button).toHaveClass("bg-destructive");
      });

      it("renders with icon", () => {
        renderSchema({ type: "BUTTON", label: "Settings", icon: "settings" });
        expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument();
      });
    });

    describe("LINK", () => {
      it("renders with label", () => {
        renderSchemaInView({ type: "LINK", label: "Go" });
        expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
      });

      it("navigates when href is provided", async () => {
        const user = userEvent.setup();
        const services = createMockServices();

        renderSchemaInView({ type: "LINK", label: "Go", href: "/dashboard" }, { services });

        await user.click(screen.getByRole("button"));
        expect(services.navigate).toHaveBeenCalledWith("/dashboard");
      });

      it("interpolates path parameters in href", async () => {
        const user = userEvent.setup();
        const services = createMockServices();

        renderSchemaInView(
          { type: "LINK", label: "View", href: "/users/:id" },
          { services, data: { id: 123 } }
        );

        await user.click(screen.getByRole("button"));
        expect(services.navigate).toHaveBeenCalledWith("/users/123");
      });

      it("opens drawer when opens attribute is set", async () => {
        const user = userEvent.setup();
        const services = createMockServices();

        render(
          <TestWrapper services={services}>
            <DynamicRenderer
              schema={{
                type: "VIEW",
                drawers: {
                  test_drawer: {
                    title: "Test Drawer",
                    elements: [],
                  },
                },
                elements: [{ type: "LINK", label: "Open", opens: "test_drawer" }],
              }}
            />
          </TestWrapper>
        );

        await user.click(screen.getByRole("button", { name: "Open" }));
        expect(screen.getByTestId("drawer-test_drawer")).toBeInTheDocument();
        expect(screen.getByText("Test Drawer")).toBeInTheDocument();
      });

      it("renders with data-testid when opens is set", () => {
        renderSchemaInView({ type: "LINK", label: "New", opens: "new_drawer" });
        expect(screen.getByTestId("link-opens-new_drawer")).toBeInTheDocument();
      });

      it("shows confirm dialog when confirm is set", async () => {
        const user = userEvent.setup();
        const services = createMockServices();

        renderSchemaInView(
          { type: "LINK", label: "Delete", href: "/delete", confirm: "Are you sure?" },
          { services }
        );

        await user.click(screen.getByRole("button"));
        expect(services.confirm).toHaveBeenCalledWith("Are you sure?");
      });

      it("does not navigate when confirm is cancelled", async () => {
        const user = userEvent.setup();
        const services = createMockServices({
          confirm: vi.fn().mockResolvedValue(false),
        });

        renderSchemaInView(
          { type: "LINK", label: "Delete", href: "/delete", confirm: "Are you sure?" },
          { services }
        );

        await user.click(screen.getByRole("button"));
        expect(services.navigate).not.toHaveBeenCalled();
      });
    });
  });

  describe("4.2 Dropdown", () => {
    it("renders trigger button with label", () => {
      renderSchemaInView({ type: "DROPDOWN", label: "Actions", elements: [] });
      expect(screen.getByRole("button", { name: /Actions/i })).toBeInTheDocument();
    });

    it("renders icon-only trigger when no label", () => {
      renderSchemaInView({ type: "DROPDOWN", elements: [] });
      expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
    });

    it("opens menu on click", async () => {
      const user = userEvent.setup();

      renderSchemaInView({
        type: "DROPDOWN",
        label: "Actions",
        elements: [
          { type: "OPTION", label: "Edit" },
          { type: "OPTION", label: "Delete" },
        ],
      });

      await user.click(screen.getByRole("button", { name: /Actions/i }));
      expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: "Delete" })).toBeInTheDocument();
    });

    it("OPTION triggers action on click", async () => {
      const user = userEvent.setup();
      const services = createMockServices();

      renderSchemaInView(
        {
          type: "DROPDOWN",
          label: "Actions",
          elements: [{ type: "OPTION", label: "Go", href: "/somewhere" }],
        },
        { services }
      );

      await user.click(screen.getByRole("button", { name: /Actions/i }));
      await user.click(screen.getByRole("menuitem", { name: "Go" }));
      expect(services.navigate).toHaveBeenCalledWith("/somewhere");
    });

    it("OPTION can open drawer", async () => {
      const user = userEvent.setup();
      const services = createMockServices();

      render(
        <TestWrapper services={services}>
          <DynamicRenderer
            schema={{
              type: "VIEW",
              drawers: {
                edit_drawer: {
                  title: "Edit",
                  elements: [],
                },
              },
              elements: [
                {
                  type: "DROPDOWN",
                  label: "Actions",
                  elements: [{ type: "OPTION", label: "Edit", opens: "edit_drawer" }],
                },
              ],
            }}
          />
        </TestWrapper>
      );

      await user.click(screen.getByRole("button", { name: /Actions/i }));
      await user.click(screen.getByRole("menuitem", { name: "Edit" }));
      expect(screen.getByTestId("drawer-edit_drawer")).toBeInTheDocument();
    });

    it("OPTION renders with destructive variant", async () => {
      const user = userEvent.setup();

      renderSchemaInView({
        type: "DROPDOWN",
        label: "Actions",
        elements: [{ type: "OPTION", label: "Delete", variant: "destructive" }],
      });

      await user.click(screen.getByRole("button", { name: /Actions/i }));
      const deleteOption = screen.getByRole("menuitem", { name: "Delete" });
      expect(deleteOption).toHaveClass("text-destructive");
    });
  });

  describe("4.3 Submit", () => {
    function createMockFormContext(overrides?: Partial<FormContextValue>): FormContextValue {
      return {
        values: {},
        errors: {},
        touched: {},
        isSubmitting: false,
        isDirty: false,
        setFieldValue: vi.fn(),
        setFieldError: vi.fn(),
        setFieldTouched: vi.fn(),
        handleSubmit: vi.fn(),
        reset: vi.fn(),
        ...overrides,
      };
    }

    function SubmitWrapper({
      children,
      formContext,
    }: {
      children: ReactNode;
      formContext: FormContextValue;
    }) {
      return (
        <TestWrapper>
          <FormContext.Provider value={formContext}>
            {children}
          </FormContext.Provider>
        </TestWrapper>
      );
    }

    it("renders submit button", () => {
      const formContext = createMockFormContext();

      render(
        <SubmitWrapper formContext={formContext}>
          <DynamicRenderer schema={{ type: "SUBMIT", label: "Save" }} />
        </SubmitWrapper>
      );

      const button = screen.getByRole("button", { name: "Save" });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("type", "submit");
    });

    it("shows loading state when form submitting", () => {
      const formContext = createMockFormContext({ isSubmitting: true });

      render(
        <SubmitWrapper formContext={formContext}>
          <DynamicRenderer schema={{ type: "SUBMIT", label: "Save" }} />
        </SubmitWrapper>
      );

      expect(screen.getByRole("button", { name: /Submitting/i })).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("displays custom loadingLabel during submission", () => {
      const formContext = createMockFormContext({ isSubmitting: true });

      render(
        <SubmitWrapper formContext={formContext}>
          <DynamicRenderer schema={{ type: "SUBMIT", label: "Save", loadingLabel: "Saving..." }} />
        </SubmitWrapper>
      );

      expect(screen.getByRole("button", { name: /Saving/i })).toBeInTheDocument();
    });

    it("is enabled when not submitting", () => {
      const formContext = createMockFormContext({ isSubmitting: false });

      render(
        <SubmitWrapper formContext={formContext}>
          <DynamicRenderer schema={{ type: "SUBMIT", label: "Save" }} />
        </SubmitWrapper>
      );

      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    it("uses default label when not provided", () => {
      const formContext = createMockFormContext();

      render(
        <SubmitWrapper formContext={formContext}>
          <DynamicRenderer schema={{ type: "SUBMIT" }} />
        </SubmitWrapper>
      );

      expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });
  });
});
