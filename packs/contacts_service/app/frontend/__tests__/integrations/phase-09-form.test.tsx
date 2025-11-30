import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  View,
  Form,
  TextInput,
  Submit,
} from "@ui/adapters";
import { renderWithProviders, resetMocks } from "./test-utils";

describe("Phase 9: Form Adapter", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("9.1 Form Context", () => {
    it("Form provides FormContext to children", () => {
      renderWithProviders(
        <View>
          <Form>
            <TextInput name="email" label="Email" />
          </Form>
        </View>
      );

      // If FormContext wasn't provided, TextInput would throw
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });

    it("Form children can update values", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <View>
          <Form>
            <TextInput name="email" label="Email" />
          </Form>
        </View>
      );

      const input = screen.getByLabelText("Email");
      await user.type(input, "hello@test.com");
      expect(input).toHaveValue("hello@test.com");
    });
  });

  describe("9.2 Form Initial Values", () => {
    it("Form starts with empty values when no initial values", () => {
      renderWithProviders(
        <View>
          <Form>
            <TextInput name="email" label="Email" />
          </Form>
        </View>
      );

      expect(screen.getByLabelText("Email")).toHaveValue("");
    });

    it("Form initializes with defaultValues prop", () => {
      renderWithProviders(
        <View>
          <Form defaultValues={{ email: "default@example.com" }}>
            <TextInput name="email" label="Email" />
          </Form>
        </View>
      );

      expect(screen.getByLabelText("Email")).toHaveValue("default@example.com");
    });
  });

  describe("9.3 Form State", () => {
    it("Form values change when user types", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <View>
          <Form>
            <TextInput name="email" label="Email" />
          </Form>
        </View>
      );

      const input = screen.getByLabelText("Email");
      await user.type(input, "changed@test.com");
      expect(input).toHaveValue("changed@test.com");
    });

    it("Form value can be cleared and retyped", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <View>
          <Form>
            <TextInput name="email" label="Email" />
          </Form>
        </View>
      );

      const input = screen.getByLabelText("Email");
      await user.type(input, "test");
      await user.clear(input);
      await user.type(input, "new");

      expect(input).toHaveValue("new");
    });
  });

  describe("9.4 Form Submission", () => {
    it("Form renders form element", () => {
      const { container } = renderWithProviders(
        <View>
          <Form>
            <TextInput name="email" label="Email" />
          </Form>
        </View>
      );

      const formElement = container.querySelector("form");
      expect(formElement).toBeInTheDocument();
    });

    it("Form handles submission without page reload", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <View>
          <Form>
            <TextInput name="email" label="Email" />
            <Submit label="Save" />
          </Form>
        </View>
      );

      const form = document.querySelector("form")!;
      expect(form).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Save" }));

      // Form should still be in the document after submission
      expect(form).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it("Form calls onSubmit when submitted", async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(
        <View>
          <Form onSubmit={onSubmit}>
            <TextInput name="email" label="Email" />
            <Submit label="Save" />
          </Form>
        </View>
      );

      await user.type(screen.getByLabelText("Email"), "test@example.com");
      await user.click(screen.getByRole("button", { name: "Save" }));

      expect(onSubmit).toHaveBeenCalled();
    });

    it("Submit button returns to normal state after submission", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <View>
          <Form>
            <TextInput name="email" label="Email" />
            <Submit label="Save" />
          </Form>
        </View>
      );

      await user.click(screen.getByRole("button", { name: "Save" }));

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Save" })).not.toBeDisabled();
      });
    });
  });

  describe("9.5 Multiple Fields", () => {
    it("Form handles multiple fields", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <View>
          <Form>
            <TextInput name="firstName" label="First Name" />
            <TextInput name="lastName" label="Last Name" />
            <TextInput name="email" label="Email" />
          </Form>
        </View>
      );

      await user.type(screen.getByLabelText("First Name"), "John");
      await user.type(screen.getByLabelText("Last Name"), "Doe");
      await user.type(screen.getByLabelText("Email"), "john@example.com");

      expect(screen.getByLabelText("First Name")).toHaveValue("John");
      expect(screen.getByLabelText("Last Name")).toHaveValue("Doe");
      expect(screen.getByLabelText("Email")).toHaveValue("john@example.com");
    });

    it("Form initializes multiple fields with defaultValues", () => {
      renderWithProviders(
        <View>
          <Form defaultValues={{ firstName: "Jane", lastName: "Smith" }}>
            <TextInput name="firstName" label="First Name" />
            <TextInput name="lastName" label="Last Name" />
          </Form>
        </View>
      );

      expect(screen.getByLabelText("First Name")).toHaveValue("Jane");
      expect(screen.getByLabelText("Last Name")).toHaveValue("Smith");
    });
  });
});
