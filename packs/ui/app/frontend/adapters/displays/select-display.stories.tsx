import type { Meta, StoryObj } from "@storybook/react-vite";
import { DISPLAY_SELECT } from "@ui/adapters/displays";

const meta: Meta<typeof DISPLAY_SELECT> = {
  title: "Displays/Select",
  component: DISPLAY_SELECT,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    label: { control: "text" },
    value: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof DISPLAY_SELECT>;

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending Review" },
];

const countryOptions = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
];

export const Default: Story = {
  args: {
    name: "status",
    value: "active",
    options: statusOptions,
  },
};

export const WithLabel: Story = {
  args: {
    name: "status",
    label: "Status",
    value: "pending",
    options: statusOptions,
  },
};

export const Country: Story = {
  args: {
    name: "country",
    label: "Country",
    value: "us",
    options: countryOptions,
  },
};

export const ValueWithoutOptions: Story = {
  args: {
    name: "category",
    label: "Category",
    value: "technology",
  },
};

export const Empty: Story = {
  args: {
    name: "status",
    label: "Status",
    value: null,
    options: statusOptions,
  },
};

export const UnknownValue: Story = {
  args: {
    name: "status",
    label: "Status",
    value: "unknown_status",
    options: statusOptions,
  },
};
