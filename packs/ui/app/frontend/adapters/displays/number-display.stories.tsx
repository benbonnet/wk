import type { Meta, StoryObj } from "@storybook/react-vite";
import { DISPLAY_NUMBER } from "@ui/adapters/displays";

const meta: Meta<typeof DISPLAY_NUMBER> = {
  title: "Displays/Number",
  component: DISPLAY_NUMBER,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    label: { control: "text" },
    value: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof DISPLAY_NUMBER>;

export const Default: Story = {
  args: {
    name: "count",
    value: 42,
  },
};

export const WithLabel: Story = {
  args: {
    name: "revenue",
    label: "Total Revenue",
    value: 1234567,
  },
};

export const WithDecimals: Story = {
  args: {
    name: "price",
    label: "Price",
    value: 99.99,
  },
};

export const LargeNumber: Story = {
  args: {
    name: "population",
    label: "Population",
    value: 7900000000,
  },
};

export const Zero: Story = {
  args: {
    name: "balance",
    label: "Balance",
    value: 0,
  },
};

export const Negative: Story = {
  args: {
    name: "change",
    label: "Change",
    value: -15.5,
  },
};

export const Empty: Story = {
  args: {
    name: "count",
    label: "Count",
    value: null,
  },
};
