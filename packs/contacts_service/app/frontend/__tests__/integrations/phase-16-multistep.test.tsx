/**
 * EXCEPTION: Synthetic tests for MULTISTEP component
 *
 * Unlike other integration tests that use real backend-generated mocks,
 * these tests use inline schemas because MULTISTEP is not currently used
 * in any backend view. We keep these tests to ensure the component works
 * when we eventually add wizard-style forms.
 *
 * When MULTISTEP is added to a real view, migrate these tests to use
 * the generated mock from `__tests__/mocks/views/`.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/lib/ui-renderer/provider";
import { DynamicRenderer } from "@ui/lib/ui-renderer/renderer";
import { TooltipProvider } from "@ui/components/tooltip";
import type { UIServices } from "@ui/lib/ui-renderer/registry";
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

interface WrapperProps {
  children: ReactNode;
  services?: UIServices;
}

function TestWrapper({
  children,
  services = createMockServices(),
}: WrapperProps) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  // View component handles translations from schema - no manual wiring needed
  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider services={services} locale="en">
        <TooltipProvider>{children}</TooltipProvider>
      </UIProvider>
    </QueryClientProvider>
  );
}

function renderSchema(schema: UISchema) {
  return render(
    <TestWrapper>
      <DynamicRenderer schema={schema} />
    </TestWrapper>
  );
}

describe("Phase 16: MULTISTEP (Wizard Forms)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("16.1 Step Rendering", () => {
    it("MULTISTEP renders first step by default", () => {
      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "FORM",
            elements: [
              {
                type: "MULTISTEP",
                elements: [
                  { type: "STEP", label: "step1", elements: [{ type: "ALERT", label: "Step 1 Content" }] },
                  { type: "STEP", label: "step2", elements: [{ type: "ALERT", label: "Step 2 Content" }] },
                ],
              },
            ],
          },
        ],
      });

      // First step should be visible
      expect(screen.getByText("Step 1 Content")).toBeInTheDocument();
      // Second step should not be visible
      expect(screen.queryByText("Step 2 Content")).not.toBeInTheDocument();
    });

    it("MULTISTEP renders step labels in indicator", () => {
      renderSchema({
        type: "VIEW",
        translations: { en: { personal_info: "Personal Info", contact_info: "Contact Info" } },
        elements: [
          {
            type: "FORM",
            elements: [
              {
                type: "MULTISTEP",
                elements: [
                  { type: "STEP", label: "personal_info", elements: [{ type: "ALERT", label: "Step 1" }] },
                  { type: "STEP", label: "contact_info", elements: [{ type: "ALERT", label: "Step 2" }] },
                ],
              },
            ],
          },
        ],
      });

      // Step labels appear in both the indicator and step header
      expect(screen.getAllByText("Personal Info").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Contact Info").length).toBeGreaterThan(0);
    });

    it("MULTISTEP shows navigation buttons", () => {
      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "FORM",
            elements: [
              {
                type: "MULTISTEP",
                elements: [
                  { type: "STEP", label: "step1", elements: [{ type: "ALERT", label: "Step 1" }] },
                  { type: "STEP", label: "step2", elements: [{ type: "ALERT", label: "Step 2" }] },
                ],
              },
            ],
          },
        ],
      });

      // On first step, should have Previous (disabled) and Next buttons
      expect(screen.getByRole("button", { name: /Previous/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
    });
  });

  describe("16.2 Step Navigation", () => {
    it("Click Next advances to next step", async () => {
      const user = userEvent.setup();

      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "FORM",
            elements: [
              {
                type: "MULTISTEP",
                elements: [
                  { type: "STEP", label: "step1", elements: [{ type: "ALERT", label: "First Step" }] },
                  { type: "STEP", label: "step2", elements: [{ type: "ALERT", label: "Second Step" }] },
                ],
              },
            ],
          },
        ],
      });

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

      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "FORM",
            elements: [
              {
                type: "MULTISTEP",
                elements: [
                  { type: "STEP", label: "step1", elements: [{ type: "ALERT", label: "First Step" }] },
                  { type: "STEP", label: "step2", elements: [{ type: "ALERT", label: "Second Step" }] },
                ],
              },
            ],
          },
        ],
      });

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
      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "FORM",
            elements: [
              {
                type: "MULTISTEP",
                elements: [
                  { type: "STEP", label: "step1", elements: [{ type: "ALERT", label: "Step 1" }] },
                  { type: "STEP", label: "step2", elements: [{ type: "ALERT", label: "Step 2" }] },
                ],
              },
            ],
          },
        ],
      });

      // On first step, Previous button is disabled
      expect(screen.getByRole("button", { name: /Previous/i })).toBeDisabled();
    });

    it("Last step shows Submit instead of Next", async () => {
      const user = userEvent.setup();

      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "FORM",
            elements: [
              {
                type: "MULTISTEP",
                elements: [
                  { type: "STEP", label: "step1", elements: [{ type: "ALERT", label: "Step 1" }] },
                  { type: "STEP", label: "step2", elements: [{ type: "ALERT", label: "Step 2" }] },
                ],
              },
            ],
          },
        ],
      });

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
      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "FORM",
            elements: [
              {
                type: "MULTISTEP",
                elements: [
                  { type: "STEP", label: "step1", elements: [{ type: "ALERT", label: "Step 1" }] },
                  { type: "STEP", label: "step2", elements: [{ type: "ALERT", label: "Step 2" }] },
                  { type: "STEP", label: "step3", elements: [{ type: "ALERT", label: "Step 3" }] },
                ],
              },
            ],
          },
        ],
      });

      // Should show step number indicators (1, 2, 3)
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("Step indicator clickable for completed steps", async () => {
      const user = userEvent.setup();

      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "FORM",
            elements: [
              {
                type: "MULTISTEP",
                elements: [
                  { type: "STEP", label: "step1", elements: [{ type: "ALERT", label: "First Step" }] },
                  { type: "STEP", label: "step2", elements: [{ type: "ALERT", label: "Second Step" }] },
                ],
              },
            ],
          },
        ],
      });

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
      renderSchema({
        type: "VIEW",
        elements: [
          {
            type: "FORM",
            elements: [
              {
                type: "MULTISTEP",
                elements: [
                  {
                    type: "STEP",
                    label: "step1",
                    elements: [{ type: "ALERT", label: "Custom Content" }],
                  },
                ],
              },
            ],
          },
        ],
      });

      expect(screen.getByText("Custom Content")).toBeInTheDocument();
    });
  });
});
