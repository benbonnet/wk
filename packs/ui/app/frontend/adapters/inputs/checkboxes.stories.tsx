import type { Meta, StoryObj } from "@storybook/react-vite";
import { INPUT_CHECKBOXES } from "@ui/adapters/inputs";

const meta: Meta<typeof INPUT_CHECKBOXES> = {
  title: "Inputs/Checkboxes",
  component: INPUT_CHECKBOXES,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    label: { control: "text" },
    helperText: { control: "text" },
    disabled: { control: "boolean" },
    error: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof INPUT_CHECKBOXES>;

const interestOptions = [
  { value: "technology", label: "Technology" },
  { value: "design", label: "Design" },
  { value: "business", label: "Business" },
  { value: "marketing", label: "Marketing" },
];

const notificationOptions = [
  {
    value: "email",
    label: "Email notifications",
    description: "Receive updates via email",
  },
  {
    value: "sms",
    label: "SMS notifications",
    description: "Get text messages for important alerts",
  },
  {
    value: "push",
    label: "Push notifications",
    description: "Browser notifications when logged in",
  },
];

const permissionOptions = [
  { value: "read", label: "Read" },
  { value: "write", label: "Write" },
  { value: "delete", label: "Delete" },
  { value: "admin", label: "Admin" },
];

export const Default: Story = {
  args: {
    name: "interests",
    options: interestOptions,
  },
};

export const WithLabel: Story = {
  args: {
    name: "interests",
    label: "Your Interests",
    options: interestOptions,
  },
};

export const WithDescriptions: Story = {
  args: {
    name: "notifications",
    label: "Notification Preferences",
    options: notificationOptions,
  },
};

export const WithHelperText: Story = {
  args: {
    name: "interests",
    label: "Your Interests",
    helperText: "Select all that apply",
    options: interestOptions,
  },
};

export const WithSelectedValues: Story = {
  args: {
    name: "interests",
    label: "Your Interests",
    value: ["technology", "design"],
    options: interestOptions,
  },
};

export const WithError: Story = {
  args: {
    name: "interests",
    label: "Your Interests",
    error: "Please select at least one interest",
    options: interestOptions,
  },
};

export const Disabled: Story = {
  args: {
    name: "permissions",
    label: "Permissions",
    value: ["read"],
    disabled: true,
    options: permissionOptions,
  },
};

export const Complete: Story = {
  args: {
    name: "notifications",
    label: "Notification Settings",
    helperText: "Choose how you want to be notified",
    value: ["email"],
    options: notificationOptions,
  },
};
