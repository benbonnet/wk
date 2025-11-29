import type { Meta, StoryObj } from "@storybook/react-vite";
import { SEARCH } from "@ui/adapters/primitives";

const meta: Meta<typeof SEARCH> = {
  title: "Primitives/Search",
  component: SEARCH,
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof SEARCH>;

export const Default: Story = {
  args: {
    schema: { type: "SEARCH" },
  },
};

export const WithPlaceholder: Story = {
  args: {
    schema: { type: "SEARCH" },
    placeholder: "Search contacts...",
  },
};

export const CustomPlaceholder: Story = {
  args: {
    schema: {
      type: "SEARCH",
      placeholder: "Find products by name or SKU...",
    },
  },
};

export const WithCustomClassName: Story = {
  args: {
    schema: {
      type: "SEARCH",
      className: "max-w-md",
    },
    placeholder: "Search...",
  },
};

export const Wide: Story = {
  args: {
    schema: {
      type: "SEARCH",
      className: "w-full max-w-lg",
    },
    placeholder: "Search across all records...",
  },
};

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default</p>
        <SEARCH schema={{ type: "SEARCH" }} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">With custom placeholder</p>
        <SEARCH schema={{ type: "SEARCH" }} placeholder="Search users..." />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Full width</p>
        <SEARCH schema={{ type: "SEARCH", className: "w-full" }} placeholder="Search everything..." />
      </div>
    </div>
  ),
};
