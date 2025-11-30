/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  View,
  Page,
  Form,
  Show,
  Group,
  CardGroup,
  Actions,
  Alert,
  Button,
  FormikAdapter,
  DisplayAdapter,
} from "..";
import { renderWithProviders, resetMocks } from "./test-utils";

describe("Layout Adapters", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("View", () => {
    it("renders children", () => {
      renderWithProviders(
        <View>
          <div>View Content</div>
        </View>,
      );

      expect(screen.getByText("View Content")).toBeInTheDocument();
    });

    it("has data-ui attribute", () => {
      const { container } = renderWithProviders(
        <View>
          <div>Content</div>
        </View>,
      );

      const viewElement = container.querySelector('[data-ui="view"]');
      expect(viewElement).toBeInTheDocument();
    });
  });

  describe("Page", () => {
    it("renders title and description", () => {
      renderWithProviders(
        <Page title="Users" description="Manage users">
          <div>Page content</div>
        </Page>,
      );

      expect(screen.getByText("Users")).toBeInTheDocument();
      expect(screen.getByText("Manage users")).toBeInTheDocument();
    });

    it("renders children", () => {
      renderWithProviders(
        <Page>
          <div>Page content</div>
        </Page>,
      );

      expect(screen.getByText("Page content")).toBeInTheDocument();
    });
  });

  describe("Form", () => {
    it("renders form element", () => {
      const { container } = renderWithProviders(
        <View>
          <Form>
            <div>Form content</div>
          </Form>
        </View>,
      );

      const formElement = container.querySelector("form");
      expect(formElement).toBeInTheDocument();
    });

    it("calls onSubmit when form is submitted", async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(
        <View>
          <Form onSubmit={onSubmit}>
            <button type="submit">Submit</button>
          </Form>
        </View>,
      );

      await user.click(screen.getByText("Submit"));

      expect(onSubmit).toHaveBeenCalled();
    });

    it("provides form context to children", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      renderWithProviders(
        <View>
          <Form onSubmit={onSubmit} defaultValues={{ email: "" }}>
            <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
            <button type="submit">Submit</button>
          </Form>
        </View>,
      );

      const input = screen.getByLabelText("Email");
      await user.type(input, "test@example.com");
      await user.click(screen.getByText("Submit"));

      expect(onSubmit).toHaveBeenCalled();
    });
  });

  describe("Show", () => {
    it("renders children with record context", () => {
      const record = { name: "John Doe", email: "john@example.com" };

      renderWithProviders(
        <View>
          <Show record={record}>
            <DisplayAdapter type="DISPLAY_TEXT" name="name" label="Name" value={record.name} />
            <DisplayAdapter type="DISPLAY_TEXT" name="email" label="Email" value={record.email} />
          </Show>
        </View>,
      );

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    it("renders with title in Card", () => {
      renderWithProviders(
        <Show title="User Details" record={{}}>
          <div>Content</div>
        </Show>,
      );

      expect(screen.getByText("User Details")).toBeInTheDocument();
    });
  });

  describe("Group", () => {
    it("renders label", () => {
      renderWithProviders(
        <View>
          <Group label="Personal Info">
            <div>Group content</div>
          </Group>
        </View>,
      );

      expect(screen.getByText("Personal Info")).toBeInTheDocument();
    });

    it("renders children", () => {
      renderWithProviders(
        <View>
          <Group>
            <div>Group content</div>
          </Group>
        </View>,
      );

      expect(screen.getByText("Group content")).toBeInTheDocument();
    });
  });

  describe("CardGroup", () => {
    it("renders in Card with title", () => {
      renderWithProviders(
        <CardGroup label="Settings">
          <div>Card content</div>
        </CardGroup>,
      );

      expect(screen.getByText("Settings")).toBeInTheDocument();
      expect(screen.getByText("Card content")).toBeInTheDocument();
    });
  });

  describe("Actions", () => {
    it("renders children in flex container", () => {
      renderWithProviders(
        <View>
          <Actions>
            <Button label="Save" />
            <Button label="Cancel" />
          </Actions>
        </View>,
      );

      expect(screen.getByText("Save")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
  });

  describe("Alert", () => {
    it("renders alert with label", () => {
      renderWithProviders(<Alert label="Warning message" />);

      expect(screen.getByText("Warning message")).toBeInTheDocument();
    });

    it("applies color variant", () => {
      renderWithProviders(<Alert label="Error" color="red" />);

      const alert = screen.getByRole("alert");
      expect(alert.className).toContain("text-red");
    });
  });
});
