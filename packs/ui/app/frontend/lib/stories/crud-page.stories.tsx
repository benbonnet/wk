import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import { DynamicRenderer } from "@ui/lib/renderer";
import type { UISchema } from "@ui/lib/types";

const meta: Meta<typeof DynamicRenderer> = {
  title: "Compositions/CRUD Page",
  component: DynamicRenderer,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof DynamicRenderer>;

const mockContacts = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    status: "active",
    created_at: "2025-01-10",
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    email: "jane@example.com",
    status: "active",
    created_at: "2025-01-08",
  },
  {
    id: 3,
    first_name: "Bob",
    last_name: "Wilson",
    email: "bob@example.com",
    status: "pending",
    created_at: "2025-01-05",
  },
  {
    id: 4,
    first_name: "Alice",
    last_name: "Brown",
    email: "alice@example.com",
    status: "inactive",
    created_at: "2025-01-03",
  },
  {
    id: 5,
    first_name: "Charlie",
    last_name: "Davis",
    email: "charlie@example.com",
    status: "active",
    created_at: "2025-01-01",
  },
];

const contactsListSchema: UISchema = {
  type: "VIEW",
  drawers: {
    new_contact: {
      title: "New Contact",
      description: "Add a new contact to your list",
      elements: [
        {
          type: "FORM",
          action: "create",
          elements: [
            {
              type: "COMPONENT",
              name: "first_name",
              kind: "INPUT_TEXT",
              label: "First Name",
              placeholder: "Enter first name",
            },
            {
              type: "COMPONENT",
              name: "last_name",
              kind: "INPUT_TEXT",
              label: "Last Name",
              placeholder: "Enter last name",
            },
            {
              type: "COMPONENT",
              name: "email",
              kind: "INPUT_TEXT",
              label: "Email",
              placeholder: "email@example.com",
            },
            {
              type: "COMPONENT",
              name: "status",
              kind: "INPUT_SELECT",
              label: "Status",
              options: [
                { value: "active", label: "Active" },
                { value: "pending", label: "Pending" },
                { value: "inactive", label: "Inactive" },
              ],
            },
            { type: "SUBMIT", label: "Create Contact" },
          ],
        },
      ],
    },
    view_contact: {
      title: "Contact Details",
      description: "View contact information",
      elements: [
        {
          type: "SHOW",
          use_record: true,
          elements: [
            {
              type: "COMPONENT",
              name: "first_name",
              kind: "DISPLAY_TEXT",
              label: "First Name",
            },
            {
              type: "COMPONENT",
              name: "last_name",
              kind: "DISPLAY_TEXT",
              label: "Last Name",
            },
            {
              type: "COMPONENT",
              name: "email",
              kind: "DISPLAY_TEXT",
              label: "Email",
            },
            {
              type: "COMPONENT",
              name: "status",
              kind: "DISPLAY_BADGE",
              label: "Status",
            },
            {
              type: "COMPONENT",
              name: "created_at",
              kind: "DISPLAY_DATE",
              label: "Created",
            },
          ],
        },
      ],
    },
    edit_contact: {
      title: "Edit Contact",
      description: "Update contact information",
      elements: [
        {
          type: "FORM",
          action: "update",
          use_record: true,
          elements: [
            {
              type: "COMPONENT",
              name: "first_name",
              kind: "INPUT_TEXT",
              label: "First Name",
            },
            {
              type: "COMPONENT",
              name: "last_name",
              kind: "INPUT_TEXT",
              label: "Last Name",
            },
            {
              type: "COMPONENT",
              name: "email",
              kind: "INPUT_TEXT",
              label: "Email",
            },
            {
              type: "COMPONENT",
              name: "status",
              kind: "INPUT_SELECT",
              label: "Status",
              options: [
                { value: "active", label: "Active" },
                { value: "pending", label: "Pending" },
                { value: "inactive", label: "Inactive" },
              ],
            },
            { type: "SUBMIT", label: "Update Contact" },
          ],
        },
      ],
    },
  },
  elements: [
    {
      type: "PAGE",
      title: "Contacts",
      description: "Manage your contacts and leads",
      actions: [
        {
          type: "LINK",
          label: "New Contact",
          opens: "new_contact",
          variant: "primary",
          icon: "plus",
        },
      ],
      elements: [
        {
          type: "TABLE",
          searchable: true,
          selectable: true,
          pageSize: 10,
          columns: [
            {
              name: "first_name",
              kind: "DISPLAY_TEXT",
              label: "First Name",
              sortable: true,
            },
            {
              name: "last_name",
              kind: "DISPLAY_TEXT",
              label: "Last Name",
              sortable: true,
            },
            {
              name: "email",
              kind: "DISPLAY_TEXT",
              label: "Email",
              sortable: true,
            },
            {
              name: "status",
              kind: "DISPLAY_BADGE",
              label: "Status",
              sortable: true,
            },
            {
              name: "created_at",
              kind: "DISPLAY_DATE",
              label: "Created",
              sortable: true,
            },
          ],
          rowClick: { opens: "view_contact" },
          rowActions: {
            icon: "ellipsis",
            elements: [
              { type: "LINK", label: "View", opens: "view_contact", icon: "eye" },
              {
                type: "LINK",
                label: "Edit",
                opens: "edit_contact",
                icon: "pencil",
              },
              {
                type: "LINK",
                label: "Delete",
                api: "destroy",
                variant: "destructive",
                confirm: "Are you sure you want to delete this contact?",
                icon: "trash",
              },
            ],
          },
          bulkActions: {
            elements: [
              { type: "BUTTON", label: "Export", variant: "secondary" },
              {
                type: "BUTTON",
                label: "Delete Selected",
                variant: "destructive",
              },
            ],
          },
        },
      ],
    },
  ],
};

export const ContactsList: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/contacts", () => {
          return HttpResponse.json({
            data: mockContacts,
            pagination: {
              current_page: 1,
              total_pages: 1,
              total_count: mockContacts.length,
            },
          });
        }),
        http.post("/api/v1/contacts", async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json({
            id: 6,
            ...body,
            created_at: new Date().toISOString(),
          });
        }),
        http.put("/api/v1/contacts/:id", async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json(body);
        }),
        http.delete("/api/v1/contacts/:id", () => {
          return HttpResponse.json({ success: true });
        }),
      ],
    },
  },
  render: () => (
    <div className="min-h-screen bg-slate-50 p-6">
      <DynamicRenderer schema={contactsListSchema} data={{}} />
    </div>
  ),
};

// Products example
const mockProducts = [
  {
    id: 1,
    name: "MacBook Pro",
    sku: "MBP-001",
    price: 2499,
    status: "active",
    stock: 45,
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    sku: "IP15P-001",
    price: 999,
    status: "active",
    stock: 120,
  },
  {
    id: 3,
    name: "iPad Air",
    sku: "IPA-001",
    price: 599,
    status: "pending",
    stock: 0,
  },
  {
    id: 4,
    name: "AirPods Pro",
    sku: "APP-001",
    price: 249,
    status: "active",
    stock: 200,
  },
];

const productsListSchema: UISchema = {
  type: "VIEW",
  drawers: {
    new_product: {
      title: "New Product",
      elements: [
        {
          type: "FORM",
          elements: [
            {
              type: "COMPONENT",
              name: "name",
              kind: "INPUT_TEXT",
              label: "Product Name",
            },
            {
              type: "COMPONENT",
              name: "sku",
              kind: "INPUT_TEXT",
              label: "SKU",
            },
            {
              type: "COMPONENT",
              name: "price",
              kind: "INPUT_TEXT",
              label: "Price",
            },
            {
              type: "COMPONENT",
              name: "stock",
              kind: "INPUT_TEXT",
              label: "Stock Quantity",
            },
            {
              type: "COMPONENT",
              name: "status",
              kind: "INPUT_SELECT",
              label: "Status",
              options: [
                { value: "active", label: "Active" },
                { value: "pending", label: "Draft" },
                { value: "inactive", label: "Archived" },
              ],
            },
            { type: "SUBMIT", label: "Create Product" },
          ],
        },
      ],
    },
    view_product: {
      title: "Product Details",
      elements: [
        {
          type: "SHOW",
          use_record: true,
          elements: [
            {
              type: "COMPONENT",
              name: "name",
              kind: "DISPLAY_TEXT",
              label: "Name",
            },
            {
              type: "COMPONENT",
              name: "sku",
              kind: "DISPLAY_TEXT",
              label: "SKU",
            },
            {
              type: "COMPONENT",
              name: "price",
              kind: "DISPLAY_NUMBER",
              label: "Price",
            },
            {
              type: "COMPONENT",
              name: "stock",
              kind: "DISPLAY_NUMBER",
              label: "Stock",
            },
            {
              type: "COMPONENT",
              name: "status",
              kind: "DISPLAY_BADGE",
              label: "Status",
            },
          ],
        },
      ],
    },
  },
  elements: [
    {
      type: "PAGE",
      title: "Products",
      description: "Manage your product catalog",
      actions: [
        {
          type: "BUTTON",
          label: "Import",
          variant: "secondary",
          icon: "upload",
        },
        {
          type: "LINK",
          label: "Add Product",
          opens: "new_product",
          variant: "primary",
          icon: "plus",
        },
      ],
      elements: [
        {
          type: "TABLE",
          searchable: true,
          selectable: true,
          columns: [
            { name: "name", kind: "DISPLAY_TEXT", label: "Name", sortable: true },
            { name: "sku", kind: "DISPLAY_TEXT", label: "SKU", sortable: true },
            {
              name: "price",
              kind: "DISPLAY_NUMBER",
              label: "Price",
              sortable: true,
            },
            {
              name: "stock",
              kind: "DISPLAY_NUMBER",
              label: "Stock",
              sortable: true,
            },
            {
              name: "status",
              kind: "DISPLAY_BADGE",
              label: "Status",
              sortable: true,
            },
          ],
          rowClick: { opens: "view_product" },
          rowActions: {
            elements: [
              { type: "LINK", label: "View", opens: "view_product" },
              { type: "LINK", label: "Edit", opens: "edit_product" },
              {
                type: "LINK",
                label: "Delete",
                variant: "destructive",
                confirm: "Delete this product?",
              },
            ],
          },
        },
      ],
    },
  ],
};

export const ProductsList: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/products", () => {
          return HttpResponse.json({ data: mockProducts });
        }),
      ],
    },
  },
  render: () => (
    <div className="min-h-screen bg-slate-50 p-6">
      <DynamicRenderer schema={productsListSchema} data={{}} />
    </div>
  ),
};

// Simple table without drawers
const simpleTableSchema: UISchema = {
  type: "VIEW",
  elements: [
    {
      type: "PAGE",
      title: "Activity Log",
      description: "Recent system activity",
      elements: [
        {
          type: "TABLE",
          searchable: true,
          pageSize: 5,
          columns: [
            { name: "action", kind: "DISPLAY_TEXT", label: "Action" },
            { name: "user", kind: "DISPLAY_TEXT", label: "User" },
            { name: "status", kind: "DISPLAY_BADGE", label: "Status" },
            { name: "timestamp", kind: "DISPLAY_DATETIME", label: "Time" },
          ],
        },
      ],
    },
  ],
};

const mockActivityLog = [
  {
    id: 1,
    action: "User login",
    user: "john@example.com",
    status: "completed",
    timestamp: "2025-01-15T14:30:00Z",
  },
  {
    id: 2,
    action: "Contact created",
    user: "jane@example.com",
    status: "completed",
    timestamp: "2025-01-15T14:25:00Z",
  },
  {
    id: 3,
    action: "Export started",
    user: "john@example.com",
    status: "processing",
    timestamp: "2025-01-15T14:20:00Z",
  },
  {
    id: 4,
    action: "Bulk delete",
    user: "admin@example.com",
    status: "completed",
    timestamp: "2025-01-15T14:15:00Z",
  },
  {
    id: 5,
    action: "Import failed",
    user: "jane@example.com",
    status: "failed",
    timestamp: "2025-01-15T14:10:00Z",
  },
];

export const ActivityLog: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/activity", () => {
          return HttpResponse.json({ data: mockActivityLog });
        }),
      ],
    },
  },
  render: () => (
    <div className="min-h-screen bg-slate-50 p-6">
      <DynamicRenderer schema={simpleTableSchema} data={{ items: mockActivityLog }} />
    </div>
  ),
};
