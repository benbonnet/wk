import type { Meta, StoryObj } from "@storybook/react-vite";
import { ACTIONS } from "@ui/adapters/layouts";
import { Button } from "@ui/components/ui/button";

const meta: Meta<typeof ACTIONS> = {
  title: "Layouts/Actions",
  component: ACTIONS,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof ACTIONS>;

export const Default: Story = {
  args: {
    schema: { type: "ACTIONS" },
    children: (
      <>
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </>
    ),
  },
};

export const SingleAction: Story = {
  args: {
    schema: { type: "ACTIONS" },
    children: <Button>Submit</Button>,
  },
};

export const MultipleActions: Story = {
  args: {
    schema: { type: "ACTIONS" },
    children: (
      <>
        <Button variant="ghost">Reset</Button>
        <Button variant="outline">Cancel</Button>
        <Button variant="destructive">Delete</Button>
        <Button>Save Changes</Button>
      </>
    ),
  },
};

export const WithCustomClassName: Story = {
  args: {
    schema: {
      type: "ACTIONS",
      className: "justify-end",
    },
    children: (
      <>
        <Button variant="outline">Cancel</Button>
        <Button>Confirm</Button>
      </>
    ),
  },
};

export const SpaceBetween: Story = {
  args: {
    schema: {
      type: "ACTIONS",
      className: "justify-between w-full",
    },
    children: (
      <>
        <Button variant="outline">Back</Button>
        <Button>Next</Button>
      </>
    ),
  },
};

export const CenterAligned: Story = {
  args: {
    schema: {
      type: "ACTIONS",
      className: "justify-center",
    },
    children: (
      <>
        <Button variant="outline">No</Button>
        <Button>Yes</Button>
      </>
    ),
  },
};
