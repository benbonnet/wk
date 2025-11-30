import type { Meta, StoryObj } from "@storybook/react-vite";
import { withForm } from "@storybook-decorators";
import { Multistep, Step, Alert, FormikAdapter } from "@ui/adapters";

const meta: Meta<typeof Multistep> = {
  title: "Layouts/Multistep",
  component: Multistep,
  tags: ["autodocs"],
  decorators: [withForm],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Multistep>;

export const Default: Story = {
  render: () => (
    <Multistep>
      <Step label="Step 1" active>
        <p>Content for step 1</p>
      </Step>
      <Step label="Step 2">
        <p>Content for step 2</p>
      </Step>
      <Step label="Step 3">
        <p>Content for step 3</p>
      </Step>
    </Multistep>
  ),
};

export const RegistrationForm: Story = {
  render: () => (
    <Multistep>
      <Step
        subtitle="Enter your personal details"
        label="Personal"
        active
      >
        <div className="space-y-4">
          <FormikAdapter type="INPUT_TEXT" name="first_name" label="First Name" />
          <FormikAdapter type="INPUT_TEXT" name="last_name" label="Last Name" />
          <FormikAdapter type="INPUT_TEXT" name="email" label="Email Address" />
        </div>
      </Step>
      <Step
        subtitle="Create your account credentials"
        label="Account"
      >
        <div className="space-y-4">
          <FormikAdapter type="INPUT_TEXT" name="username" label="Username" />
          <FormikAdapter type="INPUT_TEXT" name="password" label="Password" />
          <FormikAdapter type="INPUT_TEXT" name="confirm_password" label="Confirm Password" />
        </div>
      </Step>
      <Step
        subtitle="Set your preferences"
        label="Preferences"
      >
        <div className="space-y-4">
          <FormikAdapter
            type="INPUT_SELECT"
            name="language"
            label="Preferred Language"
            options={[
              { value: "en", label: "English" },
              { value: "fr", label: "French" },
              { value: "es", label: "Spanish" },
            ]}
          />
          <FormikAdapter type="INPUT_CHECKBOX" name="newsletter" label="Subscribe to newsletter" />
          <FormikAdapter
            type="INPUT_CHECKBOX"
            name="notifications"
            label="Enable email notifications"
          />
        </div>
      </Step>
      <Step
        subtitle="Review and confirm your information"
        label="Review"
      >
        <div className="space-y-4">
          <Alert
            label="Please review your information before submitting."
            color="blue"
          />
          <p className="text-sm text-muted-foreground">
            By clicking Submit, you agree to our Terms of Service and Privacy
            Policy.
          </p>
        </div>
      </Step>
    </Multistep>
  ),
};

export const TwoSteps: Story = {
  render: () => (
    <Multistep>
      <Step label="Details" active>
        <div className="space-y-4">
          <FormikAdapter type="INPUT_TEXT" name="name" label="Name" />
          <FormikAdapter type="INPUT_TEXT" name="email" label="Email" />
        </div>
      </Step>
      <Step label="Confirm">
        <Alert
          label="Click Submit to complete the process."
          color="green"
        />
      </Step>
    </Multistep>
  ),
};

export const OnboardingWizard: Story = {
  render: () => (
    <Multistep>
      <Step
        subtitle="Tell us about yourself"
        label="Welcome"
        active
      >
        <div className="space-y-4 text-center py-4">
          <h3 className="text-lg font-medium">Welcome to Our Platform!</h3>
          <p className="text-muted-foreground">
            Let's get you set up in just a few steps.
          </p>
        </div>
      </Step>
      <Step
        subtitle="Set up your profile"
        label="Profile"
      >
        <div className="space-y-4">
          <FormikAdapter type="INPUT_TEXT" name="display_name" label="Display Name" />
          <FormikAdapter type="INPUT_TEXT" name="company" label="Company" />
          <FormikAdapter
            type="INPUT_SELECT"
            name="role"
            label="Your Role"
            options={[
              { value: "developer", label: "Developer" },
              { value: "designer", label: "Designer" },
              { value: "manager", label: "Manager" },
              { value: "other", label: "Other" },
            ]}
          />
        </div>
      </Step>
      <Step
        subtitle="Choose your settings"
        label="Settings"
      >
        <div className="space-y-4">
          <FormikAdapter
            type="INPUT_SELECT"
            name="theme"
            label="Theme"
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "system", label: "System" },
            ]}
          />
          <FormikAdapter type="INPUT_CHECKBOX" name="analytics" label="Allow anonymous analytics" />
        </div>
      </Step>
      <Step
        subtitle="You're all set!"
        label="Complete"
      >
        <div className="text-center py-4">
          <Alert
            label="Setup complete! You're ready to start using the platform."
            color="green"
          />
        </div>
      </Step>
    </Multistep>
  ),
};
