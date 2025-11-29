import type { Meta, StoryObj } from "@storybook/react-vite";
import { withForm } from "@storybook-decorators";
import { Checkboxes } from "@ui/adapters";

const meta: Meta<typeof Checkboxes> = {
  title: "Inputs/Checkboxes",
  component: Checkboxes,
  tags: ["autodocs"],
  decorators: [withForm],
};

export default meta;
type Story = StoryObj<typeof Checkboxes>;

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
