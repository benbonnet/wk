import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { UIProvider } from "@ui/provider";
import { TooltipProvider } from "@ui-components/ui/tooltip";
import {
  DISPLAY_TEXT,
  DISPLAY_LONGTEXT,
  DISPLAY_NUMBER,
  DISPLAY_DATE,
  DISPLAY_DATETIME,
  DISPLAY_BOOLEAN,
  DISPLAY_BADGE,
  DISPLAY_TAGS,
  DISPLAY_SELECT,
} from "@ui/adapters/displays";
import { ShowContext } from "@ui/adapters/layouts";
import type { UIServices } from "@ui/registry";
import type { ReactNode } from "react";

// Minimal mock services
const mockServices: UIServices = {
  fetch: vi.fn(),
  navigate: vi.fn(),
  toast: vi.fn(),
  confirm: vi.fn(),
};

// Minimal component registries (displays only need these for context)
const mockComponents = {} as never;
const mockInputs = {} as never;
const mockDisplays = {
  DISPLAY_TEXT,
  DISPLAY_LONGTEXT,
  DISPLAY_NUMBER,
  DISPLAY_DATE,
  DISPLAY_DATETIME,
  DISPLAY_BOOLEAN,
  DISPLAY_BADGE,
  DISPLAY_TAGS,
  DISPLAY_SELECT,
};

interface WrapperProps {
  children: ReactNode;
  showData?: Record<string, unknown>;
}

function TestWrapper({ children, showData = {} }: WrapperProps) {
  return (
    <UIProvider
      components={mockComponents}
      inputs={mockInputs}
      displays={mockDisplays}
      services={mockServices}
      locale="en"
    >
      <TooltipProvider>
        <ShowContext.Provider value={{ data: showData }}>
          {children}
        </ShowContext.Provider>
      </TooltipProvider>
    </UIProvider>
  );
}

describe("Phase 2: Display Adapters", () => {
  describe("2.1 Text Displays", () => {
    describe("DISPLAY_TEXT", () => {
      it("renders string value", () => {
        render(
          <TestWrapper>
            <DISPLAY_TEXT name="name" value="John Doe" />
          </TestWrapper>
        );
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      it("renders empty state (—) for null value", () => {
        render(
          <TestWrapper>
            <DISPLAY_TEXT name="name" value={null} />
          </TestWrapper>
        );
        expect(screen.getByText("—")).toBeInTheDocument();
      });

      it("renders empty state (—) for undefined value", () => {
        render(
          <TestWrapper>
            <DISPLAY_TEXT name="name" value={undefined} />
          </TestWrapper>
        );
        expect(screen.getByText("—")).toBeInTheDocument();
      });

      it("renders value from ShowContext when no value prop", () => {
        render(
          <TestWrapper showData={{ firstName: "Jane" }}>
            <DISPLAY_TEXT name="firstName" />
          </TestWrapper>
        );
        expect(screen.getByText("Jane")).toBeInTheDocument();
      });

      it("prefers value prop over ShowContext", () => {
        render(
          <TestWrapper showData={{ firstName: "Context Value" }}>
            <DISPLAY_TEXT name="firstName" value="Prop Value" />
          </TestWrapper>
        );
        expect(screen.getByText("Prop Value")).toBeInTheDocument();
        expect(screen.queryByText("Context Value")).not.toBeInTheDocument();
      });
    });

    describe("DISPLAY_LONGTEXT", () => {
      it("renders multiline text preserving whitespace", () => {
        const multiline = "Line 1\nLine 2\nLine 3";
        render(
          <TestWrapper>
            <DISPLAY_LONGTEXT name="bio" value={multiline} />
          </TestWrapper>
        );
        // Use custom matcher that only matches the <p> element, not parents
        const element = screen.getByText((content, node) => {
          return (
            node?.tagName === "P" &&
            node?.textContent === multiline
          );
        });
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass("whitespace-pre-wrap");
      });

      it("renders empty state for null", () => {
        render(
          <TestWrapper>
            <DISPLAY_LONGTEXT name="bio" value={null} />
          </TestWrapper>
        );
        expect(screen.getByText("—")).toBeInTheDocument();
      });
    });

    describe("DISPLAY_NUMBER", () => {
      it("renders numeric value", () => {
        render(
          <TestWrapper>
            <DISPLAY_NUMBER name="count" value={42} />
          </TestWrapper>
        );
        expect(screen.getByText("42")).toBeInTheDocument();
      });

      it("renders formatted number with thousands separator", () => {
        render(
          <TestWrapper>
            <DISPLAY_NUMBER name="amount" value={1234567} />
          </TestWrapper>
        );
        // Intl.NumberFormat formats with commas
        expect(screen.getByText("1,234,567")).toBeInTheDocument();
      });

      it("renders empty state for null", () => {
        render(
          <TestWrapper>
            <DISPLAY_NUMBER name="count" value={null} />
          </TestWrapper>
        );
        expect(screen.getByText("—")).toBeInTheDocument();
      });

      it("renders zero correctly", () => {
        render(
          <TestWrapper>
            <DISPLAY_NUMBER name="count" value={0} />
          </TestWrapper>
        );
        expect(screen.getByText("0")).toBeInTheDocument();
      });
    });
  });

  describe("2.2 Date Displays", () => {
    describe("DISPLAY_DATE", () => {
      it("renders formatted date", () => {
        render(
          <TestWrapper>
            <DISPLAY_DATE name="created" value="2024-01-15" />
          </TestWrapper>
        );
        // date-fns PPP format: "January 15th, 2024"
        expect(screen.getByText("January 15th, 2024")).toBeInTheDocument();
      });

      it("renders empty state for null", () => {
        render(
          <TestWrapper>
            <DISPLAY_DATE name="created" value={null} />
          </TestWrapper>
        );
        expect(screen.getByText("—")).toBeInTheDocument();
      });

      it("renders empty state for empty string", () => {
        render(
          <TestWrapper>
            <DISPLAY_DATE name="created" value="" />
          </TestWrapper>
        );
        expect(screen.getByText("—")).toBeInTheDocument();
      });
    });

    describe("DISPLAY_DATETIME", () => {
      it("renders date with time", () => {
        render(
          <TestWrapper>
            <DISPLAY_DATETIME name="timestamp" value="2024-01-15T14:30:00Z" />
          </TestWrapper>
        );
        // date-fns PPP 'at' p format includes date and time
        expect(screen.getByText(/January 15th, 2024/)).toBeInTheDocument();
      });

      it("renders empty state for null", () => {
        render(
          <TestWrapper>
            <DISPLAY_DATETIME name="timestamp" value={null} />
          </TestWrapper>
        );
        expect(screen.getByText("—")).toBeInTheDocument();
      });
    });
  });

  describe("2.3 Semantic Displays", () => {
    describe("DISPLAY_BOOLEAN", () => {
      it("renders 'Yes' for true value", () => {
        render(
          <TestWrapper>
            <DISPLAY_BOOLEAN name="active" value={true} />
          </TestWrapper>
        );
        expect(screen.getByText("Yes")).toBeInTheDocument();
      });

      it("renders 'No' for false value", () => {
        render(
          <TestWrapper>
            <DISPLAY_BOOLEAN name="active" value={false} />
          </TestWrapper>
        );
        expect(screen.getByText("No")).toBeInTheDocument();
      });

      it("renders 'No' for null/undefined (falsy)", () => {
        render(
          <TestWrapper>
            <DISPLAY_BOOLEAN name="active" value={null} />
          </TestWrapper>
        );
        expect(screen.getByText("No")).toBeInTheDocument();
      });

      it("renders 'Yes' for truthy string", () => {
        render(
          <TestWrapper>
            <DISPLAY_BOOLEAN name="active" value="yes" />
          </TestWrapper>
        );
        expect(screen.getByText("Yes")).toBeInTheDocument();
      });
    });

    describe("DISPLAY_BADGE", () => {
      it("renders value as badge", () => {
        render(
          <TestWrapper>
            <DISPLAY_BADGE name="status" value="active" />
          </TestWrapper>
        );
        expect(screen.getByText("active")).toBeInTheDocument();
      });

      it("renders label from options when matching value", () => {
        const options = [
          { label: "Active User", value: "active" },
          { label: "Inactive User", value: "inactive" },
        ];
        render(
          <TestWrapper>
            <DISPLAY_BADGE name="status" value="active" options={options} />
          </TestWrapper>
        );
        expect(screen.getByText("Active User")).toBeInTheDocument();
      });

      it("renders empty state for null", () => {
        render(
          <TestWrapper>
            <DISPLAY_BADGE name="status" value={null} />
          </TestWrapper>
        );
        expect(screen.getByText("—")).toBeInTheDocument();
      });
    });

    describe("DISPLAY_TAGS", () => {
      it("renders array of tags as badges", () => {
        render(
          <TestWrapper>
            <DISPLAY_TAGS name="tags" value={["react", "typescript", "vitest"]} />
          </TestWrapper>
        );
        expect(screen.getByText("react")).toBeInTheDocument();
        expect(screen.getByText("typescript")).toBeInTheDocument();
        expect(screen.getByText("vitest")).toBeInTheDocument();
      });

      it("renders empty state for empty array", () => {
        render(
          <TestWrapper>
            <DISPLAY_TAGS name="tags" value={[]} />
          </TestWrapper>
        );
        expect(screen.getByText("—")).toBeInTheDocument();
      });

      it("renders empty state for non-array value", () => {
        render(
          <TestWrapper>
            <DISPLAY_TAGS name="tags" value="not an array" />
          </TestWrapper>
        );
        // Non-array becomes empty array, shows empty state
        expect(screen.getByText("—")).toBeInTheDocument();
      });

      it("renders empty state for null", () => {
        render(
          <TestWrapper>
            <DISPLAY_TAGS name="tags" value={null} />
          </TestWrapper>
        );
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
        render(
          <TestWrapper>
            <DISPLAY_SELECT name="gender" value="female" options={options} />
          </TestWrapper>
        );
        expect(screen.getByText("Female")).toBeInTheDocument();
      });

      it("renders raw value when no matching option", () => {
        const options = [
          { label: "Option A", value: "a" },
        ];
        render(
          <TestWrapper>
            <DISPLAY_SELECT name="choice" value="unknown" options={options} />
          </TestWrapper>
        );
        expect(screen.getByText("unknown")).toBeInTheDocument();
      });

      it("renders empty state for null value", () => {
        const options = [
          { label: "Option A", value: "a" },
        ];
        render(
          <TestWrapper>
            <DISPLAY_SELECT name="choice" value={null} options={options} />
          </TestWrapper>
        );
        expect(screen.getByText("—")).toBeInTheDocument();
      });

      it("renders raw value when no options provided", () => {
        render(
          <TestWrapper>
            <DISPLAY_SELECT name="choice" value="raw_value" />
          </TestWrapper>
        );
        expect(screen.getByText("raw_value")).toBeInTheDocument();
      });
    });
  });

  describe("2.4 Display with Labels", () => {
    it("renders label when provided", () => {
      render(
        <TestWrapper>
          <DISPLAY_TEXT name="email" label="Email Address" value="test@example.com" />
        </TestWrapper>
      );
      expect(screen.getByText("Email Address")).toBeInTheDocument();
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    it("renders without label when not provided", () => {
      render(
        <TestWrapper>
          <DISPLAY_TEXT name="email" value="test@example.com" />
        </TestWrapper>
      );
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
      expect(screen.queryByText("Email Address")).not.toBeInTheDocument();
    });

    it("DISPLAY_NUMBER renders with label", () => {
      render(
        <TestWrapper>
          <DISPLAY_NUMBER name="age" label="Age" value={25} />
        </TestWrapper>
      );
      expect(screen.getByText("Age")).toBeInTheDocument();
      expect(screen.getByText("25")).toBeInTheDocument();
    });

    it("DISPLAY_DATE renders with label", () => {
      render(
        <TestWrapper>
          <DISPLAY_DATE name="dob" label="Date of Birth" value="1990-05-15" />
        </TestWrapper>
      );
      expect(screen.getByText("Date of Birth")).toBeInTheDocument();
    });

    it("DISPLAY_BOOLEAN renders with label", () => {
      render(
        <TestWrapper>
          <DISPLAY_BOOLEAN name="verified" label="Verified" value={true} />
        </TestWrapper>
      );
      expect(screen.getByText("Verified")).toBeInTheDocument();
      expect(screen.getByText("Yes")).toBeInTheDocument();
    });

    it("DISPLAY_TAGS renders with label", () => {
      render(
        <TestWrapper>
          <DISPLAY_TAGS name="skills" label="Skills" value={["JS", "TS"]} />
        </TestWrapper>
      );
      expect(screen.getByText("Skills")).toBeInTheDocument();
      expect(screen.getByText("JS")).toBeInTheDocument();
      expect(screen.getByText("TS")).toBeInTheDocument();
    });

    it("DISPLAY_SELECT renders with label", () => {
      const options = [{ label: "Admin", value: "admin" }];
      render(
        <TestWrapper>
          <DISPLAY_SELECT name="role" label="Role" value="admin" options={options} />
        </TestWrapper>
      );
      expect(screen.getByText("Role")).toBeInTheDocument();
      expect(screen.getByText("Admin")).toBeInTheDocument();
    });
  });
});
