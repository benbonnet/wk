import type { Meta, StoryObj } from "@storybook/react-vite";
import { DISPLAY_DATETIME } from "@ui/adapters/displays";

const meta: Meta<typeof DISPLAY_DATETIME> = {
  title: "Displays/Datetime",
  component: DISPLAY_DATETIME,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    label: { control: "text" },
    value: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof DISPLAY_DATETIME>;

export const Default: Story = {
  args: {
    name: "datetime",
    value: "2025-01-15T14:30:00Z",
  },
};

export const WithLabel: Story = {
  args: {
    name: "updated",
    label: "Last Updated",
    value: "2025-01-15T09:45:30Z",
  },
};

export const Now: Story = {
  args: {
    name: "now",
    label: "Current Time",
    value: new Date().toISOString(),
  },
};

export const MorningTime: Story = {
  args: {
    name: "meeting",
    label: "Meeting Time",
    value: "2025-01-20T08:00:00Z",
  },
};

export const EveningTime: Story = {
  args: {
    name: "event",
    label: "Event Time",
    value: "2025-01-20T19:30:00Z",
  },
};

export const Empty: Story = {
  args: {
    name: "datetime",
    label: "Date & Time",
    value: null,
  },
};
