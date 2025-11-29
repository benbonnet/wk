import type { Meta, StoryObj } from "@storybook/react-vite";
import { DROPDOWN } from "@ui/adapters/primitives";
import { DropdownMenuItem, DropdownMenuSeparator } from "@ui/components/ui/dropdown-menu";

const meta: Meta<typeof DROPDOWN> = {
  title: "Primitives/Dropdown",
  component: DROPDOWN,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof DROPDOWN>;

export const Default: Story = {
  args: {
    schema: { type: "DROPDOWN" },
    children: (
      <>
        <DropdownMenuItem>Option 1</DropdownMenuItem>
        <DropdownMenuItem>Option 2</DropdownMenuItem>
        <DropdownMenuItem>Option 3</DropdownMenuItem>
      </>
    ),
  },
};

export const WithLabel: Story = {
  args: {
    schema: { type: "DROPDOWN" },
    label: "Actions",
    children: (
      <>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    schema: { type: "DROPDOWN" },
    children: (
      <>
        <DropdownMenuItem>View Details</DropdownMenuItem>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Archive</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
      </>
    ),
  },
};

export const WithSeparators: Story = {
  args: {
    schema: { type: "DROPDOWN" },
    label: "Options",
    children: (
      <>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Help</DropdownMenuItem>
        <DropdownMenuItem>Documentation</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
      </>
    ),
  },
};

export const ManyOptions: Story = {
  args: {
    schema: { type: "DROPDOWN" },
    label: "Select Action",
    children: (
      <>
        <DropdownMenuItem>View</DropdownMenuItem>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem>Move</DropdownMenuItem>
        <DropdownMenuItem>Archive</DropdownMenuItem>
        <DropdownMenuItem>Export</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
      </>
    ),
  },
};

export const WithCustomClassName: Story = {
  args: {
    schema: {
      type: "DROPDOWN",
      className: "bg-blue-50",
    },
    label: "Styled Dropdown",
    children: (
      <>
        <DropdownMenuItem>Option 1</DropdownMenuItem>
        <DropdownMenuItem>Option 2</DropdownMenuItem>
      </>
    ),
  },
};
