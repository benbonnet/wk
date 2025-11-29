import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { UIProvider } from "@ui/lib/ui-renderer/provider";
import { DynamicRenderer } from "@ui/lib/ui-renderer/renderer";
import { TooltipProvider } from "@ui/components/tooltip";
import { ShowContext } from "@ui/adapters";
import type { UIServices } from "@ui/lib/ui-renderer/registry";
import type { UISchema } from "@ui/lib/ui-renderer/types";
import type { ReactNode } from "react";

// Minimal mock services
const mockServices: UIServices = {
  fetch: vi.fn(),
  navigate: vi.fn(),
  toast: vi.fn(),
  confirm: vi.fn(),
};

interface WrapperProps {
  children: ReactNode;
  showData?: Record<string, unknown>;
}

function TestWrapper({ children, showData = {} }: WrapperProps) {
  return (
    <UIProvider services={mockServices} locale="en">
      <TooltipProvider>
        <ShowContext.Provider value={{ data: showData }}>
          {children}
        </ShowContext.Provider>
      </TooltipProvider>
    </UIProvider>
  );
}

function renderSchema(schema: UISchema, data?: Record<string, unknown>) {
  return render(
    <TestWrapper>
      <DynamicRenderer schema={schema} data={data} />
    </TestWrapper>
  );
}

function renderSchemaWithContext(schema: UISchema, showData: Record<string, unknown>) {
  return render(
    <TestWrapper showData={showData}>
      <DynamicRenderer schema={schema} />
    </TestWrapper>
  );
}

describe("Phase 2: Display Adapters", () => {
  describe("2.1 Text Displays", () => {
    describe("DISPLAY_TEXT", () => {
      it("renders string value", () => {
        renderSchema({ type: "DISPLAY_TEXT", name: "name" }, { name: "John Doe" });
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      it("renders empty state (—) for null value", () => {
        renderSchema({ type: "DISPLAY_TEXT", name: "name" }, { name: null });
        expect(screen.getByText("—")).toBeInTheDocument();
      });

      it("renders empty state (—) for undefined value", () => {
        renderSchema({ type: "DISPLAY_TEXT", name: "name" }, { name: undefined });
        expect(screen.getByText("—")).toBeInTheDocument();
      });

      it("renders value from ShowContext when no value prop", () => {
        renderSchemaWithContext({ type: "DISPLAY_TEXT", name: "firstName" }, { firstName: "Jane" });
        expect(screen.getByText("Jane")).toBeInTheDocument();
      });

      it("prefers value prop over ShowContext", () => {
        render(
          <TestWrapper showData={{ firstName: "Context Value" }}>
            <DynamicRenderer schema={{ type: "DISPLAY_TEXT", name: "firstName" }} data={{ firstName: "Prop Value" }} />
          </TestWrapper>
        );
        expect(screen.getByText("Prop Value")).toBeInTheDocument();
        expect(screen.queryByText("Context Value")).not.toBeInTheDocument();
      });
    });

    describe("DISPLAY_LONGTEXT", () => {
      it("renders multiline text preserving whitespace", () => {
        const multiline = "Line 1\nLine 2\nLine 3";
        renderSchema({ type: "DISPLAY_LONGTEXT", name: "bio" }, { bio: multiline });
        const element = screen.getByText((content, node) => {
          return node?.tagName === "P" && node?.textContent === multiline;
        });
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass("whitespace-pre-wrap");
      });

      it("renders empty state for null", () => {
        renderSchema({ type: "DISPLAY_LONGTEXT", name: "bio" }, { bio: null });
        expect(screen.getByText("—")).toBeInTheDocument();
      });
    });

    describe("DISPLAY_NUMBER", () => {
      it("renders numeric value", () => {
        renderSchema({ type: "DISPLAY_NUMBER", name: "count" }, { count: 42 });
        expect(screen.getByText("42")).toBeInTheDocument();
      });

      it("renders formatted number with thousands separator", () => {
        renderSchema({ type: "DISPLAY_NUMBER", name: "amount" }, { amount: 1234567 });
        expect(screen.getByText("1,234,567")).toBeInTheDocument();
      });

      it("renders empty state for null", () => {
        renderSchema({ type: "DISPLAY_NUMBER", name: "count" }, { count: null });
        expect(screen.getByText("—")).toBeInTheDocument();
      });

      it("renders zero correctly", () => {
        renderSchema({ type: "DISPLAY_NUMBER", name: "count" }, { count: 0 });
        expect(screen.getByText("0")).toBeInTheDocument();
      });
    });
  });

  describe("2.2 Date Displays", () => {
    describe("DISPLAY_DATE", () => {
      it("renders formatted date", () => {
        renderSchema({ type: "DISPLAY_DATE", name: "created" }, { created: "2024-01-15" });
        expect(screen.getByText("January 15th, 2024")).toBeInTheDocument();
      });

      it("renders empty state for null", () => {
        renderSchema({ type: "DISPLAY_DATE", name: "created" }, { created: null });
        expect(screen.getByText("—")).toBeInTheDocument();
      });

      it("renders empty state for empty string", () => {
        renderSchema({ type: "DISPLAY_DATE", name: "created" }, { created: "" });
        expect(screen.getByText("—")).toBeInTheDocument();
      });
    });

    describe("DISPLAY_DATETIME", () => {
      it("renders date with time", () => {
        renderSchema({ type: "DISPLAY_DATETIME", name: "timestamp" }, { timestamp: "2024-01-15T14:30:00Z" });
        expect(screen.getByText(/January 15th, 2024/)).toBeInTheDocument();
      });

      it("renders empty state for null", () => {
        renderSchema({ type: "DISPLAY_DATETIME", name: "timestamp" }, { timestamp: null });
        expect(screen.getByText("—")).toBeInTheDocument();
      });
    });
  });

  describe("2.3 Semantic Displays", () => {
    describe("DISPLAY_BOOLEAN", () => {
      it("renders 'Yes' for true value", () => {
        renderSchema({ type: "DISPLAY_BOOLEAN", name: "active" }, { active: true });
        expect(screen.getByText("Yes")).toBeInTheDocument();
      });

      it("renders 'No' for false value", () => {
        renderSchema({ type: "DISPLAY_BOOLEAN", name: "active" }, { active: false });
        expect(screen.getByText("No")).toBeInTheDocument();
      });

      it("renders 'No' for null/undefined (falsy)", () => {
        renderSchema({ type: "DISPLAY_BOOLEAN", name: "active" }, { active: null });
        expect(screen.getByText("No")).toBeInTheDocument();
      });

      it("renders 'Yes' for truthy string", () => {
        renderSchema({ type: "DISPLAY_BOOLEAN", name: "active" }, { active: "yes" });
        expect(screen.getByText("Yes")).toBeInTheDocument();
      });
    });

    describe("DISPLAY_BADGE", () => {
      it("renders value as badge", () => {
        renderSchema({ type: "DISPLAY_BADGE", name: "status" }, { status: "active" });
        expect(screen.getByText("active")).toBeInTheDocument();
      });

      it("renders label from options when matching value", () => {
        const options = [
          { label: "Active User", value: "active" },
          { label: "Inactive User", value: "inactive" },
        ];
        renderSchema({ type: "DISPLAY_BADGE", name: "status", options }, { status: "active" });
        expect(screen.getByText("Active User")).toBeInTheDocument();
      });

      it("renders empty state for null", () => {
        renderSchema({ type: "DISPLAY_BADGE", name: "status" }, { status: null });
        expect(screen.getByText("—")).toBeInTheDocument();
      });
    });

    describe("DISPLAY_TAGS", () => {
      it("renders array of tags as badges", () => {
        renderSchema({ type: "DISPLAY_TAGS", name: "tags" }, { tags: ["react", "typescript", "vitest"] });
        expect(screen.getByText("react")).toBeInTheDocument();
        expect(screen.getByText("typescript")).toBeInTheDocument();
        expect(screen.getByText("vitest")).toBeInTheDocument();
      });

      it("renders empty state for empty array", () => {
        renderSchema({ type: "DISPLAY_TAGS", name: "tags" }, { tags: [] });
        expect(screen.getByText("—")).toBeInTheDocument();
      });

      it("renders empty state for non-array value", () => {
        renderSchema({ type: "DISPLAY_TAGS", name: "tags" }, { tags: "not an array" as never });
        expect(screen.getByText("—")).toBeInTheDocument();
      });

      it("renders empty state for null", () => {
        renderSchema({ type: "DISPLAY_TAGS", name: "tags" }, { tags: null });
        expect(screen.getByText("—")).toBeInTheDocument();
      });
    });

    describe("DISPLAY_SELECT", () => {
      it("renders label from options matching value", () => {
        const options = [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
          { label: "Other", value: "other" },
        ];
        renderSchema({ type: "DISPLAY_SELECT", name: "gender", options }, { gender: "female" });
        expect(screen.getByText("Female")).toBeInTheDocument();
      });

      it("renders raw value when no matching option", () => {
        const options = [{ label: "Option A", value: "a" }];
        renderSchema({ type: "DISPLAY_SELECT", name: "choice", options }, { choice: "unknown" });
        expect(screen.getByText("unknown")).toBeInTheDocument();
      });

      it("renders empty state for null value", () => {
        const options = [{ label: "Option A", value: "a" }];
        renderSchema({ type: "DISPLAY_SELECT", name: "choice", options }, { choice: null });
        expect(screen.getByText("—")).toBeInTheDocument();
      });

      it("renders raw value when no options provided", () => {
        renderSchema({ type: "DISPLAY_SELECT", name: "choice" }, { choice: "raw_value" });
        expect(screen.getByText("raw_value")).toBeInTheDocument();
      });
    });
  });

  describe("2.4 Display with Labels", () => {
    it("renders label when provided", () => {
      renderSchema({ type: "DISPLAY_TEXT", name: "email", label: "Email Address" }, { email: "test@example.com" });
      expect(screen.getByText("Email Address")).toBeInTheDocument();
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    it("renders without label when not provided", () => {
      renderSchema({ type: "DISPLAY_TEXT", name: "email" }, { email: "test@example.com" });
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
      expect(screen.queryByText("Email Address")).not.toBeInTheDocument();
    });

    it("DISPLAY_NUMBER renders with label", () => {
      renderSchema({ type: "DISPLAY_NUMBER", name: "age", label: "Age" }, { age: 25 });
      expect(screen.getByText("Age")).toBeInTheDocument();
      expect(screen.getByText("25")).toBeInTheDocument();
    });

    it("DISPLAY_DATE renders with label", () => {
      renderSchema({ type: "DISPLAY_DATE", name: "dob", label: "Date of Birth" }, { dob: "1990-05-15" });
      expect(screen.getByText("Date of Birth")).toBeInTheDocument();
    });

    it("DISPLAY_BOOLEAN renders with label", () => {
      renderSchema({ type: "DISPLAY_BOOLEAN", name: "verified", label: "Verified" }, { verified: true });
      expect(screen.getByText("Verified")).toBeInTheDocument();
      expect(screen.getByText("Yes")).toBeInTheDocument();
    });

    it("DISPLAY_TAGS renders with label", () => {
      renderSchema({ type: "DISPLAY_TAGS", name: "skills", label: "Skills" }, { skills: ["JS", "TS"] });
      expect(screen.getByText("Skills")).toBeInTheDocument();
      expect(screen.getByText("JS")).toBeInTheDocument();
      expect(screen.getByText("TS")).toBeInTheDocument();
    });

    it("DISPLAY_SELECT renders with label", () => {
      const options = [{ label: "Admin", value: "admin" }];
      renderSchema({ type: "DISPLAY_SELECT", name: "role", label: "Role", options }, { role: "admin" });
      expect(screen.getByText("Role")).toBeInTheDocument();
      expect(screen.getByText("Admin")).toBeInTheDocument();
    });
  });
});
