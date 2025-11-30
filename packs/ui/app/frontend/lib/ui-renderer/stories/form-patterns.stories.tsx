import type { Meta, StoryObj } from "@storybook/react-vite";
import { DynamicRenderer } from "@ui/lib/ui-renderer/renderer";
import type { UISchema } from "@ui/lib/ui-renderer/types";

const meta: Meta<typeof DynamicRenderer> = {
  title: "Compositions/Form Patterns",
  component: DynamicRenderer,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof DynamicRenderer>;

const inputKindsSchema: UISchema = {
  type: "VIEW",
  elements: [
    {
      type: "PAGE",
      title: "Form Input Types",
      description: "All available input field types",
      elements: [
        {
          type: "FORM",
          className: "max-w-2xl mx-auto p-6",
          elements: [
            {
              type: "GROUP",
              label: "Text Inputs",
              subtitle: "Various text input components",
              elements: [
                {
                  type: "INPUT_TEXT",
                  name: "text",
                  label: "Text Input",
                  placeholder: "Enter text...",
                },
                {
                  type: "INPUT_TEXTAREA",
                  name: "textarea",
                  label: "Textarea",
                  rows: 4,
                  placeholder: "Enter longer text...",
                },
              ],
            },
            {
              type: "GROUP",
              label: "Selection Inputs",
              subtitle: "Choose from predefined options",
              elements: [
                {
                  type: "INPUT_SELECT",
                  name: "select",
                  label: "Select",
                  placeholder: "Select an option...",
                  options: [
                    { label: "Option A", value: "a" },
                    { label: "Option B", value: "b" },
                    { label: "Option C", value: "c" },
                  ],
                },
                {
                  type: "INPUT_CHECKBOX",
                  name: "checkbox",
                  label: "Checkbox",
                  helperText: "Toggle this option",
                },
                {
                  type: "INPUT_CHECKBOXES",
                  name: "checkboxes",
                  label: "Checkboxes",
                  options: [
                    { label: "Option 1", value: "1" },
                    { label: "Option 2", value: "2" },
                    { label: "Option 3", value: "3" },
                  ],
                },
                {
                  type: "INPUT_RADIOS",
                  name: "radios",
                  label: "Radio Group",
                  options: [
                    { label: "Small", value: "small" },
                    { label: "Medium", value: "medium" },
                    { label: "Large", value: "large" },
                  ],
                },
              ],
            },
            {
              type: "GROUP",
              label: "Date & Time Inputs",
              elements: [
                {
                  type: "INPUT_DATE",
                  name: "date",
                  label: "Date",
                },
                {
                  type: "INPUT_DATETIME",
                  name: "datetime",
                  label: "Date & Time",
                },
              ],
            },
            {
              type: "GROUP",
              label: "Other Inputs",
              elements: [
                {
                  type: "INPUT_TAGS",
                  name: "tags",
                  label: "Tags",
                  placeholder: "Add tags...",
                },
              ],
            },
            { type: "SUBMIT", label: "Submit Form" },
          ],
        },
      ],
    },
  ],
};

export const InputKinds: Story = {
  render: () => (
    <div className="min-h-screen bg-slate-50">
      <DynamicRenderer schema={inputKindsSchema} />
    </div>
  ),
};

const multistepSchema: UISchema = {
  type: "VIEW",
  elements: [
    {
      type: "PAGE",
      title: "Multi-step Registration",
      description: "Complete the registration in a few simple steps",
      elements: [
        {
          type: "FORM",
          className: "max-w-xl mx-auto p-6",
          elements: [
            {
              type: "MULTISTEP",
              elements: [
                {
                  type: "STEP",
                  label: "Personal",
                  subtitle: "Enter your personal information",
                  elements: [
                    {
                      type: "INPUT_TEXT",
                      name: "first_name",
                      label: "First Name",
                    },
                    {
                      type: "INPUT_TEXT",
                      name: "last_name",
                      label: "Last Name",
                    },
                    {
                      type: "INPUT_TEXT",
                      name: "email",
                      label: "Email Address",
                    },
                  ],
                },
                {
                  type: "STEP",
                  label: "Account",
                  subtitle: "Set up your account credentials",
                  elements: [
                    {
                      type: "INPUT_TEXT",
                      name: "username",
                      label: "Username",
                    },
                    {
                      type: "INPUT_TEXT",
                      name: "password",
                      label: "Password",
                      inputType: "password",
                    },
                    {
                      type: "INPUT_TEXT",
                      name: "confirm_password",
                      label: "Confirm Password",
                      inputType: "password",
                    },
                  ],
                },
                {
                  type: "STEP",
                  label: "Preferences",
                  subtitle: "Customize your experience",
                  elements: [
                    {
                      type: "INPUT_SELECT",
                      name: "language",
                      label: "Preferred Language",
                      options: [
                        { label: "English", value: "en" },
                        { label: "French", value: "fr" },
                        { label: "Spanish", value: "es" },
                      ],
                    },
                    {
                      type: "INPUT_CHECKBOXES",
                      name: "notifications",
                      label: "Notification Preferences",
                      options: [
                        { label: "Email updates", value: "email" },
                        { label: "SMS alerts", value: "sms" },
                        { label: "Push notifications", value: "push" },
                      ],
                    },
                  ],
                },
                {
                  type: "STEP",
                  label: "Review",
                  subtitle: "Review and confirm your information",
                  elements: [
                    {
                      type: "ALERT",
                      label: "Please review your information before submitting.",
                      color: "blue",
                    },
                    {
                      type: "INPUT_CHECKBOX",
                      name: "terms",
                      label: "I agree to the Terms of Service and Privacy Policy",
                    },
                  ],
                },
              ],
            },
            { type: "SUBMIT", label: "Create Account" },
          ],
        },
      ],
    },
  ],
};

export const Multistep: Story = {
  render: () => (
    <div className="min-h-screen bg-slate-50">
      <DynamicRenderer schema={multistepSchema} />
    </div>
  ),
};

const formArraySchema: UISchema = {
  type: "VIEW",
  elements: [
    {
      type: "PAGE",
      title: "Contact with Addresses",
      description: "Add a contact with multiple addresses",
      elements: [
        {
          type: "FORM",
          className: "max-w-2xl mx-auto p-6",
          elements: [
            {
              type: "CARD_GROUP",
              label: "Contact Information",
              elements: [
                {
                  type: "GROUP",
                  direction: "HORIZONTAL",
                  elements: [
                    {
                      type: "INPUT_TEXT",
                      name: "first_name",
                      label: "First Name",
                    },
                    {
                      type: "INPUT_TEXT",
                      name: "last_name",
                      label: "Last Name",
                    },
                  ],
                },
                {
                  type: "INPUT_TEXT",
                  name: "email",
                  label: "Email",
                },
                {
                  type: "INPUT_TEXT",
                  name: "phone",
                  label: "Phone",
                },
              ],
            },
            {
              type: "FORM_ARRAY",
              name: "addresses_attributes",
              label: "Addresses",
              addLabel: "Add Address",
              removeLabel: "Remove",
              template: [
                {
                  type: "INPUT_TEXT",
                  name: "street",
                  label: "Street",
                },
                {
                  type: "GROUP",
                  direction: "HORIZONTAL",
                  elements: [
                    {
                      type: "INPUT_TEXT",
                      name: "city",
                      label: "City",
                    },
                    {
                      type: "INPUT_TEXT",
                      name: "state",
                      label: "State",
                    },
                    {
                      type: "INPUT_TEXT",
                      name: "zip",
                      label: "ZIP Code",
                    },
                  ],
                },
              ],
            },
            { type: "SUBMIT", label: "Save Contact" },
          ],
        },
      ],
    },
  ],
};

export const FormArray: Story = {
  render: () => (
    <div className="min-h-screen bg-slate-50">
      <DynamicRenderer schema={formArraySchema} />
    </div>
  ),
};

const settingsFormSchema: UISchema = {
  type: "VIEW",
  elements: [
    {
      type: "PAGE",
      title: "Account Settings",
      description: "Manage your account preferences",
      elements: [
        {
          type: "FORM",
          className: "max-w-2xl mx-auto",
          elements: [
            {
              type: "CARD_GROUP",
              label: "Profile",
              subtitle: "Your public profile information",
              elements: [
                {
                  type: "INPUT_TEXT",
                  name: "display_name",
                  label: "Display Name",
                  helperText: "This is how your name will appear to others",
                },
                {
                  type: "INPUT_TEXTAREA",
                  name: "bio",
                  label: "Bio",
                  rows: 3,
                  placeholder: "Tell us about yourself...",
                },
              ],
            },
            {
              type: "CARD_GROUP",
              label: "Preferences",
              subtitle: "Customize your experience",
              elements: [
                {
                  type: "INPUT_SELECT",
                  name: "timezone",
                  label: "Timezone",
                  options: [
                    { label: "UTC", value: "utc" },
                    { label: "Eastern Time", value: "est" },
                    { label: "Pacific Time", value: "pst" },
                    { label: "Central European", value: "cet" },
                  ],
                },
                {
                  type: "INPUT_SELECT",
                  name: "language",
                  label: "Language",
                  options: [
                    { label: "English", value: "en" },
                    { label: "French", value: "fr" },
                    { label: "German", value: "de" },
                    { label: "Spanish", value: "es" },
                  ],
                },
              ],
            },
            {
              type: "CARD_GROUP",
              label: "Notifications",
              subtitle: "Choose how you want to be notified",
              elements: [
                {
                  type: "INPUT_CHECKBOX",
                  name: "email_notifications",
                  label: "Email notifications",
                  helperText: "Receive notifications via email",
                },
                {
                  type: "INPUT_CHECKBOX",
                  name: "push_notifications",
                  label: "Push notifications",
                  helperText: "Receive browser push notifications",
                },
                {
                  type: "INPUT_CHECKBOX",
                  name: "newsletter",
                  label: "Weekly newsletter",
                  helperText: "Get weekly updates about new features",
                },
              ],
            },
            {
              type: "ACTIONS",
              className: "justify-end mt-6",
              elements: [
                { type: "BUTTON", label: "Cancel", variant: "outline" },
                { type: "SUBMIT", label: "Save Changes" },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const SettingsForm: Story = {
  render: () => (
    <div className="min-h-screen bg-slate-50 p-6">
      <DynamicRenderer schema={settingsFormSchema} />
    </div>
  ),
};
