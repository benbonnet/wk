import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  VIEW,
  PAGE,
  FORM,
  SHOW,
  GROUP,
  CARD_GROUP,
  ACTIONS,
  ALERT,
} from "../layouts";
import { BUTTON } from "../primitives";
import { INPUT_TEXT } from "../inputs";
import { DISPLAY_TEXT } from "../displays";
import { renderWithProviders, resetMocks } from "./test-utils";

describe("Layout Adapters", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("VIEW", () => {
    it("renders children", () => {
      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <div>View Content</div>
        </VIEW>
      );

      expect(screen.getByText("View Content")).toBeInTheDocument();
    });

    it("has data-ui attribute", () => {
      const { container } = renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <div>Content</div>
        </VIEW>
      );

      const viewElement = container.querySelector('[data-ui="view"]');
      expect(viewElement).toBeInTheDocument();
    });
  });

  describe("PAGE", () => {
    it("renders title and description", () => {
      renderWithProviders(
        <PAGE
          schema={{ type: "PAGE", title: "Users", description: "Manage users" }}
        >
          <div>Page content</div>
        </PAGE>
      );

      expect(screen.getByText("Users")).toBeInTheDocument();
      expect(screen.getByText("Manage users")).toBeInTheDocument();
    });

    it("renders children", () => {
      renderWithProviders(
        <PAGE schema={{ type: "PAGE" }}>
          <div>Page content</div>
        </PAGE>
      );

      expect(screen.getByText("Page content")).toBeInTheDocument();
    });
  });

  describe("FORM", () => {
    it("renders form element", () => {
      const { container } = renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <FORM schema={{ type: "FORM" }}>
            <div>Form content</div>
          </FORM>
        </VIEW>
      );

      const formElement = container.querySelector('form');
      expect(formElement).toBeInTheDocument();
    });

    it("calls onSubmit when form is submitted", async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <FORM schema={{ type: "FORM" }} onSubmit={onSubmit}>
            <button type="submit">Submit</button>
          </FORM>
        </VIEW>
      );

      await user.click(screen.getByText("Submit"));

      expect(onSubmit).toHaveBeenCalled();
    });

    it("provides form context to children", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <FORM schema={{ type: "FORM" }} onSubmit={onSubmit} defaultValues={{ email: "" }}>
            <INPUT_TEXT name="email" label="Email" />
            <button type="submit">Submit</button>
          </FORM>
        </VIEW>
      );

      const input = screen.getByLabelText("Email");
      await user.type(input, "test@example.com");
      await user.click(screen.getByText("Submit"));

      expect(onSubmit).toHaveBeenCalled();
    });
  });

  describe("SHOW", () => {
    it("renders children with record context", () => {
      const record = { name: "John Doe", email: "john@example.com" };

      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <SHOW schema={{ type: "SHOW" }} record={record}>
            <DISPLAY_TEXT name="name" label="Name" />
            <DISPLAY_TEXT name="email" label="Email" />
          </SHOW>
        </VIEW>
      );

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    it("renders with title in Card", () => {
      renderWithProviders(
        <SHOW schema={{ type: "SHOW", title: "User Details" }} record={{}}>
          <div>Content</div>
        </SHOW>
      );

      expect(screen.getByText("User Details")).toBeInTheDocument();
    });
  });

  describe("GROUP", () => {
    it("renders label", () => {
      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <GROUP schema={{ type: "GROUP", label: "Personal Info" }}>
            <div>Group content</div>
          </GROUP>
        </VIEW>
      );

      expect(screen.getByText("Personal Info")).toBeInTheDocument();
    });

    it("renders children", () => {
      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <GROUP schema={{ type: "GROUP" }}>
            <div>Group content</div>
          </GROUP>
        </VIEW>
      );

      expect(screen.getByText("Group content")).toBeInTheDocument();
    });
  });

  describe("CARD_GROUP", () => {
    it("renders in Card with title", () => {
      renderWithProviders(
        <CARD_GROUP schema={{ type: "CARD_GROUP", label: "Settings" }}>
          <div>Card content</div>
        </CARD_GROUP>
      );

      expect(screen.getByText("Settings")).toBeInTheDocument();
      expect(screen.getByText("Card content")).toBeInTheDocument();
    });
  });

  describe("ACTIONS", () => {
    it("renders children in flex container", () => {
      renderWithProviders(
        <VIEW schema={{ type: "VIEW" }}>
          <ACTIONS schema={{ type: "ACTIONS" }}>
            <BUTTON schema={{ type: "BUTTON", label: "Save" }} label="Save" />
            <BUTTON schema={{ type: "BUTTON", label: "Cancel" }} label="Cancel" />
          </ACTIONS>
        </VIEW>
      );

      expect(screen.getByText("Save")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
  });

  describe("ALERT", () => {
    it("renders alert with label", () => {
      renderWithProviders(
        <ALERT schema={{ type: "ALERT" }} label="Warning message" />
      );

      expect(screen.getByText("Warning message")).toBeInTheDocument();
    });

    it("applies color variant", () => {
      renderWithProviders(
        <ALERT schema={{ type: "ALERT" }} label="Error" color="red" />
      );

      const alert = screen.getByRole("alert");
      expect(alert.className).toContain("text-red");
    });
  });
});
