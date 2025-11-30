import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search } from "@ui/adapters";

const meta: Meta<typeof Search> = {
  title: "Primitives/Search",
  component: Search,
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Search>;

export const Default: Story = {
  args: {},
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Search contacts...",
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: "Find products by name or SKU...",
  },
};

export const WithCustomClassName: Story = {
  args: {
    className: "max-w-md",
    placeholder: "Search...",
  },
};

export const Wide: Story = {
  args: {
    className: "w-full max-w-lg",
    placeholder: "Search across all records...",
  },
};

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default</p>
        <Search />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">With custom placeholder</p>
        <Search placeholder="Search users..." />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Full width</p>
        <Search className="w-full" placeholder="Search everything..." />
      </div>
    </div>
  ),
};
