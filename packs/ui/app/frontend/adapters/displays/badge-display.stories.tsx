import type { Meta, StoryObj } from "@storybook/react-vite";
import { DISPLAY_BADGE } from "@ui/adapters/displays";

const meta: Meta<typeof DISPLAY_BADGE> = {
  title: "Displays/Badge",
  component: DISPLAY_BADGE,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    label: { control: "text" },
    value: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof DISPLAY_BADGE>;

export const Active: Story = {
  args: {
    name: "status",
    value: "active",
  },
};

export const Pending: Story = {
  args: {
    name: "status",
    value: "pending",
  },
};

export const Failed: Story = {
  args: {
    name: "status",
    value: "failed",
  },
};

export const Completed: Story = {
  args: {
    name: "status",
    value: "completed",
  },
};

export const Inactive: Story = {
  args: {
    name: "status",
    value: "inactive",
  },
};

export const Processing: Story = {
  args: {
    name: "status",
    value: "processing",
  },
};

export const WithLabel: Story = {
  args: {
    name: "status",
    label: "Status",
    value: "active",
  },
};

export const WithOptions: Story = {
  args: {
    name: "priority",
    label: "Priority",
    value: "high",
    options: [
      { value: "low", label: "Low Priority" },
      { value: "medium", label: "Medium Priority" },
      { value: "high", label: "High Priority" },
      { value: "critical", label: "Critical" },
    ],
  },
};

export const PriorityLow: Story = {
  args: {
    name: "priority",
    label: "Priority",
    value: "low",
  },
};

export const PriorityMedium: Story = {
  args: {
    name: "priority",
    label: "Priority",
    value: "medium",
  },
};

export const PriorityCritical: Story = {
  args: {
    name: "priority",
    label: "Priority",
    value: "critical",
  },
};

export const Empty: Story = {
  args: {
    name: "status",
    label: "Status",
    value: null,
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <DISPLAY_BADGE name="s1" value="active" />
      <DISPLAY_BADGE name="s2" value="pending" />
      <DISPLAY_BADGE name="s3" value="failed" />
      <DISPLAY_BADGE name="s4" value="completed" />
      <DISPLAY_BADGE name="s5" value="inactive" />
      <DISPLAY_BADGE name="s6" value="processing" />
      <DISPLAY_BADGE name="s7" value="cancelled" />
    </div>
  ),
};

export const AllPriorities: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <DISPLAY_BADGE name="p1" value="low" />
      <DISPLAY_BADGE name="p2" value="medium" />
      <DISPLAY_BADGE name="p3" value="high" />
      <DISPLAY_BADGE name="p4" value="critical" />
    </div>
  ),
};
