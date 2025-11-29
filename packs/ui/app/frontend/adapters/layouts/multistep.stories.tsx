import type { Meta, StoryObj } from "@storybook/react-vite";
import { MULTISTEP, STEP, ALERT } from "@ui/adapters/layouts";
import { INPUT_TEXT, INPUT_SELECT, INPUT_CHECKBOX } from "@ui/adapters/inputs";

const meta: Meta<typeof MULTISTEP> = {
  title: "Layouts/Multistep",
  component: MULTISTEP,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof MULTISTEP>;

export const Default: Story = {
  render: () => (
    <MULTISTEP schema={{ type: "MULTISTEP" }}>
      <STEP schema={{ type: "STEP" }} label="Step 1" active>
        <p>Content for step 1</p>
      </STEP>
      <STEP schema={{ type: "STEP" }} label="Step 2">
        <p>Content for step 2</p>
      </STEP>
      <STEP schema={{ type: "STEP" }} label="Step 3">
        <p>Content for step 3</p>
      </STEP>
    </MULTISTEP>
  ),
};

export const RegistrationForm: Story = {
  render: () => (
    <MULTISTEP schema={{ type: "MULTISTEP" }}>
      <STEP
        schema={{ type: "STEP", subtitle: "Enter your personal details" }}
        label="Personal"
        active
      >
        <div className="space-y-4">
          <INPUT_TEXT name="first_name" label="First Name" />
          <INPUT_TEXT name="last_name" label="Last Name" />
          <INPUT_TEXT name="email" label="Email Address" />
        </div>
      </STEP>
      <STEP
        schema={{ type: "STEP", subtitle: "Create your account credentials" }}
        label="Account"
      >
        <div className="space-y-4">
          <INPUT_TEXT name="username" label="Username" />
          <INPUT_TEXT name="password" label="Password" />
          <INPUT_TEXT name="confirm_password" label="Confirm Password" />
        </div>
      </STEP>
      <STEP
        schema={{ type: "STEP", subtitle: "Set your preferences" }}
        label="Preferences"
      >
        <div className="space-y-4">
          <INPUT_SELECT
            name="language"
            label="Preferred Language"
            options={[
              { value: "en", label: "English" },
              { value: "fr", label: "French" },
              { value: "es", label: "Spanish" },
            ]}
          />
          <INPUT_CHECKBOX name="newsletter" label="Subscribe to newsletter" />
          <INPUT_CHECKBOX name="notifications" label="Enable email notifications" />
        </div>
      </STEP>
      <STEP
        schema={{ type: "STEP", subtitle: "Review and confirm your information" }}
        label="Review"
      >
        <div className="space-y-4">
          <ALERT
            schema={{ type: "ALERT" }}
            label="Please review your information before submitting."
            color="blue"
          />
          <p className="text-sm text-muted-foreground">
            By clicking Submit, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </STEP>
    </MULTISTEP>
  ),
};

export const TwoSteps: Story = {
  render: () => (
    <MULTISTEP schema={{ type: "MULTISTEP" }}>
      <STEP schema={{ type: "STEP" }} label="Details" active>
        <div className="space-y-4">
          <INPUT_TEXT name="name" label="Name" />
          <INPUT_TEXT name="email" label="Email" />
        </div>
      </STEP>
      <STEP schema={{ type: "STEP" }} label="Confirm">
        <ALERT
          schema={{ type: "ALERT" }}
          label="Click Submit to complete the process."
          color="green"
        />
      </STEP>
    </MULTISTEP>
  ),
};

export const OnboardingWizard: Story = {
  render: () => (
    <MULTISTEP schema={{ type: "MULTISTEP" }}>
      <STEP
        schema={{ type: "STEP", subtitle: "Tell us about yourself" }}
        label="Welcome"
        active
      >
        <div className="space-y-4 text-center py-4">
          <h3 className="text-lg font-medium">Welcome to Our Platform!</h3>
          <p className="text-muted-foreground">
            Let's get you set up in just a few steps.
          </p>
        </div>
      </STEP>
      <STEP
        schema={{ type: "STEP", subtitle: "Set up your profile" }}
        label="Profile"
      >
        <div className="space-y-4">
          <INPUT_TEXT name="display_name" label="Display Name" />
          <INPUT_TEXT name="company" label="Company" />
          <INPUT_SELECT
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
      </STEP>
      <STEP
        schema={{ type: "STEP", subtitle: "Choose your settings" }}
        label="Settings"
      >
        <div className="space-y-4">
          <INPUT_SELECT
            name="theme"
            label="Theme"
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "system", label: "System" },
            ]}
          />
          <INPUT_CHECKBOX name="analytics" label="Allow anonymous analytics" />
        </div>
      </STEP>
      <STEP
        schema={{ type: "STEP", subtitle: "You're all set!" }}
        label="Complete"
      >
        <div className="text-center py-4">
          <ALERT
            schema={{ type: "ALERT" }}
            label="Setup complete! You're ready to start using the platform."
            color="green"
          />
        </div>
      </STEP>
    </MULTISTEP>
  ),
};
