import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "@ui/adapters";

const meta: Meta<typeof Alert> = {
  title: "Layouts/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    color: {
      control: "select",
      options: ["default", "red", "green", "blue", "yellow"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    label: "This is an informational message.",
  },
};

export const Success: Story = {
  args: {
    label: "Your changes have been saved successfully.",
    color: "green",
  },
};

export const Warning: Story = {
  args: {
    label: "Please review your information before submitting.",
    color: "yellow",
  },
};

export const Error: Story = {
  args: {
    label: "An error occurred. Please try again.",
    color: "red",
  },
};

export const Info: Story = {
  args: {
    label: "New features are available in the latest update.",
    color: "blue",
  },
};

export const WithSubtitle: Story = {
  args: {
    label: "Connection Error",
    subtitle: "Contact support if the problem persists.",
    color: "red",
  },
};

export const WithCustomClassName: Story = {
  args: {
    label: "This alert has a custom max-width applied.",
    className: "max-w-md",
    color: "blue",
  },
};

export const AllColors: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert label="Default alert message" />
      <Alert label="Success! Operation completed." color="green" />
      <Alert label="Warning: Please review carefully." color="yellow" />
      <Alert label="Error: Something went wrong." color="red" />
      <Alert label="Info: Here's some helpful information." color="blue" />
    </div>
  ),
};
