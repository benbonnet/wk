import type { Meta, StoryObj } from "@storybook/react-vite";
import { BadgeDisplay } from "@ui/adapters";

const meta: Meta<typeof BadgeDisplay> = {
  title: "Displays/Badge",
  component: BadgeDisplay,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BadgeDisplay>;

export const Active: Story = {
  args: {
    name: "status",
    data: { status: "active" },
  },
};

export const Pending: Story = {
  args: {
    name: "status",
    data: { status: "pending" },
  },
};

export const Failed: Story = {
  args: {
    name: "status",
    data: { status: "failed" },
  },
};

export const Completed: Story = {
  args: {
    name: "status",
    data: { status: "completed" },
  },
};

export const Inactive: Story = {
  args: {
    name: "status",
    data: { status: "inactive" },
  },
};

export const Processing: Story = {
  args: {
    name: "status",
    data: { status: "processing" },
  },
};

export const WithLabel: Story = {
  args: {
    name: "status",
    label: "Status",
    data: { status: "active" },
  },
};

export const WithOptions: Story = {
  args: {
    name: "priority",
    label: "Priority",
    options: [
      { value: "low", label: "Low Priority" },
      { value: "medium", label: "Medium Priority" },
      { value: "high", label: "High Priority" },
      { value: "critical", label: "Critical" },
    ],
    data: { priority: "high" },
  },
};

export const PriorityLow: Story = {
  args: {
    name: "priority",
    label: "Priority",
    data: { priority: "low" },
  },
};

export const PriorityMedium: Story = {
  args: {
    name: "priority",
    label: "Priority",
    data: { priority: "medium" },
  },
};

export const PriorityCritical: Story = {
  args: {
    name: "priority",
    label: "Priority",
    data: { priority: "critical" },
  },
};

export const Empty: Story = {
  args: {
    name: "status",
    label: "Status",
    data: { status: null },
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <BadgeDisplay name="s1" data={{ s1: "active" }} />
      <BadgeDisplay name="s2" data={{ s2: "pending" }} />
      <BadgeDisplay name="s3" data={{ s3: "failed" }} />
      <BadgeDisplay name="s4" data={{ s4: "completed" }} />
      <BadgeDisplay name="s5" data={{ s5: "inactive" }} />
      <BadgeDisplay name="s6" data={{ s6: "processing" }} />
      <BadgeDisplay name="s7" data={{ s7: "cancelled" }} />
    </div>
  ),
};

export const AllPriorities: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <BadgeDisplay name="p1" data={{ p1: "low" }} />
      <BadgeDisplay name="p2" data={{ p2: "medium" }} />
      <BadgeDisplay name="p3" data={{ p3: "high" }} />
      <BadgeDisplay name="p4" data={{ p4: "critical" }} />
    </div>
  ),
};
