import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dropdown } from "@ui/adapters";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@ui-components/dropdown-menu";

const meta: Meta<typeof Dropdown> = {
  title: "Primitives/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  args: {
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
    label: "Options",
    children: (
      <>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Help</DropdownMenuItem>
        <DropdownMenuItem>Documentation</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          Sign Out
        </DropdownMenuItem>
      </>
    ),
  },
};

export const ManyOptions: Story = {
  args: {
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
    className: "bg-blue-50",
    label: "Styled Dropdown",
    children: (
      <>
        <DropdownMenuItem>Option 1</DropdownMenuItem>
        <DropdownMenuItem>Option 2</DropdownMenuItem>
      </>
    ),
  },
};
