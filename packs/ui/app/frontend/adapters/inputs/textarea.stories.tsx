import type { Meta, StoryObj } from "@storybook/react-vite";
import { INPUT_TEXTAREA } from "@ui/adapters/inputs";

const meta: Meta<typeof INPUT_TEXTAREA> = {
  title: "Inputs/Textarea",
  component: INPUT_TEXTAREA,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    label: { control: "text" },
    placeholder: { control: "text" },
    helperText: { control: "text" },
    rows: { control: "number" },
    disabled: { control: "boolean" },
    error: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof INPUT_TEXTAREA>;

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
