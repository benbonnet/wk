import type { Meta, StoryObj } from "@storybook/react-vite";
import { INPUT_AI_RICH_TEXT } from "@ui/adapters/inputs";

const meta: Meta<typeof INPUT_AI_RICH_TEXT> = {
  title: "Inputs/RichText",
  component: INPUT_AI_RICH_TEXT,
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
type Story = StoryObj<typeof INPUT_AI_RICH_TEXT>;

export const Default: Story = {
  args: {
    name: "content",
  },
};

export const WithLabel: Story = {
  args: {
    name: "article",
    label: "Article Content",
  },
};

export const WithPlaceholder: Story = {
  args: {
    name: "content",
    label: "Content",
    placeholder: "Write your content here...",
  },
};

export const WithHelperText: Story = {
  args: {
    name: "description",
    label: "Description",
    helperText: "Use the toolbar to format your text. Click AI Assist for suggestions.",
  },
};

export const CustomRows: Story = {
  args: {
    name: "article",
    label: "Article",
    rows: 10,
    placeholder: "Write your article...",
  },
};

export const WithContent: Story = {
  args: {
    name: "content",
    label: "Content",
    value: "This is some pre-filled content.\n\nIt supports multiple paragraphs and formatting.",
  },
};

export const WithError: Story = {
  args: {
    name: "content",
    label: "Content",
    error: "Content is required",
  },
};

export const Disabled: Story = {
  args: {
    name: "content",
    label: "Content",
    value: "This content cannot be edited",
    disabled: true,
  },
};

export const Complete: Story = {
  args: {
    name: "blog_post",
    label: "Blog Post",
    placeholder: "Start writing your blog post...",
    helperText: "Format your text using the toolbar. Use AI Assist for writing help.",
    rows: 8,
  },
};
