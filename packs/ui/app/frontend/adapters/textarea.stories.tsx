import type { Meta, StoryObj } from "@storybook/react-vite";
import { withForm } from "@storybook-decorators";
import { Textarea } from "@ui/adapters";

const meta: Meta<typeof Textarea> = {
  title: "Inputs/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  decorators: [withForm],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    name: "description",
  },
};

export const WithLabel: Story = {
  args: {
    name: "bio",
    label: "Biography",
  },
};

export const WithPlaceholder: Story = {
  args: {
    name: "notes",
    label: "Notes",
    placeholder: "Enter your notes here...",
  },
};

export const WithHelperText: Story = {
  args: {
    name: "description",
    label: "Description",
    helperText: "Maximum 500 characters",
  },
};

export const CustomRows: Story = {
  args: {
    name: "content",
    label: "Content",
    rows: 8,
    placeholder: "Write your content...",
  },
};

export const WithValue: Story = {
  args: {
    name: "notes",
    label: "Notes",
    value: "This is some pre-filled content.\n\nWith multiple lines.",
  },
};

export const WithError: Story = {
  args: {
    name: "description",
    label: "Description",
    error: "Description is required",
  },
};

export const Disabled: Story = {
  args: {
    name: "readonly",
    label: "Read Only",
    value: "This content cannot be edited",
    disabled: true,
  },
};

export const Complete: Story = {
  args: {
    name: "message",
    label: "Message",
    placeholder: "Type your message...",
    helperText: "Be descriptive and clear",
    rows: 5,
  },
};
