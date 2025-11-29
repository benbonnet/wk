import type { Meta, StoryObj } from "@storybook/react-vite";
import { withForm } from "@storybook-decorators";
import {
  CardGroup,
  TextInput,
  Select,
  Checkbox,
  TextDisplay,
  BadgeDisplay,
} from "@ui/adapters";

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
        <TextInput name="name" label="Name" />
        <TextInput name="email" label="Email" />
      </>
    ),
  },
};

export const WithTitle: Story = {
  args: {
    label: "Account Settings",
    children: (
      <>
        <TextInput name="username" label="Username" />
        <TextInput name="email" label="Email Address" />
        <Checkbox name="notifications" label="Enable notifications" />
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
        <TextInput name="username" label="Username" />
        <TextInput name="email" label="Email" />
      </>
    ),
  },
};

export const WithDisplayComponents: Story = {
  args: {
    label: "User Profile",
    children: (
      <>
        <TextDisplay name="name" label="Name" data={{ name: "John Doe" }} />
        <TextDisplay name="email" label="Email" data={{ email: "john@example.com" }} />
        <BadgeDisplay name="status" label="Status" data={{ status: "active" }} />
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
        <Select
          name="plan"
          label="Plan"
          options={[
            { value: "basic", label: "Basic" },
            { value: "pro", label: "Pro" },
            { value: "enterprise", label: "Enterprise" },
          ]}
        />
        <Checkbox name="annual" label="Annual billing" />
      </>
    ),
  },
};

export const MultipleCards: Story = {
  render: () => (
    <div className="space-y-4">
      <CardGroup label="Personal Information">
        <TextInput name="first_name" label="First Name" />
        <TextInput name="last_name" label="Last Name" />
      </CardGroup>
      <CardGroup label="Contact Information">
        <TextInput name="email" label="Email" />
        <TextInput name="phone" label="Phone" />
      </CardGroup>
      <CardGroup label="Preferences">
        <Checkbox name="newsletter" label="Subscribe to newsletter" />
        <Checkbox name="notifications" label="Email notifications" />
      </CardGroup>
    </div>
  ),
};
