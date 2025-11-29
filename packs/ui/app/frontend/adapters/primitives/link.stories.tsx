import type { Meta, StoryObj } from "@storybook/react-vite";
import { LINK } from "@ui/adapters/primitives";

const meta: Meta<typeof LINK> = {
  title: "Primitives/Link",
  component: LINK,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    href: { control: "text" },
    opens: { control: "text" },
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "destructive"],
    },
    icon: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof LINK>;

export const Default: Story = {
  args: {
    schema: { type: "LINK" },
    label: "Click Me",
  },
};

export const WithHref: Story = {
  args: {
    schema: { type: "LINK" },
    label: "Go to Dashboard",
    href: "/dashboard",
  },
};

export const OpensDrawer: Story = {
  args: {
    schema: { type: "LINK" },
    label: "New Contact",
    opens: "new_contact_drawer",
  },
};

export const WithIcon: Story = {
  args: {
    schema: { type: "LINK" },
    label: "Add New",
    icon: "plus",
  },
};

export const Destructive: Story = {
  args: {
    schema: { type: "LINK" },
    label: "Delete",
    variant: "destructive",
    icon: "trash",
  },
};

export const WithConfirmation: Story = {
  args: {
    schema: { type: "LINK" },
    label: "Delete Item",
    variant: "destructive",
    confirm: "Are you sure you want to delete this item?",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <LINK schema={{ type: "LINK" }} label="Primary" variant="primary" />
      <LINK schema={{ type: "LINK" }} label="Secondary" variant="secondary" />
      <LINK schema={{ type: "LINK" }} label="Ghost" variant="ghost" />
      <LINK schema={{ type: "LINK" }} label="Destructive" variant="destructive" />
    </div>
  ),
};

export const IconLinks: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <LINK schema={{ type: "LINK" }} label="View" icon="eye" />
      <LINK schema={{ type: "LINK" }} label="Edit" icon="pencil" variant="secondary" />
      <LINK schema={{ type: "LINK" }} label="Copy" icon="copy" variant="ghost" />
      <LINK
        schema={{ type: "LINK" }}
        label="Delete"
        icon="trash"
        variant="destructive"
      />
    </div>
  ),
};

export const WithCustomClassName: Story = {
  args: {
    schema: {
      type: "LINK",
      className: "px-8",
    },
    label: "Wide Link",
  },
};
