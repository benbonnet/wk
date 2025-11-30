import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatetimeDisplay } from "@ui/adapters";

const meta: Meta<typeof DatetimeDisplay> = {
  title: "Displays/Datetime",
  component: DatetimeDisplay,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DatetimeDisplay>;

export const Default: Story = {
  args: {
    name: "datetime",
    data: { datetime: "2025-01-15T14:30:00Z" },
  },
};

export const WithLabel: Story = {
  args: {
    name: "updated",
    label: "Last Updated",
    data: { updated: "2025-01-15T09:45:30Z" },
  },
};

export const Now: Story = {
  args: {
    name: "now",
    label: "Current Time",
    data: { now: new Date().toISOString() },
  },
};

export const MorningTime: Story = {
  args: {
    name: "meeting",
    label: "Meeting Time",
    data: { meeting: "2025-01-20T08:00:00Z" },
  },
};

export const EveningTime: Story = {
  args: {
    name: "event",
    label: "Event Time",
    data: { event: "2025-01-20T19:30:00Z" },
  },
};

export const Empty: Story = {
  args: {
    name: "datetime",
    label: "Date & Time",
    data: { datetime: null },
  },
};
