import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateDisplay } from "@ui/adapters";

const meta: Meta<typeof DateDisplay> = {
  title: "Displays/Date",
  component: DateDisplay,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DateDisplay>;

export const Default: Story = {
  args: {
    name: "date",
    data: { date: "2025-01-15" },
  },
};

export const WithLabel: Story = {
  args: {
    name: "birthdate",
    label: "Birth Date",
    data: { birthdate: "1990-06-15" },
  },
};

export const Today: Story = {
  args: {
    name: "today",
    label: "Today",
    data: { today: new Date().toISOString().split("T")[0] },
  },
};

export const PastDate: Story = {
  args: {
    name: "created",
    label: "Created At",
    data: { created: "2020-03-20" },
  },
};

export const FutureDate: Story = {
  args: {
    name: "due",
    label: "Due Date",
    data: { due: "2026-12-31" },
  },
};

export const Empty: Story = {
  args: {
    name: "date",
    label: "Date",
    data: { date: null },
  },
};
