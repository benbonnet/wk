import type { Meta, StoryObj } from "@storybook/react-vite";
import { ALERT } from "@ui/adapters/layouts";

const meta: Meta<typeof ALERT> = {
  title: "Layouts/Alert",
  component: ALERT,
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
type Story = StoryObj<typeof ALERT>;

export const Default: Story = {
  args: {
    schema: { type: "ALERT" },
    label: "This is an informational message.",
  },
};

export const Success: Story = {
  args: {
    schema: { type: "ALERT" },
    label: "Your changes have been saved successfully.",
    color: "green",
  },
};

export const Warning: Story = {
  args: {
    schema: { type: "ALERT" },
    label: "Please review your information before submitting.",
    color: "yellow",
  },
};

export const Error: Story = {
  args: {
    schema: { type: "ALERT" },
    label: "An error occurred. Please try again.",
    color: "red",
  },
};

export const Info: Story = {
  args: {
    schema: { type: "ALERT" },
    label: "New features are available in the latest update.",
    color: "blue",
  },
};

export const WithSubtitle: Story = {
  args: {
    schema: {
      type: "ALERT",
      subtitle: "Contact support if the problem persists.",
    },
    label: "Connection Error",
    color: "red",
  },
};

export const WithCustomClassName: Story = {
  args: {
    schema: {
      type: "ALERT",
      className: "max-w-md",
    },
    label: "This alert has a custom max-width applied.",
    color: "blue",
  },
};

export const AllColors: Story = {
  render: () => (
    <div className="space-y-4">
      <ALERT schema={{ type: "ALERT" }} label="Default alert message" />
      <ALERT
        schema={{ type: "ALERT" }}
        label="Success! Operation completed."
        color="green"
      />
      <ALERT
        schema={{ type: "ALERT" }}
        label="Warning: Please review carefully."
        color="yellow"
      />
      <ALERT
        schema={{ type: "ALERT" }}
        label="Error: Something went wrong."
        color="red"
      />
      <ALERT
        schema={{ type: "ALERT" }}
        label="Info: Here's some helpful information."
        color="blue"
      />
    </div>
  ),
};
