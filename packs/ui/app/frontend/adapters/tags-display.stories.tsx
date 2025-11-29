import type { Meta, StoryObj } from "@storybook/react-vite";
import { TagsDisplay } from "@ui/adapters";

const meta: Meta<typeof TagsDisplay> = {
  title: "Displays/Tags",
  component: TagsDisplay,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TagsDisplay>;

export const Default: Story = {
  args: {
    name: "tags",
    data: { tags: ["react", "typescript", "tailwind"] },
  },
};

export const WithLabel: Story = {
  args: {
    name: "skills",
    label: "Skills",
    data: { skills: ["JavaScript", "React", "Node.js", "TypeScript"] },
  },
};

export const SingleTag: Story = {
  args: {
    name: "category",
    label: "Category",
    data: { category: ["Featured"] },
  },
};

export const ManyTags: Story = {
  args: {
    name: "technologies",
    label: "Technologies",
    data: { technologies: [
      "React",
      "Vue",
      "Angular",
      "Svelte",
      "Next.js",
      "Nuxt",
      "Remix",
      "Astro",
    ] },
  },
};

export const Empty: Story = {
  args: {
    name: "tags",
    label: "Tags",
    data: { tags: [] },
  },
};

export const NullValue: Story = {
  args: {
    name: "tags",
    label: "Tags",
    data: { tags: null },
  },
};
