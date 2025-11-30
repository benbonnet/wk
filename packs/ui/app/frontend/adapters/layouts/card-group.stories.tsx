import type { Meta, StoryObj } from "@storybook/react-vite";
import { withForm } from "@storybook-decorators";
import { CardGroup, FormikAdapter, DisplayAdapter } from "@ui/adapters";

const meta: Meta<typeof CardGroup> = {
  title: "Layouts/CardGroup",
  component: CardGroup,
  tags: ["autodocs"],
  decorators: [withForm],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof CardGroup>;

export const Default: Story = {
  args: {
    children: (
      <>
        <FormikAdapter type="INPUT_TEXT" name="name" label="Name" />
        <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
      </>
    ),
  },
};

export const WithTitle: Story = {
  args: {
    label: "Account Settings",
    children: (
      <>
        <FormikAdapter type="INPUT_TEXT" name="username" label="Username" />
        <FormikAdapter type="INPUT_TEXT" name="email" label="Email Address" />
        <FormikAdapter type="INPUT_CHECKBOX" name="notifications" label="Enable notifications" />
      </>
    ),
  },
};

export const WithDescription: Story = {
  args: {
    label: "Account Settings",
    subtitle: "Update your account information below",
    children: (
      <>
        <FormikAdapter type="INPUT_TEXT" name="username" label="Username" />
        <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
      </>
    ),
  },
};

export const WithDisplayComponents: Story = {
  args: {
    label: "User Profile",
    children: (
      <>
        <DisplayAdapter type="DISPLAY_TEXT" name="name" label="Name" value="John Doe" />
        <DisplayAdapter type="DISPLAY_TEXT" name="email" label="Email" value="john@example.com" />
        <DisplayAdapter type="DISPLAY_BADGE" name="status" label="Status" value="active" />
      </>
    ),
  },
};

export const WithCustomClassName: Story = {
  args: {
    label: "Premium Settings",
    className: "shadow-lg border-2 border-blue-200",
    children: (
      <>
        <FormikAdapter
          type="INPUT_SELECT"
          name="plan"
          label="Plan"
          options={[
            { value: "basic", label: "Basic" },
            { value: "pro", label: "Pro" },
            { value: "enterprise", label: "Enterprise" },
          ]}
        />
        <FormikAdapter type="INPUT_CHECKBOX" name="annual" label="Annual billing" />
      </>
    ),
  },
};

export const MultipleCards: Story = {
  render: () => (
    <div className="space-y-4">
      <CardGroup label="Personal Information">
        <FormikAdapter type="INPUT_TEXT" name="first_name" label="First Name" />
        <FormikAdapter type="INPUT_TEXT" name="last_name" label="Last Name" />
      </CardGroup>
      <CardGroup label="Contact Information">
        <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
        <FormikAdapter type="INPUT_TEXT" name="phone" label="Phone" />
      </CardGroup>
      <CardGroup label="Preferences">
        <FormikAdapter type="INPUT_CHECKBOX" name="newsletter" label="Subscribe to newsletter" />
        <FormikAdapter type="INPUT_CHECKBOX" name="notifications" label="Email notifications" />
      </CardGroup>
    </div>
  ),
};
