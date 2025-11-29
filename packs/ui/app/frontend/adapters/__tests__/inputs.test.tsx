import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  INPUT_TEXT,
  INPUT_TEXTAREA,
  INPUT_SELECT,
  INPUT_CHECKBOX,
  INPUT_CHECKBOXES,
  INPUT_RADIOS,
  INPUT_TAGS,
} from "../inputs";
import { renderWithProviders, resetMocks } from "./test-utils";

describe("Input Adapters", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("INPUT_TEXT", () => {
    it("renders with label", () => {
      renderWithProviders(<INPUT_TEXT name="email" label="Email Address" />);

      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    });

    it("renders with placeholder", () => {
      renderWithProviders(
        <INPUT_TEXT name="email" placeholder="Enter email" />,
      );

      expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
    });

    it("calls onChange when value changes", async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(<INPUT_TEXT name="email" onChange={onChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "test@example.com");

      expect(onChange).toHaveBeenCalled();
    });

    it("displays error message", () => {
      renderWithProviders(<INPUT_TEXT name="email" error="Invalid email" />);

      expect(screen.getByText("Invalid email")).toBeInTheDocument();
    });

    it("displays helper text", () => {
      renderWithProviders(
        <INPUT_TEXT name="email" helperText="We'll never share your email" />,
      );

      expect(
        screen.getByText("We'll never share your email"),
      ).toBeInTheDocument();
    });

    it("can be disabled", () => {
      renderWithProviders(<INPUT_TEXT name="email" disabled />);

      expect(screen.getByRole("textbox")).toBeDisabled();
    });
  });

  describe("INPUT_TEXTAREA", () => {
    it("renders with correct rows", () => {
      renderWithProviders(<INPUT_TEXTAREA name="description" rows={5} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("rows", "5");
    });

    it("displays value", () => {
      renderWithProviders(
        <INPUT_TEXTAREA name="description" value="Test content" />,
      );

      expect(screen.getByDisplayValue("Test content")).toBeInTheDocument();
    });
  });

  describe("INPUT_SELECT", () => {
    const options = [
      { value: "us", label: "United States" },
      { value: "uk", label: "United Kingdom" },
      { value: "ca", label: "Canada" },
    ];

    it("renders with placeholder", () => {
      renderWithProviders(
        <INPUT_SELECT
          name="country"
          placeholder="Select country"
          options={options}
        />,
      );

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("renders all options", async () => {
      const user = userEvent.setup();

      renderWithProviders(<INPUT_SELECT name="country" options={options} />);

      await user.click(screen.getByRole("combobox"));

      expect(screen.getByText("United States")).toBeInTheDocument();
      expect(screen.getByText("United Kingdom")).toBeInTheDocument();
      expect(screen.getByText("Canada")).toBeInTheDocument();
    });
  });

  describe("INPUT_CHECKBOX", () => {
    it("renders with label", () => {
      renderWithProviders(
        <INPUT_CHECKBOX name="agree" label="I agree to terms" />,
      );

      expect(screen.getByText("I agree to terms")).toBeInTheDocument();
    });

    it("can be checked", async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(
        <INPUT_CHECKBOX name="agree" label="I agree" onChange={onChange} />,
      );

      await user.click(screen.getByRole("checkbox"));

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it("respects initial value", () => {
      renderWithProviders(<INPUT_CHECKBOX name="agree" value={true} />);

      expect(screen.getByRole("checkbox")).toBeChecked();
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
        <INPUT_CHECKBOXES name="notifications" options={options} />,
      );

      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("SMS")).toBeInTheDocument();
      expect(screen.getByText("Push")).toBeInTheDocument();
    });

    it("shows selected values", () => {
      renderWithProviders(
        <INPUT_CHECKBOXES
          name="notifications"
          options={options}
          value={["email", "push"]}
        />,
      );

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes[0]).toBeChecked(); // email
      expect(checkboxes[1]).not.toBeChecked(); // sms
      expect(checkboxes[2]).toBeChecked(); // push
    });

    it("calls onChange with updated array", async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(
        <INPUT_CHECKBOXES
          name="notifications"
          options={options}
          value={["email"]}
          onChange={onChange}
        />,
      );

      await user.click(screen.getByText("SMS"));

      expect(onChange).toHaveBeenCalledWith(["email", "sms"]);
    });
  });

  describe("INPUT_RADIOS", () => {
    const options = [
      { value: "free", label: "Free Plan" },
      { value: "pro", label: "Pro Plan" },
      { value: "enterprise", label: "Enterprise" },
    ];

    it("renders all options", () => {
      renderWithProviders(<INPUT_RADIOS name="plan" options={options} />);

      expect(screen.getByText("Free Plan")).toBeInTheDocument();
      expect(screen.getByText("Pro Plan")).toBeInTheDocument();
      expect(screen.getByText("Enterprise")).toBeInTheDocument();
    });

    it("shows selected value", () => {
      renderWithProviders(
        <INPUT_RADIOS name="plan" options={options} value="pro" />,
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
      expect(radios[2]).not.toBeChecked();
    });

    it("calls onChange with selected value", async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(
        <INPUT_RADIOS name="plan" options={options} onChange={onChange} />,
      );

      await user.click(screen.getByText("Enterprise"));

      expect(onChange).toHaveBeenCalledWith("enterprise");
    });
  });

  describe("INPUT_TAGS", () => {
    it("displays existing tags", () => {
      renderWithProviders(
        <INPUT_TAGS name="skills" value={["React", "TypeScript"]} />,
      );

      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
    });

    it("adds tag on Enter", async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(
        <INPUT_TAGS name="skills" value={[]} onChange={onChange} />,
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "JavaScript{enter}");

      expect(onChange).toHaveBeenCalledWith(["JavaScript"]);
    });

    it("removes tag when X is clicked", async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(
        <INPUT_TAGS
          name="skills"
          value={["React", "Vue"]}
          onChange={onChange}
        />,
      );

      const removeButtons = screen.getAllByRole("button");
      await user.click(removeButtons[0]);

      expect(onChange).toHaveBeenCalledWith(["Vue"]);
    });

    it("prevents duplicate tags", async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(
        <INPUT_TAGS name="skills" value={["React"]} onChange={onChange} />,
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "React{enter}");

      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
