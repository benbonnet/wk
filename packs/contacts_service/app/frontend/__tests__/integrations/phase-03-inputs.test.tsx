import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  TextInput,
  Textarea,
  Select,
  Checkbox,
  Checkboxes,
  Radios,
  DateInput,
  TagsInput,
  View,
  Form,
} from "@ui/adapters";
import { renderWithProviders, resetMocks } from "./test-utils";
import type { ReactNode } from "react";

// Wrapper to provide FormContext for inputs
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
    describe("TextInput", () => {
      it("renders with label", () => {
        renderWithProviders(
          <InputWrapper>
            <TextInput name="email" label="Email Address" />
          </InputWrapper>
        );
        expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
      });

      it("renders with placeholder", () => {
        renderWithProviders(
          <InputWrapper>
            <TextInput name="email" placeholder="Enter your email" />
          </InputWrapper>
        );
        expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
      });

      it("updates value when typing", async () => {
        const user = userEvent.setup();

        renderWithProviders(
          <InputWrapper>
            <TextInput name="email" label="Email" />
          </InputWrapper>
        );

        const input = screen.getByLabelText("Email");
        await user.type(input, "test@example.com");
        expect(input).toHaveValue("test@example.com");
      });

      it("displays helper text", () => {
        renderWithProviders(
          <InputWrapper>
            <TextInput name="email" helperText="We'll never share your email" />
          </InputWrapper>
        );
        expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
      });

      it("can be disabled", () => {
        renderWithProviders(
          <InputWrapper>
            <TextInput name="email" disabled />
          </InputWrapper>
        );
        expect(screen.getByRole("textbox")).toBeDisabled();
      });
    });

    describe("Textarea", () => {
      it("renders with correct rows", () => {
        renderWithProviders(
          <InputWrapper>
            <Textarea name="description" rows={5} />
          </InputWrapper>
        );
        const textarea = screen.getByRole("textbox");
        expect(textarea).toHaveAttribute("rows", "5");
      });

      it("can be typed into", async () => {
        const user = userEvent.setup();

        renderWithProviders(
          <InputWrapper>
            <Textarea name="description" />
          </InputWrapper>
        );

        const textarea = screen.getByRole("textbox");
        await user.type(textarea, "Test content");
        expect(textarea).toHaveValue("Test content");
      });
    });
  });

  describe("3.2 Selection Inputs", () => {
    describe("Select", () => {
      const options = [
        { label: "Option A", value: "a" },
        { label: "Option B", value: "b" },
        { label: "Option C", value: "c" },
      ];

      it("renders with label", () => {
        renderWithProviders(
          <InputWrapper>
            <Select name="choice" label="Choice" options={options} />
          </InputWrapper>
        );
        expect(screen.getByText("Choice")).toBeInTheDocument();
      });

      it("renders with placeholder", () => {
        renderWithProviders(
          <InputWrapper>
            <Select name="choice" placeholder="Select..." options={options} />
          </InputWrapper>
        );
        expect(screen.getByRole("combobox")).toBeInTheDocument();
      });

      it("renders all options", async () => {
        const user = userEvent.setup();

        renderWithProviders(
          <InputWrapper>
            <Select name="choice" options={options} />
          </InputWrapper>
        );

        await user.click(screen.getByRole("combobox"));
        expect(screen.getAllByText("Option A").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Option B").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Option C").length).toBeGreaterThan(0);
      });
    });

    describe("Checkbox", () => {
      it("renders with label", () => {
        renderWithProviders(
          <InputWrapper>
            <Checkbox name="agree" label="I agree to terms" />
          </InputWrapper>
        );
        expect(screen.getByText("I agree to terms")).toBeInTheDocument();
      });

      it("can be checked", async () => {
        const user = userEvent.setup();

        renderWithProviders(
          <InputWrapper>
            <Checkbox name="agree" label="I agree" />
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
            <Checkbox name="agree" label="I agree" />
          </InputWrapper>
        );

        const checkbox = screen.getByRole("checkbox");
        await user.click(checkbox);
        expect(checkbox).toBeChecked();

        await user.click(checkbox);
        expect(checkbox).not.toBeChecked();
      });
    });

    describe("Checkboxes", () => {
      const options = [
        { value: "email", label: "Email" },
        { value: "sms", label: "SMS" },
        { value: "push", label: "Push" },
      ];

      it("renders all options", () => {
        renderWithProviders(
          <InputWrapper>
            <Checkboxes name="notifications" options={options} />
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
            <Checkboxes name="notifications" options={options} />
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

    describe("Radios", () => {
      const options = [
        { value: "free", label: "Free Plan" },
        { value: "pro", label: "Pro Plan" },
        { value: "enterprise", label: "Enterprise" },
      ];

      it("renders all options", () => {
        renderWithProviders(
          <InputWrapper>
            <Radios name="plan" options={options} />
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
            <Radios name="plan" options={options} />
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
    describe("DateInput", () => {
      it("renders date picker trigger", () => {
        renderWithProviders(
          <InputWrapper>
            <DateInput name="dob" label="Date of Birth" />
          </InputWrapper>
        );
        expect(screen.getByRole("button")).toBeInTheDocument();
        expect(screen.getByText("Date of Birth")).toBeInTheDocument();
      });

      it("displays placeholder when no value", () => {
        renderWithProviders(
          <InputWrapper>
            <DateInput name="dob" placeholder="Select date" />
          </InputWrapper>
        );
        expect(screen.getByText("Select date")).toBeInTheDocument();
      });

      it("opens calendar on click", async () => {
        const user = userEvent.setup();

        renderWithProviders(
          <InputWrapper>
            <DateInput name="dob" label="Date" />
          </InputWrapper>
        );

        await user.click(screen.getByRole("button"));
        expect(screen.getByRole("grid")).toBeInTheDocument();
      });
    });
  });

  describe("3.4 Complex Inputs", () => {
    describe("TagsInput", () => {
      it("renders empty state", () => {
        renderWithProviders(
          <InputWrapper>
            <TagsInput name="skills" />
          </InputWrapper>
        );
        expect(screen.getByRole("textbox")).toBeInTheDocument();
      });

      it("adds tag on Enter", async () => {
        const user = userEvent.setup();

        renderWithProviders(
          <InputWrapper>
            <TagsInput name="skills" />
          </InputWrapper>
        );

        const input = screen.getByRole("textbox");
        await user.type(input, "JavaScript{enter}");
        expect(screen.getByText("JavaScript")).toBeInTheDocument();
      });

      it("removes tag when X is clicked", async () => {
        const user = userEvent.setup();

        renderWithProviders(
          <InputWrapper>
            <TagsInput name="skills" />
          </InputWrapper>
        );

        const input = screen.getByRole("textbox");
        await user.type(input, "React{enter}");
        await user.type(input, "Vue{enter}");

        expect(screen.getByText("React")).toBeInTheDocument();
        expect(screen.getByText("Vue")).toBeInTheDocument();

        const removeButtons = screen.getAllByRole("button");
        await user.click(removeButtons[0]);

        expect(screen.queryByText("React")).not.toBeInTheDocument();
        expect(screen.getByText("Vue")).toBeInTheDocument();
      });

      it("shows placeholder when empty", () => {
        renderWithProviders(
          <InputWrapper>
            <TagsInput name="tags" placeholder="Add tags here" />
          </InputWrapper>
        );
        expect(screen.getByPlaceholderText("Add tags here")).toBeInTheDocument();
      });
    });
  });

  describe("3.5 Input States", () => {
    it("TextInput renders disabled state", () => {
      renderWithProviders(
        <InputWrapper>
          <TextInput name="email" label="Email" disabled />
        </InputWrapper>
      );
      expect(screen.getByLabelText("Email")).toBeDisabled();
    });

    it("TextInput displays helper text", () => {
      renderWithProviders(
        <InputWrapper>
          <TextInput name="email" label="Email" helperText="We'll never share your email" />
        </InputWrapper>
      );
      expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
    });

    it("Select renders disabled state", () => {
      renderWithProviders(
        <InputWrapper>
          <Select
            name="choice"
            label="Choice"
            options={[{ label: "A", value: "a" }]}
            disabled
          />
        </InputWrapper>
      );
      expect(screen.getByRole("combobox")).toBeDisabled();
    });

    it("Checkbox renders disabled state", () => {
      renderWithProviders(
        <InputWrapper>
          <Checkbox name="agree" label="Agree" disabled />
        </InputWrapper>
      );
      expect(screen.getByRole("checkbox")).toBeDisabled();
    });
  });
});
