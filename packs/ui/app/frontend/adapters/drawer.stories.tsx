import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Drawer, TextInput, Select, Textarea } from "@ui/adapters";
import { Button } from "@ui/components/button";

const meta: Meta<typeof Drawer> = {
  title: "Layouts/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

// Wrapper component to manage drawer state
const DrawerDemo = ({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer
        title={title}
        description={description}
        open={open}
        onClose={() => setOpen(false)}
      >
        {children}
      </Drawer>
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <DrawerDemo title="Drawer Title">
      <p className="text-muted-foreground">Drawer content goes here</p>
    </DrawerDemo>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <DrawerDemo
      title="Edit Contact"
      description="Update the contact information below"
    >
      <div className="space-y-4">
        <TextInput name="name" label="Name" value="John Doe" />
        <TextInput name="email" label="Email" value="john@example.com" />
      </div>
    </DrawerDemo>
  ),
};

export const WithForm: Story = {
  render: () => (
    <DrawerDemo
      title="New Contact"
      description="Add a new contact to your list"
    >
      <div className="space-y-4">
        <TextInput name="first_name" label="First Name" />
        <TextInput name="last_name" label="Last Name" />
        <TextInput name="email" label="Email" />
        <TextInput name="phone" label="Phone" />
        <Select
          name="category"
          label="Category"
          options={[
            { value: "personal", label: "Personal" },
            { value: "business", label: "Business" },
            { value: "other", label: "Other" },
          ]}
        />
        <Textarea name="notes" label="Notes" rows={3} />
        <Button className="w-full">Save Contact</Button>
      </div>
    </DrawerDemo>
  ),
};

export const LongContent: Story = {
  render: () => (
    <DrawerDemo
      title="Terms and Conditions"
      description="Please read carefully before proceeding"
    >
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <p key={i} className="text-sm text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        ))}
      </div>
    </DrawerDemo>
  ),
};

export const MinimalDrawer: Story = {
  render: () => (
    <DrawerDemo title="Quick Action">
      <div className="text-center py-8">
        <p className="mb-4">Are you sure you want to proceed?</p>
        <div className="flex gap-2 justify-center">
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </div>
      </div>
    </DrawerDemo>
  ),
};
