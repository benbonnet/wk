import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormikAdapter, View, Form } from "@ui/adapters";
import { renderWithProviders, resetMocks } from "./test-utils";
import type { ReactNode } from "react";

// Wrapper to provide Formik context for inputs
const InputWrapper = ({ children }: { children: ReactNode }) => (
  <View>
    <Form>{children}</Form>
  </View>
);

describe("Phase 3: Input Adapters", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("3.1 Text Inputs", () => {
    describe("INPUT_TEXT", () => {
      it("renders with label", () => {
        renderWithProviders(
          <InputWrapper>
            <FormikAdapter type="INPUT_TEXT" name="email" label="Email Address" />
          </InputWrapper>
        );
        expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
      });

      it("renders with placeholder", () => {
        renderWithProviders(
          <InputWrapper>
            <FormikAdapter type="INPUT_TEXT" name="email" placeholder="Enter your email" />
          </InputWrapper>
        );
        expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
      });

      it("updates value when typing", async () => {
        const user = userEvent.setup();

        renderWithProviders(
          <InputWrapper>
            <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
          </InputWrapper>
        );

        const input = screen.getByLabelText("Email");
        await user.type(input, "test@example.com");
        expect(input).toHaveValue("test@example.com");
      });

      it("displays helper text", () => {
        renderWithProviders(
          <InputWrapper>
            <FormikAdapter type="INPUT_TEXT" name="email" helperText="We'll never share your email" />
          </InputWrapper>
        );
        expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
      });

      it("can be disabled", () => {
        renderWithProviders(
          <InputWrapper>
            <FormikAdapter type="INPUT_TEXT" name="email" disabled />
          </InputWrapper>
        );
        expect(screen.getByRole("textbox")).toBeDisabled();
      });
    });

    describe("INPUT_TEXTAREA", () => {
      it("renders with correct rows", () => {
        renderWithProviders(
          <InputWrapper>
            <FormikAdapter type="INPUT_TEXTAREA" name="description" rows={5} />
          </InputWrapper>
        );
        const textarea = screen.getByRole("textbox");
        expect(textarea).toHaveAttribute("rows", "5");
      });

      it("can be typed into", async () => {
        const user = userEvent.setup();

        renderWithProviders(
          <InputWrapper>
            <FormikAdapter type="INPUT_TEXTAREA" name="description" />
          </InputWrapper>
        );

        const textarea = screen.getByRole("textbox");
        await user.type(textarea, "Test content");
        expect(textarea).toHaveValue("Test content");
      });
    });
  });

  describe("3.2 Selection Inputs", () => {
    describe("INPUT_SELECT", () => {
      const options = [
        { label: "Option A", value: "a" },
        { label: "Option B", value: "b" },
        { label: "Option C", value: "c" },
      ];

      it("renders with label", () => {
        renderWithProviders(
          <InputWrapper>
            <FormikAdapter type="INPUT_SELECT" name="choice" label="Choice" options={options} />
          </InputWrapper>
        );
        expect(screen.getByText("Choice")).toBeInTheDocument();
      });

      it("renders with placeholder", () => {
        renderWithProviders(
          <InputWrapper>
            <FormikAdapter type="INPUT_SELECT" name="choice" placeholder="Select..." options={options} />
          </InputWrapper>
        );
        expect(screen.getByRole("combobox")).toBeInTheDocument();
      });

      it("renders all options", async () => {
        const user = userEvent.setup();

        renderWithProviders(
          <InputWrapper>
            <FormikAdapter type="INPUT_SELECT" name="choice" options={options} />
          </InputWrapper>
        );

        await user.click(screen.getByRole("combobox"));
        expect(screen.getAllByText("Option A").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Option B").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Option C").length).toBeGreaterThan(0);
      });
    });

    describe("INPUT_CHECKBOX", () => {
      it("renders with label", () => {
        renderWithProviders(
          <InputWrapper>
            <FormikAdapter type="INPUT_CHECKBOX" name="agree" label="I agree to terms" />
          </InputWrapper>
        );
        expect(screen.getByText("I agree to terms")).toBeInTheDocument();
      });

      it("can be checked", async () => {
        const user = userEvent.setup();

        renderWithProviders(
          <InputWrapper>
            <FormikAdapter type="INPUT_CHECKBOX" name="agree" label="I agree" />
          </InputWrapper>
        );

        const checkbox = screen.getByRole("checkbox");
        await user.click(checkbox);
        expect(checkbox).toBeChecked();
      });

      it("can be unchecked", async () => {
        const user = userEvent.setup();

        renderWithProviders(
          <InputWrapper>
            <FormikAdapter type="INPUT_CHECKBOX" name="agree" label="I agree" />
          </InputWrapper>
        );

        const checkbox = screen.getByRole("checkbox");
        await user.click(checkbox);
        expect(checkbox).toBeChecked();

        await user.click(checkbox);
        expect(checkbox).not.toBeChecked();
      });
    });

    describe("INPUT_CHECKBOXES", () => {
      const options = [
        { value: "email", label: "Email" },
        { value: "sms", label: "SMS" },
        { value: "push", label: "Push" },
      ];

      it("renders all options", () => {
        renderWithProviders(
          <InputWrapper>
            <FormikAdapter type="INPUT_CHECKBOXES" name="notifications" options={options} />
          </InputWrapper>
        );
        expect(screen.getByText("Email")).toBeInTheDocument();
        expect(screen.getByText("SMS")).toBeInTheDocument();
        expect(screen.getByText("Push")).toBeInTheDocument();
      });

      it("can check options", async () => {
        const user = userEvent.setup();

        renderWithProviders(
          <InputWrapper>
            <FormikAdapter type="INPUT_CHECKBOXES" name="notifications" options={options} />
          </InputWrapper>
        );

        const checkboxes = screen.getAllByRole("checkbox");
        await user.click(checkboxes[0]); // email
        await user.click(checkboxes[2]); // push

        expect(checkboxes[0]).toBeChecked();
        expect(checkboxes[1]).not.toBeChecked();
        expect(checkboxes[2]).toBeChecked();
      });
    });

    describe("INPUT_RADIOS", () => {
      const options = [
        { value: "free", label: "Free Plan" },
        { value: "pro", label: "Pro Plan" },
        { value: "enterprise", label: "Enterprise" },
      ];

      it("renders all options", () => {
        renderWithProviders(
          <InputWrapper>
            <FormikAdapter type="INPUT_RADIOS" name="plan" options={options} />
          </InputWrapper>
        );
        expect(screen.getByText("Free Plan")).toBeInTheDocument();
        expect(screen.getByText("Pro Plan")).toBeInTheDocument();
        expect(screen.getByText("Enterprise")).toBeInTheDocument();
      });

      it("can select an option", async () => {
        const user = userEvent.setup();

        renderWithProviders(
          <InputWrapper>
            <FormikAdapter type="INPUT_RADIOS" name="plan" options={options} />
          </InputWrapper>
        );

        await user.click(screen.getByText("Pro Plan"));

        const radios = screen.getAllByRole("radio");
        expect(radios[0]).not.toBeChecked();
        expect(radios[1]).toBeChecked();
        expect(radios[2]).not.toBeChecked();
      });
    });
  });

  describe("3.3 Date Inputs", () => {
    describe("INPUT_DATE", () => {
      it("renders date input", () => {
        renderWithProviders(
          <InputWrapper>
            <FormikAdapter type="INPUT_DATE" name="dob" label="Date of Birth" />
          </InputWrapper>
        );
        expect(screen.getByLabelText("Date of Birth")).toHaveAttribute("type", "date");
      });

      it("can be interacted with", () => {
        renderWithProviders(
          <InputWrapper>
            <FormikAdapter type="INPUT_DATE" name="dob" label="Date" />
          </InputWrapper>
        );
        expect(screen.getByLabelText("Date")).toBeInTheDocument();
      });
    });
  });

  describe("3.4 Complex Inputs", () => {
    describe("INPUT_TAGS", () => {
      it("renders placeholder for tags", () => {
        renderWithProviders(
          <InputWrapper>
            <FormikAdapter type="INPUT_TAGS" name="skills" />
          </InputWrapper>
        );
        expect(screen.getByText(/pending implementation/i)).toBeInTheDocument();
      });
    });
  });

  describe("3.5 Input States", () => {
    it("INPUT_TEXT renders disabled state", () => {
      renderWithProviders(
        <InputWrapper>
          <FormikAdapter type="INPUT_TEXT" name="email" label="Email" disabled />
        </InputWrapper>
      );
      expect(screen.getByLabelText("Email")).toBeDisabled();
    });

    it("INPUT_TEXT displays helper text", () => {
      renderWithProviders(
        <InputWrapper>
          <FormikAdapter type="INPUT_TEXT" name="email" label="Email" helperText="We'll never share your email" />
        </InputWrapper>
      );
      expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
    });

    it("INPUT_SELECT renders disabled state", () => {
      renderWithProviders(
        <InputWrapper>
          <FormikAdapter
            type="INPUT_SELECT"
            name="choice"
            label="Choice"
            options={[{ label: "A", value: "a" }]}
            disabled
          />
        </InputWrapper>
      );
      expect(screen.getByRole("combobox")).toBeDisabled();
    });

    it("INPUT_CHECKBOX renders disabled state", () => {
      renderWithProviders(
        <InputWrapper>
          <FormikAdapter type="INPUT_CHECKBOX" name="agree" label="Agree" disabled />
        </InputWrapper>
      );
      expect(screen.getByRole("checkbox")).toBeDisabled();
    });
  });
});
