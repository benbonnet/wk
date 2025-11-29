import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "@ui/adapters";

const meta: Meta<typeof Link> = {
  title: "Primitives/Link",
  component: Link,
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
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: {
    label: "Click Me",
  },
};

export const WithHref: Story = {
  args: {
    label: "Go to Dashboard",
    href: "/dashboard",
  },
};

export const OpensDrawer: Story = {
  args: {
    label: "New Contact",
    opens: "new_contact_drawer",
  },
};

export const WithIcon: Story = {
  args: {
    label: "Add New",
    icon: "plus",
  },
};

export const Destructive: Story = {
  args: {
    label: "Delete",
    variant: "destructive",
    icon: "trash",
  },
};

export const WithConfirmation: Story = {
  args: {
    label: "Delete Item",
    variant: "destructive",
    confirm: "Are you sure you want to delete this item?",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Link label="Primary" variant="primary" />
      <Link label="Secondary" variant="secondary" />
      <Link label="Ghost" variant="ghost" />
      <Link label="Destructive" variant="destructive" />
    </div>
  ),
};

export const IconLinks: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Link label="View" icon="eye" />
      <Link label="Edit" icon="pencil" variant="secondary" />
      <Link label="Copy" icon="copy" variant="ghost" />
      <Link label="Delete" icon="trash" variant="destructive" />
    </div>
  ),
};

export const WithCustomClassName: Story = {
  args: {
    className: "px-8",
    label: "Wide Link",
  },
};
