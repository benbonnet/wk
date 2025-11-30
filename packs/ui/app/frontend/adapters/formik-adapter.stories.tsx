import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormikAdapter } from "./formik-adapter";
import { withForm } from "@storybook-decorators";

const meta: Meta<typeof FormikAdapter> = {
  title: "Adapters/FormikAdapter",
  component: FormikAdapter,
  tags: ["autodocs"],
  decorators: [withForm],
};

export default meta;
type Story = StoryObj<typeof FormikAdapter>;

export const Text: Story = {
  args: { type: "INPUT_TEXT", name: "email", label: "Email Address" },
};

export const TextWithHelper: Story = {
  args: {
    type: "INPUT_TEXT",
    name: "username",
    label: "Username",
    helperText: "Choose a unique username",
  },
};

export const Textarea: Story = {
  args: { type: "INPUT_TEXTAREA", name: "description", label: "Description", rows: 4 },
};

export const Select: Story = {
  args: {
    type: "INPUT_SELECT",
    name: "country",
    label: "Country",
    placeholder: "Select a country",
    options: [
      { value: "us", label: "United States" },
      { value: "uk", label: "United Kingdom" },
      { value: "ca", label: "Canada" },
    ],
  },
};

export const Checkbox: Story = {
  args: { type: "INPUT_CHECKBOX", name: "agree", label: "I agree to terms" },
};

export const Checkboxes: Story = {
  args: {
    type: "INPUT_CHECKBOXES",
    name: "notifications",
    label: "Notifications",
    options: [
      { value: "email", label: "Email" },
      { value: "sms", label: "SMS" },
      { value: "push", label: "Push" },
    ],
  },
};

export const Radios: Story = {
  args: {
    type: "INPUT_RADIOS",
    name: "plan",
    label: "Plan",
    options: [
      { value: "free", label: "Free" },
      { value: "pro", label: "Pro" },
      { value: "enterprise", label: "Enterprise" },
    ],
  },
};

export const Date: Story = {
  args: { type: "INPUT_DATE", name: "birthdate", label: "Birth Date" },
};

export const Datetime: Story = {
  args: { type: "INPUT_DATETIME", name: "appointment", label: "Appointment" },
};

export const Tags: Story = {
  args: { type: "INPUT_TAGS", name: "skills", label: "Skills" },
};

export const RichText: Story = {
  args: { type: "INPUT_AI_RICH_TEXT", name: "content", label: "Content", rows: 6 },
};

export const Disabled: Story = {
  args: {
    type: "INPUT_TEXT",
    name: "readonly",
    label: "Read Only",
    disabled: true,
  },
};
