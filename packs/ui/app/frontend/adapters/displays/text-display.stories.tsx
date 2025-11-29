import type { Meta, StoryObj } from "@storybook/react-vite";
import { DISPLAY_TEXT } from "@ui/adapters/displays";

const meta: Meta<typeof DISPLAY_TEXT> = {
  title: "Displays/Text",
  component: DISPLAY_TEXT,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    label: { control: "text" },
    value: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof DISPLAY_TEXT>;

export const Default: Story = {
  args: {
    name: "name",
    value: "Hello World",
  },
};

export const WithLabel: Story = {
  args: {
    name: "name",
    label: "Full Name",
    value: "John Doe",
  },
};

export const WithNumber: Story = {
  args: {
    name: "count",
    label: "Count",
    value: 12345,
  },
};

export const Empty: Story = {
  args: {
    name: "name",
    label: "Name",
    value: null,
  },
};

export const LongText: Story = {
  args: {
    name: "description",
    label: "Description",
    value: "This is a longer piece of text that demonstrates how the component handles extended content without wrapping or truncation in the default configuration.",
  },
};
