import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  View,
  Form,
  FormikAdapter,
  Submit,
} from "@ui/adapters";
import { renderWithProviders, resetMocks, mockServices } from "./test-utils";

describe("Phase 9: Form Adapter", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("9.1 Form Context", () => {
    it("Form provides Formik context to children", () => {
      renderWithProviders(
        <View>
          <Form>
            <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
          </Form>
        </View>
      );

      // If Formik context wasn't provided, FormikAdapter would throw
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });

    it("Form children can update values", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <View>
          <Form>
            <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
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
            <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
          </Form>
        </View>
      );

      expect(screen.getByLabelText("Email")).toHaveValue("");
    });

    it("Form initializes with defaultValues prop", () => {
      renderWithProviders(
        <View>
          <Form defaultValues={{ email: "default@example.com" }}>
            <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
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
            <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
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
            <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
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
            <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
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
            <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
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
            <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
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
            <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
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
            <FormikAdapter type="INPUT_TEXT" name="firstName" label="First Name" />
            <FormikAdapter type="INPUT_TEXT" name="lastName" label="Last Name" />
            <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
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
            <FormikAdapter type="INPUT_TEXT" name="firstName" label="First Name" />
            <FormikAdapter type="INPUT_TEXT" name="lastName" label="Last Name" />
          </Form>
        </View>
      );

      expect(screen.getByLabelText("First Name")).toHaveValue("Jane");
      expect(screen.getByLabelText("Last Name")).toHaveValue("Smith");
    });
  });

  describe("9.6 Form API Submission", () => {
    it("Form sends data property (not body) for axios compatibility", async () => {
      const user = userEvent.setup();
      const mockFetch = mockServices.fetch as ReturnType<typeof vi.fn>;
      mockFetch.mockResolvedValue({ data: { id: 1 } });

      renderWithProviders(
        <View
          url="/api/v1/contacts"
          api={{ create: { method: "POST", path: "" } }}
        >
          <Form action="create">
            <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
            <Submit label="Save" />
          </Form>
        </View>
      );

      await user.type(screen.getByLabelText("Email"), "test@example.com");
      await user.click(screen.getByRole("button", { name: "Save" }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          "/api/v1/contacts",
          expect.objectContaining({
            method: "POST",
            data: { email: "test@example.com" },
          }),
        );
      });

      // Verify body is NOT used (axios uses data, not body)
      const calls = mockFetch.mock.calls;
      const postCall = calls.find((call) => call[1]?.method === "POST");
      expect(postCall?.[1]).not.toHaveProperty("body");
    });
  });
});
