import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
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
} from "@ui/adapters";
import { renderWithProviders, resetMocks } from "./test-utils";

describe("Phase 5: Layout Adapters", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("5.1 Basic Layouts", () => {
    describe("View", () => {
      it("renders children", () => {
        renderWithProviders(
          <View>
            <div>View Content</div>
          </View>
        );
        expect(screen.getByText("View Content")).toBeInTheDocument();
      });

      it("has data-ui attribute", () => {
        const { container } = renderWithProviders(
          <View>
            <div>Content</div>
          </View>
        );
        const viewElement = container.querySelector('[data-ui="view"]');
        expect(viewElement).toBeInTheDocument();
      });
    });

    describe("Group", () => {
      it("renders children", () => {
        renderWithProviders(
          <View>
            <Group>
              <div data-testid="child-1">Child 1</div>
              <div data-testid="child-2">Child 2</div>
            </Group>
          </View>
        );
        expect(screen.getByTestId("child-1")).toBeInTheDocument();
        expect(screen.getByTestId("child-2")).toBeInTheDocument();
      });

      it("renders label as heading", () => {
        renderWithProviders(
          <View>
            <Group label="Personal Information">
              <div>Content</div>
            </Group>
          </View>
        );
        expect(screen.getByText("Personal Information")).toBeInTheDocument();
      });

      it("renders without header when no label", () => {
        renderWithProviders(
          <View>
            <Group>
              <div>Content</div>
            </Group>
          </View>
        );
        expect(screen.queryByRole("heading")).not.toBeInTheDocument();
        expect(screen.getByText("Content")).toBeInTheDocument();
      });
    });

    describe("CardGroup", () => {
      it("renders children in card", () => {
        renderWithProviders(
          <CardGroup>
            <div data-testid="card-content">Card Content</div>
          </CardGroup>
        );
        expect(screen.getByTestId("card-content")).toBeInTheDocument();
      });

      it("renders card title", () => {
        renderWithProviders(
          <CardGroup label="Account Details">
            <div>Content</div>
          </CardGroup>
        );
        expect(screen.getByText("Account Details")).toBeInTheDocument();
      });
    });

    describe("Alert", () => {
      it("renders message", () => {
        renderWithProviders(<Alert label="This is important" />);
        expect(screen.getByText("This is important")).toBeInTheDocument();
      });

      it("renders with alert role", () => {
        renderWithProviders(<Alert label="Info message" />);
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });

      it("applies color variant", () => {
        renderWithProviders(<Alert label="Error!" color="red" />);
        const alert = screen.getByRole("alert");
        expect(alert.className).toContain("text-red");
      });
    });
  });

  describe("5.2 Page Layout", () => {
    it("renders title and description", () => {
      renderWithProviders(
        <Page title="Users" description="Manage users">
          <div>Page content</div>
        </Page>
      );
      expect(screen.getByText("Users")).toBeInTheDocument();
      expect(screen.getByText("Manage users")).toBeInTheDocument();
    });

    it("renders children", () => {
      renderWithProviders(
        <Page>
          <div>Page content</div>
        </Page>
      );
      expect(screen.getByText("Page content")).toBeInTheDocument();
    });
  });

  describe("5.3 Show Layout", () => {
    it("renders children with data context", () => {
      const record = { name: "John Doe", email: "john@example.com" };

      renderWithProviders(
        <View>
          <Show record={record}>
            <DisplayAdapter type="DISPLAY_TEXT" name="name" label="Name" value={record.name} />
            <DisplayAdapter type="DISPLAY_TEXT" name="email" label="Email" value={record.email} />
          </Show>
        </View>
      );

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    it("renders title when provided", () => {
      renderWithProviders(
        <Show title="Contact Details" record={{}}>
          <div>Content</div>
        </Show>
      );
      expect(screen.getByText("Contact Details")).toBeInTheDocument();
    });

    it("handles empty record", () => {
      renderWithProviders(
        <View>
          <Show record={{}}>
            <DisplayAdapter type="DISPLAY_TEXT" name="name" label="Name" value={null} />
          </Show>
        </View>
      );
      // Should show dash for null value
      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  describe("5.4 Actions Layout", () => {
    it("renders children inline", () => {
      renderWithProviders(
        <View>
          <Actions>
            <Button label="Save" />
            <Button label="Cancel" />
          </Actions>
        </View>
      );
      expect(screen.getByText("Save")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    it("applies flex styling", () => {
      renderWithProviders(
        <View>
          <Actions>
            <Button label="Action 1" />
            <Button label="Action 2" />
          </Actions>
        </View>
      );
      const container = screen.getByText("Action 1").closest("div");
      expect(container).toHaveClass("flex");
    });
  });

  describe("5.5 Form Layout", () => {
    it("renders form element", () => {
      const { container } = renderWithProviders(
        <View>
          <Form>
            <div>Form content</div>
          </Form>
        </View>
      );
      const formElement = container.querySelector("form");
      expect(formElement).toBeInTheDocument();
    });

    it("provides form context to children", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <View>
          <Form>
            <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
          </Form>
        </View>
      );

      const input = screen.getByLabelText("Email");
      await user.type(input, "test@example.com");
      expect(input).toHaveValue("test@example.com");
    });
  });
});
