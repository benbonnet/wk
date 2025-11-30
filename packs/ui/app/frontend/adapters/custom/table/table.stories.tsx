import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table } from "./table";
import { ViewContext } from "../view";

const mockViewContext = {
  url: "/api/v1/items",
  api: {},
  executeApi: async () => ({ success: true }),
};

const meta: Meta<typeof Table> = {
  title: "Layouts/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <ViewContext.Provider value={mockViewContext}>
        <Story />
      </ViewContext.Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Table>;

const sampleData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    role: "Admin",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "active",
    role: "User",
  },
  {
    id: 3,
    name: "Bob Wilson",
    email: "bob@example.com",
    status: "pending",
    role: "User",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    status: "inactive",
    role: "Editor",
  },
  {
    id: 5,
    name: "Charlie Davis",
    email: "charlie@example.com",
    status: "active",
    role: "User",
  },
];

const columns = [
  {
    name: "name",
    label: "Name",
    type: "TextDisplay" as const,
    sortable: true,
  },
  {
    name: "email",
    label: "Email",
    type: "TextDisplay" as const,
    sortable: true,
  },
  {
    name: "status",
    label: "Status",
    type: "BadgeDisplay" as const,
    sortable: true,
  },
  {
    name: "role",
    label: "Role",
    type: "TextDisplay" as const,
    sortable: true,
  },
];

export const Default: Story = {
  args: {
    columns,
    data: sampleData,
  },
};

export const Searchable: Story = {
  args: {
    columns,
    data: sampleData,
    searchable: true,
  },
};

export const Selectable: Story = {
  args: {
    columns,
    data: sampleData,
    selectable: true,
  },
};

export const SearchableAndSelectable: Story = {
  args: {
    columns,
    data: sampleData,
    searchable: true,
    selectable: true,
  },
};

export const WithRowActions: Story = {
  args: {
    columns,
    data: sampleData,
    rowActions: {
      icon: "ellipsis",
      elements: [
        { type: "LINK", label: "View", opens: "view_drawer" },
        { type: "LINK", label: "Edit", opens: "edit_drawer" },
        {
          type: "LINK",
          label: "Delete",
          variant: "destructive",
          confirm: "Are you sure?",
        },
      ],
    },
  },
};

export const CustomPageSize: Story = {
  args: {
    columns,
    data: [...sampleData, ...sampleData, ...sampleData], // Triple the data
    pageSize: 5,
  },
};

export const EmptyTable: Story = {
  args: {
    columns,
    data: [],
  },
};

export const ManyColumns: Story = {
  args: {
    columns: [
      {
        name: "id",
        label: "ID",
        type: "TextDisplay" as const,
        sortable: true,
      },
      {
        name: "name",
        label: "Name",
        type: "TextDisplay" as const,
        sortable: true,
      },
      {
        name: "email",
        label: "Email",
        type: "TextDisplay" as const,
        sortable: true,
      },
      {
        name: "status",
        label: "Status",
        type: "BadgeDisplay" as const,
        sortable: true,
      },
      {
        name: "role",
        label: "Role",
        type: "TextDisplay" as const,
        sortable: true,
      },
      {
        name: "created_at",
        label: "Created",
        type: "DateDisplay" as const,
        sortable: true,
      },
    ],
    data: sampleData.map((row) => ({
      ...row,
      created_at: "2025-01-15",
    })),
    searchable: true,
    selectable: true,
  },
};

export const Complete: Story = {
  args: {
    search_placeholder: "Search users...",
    columns,
    data: [...sampleData, ...sampleData],
    searchable: true,
    selectable: true,
    pageSize: 5,
    rowActions: {
      icon: "ellipsis",
      elements: [
        { type: "LINK", label: "View Details", opens: "view_drawer" },
        { type: "LINK", label: "Edit User", opens: "edit_drawer" },
        {
          type: "LINK",
          label: "Deactivate",
          variant: "destructive",
          confirm: "Deactivate this user?",
        },
      ],
    },
  },
};
