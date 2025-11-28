import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import {
  DISPLAY_TEXT,
  DISPLAY_LONGTEXT,
  DISPLAY_NUMBER,
  DISPLAY_BADGE,
  DISPLAY_TAGS,
  DISPLAY_BOOLEAN,
  DISPLAY_SELECT,
} from "../displays";
import { SHOW, ShowContext } from "../layouts/show";
import { VIEW } from "../layouts/view";
import { renderWithProviders, resetMocks } from "./test-utils";

describe("Display Adapters", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("DISPLAY_TEXT", () => {
    it("displays value with label", () => {
      renderWithProviders(
        <DISPLAY_TEXT name="email" label="Email" value="test@example.com" />
      );

      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    it("displays em-dash for null value", () => {
      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <DISPLAY_TEXT name="email" label="Email" value={null} />
        </VIEW>
      );

      expect(screen.getByText("—")).toBeInTheDocument();
    });

    it("gets value from ShowContext", () => {
      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <ShowContext.Provider value={{ data: { email: "context@example.com" } }}>
            <DISPLAY_TEXT name="email" label="Email" />
          </ShowContext.Provider>
        </VIEW>
      );

      expect(screen.getByText("context@example.com")).toBeInTheDocument();
    });
  });

  describe("DISPLAY_LONGTEXT", () => {
    it("preserves whitespace", () => {
      const multilineText = "Line 1\nLine 2\nLine 3";

      renderWithProviders(
        <DISPLAY_LONGTEXT name="description" value={multilineText} />
      );

      const textElement = screen.getByText((content, element) => {
        return element?.className?.includes("whitespace-pre-wrap") ?? false;
      });
      expect(textElement).toBeInTheDocument();
    });
  });

  describe("DISPLAY_NUMBER", () => {
    it("formats number with locale", () => {
      renderWithProviders(
        <DISPLAY_NUMBER name="amount" value={1234567.89} />
      );

      // Check for formatted number (locale-dependent)
      expect(screen.getByText(/1,234,567/)).toBeInTheDocument();
    });

    it("displays em-dash for null", () => {
      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <DISPLAY_NUMBER name="amount" value={null} />
        </VIEW>
      );

      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  describe("DISPLAY_BADGE", () => {
    it("displays value as badge", () => {
      renderWithProviders(
        <DISPLAY_BADGE name="status" value="active" />
      );

      expect(screen.getByText("active")).toBeInTheDocument();
    });

    it("uses option label when available", () => {
      const options = [
        { value: "active", label: "Active User" },
        { value: "inactive", label: "Inactive User" },
      ];

      renderWithProviders(
        <DISPLAY_BADGE name="status" value="active" options={options} />
      );

      expect(screen.getByText("Active User")).toBeInTheDocument();
    });

    it("applies status color classes", () => {
      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <DISPLAY_BADGE name="status" value="active" />
        </VIEW>
      );

      const badge = screen.getByText("active");
      expect(badge.className).toContain("green");
    });
  });

  describe("DISPLAY_TAGS", () => {
    it("displays array of tags", () => {
      renderWithProviders(
        <DISPLAY_TAGS name="tags" value={["react", "typescript", "node"]} />
      );

      expect(screen.getByText("react")).toBeInTheDocument();
      expect(screen.getByText("typescript")).toBeInTheDocument();
      expect(screen.getByText("node")).toBeInTheDocument();
    });

    it("displays em-dash for empty array", () => {
      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <DISPLAY_TAGS name="tags" value={[]} />
        </VIEW>
      );

      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  describe("DISPLAY_BOOLEAN", () => {
    it("displays Yes for true value", () => {
      renderWithProviders(
        <DISPLAY_BOOLEAN name="verified" value={true} />
      );

      expect(screen.getByText("Yes")).toBeInTheDocument();
    });

    it("displays No for false value", () => {
      renderWithProviders(
        <DISPLAY_BOOLEAN name="verified" value={false} />
      );

      expect(screen.getByText("No")).toBeInTheDocument();
    });

    it("treats truthy values as true", () => {
      renderWithProviders(
        <DISPLAY_BOOLEAN name="verified" value="yes" />
      );

      expect(screen.getByText("Yes")).toBeInTheDocument();
    });
  });

  describe("DISPLAY_SELECT", () => {
    const options = [
      { value: "us", label: "United States" },
      { value: "uk", label: "United Kingdom" },
    ];

    it("displays option label for value", () => {
      renderWithProviders(
        <DISPLAY_SELECT name="country" value="us" options={options} />
      );

      expect(screen.getByText("United States")).toBeInTheDocument();
    });

    it("displays raw value if option not found", () => {
      renderWithProviders(
        <DISPLAY_SELECT name="country" value="ca" options={options} />
      );

      expect(screen.getByText("ca")).toBeInTheDocument();
    });

    it("displays em-dash for null value", () => {
      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <DISPLAY_SELECT name="country" value={null} options={options} />
        </VIEW>
      );

      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  describe("Integration with SHOW layout", () => {
    it("displays get values from ShowContext", () => {
      const record = {
        name: "John Doe",
        email: "john@example.com",
        status: "active",
        verified: true,
        tags: ["vip", "premium"],
      };

      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <SHOW schema={{ type: "SHOW" }} record={record}>
            <DISPLAY_TEXT name="name" label="Name" />
            <DISPLAY_TEXT name="email" label="Email" />
            <DISPLAY_BADGE name="status" label="Status" />
            <DISPLAY_BOOLEAN name="verified" label="Verified" />
            <DISPLAY_TAGS name="tags" label="Tags" />
          </SHOW>
        </VIEW>
      );

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
      expect(screen.getByText("active")).toBeInTheDocument();
      expect(screen.getByText("Yes")).toBeInTheDocument();
      expect(screen.getByText("vip")).toBeInTheDocument();
      expect(screen.getByText("premium")).toBeInTheDocument();
    });
  });
});
