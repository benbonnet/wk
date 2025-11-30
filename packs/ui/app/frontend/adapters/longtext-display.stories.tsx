import type { Meta, StoryObj } from "@storybook/react-vite";
import { LongtextDisplay } from "@ui/adapters";

const meta: Meta<typeof LongtextDisplay> = {
  title: "Displays/Longtext",
  component: LongtextDisplay,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LongtextDisplay>;

export const Default: Story = {
  args: {
    name: "bio",
    data: { bio: "This is a longer piece of text that spans multiple lines and demonstrates the longtext display component." },
  },
};

export const WithLabel: Story = {
  args: {
    name: "bio",
    label: "Biography",
    data: { bio: "John Doe is a software engineer with over 10 years of experience in building web applications. He specializes in React and TypeScript." },
  },
};

export const WithLineBreaks: Story = {
  args: {
    name: "address",
    label: "Address",
    data: { address: "123 Main Street\nApt 4B\nNew York, NY 10001\nUnited States" },
  },
};

export const Empty: Story = {
  args: {
    name: "notes",
    label: "Notes",
    data: { notes: null },
  },
};

export const VeryLong: Story = {
  args: {
    name: "content",
    label: "Content",
    data: { content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.` },
  },
};
