import type { Meta, StoryObj } from "@storybook/react-vite";
import { BUTTON } from "@ui/adapters/primitives";

const meta: Meta<typeof BUTTON> = {
  title: "Primitives/Button",
  component: BUTTON,
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
type Story = StoryObj<typeof BUTTON>;

export const Primary: Story = {
  args: {
    schema: { type: "BUTTON" },
    label: "Primary Button",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    schema: { type: "BUTTON" },
    label: "Secondary Button",
    variant: "secondary",
  },
};

export const Ghost: Story = {
  args: {
    schema: { type: "BUTTON" },
    label: "Ghost Button",
    variant: "ghost",
  },
};

export const Destructive: Story = {
  args: {
    schema: { type: "BUTTON" },
    label: "Delete",
    variant: "destructive",
  },
};

export const WithIcon: Story = {
  args: {
    schema: { type: "BUTTON" },
    label: "Add Item",
    icon: "plus",
  },
};

export const IconVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <BUTTON schema={{ type: "BUTTON" }} label="Save" icon="save" />
      <BUTTON schema={{ type: "BUTTON" }} label="Edit" icon="pencil" />
      <BUTTON
        schema={{ type: "BUTTON" }}
        label="Delete"
        icon="trash"
        variant="destructive"
      />
      <BUTTON
        schema={{ type: "BUTTON" }}
        label="Download"
        icon="download"
        variant="secondary"
      />
      <BUTTON
        schema={{ type: "BUTTON" }}
        label="Settings"
        icon="settings"
        variant="ghost"
      />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <BUTTON schema={{ type: "BUTTON" }} label="Primary" variant="primary" />
      <BUTTON schema={{ type: "BUTTON" }} label="Secondary" variant="secondary" />
      <BUTTON schema={{ type: "BUTTON" }} label="Ghost" variant="ghost" />
      <BUTTON schema={{ type: "BUTTON" }} label="Destructive" variant="destructive" />
    </div>
  ),
};

export const WithCustomClassName: Story = {
  args: {
    schema: {
      type: "BUTTON",
      className: "px-8",
    },
    label: "Wide Button",
  },
};
