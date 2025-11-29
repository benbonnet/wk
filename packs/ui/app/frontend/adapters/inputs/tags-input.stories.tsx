import type { Meta, StoryObj } from "@storybook/react-vite";
import { INPUT_TAGS } from "@ui/adapters/inputs";

const meta: Meta<typeof INPUT_TAGS> = {
  title: "Inputs/Tags",
  component: INPUT_TAGS,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    label: { control: "text" },
    placeholder: { control: "text" },
    helperText: { control: "text" },
    disabled: { control: "boolean" },
    error: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof INPUT_TAGS>;

export const Default: Story = {
  args: {
    name: "tags",
  },
};

export const WithLabel: Story = {
  args: {
    name: "skills",
    label: "Skills",
  },
};

export const WithPlaceholder: Story = {
  args: {
    name: "tags",
    label: "Tags",
    placeholder: "Type and press Enter...",
  },
};

export const WithHelperText: Story = {
  args: {
    name: "keywords",
    label: "Keywords",
    helperText: "Press Enter or Tab to add a tag",
  },
};

export const WithTags: Story = {
  args: {
    name: "skills",
    label: "Skills",
    value: ["React", "TypeScript", "Node.js"],
  },
};

export const ManyTags: Story = {
  args: {
    name: "technologies",
    label: "Technologies",
    value: [
      "React",
      "Vue",
      "Angular",
      "Svelte",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "Python",
    ],
  },
};

export const WithError: Story = {
  args: {
    name: "tags",
    label: "Tags",
    error: "At least one tag is required",
  },
};

export const Disabled: Story = {
  args: {
    name: "skills",
    label: "Skills",
    value: ["React", "TypeScript"],
    disabled: true,
  },
};

export const Complete: Story = {
  args: {
    name: "categories",
    label: "Categories",
    placeholder: "Add category...",
    helperText: "Add up to 5 categories",
    value: ["Technology", "Design"],
  },
};
