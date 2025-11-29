import type { Meta, StoryObj } from "@storybook/react-vite";
import { INPUT_DATETIME } from "@ui/adapters/inputs";

const meta: Meta<typeof INPUT_DATETIME> = {
  title: "Inputs/Datetime",
  component: INPUT_DATETIME,
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
type Story = StoryObj<typeof INPUT_DATETIME>;

export const Default: Story = {
  args: {
    name: "datetime",
  },
};

export const WithLabel: Story = {
  args: {
    name: "meeting",
    label: "Meeting Time",
  },
};

export const WithPlaceholder: Story = {
  args: {
    name: "event",
    label: "Event Date & Time",
    placeholder: "Select event date and time",
  },
};

export const WithHelperText: Story = {
  args: {
    name: "deadline",
    label: "Deadline",
    helperText: "Choose the exact deadline date and time",
  },
};

export const WithValue: Story = {
  args: {
    name: "meeting",
    label: "Meeting Time",
    value: "2025-01-15T14:30:00Z",
  },
};

export const WithError: Story = {
  args: {
    name: "deadline",
    label: "Deadline",
    error: "Deadline must be in the future",
  },
};

export const Disabled: Story = {
  args: {
    name: "datetime",
    label: "Date & Time",
    value: "2025-01-15T10:00:00Z",
    disabled: true,
  },
};

export const Complete: Story = {
  args: {
    name: "appointment",
    label: "Appointment",
    placeholder: "Choose date and time",
    helperText: "All times are in your local timezone",
  },
};
