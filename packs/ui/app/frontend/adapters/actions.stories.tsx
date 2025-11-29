import type { Meta, StoryObj } from "@storybook/react-vite";
import { Actions } from "@ui/adapters";
import { Button } from "@ui-components/button";

const meta: Meta<typeof Actions> = {
  title: "Layouts/Actions",
  component: Actions,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Actions>;

export const Default: Story = {
  args: {
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
    children: <Button>Submit</Button>,
  },
};

export const MultipleActions: Story = {
  args: {
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
    className: "justify-end",
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
    className: "justify-between w-full",
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
    className: "justify-center",
    children: (
      <>
        <Button variant="outline">No</Button>
        <Button>Yes</Button>
      </>
    ),
  },
};
