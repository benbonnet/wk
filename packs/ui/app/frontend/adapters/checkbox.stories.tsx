import type { Meta, StoryObj } from "@storybook/react-vite";
import { withForm } from "@storybook-decorators";
import { Checkbox } from "@ui/adapters";

const meta: Meta<typeof Checkbox> = {
  title: "Inputs/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  decorators: [withForm],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    name: "agree",
    label: "I agree to the terms",
  },
};

export const Checked: Story = {
  args: {
    name: "agree",
    label: "I agree to the terms",
    value: true,
  },
};

export const Unchecked: Story = {
  args: {
    name: "agree",
    label: "I agree to the terms",
    value: false,
  },
};

export const WithHelperText: Story = {
  args: {
    name: "newsletter",
    label: "Subscribe to newsletter",
    helperText: "Receive weekly updates about our products",
  },
};

export const WithError: Story = {
  args: {
    name: "agree",
    label: "I agree to the terms and conditions",
    error: "You must agree to continue",
  },
};

export const Disabled: Story = {
  args: {
    name: "feature",
    label: "Enable this feature",
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    name: "feature",
    label: "This feature is always enabled",
    value: true,
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox name="cb1" label="Unchecked" value={false} />
      <Checkbox name="cb2" label="Checked" value={true} />
      <Checkbox name="cb3" label="With helper text" helperText="Additional information" />
      <Checkbox name="cb4" label="Disabled" disabled />
      <Checkbox name="cb5" label="Disabled checked" value={true} disabled />
      <Checkbox name="cb6" label="With error" error="This field is required" />
    </div>
  ),
};
