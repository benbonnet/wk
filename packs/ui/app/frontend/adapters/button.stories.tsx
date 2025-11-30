import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@ui/adapters";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "destructive"],
    },
    icon: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    label: "Primary Button",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    label: "Secondary Button",
    variant: "secondary",
  },
};

export const Ghost: Story = {
  args: {
    label: "Ghost Button",
    variant: "ghost",
  },
};

export const Destructive: Story = {
  args: {
    label: "Delete",
    variant: "destructive",
  },
};

export const WithIcon: Story = {
  args: {
    label: "Add Item",
    icon: "plus",
  },
};

export const IconVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button label="Save" icon="save" />
      <Button label="Edit" icon="pencil" />
      <Button label="Delete" icon="trash" variant="destructive" />
      <Button label="Download" icon="download" variant="secondary" />
      <Button label="Settings" icon="settings" variant="ghost" />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button label="Primary" variant="primary" />
      <Button label="Secondary" variant="secondary" />
      <Button label="Ghost" variant="ghost" />
      <Button label="Destructive" variant="destructive" />
    </div>
  ),
};

export const WithCustomClassName: Story = {
  args: {
    label: "Wide Button",
    className: "px-8",
  },
};
