import type { Meta, StoryObj } from "@storybook/react-vite";
import { withForm } from "@storybook-decorators";
import { TagsInput } from "@ui/adapters";

const meta: Meta<typeof TagsInput> = {
  title: "Inputs/Tags",
  component: TagsInput,
  tags: ["autodocs"],
  decorators: [withForm],
};

export default meta;
type Story = StoryObj<typeof TagsInput>;

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
