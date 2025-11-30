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
                  type: "COMPONENT",
                  name: "text",
                  kind: "INPUT_TEXT",
                  label: "Text Input",
                  placeholder: "Enter text...",
                },
                {
                  type: "COMPONENT",
                  name: "textarea",
                  kind: "INPUT_TEXTAREA",
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
                  type: "COMPONENT",
                  name: "select",
                  kind: "INPUT_SELECT",
                  label: "Select",
                  placeholder: "Select an option...",
                  options: [
                    { label: "Option A", value: "a" },
                    { label: "Option B", value: "b" },
                    { label: "Option C", value: "c" },
                  ],
                },
                {
                  type: "COMPONENT",
                  name: "checkbox",
                  kind: "INPUT_CHECKBOX",
                  label: "Checkbox",
                  helperText: "Toggle this option",
                },
                {
                  type: "COMPONENT",
                  name: "checkboxes",
                  kind: "INPUT_CHECKBOXES",
                  label: "Checkboxes",
                  options: [
                    { label: "Option 1", value: "1" },
                    { label: "Option 2", value: "2" },
                    { label: "Option 3", value: "3" },
                  ],
                },
                {
                  type: "COMPONENT",
                  name: "radios",
                  kind: "INPUT_RADIOS",
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
                  type: "COMPONENT",
                  name: "date",
                  kind: "INPUT_DATE",
                  label: "Date",
                },
                {
                  type: "COMPONENT",
                  name: "datetime",
                  kind: "INPUT_DATETIME",
                  label: "Date & Time",
                },
              ],
            },
            {
              type: "GROUP",
              label: "Other Inputs",
              elements: [
                {
                  type: "COMPONENT",
                  name: "tags",
                  kind: "INPUT_TAGS",
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
                      type: "COMPONENT",
                      name: "username",
                      kind: "INPUT_TEXT",
                      label: "Username",
                    },
                    {
                      type: "COMPONENT",
                      name: "password",
                      kind: "INPUT_TEXT",
                      label: "Password",
                      inputType: "password",
                    },
                    {
                      type: "COMPONENT",
                      name: "confirm_password",
                      kind: "INPUT_TEXT",
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
                      type: "COMPONENT",
                      name: "language",
                      kind: "INPUT_SELECT",
                      label: "Preferred Language",
                      options: [
                        { label: "English", value: "en" },
                        { label: "French", value: "fr" },
                        { label: "Spanish", value: "es" },
                      ],
                    },
                    {
                      type: "COMPONENT",
                      name: "notifications",
                      kind: "INPUT_CHECKBOXES",
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
                      type: "COMPONENT",
                      name: "terms",
                      kind: "INPUT_CHECKBOX",
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
                  ],
                },
                {
                  type: "COMPONENT",
                  name: "email",
                  kind: "INPUT_TEXT",
                  label: "Email",
                },
                {
                  type: "COMPONENT",
                  name: "phone",
                  kind: "INPUT_TEXT",
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
                  type: "COMPONENT",
                  name: "street",
                  kind: "INPUT_TEXT",
                  label: "Street",
                },
                {
                  type: "GROUP",
                  direction: "HORIZONTAL",
                  elements: [
                    {
                      type: "COMPONENT",
                      name: "city",
                      kind: "INPUT_TEXT",
                      label: "City",
                    },
                    {
                      type: "COMPONENT",
                      name: "state",
                      kind: "INPUT_TEXT",
                      label: "State",
                    },
                    {
                      type: "COMPONENT",
                      name: "zip",
                      kind: "INPUT_TEXT",
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
                  type: "COMPONENT",
                  name: "display_name",
                  kind: "INPUT_TEXT",
                  label: "Display Name",
                  helperText: "This is how your name will appear to others",
                },
                {
                  type: "COMPONENT",
                  name: "bio",
                  kind: "INPUT_TEXTAREA",
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
                  type: "COMPONENT",
                  name: "timezone",
                  kind: "INPUT_SELECT",
                  label: "Timezone",
                  options: [
                    { label: "UTC", value: "utc" },
                    { label: "Eastern Time", value: "est" },
                    { label: "Pacific Time", value: "pst" },
                    { label: "Central European", value: "cet" },
                  ],
                },
                {
                  type: "COMPONENT",
                  name: "language",
                  kind: "INPUT_SELECT",
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
                  type: "COMPONENT",
                  name: "email_notifications",
                  kind: "INPUT_CHECKBOX",
                  label: "Email notifications",
                  helperText: "Receive notifications via email",
                },
                {
                  type: "COMPONENT",
                  name: "push_notifications",
                  kind: "INPUT_CHECKBOX",
                  label: "Push notifications",
                  helperText: "Receive browser push notifications",
                },
                {
                  type: "COMPONENT",
                  name: "newsletter",
                  kind: "INPUT_CHECKBOX",
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
