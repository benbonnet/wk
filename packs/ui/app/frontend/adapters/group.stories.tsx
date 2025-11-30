import type { Meta, StoryObj } from "@storybook/react-vite";
import { withForm } from "@storybook-decorators";
import { Group, FormikAdapter } from "@ui/adapters";

const meta: Meta<typeof Group> = {
  title: "Layouts/Group",
  component: Group,
  tags: ["autodocs"],
  decorators: [withForm],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Group>;

export const Default: Story = {
  args: {
    children: (
      <>
        <FormikAdapter type="INPUT_TEXT" name="first_name" label="First Name" />
        <FormikAdapter type="INPUT_TEXT" name="last_name" label="Last Name" />
      </>
    ),
  },
};

export const WithLabel: Story = {
  args: {
    label: "Personal Information",
    children: (
      <>
        <FormikAdapter type="INPUT_TEXT" name="first_name" label="First Name" />
        <FormikAdapter type="INPUT_TEXT" name="last_name" label="Last Name" />
        <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
      </>
    ),
  },
};

export const WithSubtitle: Story = {
  args: {
    label: "Personal Information",
    subtitle: "Please provide your personal details",
    children: (
      <>
        <FormikAdapter type="INPUT_TEXT" name="first_name" label="First Name" />
        <FormikAdapter type="INPUT_TEXT" name="last_name" label="Last Name" />
      </>
    ),
  },
};

export const Horizontal: Story = {
  args: {
    label: "Name",
    direction: "HORIZONTAL",
    children: (
      <>
        <FormikAdapter type="INPUT_TEXT" name="first_name" label="First Name" />
        <FormikAdapter type="INPUT_TEXT" name="last_name" label="Last Name" />
      </>
    ),
  },
};

export const WithCustomClassName: Story = {
  args: {
    label: "Contact Details",
    className: "bg-slate-50 p-4 rounded-lg",
    children: (
      <>
        <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
        <FormikAdapter type="INPUT_TEXT" name="phone" label="Phone" />
      </>
    ),
  },
};

export const NestedGroups: Story = {
  render: () => (
    <Group label="Profile">
      <Group label="Personal">
        <FormikAdapter type="INPUT_TEXT" name="name" label="Full Name" />
        <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
      </Group>
      <Group label="Preferences">
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
      </Group>
    </Group>
  ),
};
