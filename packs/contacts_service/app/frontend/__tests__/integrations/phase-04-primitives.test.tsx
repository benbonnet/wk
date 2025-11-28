import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/provider";
import { TooltipProvider } from "@ui-components/ui/tooltip";
import {
  BUTTON,
  LINK,
  DROPDOWN,
  OPTION,
  SUBMIT,
} from "@ui/adapters/primitives";
import { VIEW, DrawerContext, FormContext } from "@ui/adapters/layouts";
import type { UIServices, FormContextValue } from "@ui/registry";
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
      <UIProvider
        components={{} as never}
        inputs={{} as never}
        displays={{} as never}
        services={services}
        locale="en"
      >
        <TooltipProvider>{children}</TooltipProvider>
      </UIProvider>
    </QueryClientProvider>
  );
}

// Wrapper that includes VIEW for components needing DrawerContext
function TestWrapperWithView({
  children,
  services = createMockServices(),
  queryClient = createQueryClient(),
}: WrapperProps) {
  return (
    <TestWrapper services={services} queryClient={queryClient}>
      <VIEW schema={{ type: "VIEW" }}>{children}</VIEW>
    </TestWrapper>
  );
}

describe("Phase 4: Primitive Adapters", () => {
  describe("4.1 Button/Link", () => {
    describe("BUTTON", () => {
      it("renders with label", () => {
        render(
          <TestWrapper>
            <BUTTON schema={{ type: "BUTTON", label: "Click Me" }} />
          </TestWrapper>
        );
        expect(screen.getByRole("button", { name: "Click Me" })).toBeInTheDocument();
      });

      it("calls onClick when clicked", async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();

        render(
          <TestWrapper>
            <BUTTON
              schema={{ type: "BUTTON", label: "Click" }}
              onClick={handleClick}
            />
          </TestWrapper>
        );

        await user.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalledTimes(1);
      });

      it("renders with primary variant by default", () => {
        render(
          <TestWrapper>
            <BUTTON schema={{ type: "BUTTON", label: "Primary" }} />
          </TestWrapper>
        );
        // Default variant maps to shadcn "default" which has no variant modifier
        expect(screen.getByRole("button")).toBeInTheDocument();
      });

      it("renders with destructive variant", () => {
        render(
          <TestWrapper>
            <BUTTON
              schema={{ type: "BUTTON", label: "Delete" }}
              variant="destructive"
            />
          </TestWrapper>
        );
        const button = screen.getByRole("button");
        expect(button).toHaveClass("bg-destructive");
      });

      it("renders with icon", () => {
        render(
          <TestWrapper>
            <BUTTON
              schema={{ type: "BUTTON", label: "Settings" }}
              icon="settings"
            />
          </TestWrapper>
        );
        // Icon should be rendered (as SVG)
        expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument();
      });
    });

    describe("LINK", () => {
      it("renders with label", () => {
        render(
          <TestWrapperWithView>
            <LINK schema={{ type: "LINK", label: "Go" }} />
          </TestWrapperWithView>
        );
        expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
      });

      it("navigates when href is provided", async () => {
        const user = userEvent.setup();
        const services = createMockServices();

        render(
          <TestWrapperWithView services={services}>
            <LINK schema={{ type: "LINK", label: "Go", href: "/dashboard" }} />
          </TestWrapperWithView>
        );

        await user.click(screen.getByRole("button"));
        expect(services.navigate).toHaveBeenCalledWith("/dashboard");
      });

      it("interpolates path parameters in href", async () => {
        const user = userEvent.setup();
        const services = createMockServices();

        render(
          <TestWrapperWithView services={services}>
            <LINK
              schema={{ type: "LINK", label: "View", href: "/users/:id" }}
              data={{ id: 123 }}
            />
          </TestWrapperWithView>
        );

        await user.click(screen.getByRole("button"));
        expect(services.navigate).toHaveBeenCalledWith("/users/123");
      });

      it("opens drawer when opens attribute is set", async () => {
        const user = userEvent.setup();

        render(
          <TestWrapper>
            <VIEW
              schema={{
                type: "VIEW",
                drawers: {
                  test_drawer: {
                    title: "Test Drawer",
                    elements: [],
                  },
                },
              }}
            >
              <LINK schema={{ type: "LINK", label: "Open", opens: "test_drawer" }} />
            </VIEW>
          </TestWrapper>
        );

        await user.click(screen.getByRole("button", { name: "Open" }));
        expect(screen.getByTestId("drawer-test_drawer")).toBeInTheDocument();
        expect(screen.getByText("Test Drawer")).toBeInTheDocument();
      });

      it("renders with data-testid when opens is set", () => {
        render(
          <TestWrapperWithView>
            <LINK schema={{ type: "LINK", label: "New", opens: "new_drawer" }} />
          </TestWrapperWithView>
        );
        expect(screen.getByTestId("link-opens-new_drawer")).toBeInTheDocument();
      });

      it("shows confirm dialog when confirm is set", async () => {
        const user = userEvent.setup();
        const services = createMockServices();

        render(
          <TestWrapperWithView services={services}>
            <LINK
              schema={{
                type: "LINK",
                label: "Delete",
                href: "/delete",
                confirm: "Are you sure?",
              }}
            />
          </TestWrapperWithView>
        );

        await user.click(screen.getByRole("button"));
        expect(services.confirm).toHaveBeenCalledWith("Are you sure?");
      });

      it("does not navigate when confirm is cancelled", async () => {
        const user = userEvent.setup();
        const services = createMockServices({
          confirm: vi.fn().mockResolvedValue(false),
        });

        render(
          <TestWrapperWithView services={services}>
            <LINK
              schema={{
                type: "LINK",
                label: "Delete",
                href: "/delete",
                confirm: "Are you sure?",
              }}
            />
          </TestWrapperWithView>
        );

        await user.click(screen.getByRole("button"));
        expect(services.navigate).not.toHaveBeenCalled();
      });
    });
  });

  describe("4.2 Dropdown", () => {
    it("renders trigger button with label", () => {
      render(
        <TestWrapperWithView>
          <DROPDOWN schema={{ type: "DROPDOWN", label: "Actions" }}>
            <div>Menu content</div>
          </DROPDOWN>
        </TestWrapperWithView>
      );
      expect(screen.getByRole("button", { name: /Actions/i })).toBeInTheDocument();
    });

    it("renders icon-only trigger when no label", () => {
      render(
        <TestWrapperWithView>
          <DROPDOWN schema={{ type: "DROPDOWN" }}>
            <div>Menu content</div>
          </DROPDOWN>
        </TestWrapperWithView>
      );
      expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
    });

    it("opens menu on click", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapperWithView>
          <DROPDOWN schema={{ type: "DROPDOWN", label: "Actions" }}>
            <OPTION schema={{ type: "OPTION", label: "Edit" }} />
            <OPTION schema={{ type: "OPTION", label: "Delete" }} />
          </DROPDOWN>
        </TestWrapperWithView>
      );

      await user.click(screen.getByRole("button", { name: /Actions/i }));
      expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: "Delete" })).toBeInTheDocument();
    });

    it("OPTION triggers action on click", async () => {
      const user = userEvent.setup();
      const services = createMockServices();

      render(
        <TestWrapperWithView services={services}>
          <DROPDOWN schema={{ type: "DROPDOWN", label: "Actions" }}>
            <OPTION
              schema={{ type: "OPTION", label: "Go", href: "/somewhere" }}
            />
          </DROPDOWN>
        </TestWrapperWithView>
      );

      await user.click(screen.getByRole("button", { name: /Actions/i }));
      await user.click(screen.getByRole("menuitem", { name: "Go" }));
      expect(services.navigate).toHaveBeenCalledWith("/somewhere");
    });

    it("OPTION can open drawer", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VIEW
            schema={{
              type: "VIEW",
              drawers: {
                edit_drawer: {
                  title: "Edit",
                  elements: [],
                },
              },
            }}
          >
            <DROPDOWN schema={{ type: "DROPDOWN", label: "Actions" }}>
              <OPTION
                schema={{ type: "OPTION", label: "Edit", opens: "edit_drawer" }}
              />
            </DROPDOWN>
          </VIEW>
        </TestWrapper>
      );

      await user.click(screen.getByRole("button", { name: /Actions/i }));
      await user.click(screen.getByRole("menuitem", { name: "Edit" }));
      expect(screen.getByTestId("drawer-edit_drawer")).toBeInTheDocument();
    });

    it("OPTION renders with destructive variant", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapperWithView>
          <DROPDOWN schema={{ type: "DROPDOWN", label: "Actions" }}>
            <OPTION
              schema={{ type: "OPTION", label: "Delete" }}
              variant="destructive"
            />
          </DROPDOWN>
        </TestWrapperWithView>
      );

      await user.click(screen.getByRole("button", { name: /Actions/i }));
      const deleteOption = screen.getByRole("menuitem", { name: "Delete" });
      expect(deleteOption).toHaveClass("text-destructive");
    });
  });

  describe("4.3 Submit", () => {
    // Create a mock FormContext
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
          <SUBMIT schema={{ type: "SUBMIT", label: "Save" }} />
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
          <SUBMIT schema={{ type: "SUBMIT", label: "Save" }} />
        </SubmitWrapper>
      );

      expect(screen.getByRole("button", { name: /Submitting/i })).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("displays custom loadingLabel during submission", () => {
      const formContext = createMockFormContext({ isSubmitting: true });

      render(
        <SubmitWrapper formContext={formContext}>
          <SUBMIT
            schema={{ type: "SUBMIT", label: "Save", loadingLabel: "Saving..." }}
          />
        </SubmitWrapper>
      );

      expect(screen.getByRole("button", { name: /Saving/i })).toBeInTheDocument();
    });

    it("is enabled when not submitting", () => {
      const formContext = createMockFormContext({ isSubmitting: false });

      render(
        <SubmitWrapper formContext={formContext}>
          <SUBMIT schema={{ type: "SUBMIT", label: "Save" }} />
        </SubmitWrapper>
      );

      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    it("uses default label when not provided", () => {
      const formContext = createMockFormContext();

      render(
        <SubmitWrapper formContext={formContext}>
          <SUBMIT schema={{ type: "SUBMIT" }} />
        </SubmitWrapper>
      );

      expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });
  });
});
