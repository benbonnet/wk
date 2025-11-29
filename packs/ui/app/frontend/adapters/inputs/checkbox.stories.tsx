import type { Meta, StoryObj } from "@storybook/react-vite";
import { INPUT_CHECKBOX } from "@ui/adapters/inputs";

const meta: Meta<typeof INPUT_CHECKBOX> = {
  title: "Inputs/Checkbox",
  component: INPUT_CHECKBOX,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    label: { control: "text" },
    helperText: { control: "text" },
    disabled: { control: "boolean" },
    value: { control: "boolean" },
    error: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof INPUT_CHECKBOX>;

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
      <INPUT_CHECKBOX name="cb1" label="Unchecked" value={false} />
      <INPUT_CHECKBOX name="cb2" label="Checked" value={true} />
      <INPUT_CHECKBOX
        name="cb3"
        label="With helper text"
        helperText="Additional information"
      />
      <INPUT_CHECKBOX name="cb4" label="Disabled" disabled />
      <INPUT_CHECKBOX name="cb5" label="Disabled checked" value={true} disabled />
      <INPUT_CHECKBOX
        name="cb6"
        label="With error"
        error="This field is required"
      />
    </div>
  ),
};
