import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberDisplay } from "@ui/adapters";

const meta: Meta<typeof NumberDisplay> = {
  title: "Displays/Number",
  component: NumberDisplay,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NumberDisplay>;

export const Default: Story = {
  args: {
    name: "count",
    data: { count: 42 },
  },
};

export const WithLabel: Story = {
  args: {
    name: "revenue",
    label: "Total Revenue",
    data: { revenue: 1234567 },
  },
};

export const WithDecimals: Story = {
  args: {
    name: "price",
    label: "Price",
    data: { price: 99.99 },
  },
};

export const LargeNumber: Story = {
  args: {
    name: "population",
    label: "Population",
    data: { population: 7900000000 },
  },
};

export const Zero: Story = {
  args: {
    name: "balance",
    label: "Balance",
    data: { balance: 0 },
  },
};

export const Negative: Story = {
  args: {
    name: "change",
    label: "Change",
    data: { change: -15.5 },
  },
};

export const Empty: Story = {
  args: {
    name: "count",
    label: "Count",
    data: { count: null },
  },
};
