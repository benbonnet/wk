import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextInput } from "@ui/adapters";
import { withForm } from "@storybook-decorators";

const meta: Meta<typeof TextInput> = {
  title: "Inputs/Text",
  component: TextInput,
  tags: ["autodocs"],
  decorators: [withForm],
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {
    name: "name",
  },
};

export const WithLabel: Story = {
  args: {
    name: "email",
    label: "Email Address",
  },
};

export const WithPlaceholder: Story = {
  args: {
    name: "search",
    label: "Search",
    placeholder: "Type to search...",
  },
};

export const WithHelperText: Story = {
  args: {
    name: "username",
    label: "Username",
    helperText: "Choose a unique username for your account",
  },
};

export const WithValue: Story = {
  args: {
    name: "name",
    label: "Name",
    value: "John Doe",
  },
};

export const WithError: Story = {
  args: {
    name: "email",
    label: "Email",
    error: "This email is already taken",
  },
};

export const Disabled: Story = {
  args: {
    name: "readonly",
    label: "Read Only",
    value: "Cannot edit this value",
    disabled: true,
  },
};

export const Complete: Story = {
  args: {
    name: "email",
    label: "Email Address",
    placeholder: "you@example.com",
    helperText: "We will never share your email",
  },
};
