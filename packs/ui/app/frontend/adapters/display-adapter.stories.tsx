import type { Meta, StoryObj } from "@storybook/react-vite";
import { DisplayAdapter } from "./display-adapter";

const meta: Meta<typeof DisplayAdapter> = {
  title: "Adapters/DisplayAdapter",
  component: DisplayAdapter,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DisplayAdapter>;

export const Text: Story = {
  args: { type: "DISPLAY_TEXT", name: "email", label: "Email", value: "test@example.com" },
};

export const TextEmpty: Story = {
  args: { type: "DISPLAY_TEXT", name: "email", label: "Email", value: null },
};

export const Longtext: Story = {
  args: {
    type: "DISPLAY_LONGTEXT",
    name: "bio",
    label: "Bio",
    value: "Line 1\nLine 2\nLine 3",
  },
};

export const Number: Story = {
  args: { type: "DISPLAY_NUMBER", name: "amount", label: "Amount", value: 1234567.89 },
};

export const Date: Story = {
  args: { type: "DISPLAY_DATE", name: "created", label: "Created", value: "2024-01-15" },
};

export const Datetime: Story = {
  args: {
    type: "DISPLAY_DATETIME",
    name: "updated",
    label: "Updated",
    value: "2024-01-15T10:30:00",
  },
};

export const Badge: Story = {
  args: { type: "DISPLAY_BADGE", name: "status", label: "Status", value: "active" },
};

export const Tags: Story = {
  args: {
    type: "DISPLAY_TAGS",
    name: "tags",
    label: "Tags",
    value: ["react", "typescript", "node"],
  },
};

export const TagsEmpty: Story = {
  args: { type: "DISPLAY_TAGS", name: "tags", label: "Tags", value: [] },
};

export const BooleanTrue: Story = {
  args: { type: "DISPLAY_BOOLEAN", name: "verified", label: "Verified", value: true },
};

export const BooleanFalse: Story = {
  args: { type: "DISPLAY_BOOLEAN", name: "verified", label: "Verified", value: false },
};

export const SelectDisplay: Story = {
  args: {
    type: "DISPLAY_SELECT",
    name: "country",
    label: "Country",
    value: "us",
    options: [
      { value: "us", label: "United States" },
      { value: "uk", label: "United Kingdom" },
    ],
  },
};
