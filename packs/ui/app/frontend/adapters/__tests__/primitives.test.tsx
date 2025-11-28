import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  BUTTON,
  DROPDOWN,
  SEARCH,
  SUBMIT,
} from "../primitives";
import { FORM } from "../layouts";
import { VIEW } from "../layouts/view";
import { renderWithProviders, resetMocks, mockServices } from "./test-utils";

describe("Primitive Adapters", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("BUTTON", () => {
    it("renders with label", () => {
      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <BUTTON schema={{ type: "BUTTON" }} label="Click me" />
        </VIEW>
      );

      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("calls onClick when clicked", async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <BUTTON schema={{ type: "BUTTON" }} label="Click me" onClick={onClick} />
        </VIEW>
      );

      await user.click(screen.getByText("Click me"));

      expect(onClick).toHaveBeenCalled();
    });

    it("renders with different variants", () => {
      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <BUTTON schema={{ type: "BUTTON" }} label="Primary" variant="primary" />
          <BUTTON schema={{ type: "BUTTON" }} label="Secondary" variant="secondary" />
          <BUTTON schema={{ type: "BUTTON" }} label="Ghost" variant="ghost" />
          <BUTTON schema={{ type: "BUTTON" }} label="Destructive" variant="destructive" />
        </VIEW>
      );

      expect(screen.getByText("Primary")).toBeInTheDocument();
      expect(screen.getByText("Secondary")).toBeInTheDocument();
      expect(screen.getByText("Ghost")).toBeInTheDocument();
      expect(screen.getByText("Destructive")).toBeInTheDocument();
    });
  });

  describe("DROPDOWN", () => {
    it("renders trigger button", () => {
      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <DROPDOWN schema={{ type: "DROPDOWN" }} label="Actions">
            <div>Option 1</div>
          </DROPDOWN>
        </VIEW>
      );

      expect(screen.getByText("Actions")).toBeInTheDocument();
    });

    it("shows content when clicked", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <DROPDOWN schema={{ type: "DROPDOWN" }} label="Actions">
            <div>Option 1</div>
          </DROPDOWN>
        </VIEW>
      );

      await user.click(screen.getByText("Actions"));

      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });
  });

  describe("SEARCH", () => {
    it("renders with placeholder", () => {
      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <SEARCH schema={{ type: "SEARCH" }} placeholder="Search users..." />
        </VIEW>
      );

      expect(screen.getByPlaceholderText("Search users...")).toBeInTheDocument();
    });

    it("calls onSearch when value changes", async () => {
      const onSearch = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <SEARCH schema={{ type: "SEARCH" }} onSearch={onSearch} />
        </VIEW>
      );

      const input = screen.getByRole("searchbox");
      await user.type(input, "test");

      expect(onSearch).toHaveBeenCalled();
    });

    it("shows clear button when has value", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <SEARCH schema={{ type: "SEARCH" }} />
        </VIEW>
      );

      const input = screen.getByRole("searchbox");
      await user.type(input, "test");

      // Clear button should appear
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("clears value when clear button clicked", async () => {
      const onSearch = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <SEARCH schema={{ type: "SEARCH" }} onSearch={onSearch} />
        </VIEW>
      );

      const input = screen.getByRole("searchbox");
      await user.type(input, "test");
      await user.click(screen.getByRole("button"));

      expect(input).toHaveValue("");
      expect(onSearch).toHaveBeenLastCalledWith("");
    });
  });

  describe("SUBMIT", () => {
    it("renders with default label", () => {
      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <FORM schema={{ type: "FORM" }}>
            <SUBMIT schema={{ type: "SUBMIT" }} />
          </FORM>
        </VIEW>
      );

      expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });

    it("renders with custom label", () => {
      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <FORM schema={{ type: "FORM" }}>
            <SUBMIT schema={{ type: "SUBMIT" }} label="Save Changes" />
          </FORM>
        </VIEW>
      );

      expect(screen.getByRole("button", { name: "Save Changes" })).toBeInTheDocument();
    });

    it("is type submit", () => {
      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <FORM schema={{ type: "FORM" }}>
            <SUBMIT schema={{ type: "SUBMIT" }} />
          </FORM>
        </VIEW>
      );

      expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute("type", "submit");
    });
  });
});
