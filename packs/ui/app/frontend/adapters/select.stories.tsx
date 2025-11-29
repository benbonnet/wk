import type { Meta, StoryObj } from "@storybook/react-vite";
import { withForm } from "@storybook-decorators";
import { Select } from "@ui/adapters";

const meta: Meta<typeof Select> = {
  title: "Inputs/Select",
  component: Select,
  tags: ["autodocs"],
  decorators: [withForm],
};

export default meta;
type Story = StoryObj<typeof Select>;

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const countryOptions = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
];

export const Default: Story = {
  args: {
    name: "status",
    options: statusOptions,
  },
};

export const WithLabel: Story = {
  args: {
    name: "status",
    label: "Status",
    options: statusOptions,
  },
};

export const WithPlaceholder: Story = {
  args: {
    name: "status",
    label: "Status",
    placeholder: "Select a status...",
    options: statusOptions,
  },
};

export const WithHelperText: Story = {
  args: {
    name: "priority",
    label: "Priority",
    placeholder: "Select priority...",
    helperText: "Higher priority items are handled first",
    options: priorityOptions,
  },
};

export const WithValue: Story = {
  args: {
    name: "status",
    label: "Status",
    options: statusOptions,
  },
};

export const WithError: Story = {
  args: {
    name: "status",
    label: "Status",
    options: statusOptions,
  },
};

export const Disabled: Story = {
  args: {
    name: "status",
    label: "Status",
    disabled: true,
    options: statusOptions,
  },
};

export const ManyOptions: Story = {
  args: {
    name: "country",
    label: "Country",
    placeholder: "Select a country...",
    options: countryOptions,
  },
};

export const Complete: Story = {
  args: {
    name: "priority",
    label: "Priority Level",
    placeholder: "Choose priority...",
    helperText: "This determines the handling order",
    options: priorityOptions,
  },
};
