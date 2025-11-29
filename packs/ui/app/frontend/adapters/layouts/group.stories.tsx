import type { Meta, StoryObj } from "@storybook/react-vite";
import { GROUP } from "@ui/adapters/layouts";
import { INPUT_TEXT, INPUT_SELECT } from "@ui/adapters/inputs";

const meta: Meta<typeof GROUP> = {
  title: "Layouts/Group",
  component: GROUP,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof GROUP>;

export const Default: Story = {
  args: {
    schema: { type: "GROUP" },
    children: (
      <>
        <INPUT_TEXT name="first_name" label="First Name" />
        <INPUT_TEXT name="last_name" label="Last Name" />
      </>
    ),
  },
};

export const WithLabel: Story = {
  args: {
    schema: { type: "GROUP" },
    label: "Personal Information",
    children: (
      <>
        <INPUT_TEXT name="first_name" label="First Name" />
        <INPUT_TEXT name="last_name" label="Last Name" />
        <INPUT_TEXT name="email" label="Email" />
      </>
    ),
  },
};

export const WithSubtitle: Story = {
  args: {
    schema: {
      type: "GROUP",
      subtitle: "Please provide your personal details",
    },
    label: "Personal Information",
    children: (
      <>
        <INPUT_TEXT name="first_name" label="First Name" />
        <INPUT_TEXT name="last_name" label="Last Name" />
      </>
    ),
  },
};

export const Horizontal: Story = {
  args: {
    schema: {
      type: "GROUP",
      direction: "HORIZONTAL",
    },
    label: "Name",
    children: (
      <>
        <INPUT_TEXT name="first_name" label="First Name" />
        <INPUT_TEXT name="last_name" label="Last Name" />
      </>
    ),
  },
};

export const WithCustomClassName: Story = {
  args: {
    schema: {
      type: "GROUP",
      className: "bg-slate-50 p-4 rounded-lg",
    },
    label: "Contact Details",
    children: (
      <>
        <INPUT_TEXT name="email" label="Email" />
        <INPUT_TEXT name="phone" label="Phone" />
      </>
    ),
  },
};

export const NestedGroups: Story = {
  render: () => (
    <GROUP schema={{ type: "GROUP" }} label="Profile">
      <GROUP schema={{ type: "GROUP" }} label="Personal">
        <INPUT_TEXT name="name" label="Full Name" />
        <INPUT_TEXT name="email" label="Email" />
      </GROUP>
      <GROUP schema={{ type: "GROUP" }} label="Preferences">
        <INPUT_SELECT
          name="language"
          label="Language"
          options={[
            { value: "en", label: "English" },
            { value: "fr", label: "French" },
            { value: "es", label: "Spanish" },
          ]}
        />
      </GROUP>
    </GROUP>
  ),
};
