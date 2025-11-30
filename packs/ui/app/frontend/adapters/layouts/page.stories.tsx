import type { Meta, StoryObj } from "@storybook/react-vite";
import { withForm } from "@storybook-decorators";
import { Page, CardGroup, FormikAdapter } from "@ui/adapters";
import { Button } from "@ui/components/button";

const meta: Meta<typeof Page> = {
  title: "Layouts/Page",
  component: Page,
  tags: ["autodocs"],
  decorators: [withForm],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Page>;

export const Default: Story = {
  args: {
    title: "Dashboard",
    children: (
      <div className="p-4">
        <p className="text-muted-foreground">Page content goes here</p>
      </div>
    ),
  },
};

export const WithDescription: Story = {
  args: {
    title: "Settings",
    description: "Manage your account settings and preferences",
    children: (
      <CardGroup label="General">
        <FormikAdapter type="INPUT_TEXT" name="name" label="Display Name" />
        <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
      </CardGroup>
    ),
  },
};

export const WithActions: Story = {
  args: {
    title: "Contacts",
    description: "Manage your contacts and leads",
    actions: [
      { type: "BUTTON", label: "Export", variant: "outline" },
      { type: "BUTTON", label: "New Contact", variant: "primary" },
    ],
    children: (
      <div className="p-4 border rounded-lg">
        <p className="text-muted-foreground">Contact list would go here</p>
      </div>
    ),
  },
};

export const ComplexPage: Story = {
  args: {
    title: "User Profile",
    description: "View and edit your profile information",
    children: (
      <div className="space-y-6">
        <CardGroup label="Personal Information">
          <FormikAdapter type="INPUT_TEXT" name="first_name" label="First Name" />
          <FormikAdapter type="INPUT_TEXT" name="last_name" label="Last Name" />
          <FormikAdapter type="INPUT_TEXT" name="email" label="Email Address" />
        </CardGroup>
        <CardGroup label="Preferences">
          <FormikAdapter
            type="INPUT_SELECT"
            name="language"
            label="Language"
            options={[
              { value: "en", label: "English" },
              { value: "fr", label: "French" },
              { value: "es", label: "Spanish" },
            ]}
          />
          <FormikAdapter
            type="INPUT_SELECT"
            name="timezone"
            label="Timezone"
            options={[
              { value: "utc", label: "UTC" },
              { value: "est", label: "Eastern Time" },
              { value: "pst", label: "Pacific Time" },
            ]}
          />
        </CardGroup>
        <CardGroup label="Notifications">
          <FormikAdapter
            type="INPUT_CHECKBOX"
            name="email_notifications"
            label="Email notifications"
          />
          <FormikAdapter type="INPUT_CHECKBOX" name="sms_notifications" label="SMS notifications" />
          <FormikAdapter
            type="INPUT_CHECKBOX"
            name="push_notifications"
            label="Push notifications"
          />
        </CardGroup>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    ),
  },
};

export const MinimalPage: Story = {
  args: {
    title: "Reports",
    children: (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No reports available</p>
        <Button className="mt-4">Create Report</Button>
      </div>
    ),
  },
};
