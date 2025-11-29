import type { Meta, StoryObj } from "@storybook/react-vite";
import { STEP } from "@ui/adapters/layouts";
import { INPUT_TEXT } from "@ui/adapters/inputs";

const meta: Meta<typeof STEP> = {
  title: "Layouts/Step",
  component: STEP,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof STEP>;

export const Default: Story = {
  args: {
    schema: { type: "STEP" },
    label: "Step Title",
    active: true,
    children: <p className="text-muted-foreground">Step content goes here</p>,
  },
};

export const WithSubtitle: Story = {
  args: {
    schema: {
      type: "STEP",
      subtitle: "Please fill in all the required fields",
    },
    label: "Personal Information",
    active: true,
    children: (
      <div className="space-y-4">
        <INPUT_TEXT name="first_name" label="First Name" />
        <INPUT_TEXT name="last_name" label="Last Name" />
      </div>
    ),
  },
};

export const Inactive: Story = {
  args: {
    schema: { type: "STEP" },
    label: "Hidden Step",
    active: false,
    children: <p>This content is hidden when inactive</p>,
  },
};

export const WithFormContent: Story = {
  args: {
    schema: {
      type: "STEP",
      subtitle: "Enter your contact details",
    },
    label: "Contact Details",
    active: true,
    children: (
      <div className="space-y-4">
        <INPUT_TEXT name="email" label="Email Address" />
        <INPUT_TEXT name="phone" label="Phone Number" />
        <INPUT_TEXT name="address" label="Address" />
      </div>
    ),
  },
};

export const WithCustomClassName: Story = {
  args: {
    schema: {
      type: "STEP",
      className: "bg-slate-50 p-4 rounded-lg",
    },
    label: "Styled Step",
    active: true,
    children: (
      <p className="text-muted-foreground">
        This step has custom styling applied
      </p>
    ),
  },
};
