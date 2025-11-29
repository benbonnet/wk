import type { Meta, StoryObj } from "@storybook/react-vite";
import { DISPLAY_DATE } from "@ui/adapters/displays";

const meta: Meta<typeof DISPLAY_DATE> = {
  title: "Displays/Date",
  component: DISPLAY_DATE,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    label: { control: "text" },
    value: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof DISPLAY_DATE>;

export const Default: Story = {
  args: {
    name: "date",
    value: "2025-01-15",
  },
};

export const WithLabel: Story = {
  args: {
    name: "birthdate",
    label: "Birth Date",
    value: "1990-06-15",
  },
};

export const Today: Story = {
  args: {
    name: "today",
    label: "Today",
    value: new Date().toISOString().split("T")[0],
  },
};

export const PastDate: Story = {
  args: {
    name: "created",
    label: "Created At",
    value: "2020-03-20",
  },
};

export const FutureDate: Story = {
  args: {
    name: "due",
    label: "Due Date",
    value: "2026-12-31",
  },
};

export const Empty: Story = {
  args: {
    name: "date",
    label: "Date",
    value: null,
  },
};
