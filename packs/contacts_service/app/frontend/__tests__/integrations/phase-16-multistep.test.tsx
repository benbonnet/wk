import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/provider";
import { TooltipProvider } from "@ui-components/ui/tooltip";
import { VIEW, FORM, GROUP, MULTISTEP } from "@ui/adapters/layouts";
import { INPUT_TEXT } from "@ui/adapters/inputs";
import { COMPONENT, SUBMIT } from "@ui/adapters/primitives";
import type { UIServices, ComponentRegistry, InputRegistry } from "@ui/registry";
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

const mockComponents: ComponentRegistry = {
  VIEW,
  FORM,
  GROUP,
  MULTISTEP,
  COMPONENT,
  SUBMIT,
} as ComponentRegistry;

const mockInputs: InputRegistry = {
  INPUT_TEXT,
} as InputRegistry;

interface WrapperProps {
  children: ReactNode;
  services?: UIServices;
  translations?: Record<string, string>;
}

function TestWrapper({
  children,
  services = createMockServices(),
  translations = {},
}: WrapperProps) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider
        components={mockComponents}
        inputs={mockInputs}
        displays={{} as never}
        services={services}
        translations={{ views: translations, schemas: {}, common: { required: "This field is required" } }}
        locale="en"
      >
        <TooltipProvider>{children}</TooltipProvider>
      </UIProvider>
    </QueryClientProvider>
  );
}

// Step component for use with MULTISTEP (children-based API)
function Step({ label, children, active }: { label: string; children: ReactNode; active?: boolean }) {
  return <div data-testid={`step-${label}`}>{children}</div>;
}

describe("Phase 16: MULTISTEP (Wizard Forms)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("16.1 Step Rendering", () => {
    it("MULTISTEP renders first step by default", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <FORM schema={{ type: "FORM" }}>
              <MULTISTEP schema={{ type: "MULTISTEP" }}>
                <Step label="step1">
                  <div>Step 1 Content</div>
                </Step>
                <Step label="step2">
                  <div>Step 2 Content</div>
                </Step>
              </MULTISTEP>
            </FORM>
          </VIEW>
        </TestWrapper>
      );

      // First step should be visible
      expect(screen.getByText("Step 1 Content")).toBeInTheDocument();
      // Second step should not be visible
      expect(screen.queryByText("Step 2 Content")).not.toBeInTheDocument();
    });

    it("MULTISTEP renders step labels in indicator", () => {
      render(
        <TestWrapper translations={{ personal_info: "Personal Info", contact_info: "Contact Info" }}>
          <VIEW schema={{ type: "VIEW" }}>
            <FORM schema={{ type: "FORM" }}>
              <MULTISTEP schema={{ type: "MULTISTEP" }}>
                <Step label="personal_info">
                  <div>Step 1</div>
                </Step>
                <Step label="contact_info">
                  <div>Step 2</div>
                </Step>
              </MULTISTEP>
            </FORM>
          </VIEW>
        </TestWrapper>
      );

      expect(screen.getByText("Personal Info")).toBeInTheDocument();
      expect(screen.getByText("Contact Info")).toBeInTheDocument();
    });

    it("MULTISTEP shows navigation buttons", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <FORM schema={{ type: "FORM" }}>
              <MULTISTEP schema={{ type: "MULTISTEP" }}>
                <Step label="step1"><div>Step 1</div></Step>
                <Step label="step2"><div>Step 2</div></Step>
              </MULTISTEP>
            </FORM>
          </VIEW>
        </TestWrapper>
      );

      // On first step, should have Previous (disabled) and Next buttons
      expect(screen.getByRole("button", { name: /Previous/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
    });
  });

  describe("16.2 Step Navigation", () => {
    it("Click Next advances to next step", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <FORM schema={{ type: "FORM" }}>
              <MULTISTEP schema={{ type: "MULTISTEP" }}>
                <Step label="step1">
                  <div>First Step</div>
                </Step>
                <Step label="step2">
                  <div>Second Step</div>
                </Step>
              </MULTISTEP>
            </FORM>
          </VIEW>
        </TestWrapper>
      );

      // Initially on step 1
      expect(screen.getByText("First Step")).toBeInTheDocument();
      expect(screen.queryByText("Second Step")).not.toBeInTheDocument();

      // Click Next
      await user.click(screen.getByRole("button", { name: /Next/i }));

      // Now on step 2
      await waitFor(() => {
        expect(screen.queryByText("First Step")).not.toBeInTheDocument();
        expect(screen.getByText("Second Step")).toBeInTheDocument();
      });
    });

    it("Click Previous returns to previous step", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <FORM schema={{ type: "FORM" }}>
              <MULTISTEP schema={{ type: "MULTISTEP" }}>
                <Step label="step1">
                  <div>First Step</div>
                </Step>
                <Step label="step2">
                  <div>Second Step</div>
                </Step>
              </MULTISTEP>
            </FORM>
          </VIEW>
        </TestWrapper>
      );

      // Go to step 2
      await user.click(screen.getByRole("button", { name: /Next/i }));
      await waitFor(() => {
        expect(screen.getByText("Second Step")).toBeInTheDocument();
      });

      // Click Previous
      await user.click(screen.getByRole("button", { name: /Previous/i }));

      // Back on step 1
      await waitFor(() => {
        expect(screen.getByText("First Step")).toBeInTheDocument();
        expect(screen.queryByText("Second Step")).not.toBeInTheDocument();
      });
    });

    it("Previous button disabled on first step", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <FORM schema={{ type: "FORM" }}>
              <MULTISTEP schema={{ type: "MULTISTEP" }}>
                <Step label="step1"><div>Step 1</div></Step>
                <Step label="step2"><div>Step 2</div></Step>
              </MULTISTEP>
            </FORM>
          </VIEW>
        </TestWrapper>
      );

      // On first step, Previous button is disabled
      expect(screen.getByRole("button", { name: /Previous/i })).toBeDisabled();
    });

    it("Last step shows Submit instead of Next", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <FORM schema={{ type: "FORM" }}>
              <MULTISTEP schema={{ type: "MULTISTEP" }}>
                <Step label="step1"><div>Step 1</div></Step>
                <Step label="step2"><div>Step 2</div></Step>
              </MULTISTEP>
            </FORM>
          </VIEW>
        </TestWrapper>
      );

      // Go to last step
      await user.click(screen.getByRole("button", { name: /Next/i }));

      // Should have Submit button, not Next
      await waitFor(() => {
        expect(screen.queryByRole("button", { name: /Next/i })).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
      });
    });
  });

  describe("16.3 Progress Indication", () => {
    it("MULTISTEP shows step number indicators", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <FORM schema={{ type: "FORM" }}>
              <MULTISTEP schema={{ type: "MULTISTEP" }}>
                <Step label="step1"><div>Step 1</div></Step>
                <Step label="step2"><div>Step 2</div></Step>
                <Step label="step3"><div>Step 3</div></Step>
              </MULTISTEP>
            </FORM>
          </VIEW>
        </TestWrapper>
      );

      // Should show step number indicators (1, 2, 3)
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("Step indicator clickable for completed steps", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <FORM schema={{ type: "FORM" }}>
              <MULTISTEP schema={{ type: "MULTISTEP" }}>
                <Step label="step1">
                  <div>First Step</div>
                </Step>
                <Step label="step2">
                  <div>Second Step</div>
                </Step>
              </MULTISTEP>
            </FORM>
          </VIEW>
        </TestWrapper>
      );

      // Go to step 2
      await user.click(screen.getByRole("button", { name: /Next/i }));
      await waitFor(() => {
        expect(screen.getByText("Second Step")).toBeInTheDocument();
      });

      // Click on step 1 indicator to go back
      await user.click(screen.getByText("1"));

      // Should be back on step 1
      await waitFor(() => {
        expect(screen.getByText("First Step")).toBeInTheDocument();
      });
    });
  });

  describe("16.4 Step Content", () => {
    it("MULTISTEP renders step children content", () => {
      render(
        <TestWrapper>
          <VIEW schema={{ type: "VIEW" }}>
            <FORM schema={{ type: "FORM" }}>
              <MULTISTEP schema={{ type: "MULTISTEP" }}>
                <Step label="step1">
                  <div data-testid="step-content">Custom Content</div>
                </Step>
              </MULTISTEP>
            </FORM>
          </VIEW>
        </TestWrapper>
      );

      expect(screen.getByTestId("step-content")).toBeInTheDocument();
      expect(screen.getByText("Custom Content")).toBeInTheDocument();
    });
  });
});
