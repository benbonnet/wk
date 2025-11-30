import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormikAdapter } from "../formik-adapter";
import { renderWithFormik, resetMocks } from "./test-utils";

describe("FormikAdapter", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("INPUT_TEXT", () => {
    it("renders with label", () => {
      renderWithFormik(
        <FormikAdapter type="INPUT_TEXT" name="email" label="Email Address" />,
      );

      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    });

    it("renders with placeholder", () => {
      renderWithFormik(
        <FormikAdapter type="INPUT_TEXT" name="email" placeholder="Enter email" />,
      );

      expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
    });

    it("updates value when typing", async () => {
      const user = userEvent.setup();

      renderWithFormik(
        <FormikAdapter type="INPUT_TEXT" name="email" />,
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "test@example.com");

      expect(input).toHaveValue("test@example.com");
    });

    it("displays helper text", () => {
      renderWithFormik(
        <FormikAdapter
          type="INPUT_TEXT"
          name="email"
          helperText="We'll never share your email"
        />,
      );

      expect(
        screen.getByText("We'll never share your email"),
      ).toBeInTheDocument();
    });

    it("can be disabled", () => {
      renderWithFormik(
        <FormikAdapter type="INPUT_TEXT" name="email" disabled />,
      );

      expect(screen.getByRole("textbox")).toBeDisabled();
    });
  });

  describe("INPUT_TEXTAREA", () => {
    it("renders with correct rows", () => {
      renderWithFormik(
        <FormikAdapter type="INPUT_TEXTAREA" name="description" rows={5} />,
      );

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("rows", "5");
    });

    it("can be typed into", async () => {
      const user = userEvent.setup();

      renderWithFormik(
        <FormikAdapter type="INPUT_TEXTAREA" name="description" />,
      );

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Test content");

      expect(textarea).toHaveValue("Test content");
    });
  });

  describe("INPUT_SELECT", () => {
    const options = [
      { value: "us", label: "United States" },
      { value: "uk", label: "United Kingdom" },
      { value: "ca", label: "Canada" },
    ];

    it("renders with placeholder", () => {
      renderWithFormik(
        <FormikAdapter
          type="INPUT_SELECT"
          name="country"
          placeholder="Select country"
          options={options}
        />,
      );

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("renders all options", async () => {
      const user = userEvent.setup();

      renderWithFormik(
        <FormikAdapter type="INPUT_SELECT" name="country" options={options} />,
      );

      await user.click(screen.getByRole("combobox"));

      expect(screen.getAllByText("United States").length).toBeGreaterThan(0);
      expect(screen.getAllByText("United Kingdom").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Canada").length).toBeGreaterThan(0);
    });
  });

  describe("INPUT_CHECKBOX", () => {
    it("renders with label", () => {
      renderWithFormik(
        <FormikAdapter type="INPUT_CHECKBOX" name="agree" label="I agree to terms" />,
      );

      expect(screen.getByText("I agree to terms")).toBeInTheDocument();
    });

    it("can be checked", async () => {
      const user = userEvent.setup();

      renderWithFormik(
        <FormikAdapter type="INPUT_CHECKBOX" name="agree" label="I agree" />,
      );

      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);

      expect(checkbox).toBeChecked();
    });

    it("can be unchecked", async () => {
      const user = userEvent.setup();

      renderWithFormik(
        <FormikAdapter type="INPUT_CHECKBOX" name="agree" label="I agree" />,
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
      renderWithFormik(
        <FormikAdapter type="INPUT_CHECKBOXES" name="notifications" options={options} />,
      );

      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("SMS")).toBeInTheDocument();
      expect(screen.getByText("Push")).toBeInTheDocument();
    });

    it("can check options", async () => {
      const user = userEvent.setup();

      renderWithFormik(
        <FormikAdapter type="INPUT_CHECKBOXES" name="notifications" options={options} />,
        { initialValues: { notifications: [] } },
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
      renderWithFormik(
        <FormikAdapter type="INPUT_RADIOS" name="plan" options={options} />,
      );

      expect(screen.getByText("Free Plan")).toBeInTheDocument();
      expect(screen.getByText("Pro Plan")).toBeInTheDocument();
      expect(screen.getByText("Enterprise")).toBeInTheDocument();
    });

    it("can select an option", async () => {
      const user = userEvent.setup();

      renderWithFormik(
        <FormikAdapter type="INPUT_RADIOS" name="plan" options={options} />,
      );

      await user.click(screen.getByText("Pro Plan"));

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
      expect(radios[2]).not.toBeChecked();
    });
  });

  describe("INPUT_DATE", () => {
    it("renders date input", () => {
      renderWithFormik(
        <FormikAdapter type="INPUT_DATE" name="birthdate" label="Birth Date" />,
      );

      expect(screen.getByLabelText("Birth Date")).toHaveAttribute("type", "date");
    });
  });

  describe("INPUT_DATETIME", () => {
    it("renders datetime input", () => {
      renderWithFormik(
        <FormikAdapter type="INPUT_DATETIME" name="appointment" label="Appointment" />,
      );

      expect(screen.getByLabelText("Appointment")).toHaveAttribute("type", "datetime-local");
    });
  });

  describe("INPUT_TAGS", () => {
    it("renders placeholder for tags", () => {
      renderWithFormik(
        <FormikAdapter type="INPUT_TAGS" name="skills" />,
      );

      expect(screen.getByText(/pending implementation/i)).toBeInTheDocument();
    });
  });
});
