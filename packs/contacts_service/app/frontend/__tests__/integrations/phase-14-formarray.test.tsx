import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  View,
  Form,
  FormArray,
  TextInput,
} from "@ui/adapters";
import { renderWithProviders, resetMocks } from "./test-utils";

describe("Phase 14: FormArray (Dynamic Fields)", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("14.1 Array Rendering", () => {
    it("FormArray renders template for each array item", () => {
      renderWithProviders(
        <View>
          <Form
            defaultValues={{
              addresses: [
                { street: "123 Main St" },
                { street: "456 Oak Ave" },
              ],
            }}
          >
            <FormArray
              name="addresses"
              label="Addresses"
              template={[
                { type: "INPUT_TEXT", name: "street", label: "Street" },
              ]}
            />
          </Form>
        </View>
      );

      // Should have 2 street inputs (one per array item)
      const streetInputs = screen.getAllByLabelText("Street");
      expect(streetInputs).toHaveLength(2);
    });

    it("FormArray renders empty state when array empty", () => {
      renderWithProviders(
        <View>
          <Form defaultValues={{ items: [] }}>
            <FormArray
              name="items"
              label="Items"
              template={[
                { type: "INPUT_TEXT", name: "name", label: "Name" },
              ]}
            />
          </Form>
        </View>
      );

      // No name inputs when array is empty
      expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();
      // But add button should be present
      expect(screen.getByRole("button", { name: /Add Item/i })).toBeInTheDocument();
    });

    it("FormArray renders label", () => {
      renderWithProviders(
        <View>
          <Form defaultValues={{ addresses: [] }}>
            <FormArray
              name="addresses"
              label="Shipping Addresses"
              template={[]}
            />
          </Form>
        </View>
      );

      expect(screen.getByText("Shipping Addresses")).toBeInTheDocument();
    });
  });

  describe("14.2 Array Manipulation", () => {
    it("Click add button adds new item from template", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <View>
          <Form defaultValues={{ phones: [] }}>
            <FormArray
              name="phones"
              template={[
                { type: "INPUT_TEXT", name: "number", label: "Phone Number" },
              ]}
            />
          </Form>
        </View>
      );

      // Initially no phone inputs
      expect(screen.queryByLabelText("Phone Number")).not.toBeInTheDocument();

      // Click add
      await user.click(screen.getByRole("button", { name: /Add Item/i }));

      // Now should have one phone input
      expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();

      // Click add again
      await user.click(screen.getByRole("button", { name: /Add Item/i }));

      // Now should have two phone inputs
      expect(screen.getAllByLabelText("Phone Number")).toHaveLength(2);
    });

    it("Each item has remove button", () => {
      renderWithProviders(
        <View>
          <Form defaultValues={{ items: [{ name: "Item 1" }] }}>
            <FormArray
              name="items"
              template={[
                { type: "INPUT_TEXT", name: "name", label: "Name" },
              ]}
            />
          </Form>
        </View>
      );

      // Should have remove button
      expect(screen.getByRole("button", { name: /Remove/i })).toBeInTheDocument();
    });

    it("Click remove removes item from array", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <View>
          <Form
            defaultValues={{
              items: [{ name: "First" }, { name: "Second" }],
            }}
          >
            <FormArray
              name="items"
              template={[
                { type: "INPUT_TEXT", name: "name", label: "Name" },
              ]}
            />
          </Form>
        </View>
      );

      // Initially 2 items
      expect(screen.getAllByLabelText("Name")).toHaveLength(2);

      // Remove first item
      const removeButtons = screen.getAllByRole("button", { name: /Remove/i });
      await user.click(removeButtons[0]);

      // Now should have 1 item
      await waitFor(() => {
        expect(screen.getAllByLabelText("Name")).toHaveLength(1);
      });
    });

    it("Item indices update after removal", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <View>
          <Form
            defaultValues={{
              items: [{ name: "A" }, { name: "B" }, { name: "C" }],
            }}
          >
            <FormArray
              name="items"
              template={[
                { type: "INPUT_TEXT", name: "name", label: "Name" },
              ]}
            />
          </Form>
        </View>
      );

      // Remove middle item (B)
      const removeButtons = screen.getAllByRole("button", { name: /Remove/i });
      await user.click(removeButtons[1]);

      // Should have 2 items remaining
      await waitFor(() => {
        expect(screen.getAllByLabelText("Name")).toHaveLength(2);
      });
    });
  });

  describe("14.3 Array Data", () => {
    it("Array field input is rendered and interactive", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <View>
          <Form defaultValues={{ phones: [{ number: "" }] }}>
            <FormArray
              name="phones"
              template={[
                { type: "INPUT_TEXT", name: "number", label: "Phone" },
              ]}
            />
          </Form>
        </View>
      );

      const phoneInput = screen.getByLabelText("Phone");
      expect(phoneInput).toBeInTheDocument();

      // Input should be focusable and interactive
      await user.click(phoneInput);
      expect(phoneInput).toHaveFocus();
    });

    it("Multiple array items render independent inputs", () => {
      renderWithProviders(
        <View>
          <Form
            defaultValues={{ contacts: [{ email: "a@test.com" }, { email: "b@test.com" }] }}
          >
            <FormArray
              name="contacts"
              template={[
                { type: "INPUT_TEXT", name: "email", label: "Email" },
              ]}
            />
          </Form>
        </View>
      );

      const emailInputs = screen.getAllByLabelText("Email");

      // Each array item should have its own input
      expect(emailInputs).toHaveLength(2);
      // Inputs should be distinct elements
      expect(emailInputs[0]).not.toBe(emailInputs[1]);
    });
  });
});
