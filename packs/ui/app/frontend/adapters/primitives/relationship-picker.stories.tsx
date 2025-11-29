import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import { RelationshipPickerField } from "@ui/lib/form";

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

// Mock data for contacts
const mockContacts = [
  { id: 1, first_name: "John", last_name: "Doe", email: "john@example.com" },
  { id: 2, first_name: "Jane", last_name: "Smith", email: "jane@example.com" },
  { id: 3, first_name: "Bob", last_name: "Wilson", email: "bob@example.com" },
  { id: 4, first_name: "Alice", last_name: "Brown", email: "alice@example.com" },
];

const contactColumns = [
  { name: "first_name", kind: "DISPLAY_TEXT", label: "First Name" },
  { name: "last_name", kind: "DISPLAY_TEXT", label: "Last Name" },
  { name: "email", kind: "DISPLAY_TEXT", label: "Email" },
];

const contactTemplate = [
  { type: "COMPONENT" as const, name: "first_name", kind: "INPUT_TEXT" as const, label: "First Name" },
  { type: "COMPONENT" as const, name: "last_name", kind: "INPUT_TEXT" as const, label: "Last Name" },
  { type: "COMPONENT" as const, name: "email", kind: "INPUT_TEXT" as const, label: "Email" },
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
    <div className="max-w-md">
      <RelationshipPickerField
        name="contacts"
        cardinality={cardinality}
        relationSchema="contact"
        basePath="/api/contacts"
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
  );
};

export const HasManyEmpty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/contacts", () => {
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
        http.get("/api/contacts", () => {
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
        http.get("/api/contacts", () => {
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
        http.get("/api/contacts", () => {
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
  { name: "street", kind: "DISPLAY_TEXT", label: "Street" },
  { name: "city", kind: "DISPLAY_TEXT", label: "City" },
];

const addressTemplate = [
  { type: "COMPONENT" as const, name: "street", kind: "INPUT_TEXT" as const, label: "Street" },
  { type: "COMPONENT" as const, name: "city", kind: "INPUT_TEXT" as const, label: "City" },
  { type: "COMPONENT" as const, name: "zip", kind: "INPUT_TEXT" as const, label: "ZIP Code" },
];

const mockAddresses = [
  { id: 1, street: "123 Main St", city: "New York", zip: "10001" },
  { id: 2, street: "456 Oak Ave", city: "Los Angeles", zip: "90001" },
  { id: 3, street: "789 Pine Rd", city: "Chicago", zip: "60601" },
];

const AddressPickerDemo = () => {
  const [value, setValue] = useState<unknown>(null);

  return (
    <div className="max-w-md">
      <RelationshipPickerField
        name="addresses"
        cardinality="many"
        relationSchema="address"
        basePath="/api/addresses"
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
  );
};

export const AddressPicker: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/addresses", () => {
          return HttpResponse.json({ data: mockAddresses });
        }),
      ],
    },
  },
  render: () => <AddressPickerDemo />,
};
