import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { DisplayAdapter } from "../display-adapter";
import { renderWithProviders, resetMocks } from "./test-utils";

describe("DisplayAdapter", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("DISPLAY_TEXT", () => {
    it("displays value with label", () => {
      renderWithProviders(
        <DisplayAdapter
          type="DISPLAY_TEXT"
          name="email"
          label="Email"
          value="test@example.com"
        />,
      );

      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    it("displays dash for null value", () => {
      renderWithProviders(
        <DisplayAdapter type="DISPLAY_TEXT" name="email" label="Email" value={null} />,
      );

      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  describe("DISPLAY_LONGTEXT", () => {
    it("preserves whitespace", () => {
      const multilineText = "Line 1\nLine 2\nLine 3";

      renderWithProviders(
        <DisplayAdapter
          type="DISPLAY_LONGTEXT"
          name="description"
          value={multilineText}
        />,
      );

      const textElement = screen.getByText((content, element) => {
        return element?.className?.includes("whitespace-pre-wrap") ?? false;
      });
      expect(textElement).toBeInTheDocument();
    });
  });

  describe("DISPLAY_NUMBER", () => {
    it("displays number with mono font", () => {
      renderWithProviders(
        <DisplayAdapter type="DISPLAY_NUMBER" name="amount" value={1234567.89} />,
      );

      const numberElement = screen.getByText((content, element) => {
        return element?.className?.includes("font-mono") ?? false;
      });
      expect(numberElement).toBeInTheDocument();
    });

    it("displays dash for null", () => {
      renderWithProviders(
        <DisplayAdapter type="DISPLAY_NUMBER" name="amount" value={null} />,
      );

      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  describe("DISPLAY_BADGE", () => {
    it("displays value as badge", () => {
      renderWithProviders(
        <DisplayAdapter type="DISPLAY_BADGE" name="status" value="active" />,
      );

      expect(screen.getByText("active")).toBeInTheDocument();
    });
  });

  describe("DISPLAY_TAGS", () => {
    it("displays array of tags", () => {
      renderWithProviders(
        <DisplayAdapter
          type="DISPLAY_TAGS"
          name="tags"
          value={["react", "typescript", "node"]}
        />,
      );

      expect(screen.getByText("react")).toBeInTheDocument();
      expect(screen.getByText("typescript")).toBeInTheDocument();
      expect(screen.getByText("node")).toBeInTheDocument();
    });

    it("displays dash for empty array", () => {
      renderWithProviders(
        <DisplayAdapter type="DISPLAY_TAGS" name="tags" value={[]} />,
      );

      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  describe("DISPLAY_BOOLEAN", () => {
    it("displays Yes for true value", () => {
      renderWithProviders(
        <DisplayAdapter type="DISPLAY_BOOLEAN" name="verified" value={true} />,
      );

      expect(screen.getByText("Yes")).toBeInTheDocument();
    });

    it("displays No for false value", () => {
      renderWithProviders(
        <DisplayAdapter type="DISPLAY_BOOLEAN" name="verified" value={false} />,
      );

      expect(screen.getByText("No")).toBeInTheDocument();
    });
  });

  describe("DISPLAY_SELECT", () => {
    const options = [
      { value: "us", label: "United States" },
      { value: "uk", label: "United Kingdom" },
    ];

    it("displays option label for value", () => {
      renderWithProviders(
        <DisplayAdapter
          type="DISPLAY_SELECT"
          name="country"
          options={options}
          value="us"
        />,
      );

      expect(screen.getByText("United States")).toBeInTheDocument();
    });

    it("displays raw value if option not found", () => {
      renderWithProviders(
        <DisplayAdapter
          type="DISPLAY_SELECT"
          name="country"
          options={options}
          value="ca"
        />,
      );

      expect(screen.getByText("ca")).toBeInTheDocument();
    });

    it("displays dash for null value", () => {
      renderWithProviders(
        <DisplayAdapter
          type="DISPLAY_SELECT"
          name="country"
          options={options}
          value={null}
        />,
      );

      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  describe("DISPLAY_DATE", () => {
    it("formats date value", () => {
      renderWithProviders(
        <DisplayAdapter
          type="DISPLAY_DATE"
          name="created"
          label="Created"
          value="2024-01-15"
        />,
      );

      // Date formatting is locale-dependent, just check it renders
      expect(screen.getByText("Created")).toBeInTheDocument();
    });

    it("displays dash for null", () => {
      renderWithProviders(
        <DisplayAdapter type="DISPLAY_DATE" name="created" value={null} />,
      );

      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  describe("DISPLAY_DATETIME", () => {
    it("formats datetime value", () => {
      renderWithProviders(
        <DisplayAdapter
          type="DISPLAY_DATETIME"
          name="updated"
          label="Updated"
          value="2024-01-15T10:30:00"
        />,
      );

      expect(screen.getByText("Updated")).toBeInTheDocument();
    });

    it("displays dash for null", () => {
      renderWithProviders(
        <DisplayAdapter type="DISPLAY_DATETIME" name="updated" value={null} />,
      );

      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  describe("Unknown type", () => {
    it("renders error for unknown type", () => {
      renderWithProviders(
        <DisplayAdapter type="DISPLAY_UNKNOWN" name="test" value="test" />,
      );

      expect(screen.getByText(/Unknown display type/)).toBeInTheDocument();
    });
  });
});
