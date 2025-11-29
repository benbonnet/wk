import type { Meta, StoryObj } from "@storybook/react-vite";
import { PAGE, CARD_GROUP } from "@ui/adapters/layouts";
import { INPUT_TEXT, INPUT_SELECT, INPUT_CHECKBOX } from "@ui/adapters/inputs";
import { Button } from "@ui/components/ui/button";

const meta: Meta<typeof PAGE> = {
  title: "Layouts/Page",
  component: PAGE,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof PAGE>;

export const Default: Story = {
  args: {
    schema: { type: "PAGE" },
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
    schema: { type: "PAGE" },
    title: "Settings",
    description: "Manage your account settings and preferences",
    children: (
      <CARD_GROUP schema={{ type: "CARD_GROUP" }} label="General">
        <INPUT_TEXT name="name" label="Display Name" value="John Doe" />
        <INPUT_TEXT name="email" label="Email" value="john@example.com" />
      </CARD_GROUP>
    ),
  },
};

export const WithActions: Story = {
  args: {
    schema: {
      type: "PAGE",
      actions: [
        { type: "BUTTON", label: "Export", variant: "outline" },
        { type: "BUTTON", label: "New Contact", variant: "primary" },
      ],
    },
    title: "Contacts",
    description: "Manage your contacts and leads",
    children: (
      <div className="p-4 border rounded-lg">
        <p className="text-muted-foreground">Contact list would go here</p>
      </div>
    ),
  },
};

export const ComplexPage: Story = {
  args: {
    schema: { type: "PAGE" },
    title: "User Profile",
    description: "View and edit your profile information",
    children: (
      <div className="space-y-6">
        <CARD_GROUP schema={{ type: "CARD_GROUP" }} label="Personal Information">
          <INPUT_TEXT name="first_name" label="First Name" />
          <INPUT_TEXT name="last_name" label="Last Name" />
          <INPUT_TEXT name="email" label="Email Address" />
        </CARD_GROUP>
        <CARD_GROUP schema={{ type: "CARD_GROUP" }} label="Preferences">
          <INPUT_SELECT
            name="language"
            label="Language"
            options={[
              { value: "en", label: "English" },
              { value: "fr", label: "French" },
              { value: "es", label: "Spanish" },
            ]}
          />
          <INPUT_SELECT
            name="timezone"
            label="Timezone"
            options={[
              { value: "utc", label: "UTC" },
              { value: "est", label: "Eastern Time" },
              { value: "pst", label: "Pacific Time" },
            ]}
          />
        </CARD_GROUP>
        <CARD_GROUP schema={{ type: "CARD_GROUP" }} label="Notifications">
          <INPUT_CHECKBOX name="email_notifications" label="Email notifications" />
          <INPUT_CHECKBOX name="sms_notifications" label="SMS notifications" />
          <INPUT_CHECKBOX name="push_notifications" label="Push notifications" />
        </CARD_GROUP>
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
    schema: { type: "PAGE" },
    title: "Reports",
    children: (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No reports available</p>
        <Button className="mt-4">Create Report</Button>
      </div>
    ),
  },
};
