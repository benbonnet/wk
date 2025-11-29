import type { Meta, StoryObj } from "@storybook/react-vite";
import { withForm } from "@storybook-decorators";
import { Step, TextInput } from "@ui/adapters";

const meta: Meta<typeof Step> = {
  title: "Layouts/Step",
  component: Step,
  tags: ["autodocs"],
  decorators: [withForm],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Step>;

export const Default: Story = {
  args: {
    label: "Step Title",
    active: true,
    children: <p className="text-muted-foreground">Step content goes here</p>,
  },
};

export const WithSubtitle: Story = {
  args: {
    label: "Personal Information",
    subtitle: "Please fill in all the required fields",
    active: true,
    children: (
      <div className="space-y-4">
        <TextInput name="first_name" label="First Name" />
        <TextInput name="last_name" label="Last Name" />
      </div>
    ),
  },
};

export const Inactive: Story = {
  args: {
    label: "Hidden Step",
    active: false,
    children: <p>This content is hidden when inactive</p>,
  },
};

export const WithFormContent: Story = {
  args: {
    label: "Contact Details",
    subtitle: "Enter your contact details",
    active: true,
    children: (
      <div className="space-y-4">
        <TextInput name="email" label="Email Address" />
        <TextInput name="phone" label="Phone Number" />
        <TextInput name="address" label="Address" />
      </div>
    ),
  },
};

export const WithCustomClassName: Story = {
  args: {
    label: "Styled Step",
    className: "bg-slate-50 p-4 rounded-lg",
    active: true,
    children: (
      <p className="text-muted-foreground">
        This step has custom styling applied
      </p>
    ),
  },
};
