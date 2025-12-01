import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import { RelationshipPickerField, ViewContext } from "@ui/adapters";

const meta: Meta<typeof RelationshipPickerField> = {
  title: "Complex/RelationshipPicker",
  component: RelationshipPickerField,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof RelationshipPickerField>;

// Mock ViewContext value
const mockViewConfig = {
  url: "/api/v1/workspaces/rib_requests",
  api: {},
  executeApi: async () => ({ success: true }),
};

// Mock data for contacts - now flat structure
const mockContacts = [
  { id: 1, first_name: "John", last_name: "Doe", email: "john@example.com" },
  { id: 2, first_name: "Jane", last_name: "Smith", email: "jane@example.com" },
  { id: 3, first_name: "Bob", last_name: "Wilson", email: "bob@example.com" },
  { id: 4, first_name: "Alice", last_name: "Brown", email: "alice@example.com" },
];

const contactColumns = [
  { name: "first_name", kind: "TextDisplay", label: "First Name" },
  { name: "last_name", kind: "TextDisplay", label: "Last Name" },
  { name: "email", kind: "TextDisplay", label: "Email" },
];

const contactTemplate = [
  { type: "COMPONENT" as const, name: "first_name", kind: "TextInput" as const, label: "First Name" },
  { type: "COMPONENT" as const, name: "last_name", kind: "TextInput" as const, label: "Last Name" },
  { type: "COMPONENT" as const, name: "email", kind: "TextInput" as const, label: "Email" },
];

// Wrapper component for managing state
const RelationshipPickerDemo = ({
  cardinality,
  initialValue = null,
}: {
  cardinality: "one" | "many";
  initialValue?: unknown;
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <ViewContext.Provider value={mockViewConfig}>
      <div className="max-w-md">
        <RelationshipPickerField
          name="contacts"
          cardinality={cardinality}
          relationSchema="contact"
          label="Contacts"
          addLabel="Add Contact"
          emptyMessage="No contacts selected"
          searchPlaceholder="Search contacts..."
          confirmLabel="Add Selected"
          columns={contactColumns}
          template={contactTemplate}
          value={value}
          onChange={setValue}
        />
      </div>
    </ViewContext.Provider>
  );
};

export const HasManyEmpty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/workspaces/contacts", () => {
          return HttpResponse.json({ data: mockContacts });
        }),
      ],
    },
  },
  render: () => <RelationshipPickerDemo cardinality="many" />,
};

export const HasManyWithItems: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/workspaces/contacts", () => {
          return HttpResponse.json({ data: mockContacts });
        }),
      ],
    },
  },
  render: () => (
    <RelationshipPickerDemo
      cardinality="many"
      initialValue={[
        { id: 1, first_name: "John", last_name: "Doe" },
        { id: 2, first_name: "Jane", last_name: "Smith" },
      ]}
    />
  ),
};

export const HasOneEmpty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/workspaces/contacts", () => {
          return HttpResponse.json({ data: mockContacts });
        }),
      ],
    },
  },
  render: () => <RelationshipPickerDemo cardinality="one" />,
};

export const HasOneWithItem: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/workspaces/contacts", () => {
          return HttpResponse.json({ data: mockContacts });
        }),
      ],
    },
  },
  render: () => (
    <RelationshipPickerDemo
      cardinality="one"
      initialValue={{ id: 1, first_name: "John", last_name: "Doe" }}
    />
  ),
};

// Custom example with address selection
const addressColumns = [
  { name: "street", kind: "TextDisplay", label: "Street" },
  { name: "city", kind: "TextDisplay", label: "City" },
];

const addressTemplate = [
  { type: "COMPONENT" as const, name: "street", kind: "TextInput" as const, label: "Street" },
  { type: "COMPONENT" as const, name: "city", kind: "TextInput" as const, label: "City" },
  { type: "COMPONENT" as const, name: "zip", kind: "TextInput" as const, label: "ZIP Code" },
];

const mockAddresses = [
  { id: 1, street: "123 Main St", city: "New York", zip: "10001" },
  { id: 2, street: "456 Oak Ave", city: "Los Angeles", zip: "90001" },
  { id: 3, street: "789 Pine Rd", city: "Chicago", zip: "60601" },
];

const AddressPickerDemo = () => {
  const [value, setValue] = useState<unknown>(null);

  return (
    <ViewContext.Provider value={mockViewConfig}>
      <div className="max-w-md">
        <RelationshipPickerField
          name="addresses"
          cardinality="many"
          relationSchema="address"
          label="Addresses"
          addLabel="Add Address"
          emptyMessage="No addresses added"
          searchPlaceholder="Search addresses..."
          confirmLabel="Select Address"
          columns={addressColumns}
          template={addressTemplate}
          value={value}
          onChange={setValue}
        />
      </div>
    </ViewContext.Provider>
  );
};

export const AddressPicker: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/workspaces/addresses", () => {
          return HttpResponse.json({ data: mockAddresses });
        }),
      ],
    },
  },
  render: () => <AddressPickerDemo />,
};
