import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import {
  TextDisplay,
  LongtextDisplay,
  NumberDisplay,
  BadgeDisplay,
  TagsDisplay,
  BooleanDisplay,
  SelectDisplay,
  Show,
  ShowContext,
  View,
} from "..";
import { renderWithProviders, resetMocks } from "./test-utils";

describe("Display Adapters", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("TextDisplay", () => {
    it("displays value with label", () => {
      renderWithProviders(
        <TextDisplay
          name="email"
          label="Email"
          data={{ email: "test@example.com" }}
        />,
      );

      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    it("displays em-dash for null value", () => {
      renderWithProviders(
        <View>
          <TextDisplay name="email" label="Email" data={{ email: null }} />
        </View>,
      );

      expect(screen.getByText("—")).toBeInTheDocument();
    });

    it("gets value from ShowContext", () => {
      renderWithProviders(
        <View>
          <ShowContext.Provider
            value={{ data: { email: "context@example.com" } }}
          >
            <TextDisplay name="email" label="Email" />
          </ShowContext.Provider>
        </View>,
      );

      expect(screen.getByText("context@example.com")).toBeInTheDocument();
    });
  });

  describe("LongtextDisplay", () => {
    it("preserves whitespace", () => {
      const multilineText = "Line 1\nLine 2\nLine 3";

      renderWithProviders(
        <LongtextDisplay
          name="description"
          data={{ description: multilineText }}
        />,
      );

      const textElement = screen.getByText((content, element) => {
        return element?.className?.includes("whitespace-pre-wrap") ?? false;
      });
      expect(textElement).toBeInTheDocument();
    });
  });

  describe("NumberDisplay", () => {
    it("formats number with locale", () => {
      renderWithProviders(
        <NumberDisplay name="amount" data={{ amount: 1234567.89 }} />,
      );

      // Check for formatted number (locale-dependent)
      expect(screen.getByText(/1,234,567/)).toBeInTheDocument();
    });

    it("displays em-dash for null", () => {
      renderWithProviders(
        <View>
          <NumberDisplay name="amount" data={{ amount: null }} />
        </View>,
      );

      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  describe("BadgeDisplay", () => {
    it("displays value as badge", () => {
      renderWithProviders(
        <BadgeDisplay name="status" data={{ status: "active" }} />,
      );

      expect(screen.getByText("active")).toBeInTheDocument();
    });

    it("uses option label when available", () => {
      const options = [
        { value: "active", label: "Active User" },
        { value: "inactive", label: "Inactive User" },
      ];

      renderWithProviders(
        <BadgeDisplay
          name="status"
          options={options}
          data={{ status: "active" }}
        />,
      );

      expect(screen.getByText("Active User")).toBeInTheDocument();
    });

    it("applies status color classes", () => {
      renderWithProviders(
        <View>
          <BadgeDisplay name="status" data={{ status: "active" }} />
        </View>,
      );

      const badge = screen.getByText("active");
      expect(badge.className).toContain("green");
    });
  });

  describe("TagsDisplay", () => {
    it("displays array of tags", () => {
      renderWithProviders(
        <TagsDisplay
          name="tags"
          data={{ tags: ["react", "typescript", "node"] }}
        />,
      );

      expect(screen.getByText("react")).toBeInTheDocument();
      expect(screen.getByText("typescript")).toBeInTheDocument();
      expect(screen.getByText("node")).toBeInTheDocument();
    });

    it("displays em-dash for empty array", () => {
      renderWithProviders(
        <View>
          <TagsDisplay name="tags" data={{ tags: [] }} />
        </View>,
      );

      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  describe("BooleanDisplay", () => {
    it("displays Yes for true value", () => {
      renderWithProviders(
        <BooleanDisplay name="verified" data={{ verified: true }} />,
      );

      expect(screen.getByText("Yes")).toBeInTheDocument();
    });

    it("displays No for false value", () => {
      renderWithProviders(
        <BooleanDisplay name="verified" data={{ verified: false }} />,
      );

      expect(screen.getByText("No")).toBeInTheDocument();
    });

    it("treats truthy values as true", () => {
      renderWithProviders(
        <BooleanDisplay name="verified" data={{ verified: "yes" }} />,
      );

      expect(screen.getByText("Yes")).toBeInTheDocument();
    });
  });

  describe("SelectDisplay", () => {
    const options = [
      { value: "us", label: "United States" },
      { value: "uk", label: "United Kingdom" },
    ];

    it("displays option label for value", () => {
      renderWithProviders(
        <SelectDisplay
          name="country"
          options={options}
          data={{ country: "us" }}
        />,
      );

      expect(screen.getByText("United States")).toBeInTheDocument();
    });

    it("displays raw value if option not found", () => {
      renderWithProviders(
        <SelectDisplay
          name="country"
          options={options}
          data={{ country: "ca" }}
        />,
      );

      expect(screen.getByText("ca")).toBeInTheDocument();
    });

    it("displays em-dash for null value", () => {
      renderWithProviders(
        <View>
          <SelectDisplay
            name="country"
            options={options}
            data={{ country: null }}
          />
        </View>,
      );

      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  describe("Integration with Show layout", () => {
    it("displays get values from ShowContext", () => {
      const record = {
        name: "John Doe",
        email: "john@example.com",
        status: "active",
        verified: true,
        tags: ["vip", "premium"],
      };

      renderWithProviders(
        <View>
          <Show record={record}>
            <TextDisplay name="name" label="Name" />
            <TextDisplay name="email" label="Email" />
            <BadgeDisplay name="status" label="Status" />
            <BooleanDisplay name="verified" label="Verified" />
            <TagsDisplay name="tags" label="Tags" />
          </Show>
        </View>,
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
