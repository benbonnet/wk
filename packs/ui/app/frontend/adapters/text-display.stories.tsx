import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextDisplay } from "@ui/adapters";

const meta: Meta<typeof TextDisplay> = {
  title: "Displays/Text",
  component: TextDisplay,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TextDisplay>;

export const Default: Story = {
  args: {
    name: "name",
    data: { name: "Hello World" },
  },
};

export const WithLabel: Story = {
  args: {
    name: "name",
    label: "Full Name",
    data: { name: "John Doe" },
  },
};

export const WithNumber: Story = {
  args: {
    name: "count",
    label: "Count",
    data: { count: 12345 },
  },
};

export const Empty: Story = {
  args: {
    name: "name",
    label: "Name",
    data: { name: null },
  },
};

export const LongText: Story = {
  args: {
    name: "description",
    label: "Description",
    data: { description: "This is a longer piece of text that demonstrates how the component handles extended content without wrapping or truncation in the default configuration." },
  },
};
