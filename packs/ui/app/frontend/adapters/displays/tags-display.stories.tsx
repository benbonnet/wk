import type { Meta, StoryObj } from "@storybook/react-vite";
import { DISPLAY_TAGS } from "@ui/adapters/displays";

const meta: Meta<typeof DISPLAY_TAGS> = {
  title: "Displays/Tags",
  component: DISPLAY_TAGS,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof DISPLAY_TAGS>;

export const Default: Story = {
  args: {
    name: "tags",
    value: ["react", "typescript", "tailwind"],
  },
};

export const WithLabel: Story = {
  args: {
    name: "skills",
    label: "Skills",
    value: ["JavaScript", "React", "Node.js", "TypeScript"],
  },
};

export const SingleTag: Story = {
  args: {
    name: "category",
    label: "Category",
    value: ["Featured"],
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
      "Next.js",
      "Nuxt",
      "Remix",
      "Astro",
    ],
  },
};

export const Empty: Story = {
  args: {
    name: "tags",
    label: "Tags",
    value: [],
  },
};

export const NullValue: Story = {
  args: {
    name: "tags",
    label: "Tags",
    value: null,
  },
};
