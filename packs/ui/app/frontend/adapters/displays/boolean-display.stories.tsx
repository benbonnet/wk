import type { Meta, StoryObj } from "@storybook/react-vite";
import { DISPLAY_BOOLEAN } from "@ui/adapters/displays";

const meta: Meta<typeof DISPLAY_BOOLEAN> = {
  title: "Displays/Boolean",
  component: DISPLAY_BOOLEAN,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    label: { control: "text" },
    value: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof DISPLAY_BOOLEAN>;

export const True: Story = {
  args: {
    name: "active",
    value: true,
  },
};

export const False: Story = {
  args: {
    name: "active",
    value: false,
  },
};

export const WithLabelTrue: Story = {
  args: {
    name: "verified",
    label: "Email Verified",
    value: true,
  },
};

export const WithLabelFalse: Story = {
  args: {
    name: "verified",
    label: "Email Verified",
    value: false,
  },
};

export const TruthyValue: Story = {
  args: {
    name: "enabled",
    label: "Enabled",
    value: 1,
  },
};

export const FalsyValue: Story = {
  args: {
    name: "enabled",
    label: "Enabled",
    value: 0,
  },
};

export const NullValue: Story = {
  args: {
    name: "active",
    label: "Active",
    value: null,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <DISPLAY_BOOLEAN name="active" label="Active" value={true} />
      <DISPLAY_BOOLEAN name="inactive" label="Inactive" value={false} />
      <DISPLAY_BOOLEAN name="verified" label="Verified" value={true} />
      <DISPLAY_BOOLEAN name="unverified" label="Unverified" value={false} />
    </div>
  ),
};
