import type { Meta, StoryObj } from "@storybook/react-vite";
import { withForm } from "@storybook-decorators";
import { DatetimeInput } from "@ui/adapters";

const meta: Meta<typeof DatetimeInput> = {
  title: "Inputs/Datetime",
  component: DatetimeInput,
  tags: ["autodocs"],
  decorators: [withForm],
};

export default meta;
type Story = StoryObj<typeof DatetimeInput>;

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
