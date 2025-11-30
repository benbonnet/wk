import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectDisplay } from "@ui/adapters";

const meta: Meta<typeof SelectDisplay> = {
  title: "Displays/Select",
  component: SelectDisplay,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SelectDisplay>;

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
    options: statusOptions,
    data: { status: "active" },
  },
};

export const WithLabel: Story = {
  args: {
    name: "status",
    label: "Status",
    options: statusOptions,
    data: { status: "pending" },
  },
};

export const Country: Story = {
  args: {
    name: "country",
    label: "Country",
    options: countryOptions,
    data: { country: "us" },
  },
};

export const ValueWithoutOptions: Story = {
  args: {
    name: "category",
    label: "Category",
    data: { category: "technology" },
  },
};

export const Empty: Story = {
  args: {
    name: "status",
    label: "Status",
    options: statusOptions,
    data: { status: null },
  },
};

export const UnknownValue: Story = {
  args: {
    name: "status",
    label: "Status",
    options: statusOptions,
    data: { status: "unknown_status" },
  },
};
