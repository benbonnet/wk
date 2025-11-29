import type { Meta, StoryObj } from "@storybook/react-vite";
import { BooleanDisplay } from "@ui/adapters";

const meta: Meta<typeof BooleanDisplay> = {
  title: "Displays/Boolean",
  component: BooleanDisplay,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BooleanDisplay>;

export const True: Story = {
  args: {
    name: "active",
    data: { active: true },
  },
};

export const False: Story = {
  args: {
    name: "active",
    data: { active: false },
  },
};

export const WithLabelTrue: Story = {
  args: {
    name: "verified",
    label: "Email Verified",
    data: { verified: true },
  },
};

export const WithLabelFalse: Story = {
  args: {
    name: "verified",
    label: "Email Verified",
    data: { verified: false },
  },
};

export const TruthyValue: Story = {
  args: {
    name: "enabled",
    label: "Enabled",
    data: { enabled: 1 },
  },
};

export const FalsyValue: Story = {
  args: {
    name: "enabled",
    label: "Enabled",
    data: { enabled: 0 },
  },
};

export const NullValue: Story = {
  args: {
    name: "active",
    label: "Active",
    data: { active: null },
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <BooleanDisplay name="active" label="Active" data={{ active: true }} />
      <BooleanDisplay name="inactive" label="Inactive" data={{ inactive: false }} />
      <BooleanDisplay name="verified" label="Verified" data={{ verified: true }} />
      <BooleanDisplay name="unverified" label="Unverified" data={{ unverified: false }} />
    </div>
  ),
};
