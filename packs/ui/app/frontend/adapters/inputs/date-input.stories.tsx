import type { Meta, StoryObj } from "@storybook/react-vite";
import { INPUT_DATE } from "@ui/adapters/inputs";

const meta: Meta<typeof INPUT_DATE> = {
  title: "Inputs/Date",
  component: INPUT_DATE,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    label: { control: "text" },
    placeholder: { control: "text" },
    helperText: { control: "text" },
    disabled: { control: "boolean" },
    error: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof INPUT_DATE>;

export const Default: Story = {
  args: {
    name: "date",
  },
};

export const WithLabel: Story = {
  args: {
    name: "birthdate",
    label: "Birth Date",
  },
};

export const WithPlaceholder: Story = {
  args: {
    name: "due_date",
    label: "Due Date",
    placeholder: "Select a due date",
  },
};

export const WithHelperText: Story = {
  args: {
    name: "start_date",
    label: "Start Date",
    helperText: "When would you like to start?",
  },
};

export const WithValue: Story = {
  args: {
    name: "date",
    label: "Date",
    value: "2025-01-15",
  },
};

export const WithError: Story = {
  args: {
    name: "due_date",
    label: "Due Date",
    error: "Due date is required",
  },
};

export const Disabled: Story = {
  args: {
    name: "date",
    label: "Date",
    value: "2025-01-15",
    disabled: true,
  },
};

export const Complete: Story = {
  args: {
    name: "appointment",
    label: "Appointment Date",
    placeholder: "Choose appointment date",
    helperText: "Select a date within the next 30 days",
  },
};
