import type { Meta, StoryObj } from "@storybook/react-vite";
import { CARD_GROUP } from "@ui/adapters/layouts";
import { INPUT_TEXT, INPUT_SELECT, INPUT_CHECKBOX } from "@ui/adapters/inputs";
import { DISPLAY_TEXT, DISPLAY_BADGE } from "@ui/adapters/displays";

const meta: Meta<typeof CARD_GROUP> = {
  title: "Layouts/CardGroup",
  component: CARD_GROUP,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof CARD_GROUP>;

export const Default: Story = {
  args: {
    schema: { type: "CARD_GROUP" },
    children: (
      <>
        <INPUT_TEXT name="name" label="Name" />
        <INPUT_TEXT name="email" label="Email" />
      </>
    ),
  },
};

export const WithTitle: Story = {
  args: {
    schema: { type: "CARD_GROUP" },
    label: "Account Settings",
    children: (
      <>
        <INPUT_TEXT name="username" label="Username" />
        <INPUT_TEXT name="email" label="Email Address" />
        <INPUT_CHECKBOX name="notifications" label="Enable notifications" />
      </>
    ),
  },
};

export const WithDescription: Story = {
  args: {
    schema: {
      type: "CARD_GROUP",
      subtitle: "Update your account information below",
    },
    label: "Account Settings",
    children: (
      <>
        <INPUT_TEXT name="username" label="Username" />
        <INPUT_TEXT name="email" label="Email" />
      </>
    ),
  },
};

export const WithDisplayComponents: Story = {
  args: {
    schema: { type: "CARD_GROUP" },
    label: "User Profile",
    children: (
      <>
        <DISPLAY_TEXT name="name" label="Name" value="John Doe" />
        <DISPLAY_TEXT name="email" label="Email" value="john@example.com" />
        <DISPLAY_BADGE name="status" label="Status" value="active" />
      </>
    ),
  },
};

export const WithCustomClassName: Story = {
  args: {
    schema: {
      type: "CARD_GROUP",
      className: "shadow-lg border-2 border-blue-200",
    },
    label: "Premium Settings",
    children: (
      <>
        <INPUT_SELECT
          name="plan"
          label="Plan"
          options={[
            { value: "basic", label: "Basic" },
            { value: "pro", label: "Pro" },
            { value: "enterprise", label: "Enterprise" },
          ]}
        />
        <INPUT_CHECKBOX name="annual" label="Annual billing" />
      </>
    ),
  },
};

export const MultipleCards: Story = {
  render: () => (
    <div className="space-y-4">
      <CARD_GROUP schema={{ type: "CARD_GROUP" }} label="Personal Information">
        <INPUT_TEXT name="first_name" label="First Name" />
        <INPUT_TEXT name="last_name" label="Last Name" />
      </CARD_GROUP>
      <CARD_GROUP schema={{ type: "CARD_GROUP" }} label="Contact Information">
        <INPUT_TEXT name="email" label="Email" />
        <INPUT_TEXT name="phone" label="Phone" />
      </CARD_GROUP>
      <CARD_GROUP schema={{ type: "CARD_GROUP" }} label="Preferences">
        <INPUT_CHECKBOX name="newsletter" label="Subscribe to newsletter" />
        <INPUT_CHECKBOX name="notifications" label="Email notifications" />
      </CARD_GROUP>
    </div>
  ),
};
