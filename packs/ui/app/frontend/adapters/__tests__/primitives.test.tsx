/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, Dropdown, Search, Submit, Form, View } from "..";
import { renderWithProviders, resetMocks, mockServices } from "./test-utils";

describe("Primitive Adapters", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("Button", () => {
    it("renders with label", () => {
      renderWithProviders(
        <View>
          <Button label="Click me" />
        </View>,
      );

      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("calls onClick when clicked", async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(
        <View>
          <Button label="Click me" onClick={onClick} />
        </View>,
      );

      await user.click(screen.getByText("Click me"));

      expect(onClick).toHaveBeenCalled();
    });

    it("renders with different variants", () => {
      renderWithProviders(
        <View>
          <Button label="Primary" variant="primary" />
          <Button label="Secondary" variant="secondary" />
          <Button label="Ghost" variant="ghost" />
          <Button label="Destructive" variant="destructive" />
        </View>,
      );

      expect(screen.getByText("Primary")).toBeInTheDocument();
      expect(screen.getByText("Secondary")).toBeInTheDocument();
      expect(screen.getByText("Ghost")).toBeInTheDocument();
      expect(screen.getByText("Destructive")).toBeInTheDocument();
    });
  });

  describe("Dropdown", () => {
    it("renders trigger button", () => {
      renderWithProviders(
        <View>
          <Dropdown label="Actions">
            <div>Option 1</div>
          </Dropdown>
        </View>,
      );

      expect(screen.getByText("Actions")).toBeInTheDocument();
    });

    it("shows content when clicked", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <View>
          <Dropdown label="Actions">
            <div>Option 1</div>
          </Dropdown>
        </View>,
      );

      await user.click(screen.getByText("Actions"));

      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });
  });

  describe("Search", () => {
    it("renders with placeholder", () => {
      renderWithProviders(
        <View>
          <Search placeholder="Search users..." />
        </View>,
      );

      expect(
        screen.getByPlaceholderText("Search users..."),
      ).toBeInTheDocument();
    });

    it("calls onSearch when value changes", async () => {
      const onSearch = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(
        <View>
          <Search onSearch={onSearch} />
        </View>,
      );

      const input = screen.getByRole("searchbox");
      await user.type(input, "test");

      expect(onSearch).toHaveBeenCalled();
    });

    it("shows clear button when has value", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <View>
          <Search />
        </View>,
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
        <View>
          <Search onSearch={onSearch} />
        </View>,
      );

      const input = screen.getByRole("searchbox");
      await user.type(input, "test");
      await user.click(screen.getByRole("button"));

      expect(input).toHaveValue("");
      expect(onSearch).toHaveBeenLastCalledWith("");
    });
  });

  describe("Submit", () => {
    it("renders with default label", () => {
      renderWithProviders(
        <View>
          <Form>
            <Submit />
          </Form>
        </View>,
      );

      expect(
        screen.getByRole("button", { name: "Submit" }),
      ).toBeInTheDocument();
    });

    it("renders with custom label", () => {
      renderWithProviders(
        <View>
          <Form>
            <Submit label="Save Changes" />
          </Form>
        </View>,
      );

      expect(
        screen.getByRole("button", { name: "Save Changes" }),
      ).toBeInTheDocument();
    });

    it("is type submit", () => {
      renderWithProviders(
        <View>
          <Form>
            <Submit />
          </Form>
        </View>,
      );

      expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute(
        "type",
        "submit",
      );
    });
  });
});
