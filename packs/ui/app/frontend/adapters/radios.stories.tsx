import type { Meta, StoryObj } from "@storybook/react-vite";
import { withForm } from "@storybook-decorators";
import { Radios } from "@ui/adapters";

const meta: Meta<typeof Radios> = {
  title: "Inputs/Radios",
  component: Radios,
  tags: ["autodocs"],
  decorators: [withForm],
};

export default meta;
type Story = StoryObj<typeof Radios>;

const sizeOptions = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

const planOptions = [
  { value: "free", label: "Free", description: "Basic features, limited usage" },
  { value: "pro", label: "Pro", description: "$9/month, all features included" },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "Custom pricing, dedicated support",
  },
];

const frequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "never", label: "Never" },
];

export const Default: Story = {
  args: {
    name: "size",
    options: sizeOptions,
  },
};

export const WithLabel: Story = {
  args: {
    name: "size",
    label: "Select Size",
    options: sizeOptions,
  },
};

export const WithDescriptions: Story = {
  args: {
    name: "plan",
    label: "Choose a Plan",
    options: planOptions,
  },
};

export const WithHelperText: Story = {
  args: {
    name: "size",
    label: "Select Size",
    helperText: "Choose the size that fits your needs",
    options: sizeOptions,
  },
};

export const WithSelectedValue: Story = {
  args: {
    name: "size",
    label: "Select Size",
    value: "medium",
    options: sizeOptions,
  },
};

export const WithError: Story = {
  args: {
    name: "plan",
    label: "Choose a Plan",
    error: "Please select a plan to continue",
    options: planOptions,
  },
};

export const Disabled: Story = {
  args: {
    name: "size",
    label: "Select Size",
    value: "medium",
    disabled: true,
    options: sizeOptions,
  },
};

export const Complete: Story = {
  args: {
    name: "frequency",
    label: "Email Frequency",
    helperText: "How often would you like to receive updates?",
    value: "weekly",
    options: frequencyOptions,
  },
};
