import type { Meta, StoryObj } from "@storybook/react-vite";
import { PAGE, CARD_GROUP, GROUP, SHOW } from "@ui/adapters/layouts";
import {
  DISPLAY_TEXT,
  DISPLAY_LONGTEXT,
  DISPLAY_NUMBER,
  DISPLAY_DATE,
  DISPLAY_DATETIME,
  DISPLAY_BADGE,
  DISPLAY_TAGS,
  DISPLAY_BOOLEAN,
  DISPLAY_SELECT,
} from "@ui/adapters/displays";

const meta: Meta = {
  title: "Compositions/Display Patterns",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const AllDisplayTypes: Story = {
  render: () => (
    <div className="min-h-screen bg-slate-50 p-6">
      <PAGE
        schema={{ type: "PAGE" }}
        title="Display Components"
        description="All available display field types"
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <CARD_GROUP schema={{ type: "CARD_GROUP" }} label="Text Displays">
            <DISPLAY_TEXT name="text" label="Text" value="Hello World" />
            <DISPLAY_LONGTEXT
              name="longtext"
              label="Long Text"
              value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            />
            <DISPLAY_NUMBER name="number" label="Number" value={1234567} />
          </CARD_GROUP>

          <CARD_GROUP schema={{ type: "CARD_GROUP" }} label="Date & Time">
            <DISPLAY_DATE name="date" label="Date" value="2025-01-15" />
            <DISPLAY_DATETIME
              name="datetime"
              label="Date & Time"
              value="2025-01-15T14:30:00Z"
            />
          </CARD_GROUP>

          <CARD_GROUP schema={{ type: "CARD_GROUP" }} label="Status & Tags">
            <DISPLAY_BADGE name="status" label="Status" value="active" />
            <DISPLAY_TAGS
              name="tags"
              label="Tags"
              value={["React", "TypeScript", "Tailwind"]}
            />
            <DISPLAY_BOOLEAN name="verified" label="Email Verified" value={true} />
            <DISPLAY_SELECT
              name="country"
              label="Country"
              value="us"
              options={[
                { value: "us", label: "United States" },
                { value: "uk", label: "United Kingdom" },
                { value: "ca", label: "Canada" },
              ]}
            />
          </CARD_GROUP>
        </div>
      </PAGE>
    </div>
  ),
};

export const UserProfile: Story = {
  render: () => (
    <div className="min-h-screen bg-slate-50 p-6">
      <PAGE
        schema={{ type: "PAGE" }}
        title="User Profile"
        description="View user information"
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <CARD_GROUP
            schema={{ type: "CARD_GROUP" }}
            label="Personal Information"
          >
            <div className="grid grid-cols-2 gap-4">
              <DISPLAY_TEXT name="first_name" label="First Name" value="John" />
              <DISPLAY_TEXT name="last_name" label="Last Name" value="Doe" />
            </div>
            <DISPLAY_TEXT
              name="email"
              label="Email Address"
              value="john.doe@example.com"
            />
            <DISPLAY_TEXT name="phone" label="Phone" value="+1 (555) 123-4567" />
          </CARD_GROUP>

          <CARD_GROUP schema={{ type: "CARD_GROUP" }} label="Account Details">
            <div className="grid grid-cols-2 gap-4">
              <DISPLAY_BADGE name="status" label="Account Status" value="active" />
              <DISPLAY_BOOLEAN
                name="verified"
                label="Email Verified"
                value={true}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DISPLAY_DATE
                name="created_at"
                label="Member Since"
                value="2023-06-15"
              />
              <DISPLAY_DATETIME
                name="last_login"
                label="Last Login"
                value="2025-01-14T09:30:00Z"
              />
            </div>
          </CARD_GROUP>

          <CARD_GROUP schema={{ type: "CARD_GROUP" }} label="Skills & Expertise">
            <DISPLAY_TAGS
              name="skills"
              label="Skills"
              value={[
                "JavaScript",
                "React",
                "Node.js",
                "TypeScript",
                "PostgreSQL",
              ]}
            />
            <DISPLAY_SELECT
              name="experience_level"
              label="Experience Level"
              value="senior"
              options={[
                { value: "junior", label: "Junior (0-2 years)" },
                { value: "mid", label: "Mid-Level (2-5 years)" },
                { value: "senior", label: "Senior (5+ years)" },
              ]}
            />
          </CARD_GROUP>

          <CARD_GROUP schema={{ type: "CARD_GROUP" }} label="About">
            <DISPLAY_LONGTEXT
              name="bio"
              label="Biography"
              value="Senior software engineer with over 10 years of experience building web applications. Passionate about clean code, user experience, and continuous learning. Currently focused on React and TypeScript development with a strong background in full-stack development."
            />
          </CARD_GROUP>
        </div>
      </PAGE>
    </div>
  ),
};

export const OrderDetails: Story = {
  render: () => (
    <div className="min-h-screen bg-slate-50 p-6">
      <PAGE
        schema={{ type: "PAGE" }}
        title="Order #12345"
        description="Order details and status"
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <CARD_GROUP schema={{ type: "CARD_GROUP" }} label="Order Information">
            <div className="grid grid-cols-2 gap-4">
              <DISPLAY_TEXT name="order_id" label="Order ID" value="#12345" />
              <DISPLAY_BADGE name="status" label="Status" value="processing" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DISPLAY_DATETIME
                name="order_date"
                label="Order Date"
                value="2025-01-10T14:22:00Z"
              />
              <DISPLAY_DATE
                name="delivery_date"
                label="Expected Delivery"
                value="2025-01-17"
              />
            </div>
          </CARD_GROUP>

          <CARD_GROUP schema={{ type: "CARD_GROUP" }} label="Customer">
            <DISPLAY_TEXT
              name="customer_name"
              label="Name"
              value="Jane Smith"
            />
            <DISPLAY_TEXT
              name="customer_email"
              label="Email"
              value="jane.smith@email.com"
            />
            <DISPLAY_LONGTEXT
              name="shipping_address"
              label="Shipping Address"
              value="456 Oak Avenue, Apt 7B\nNew York, NY 10001\nUnited States"
            />
          </CARD_GROUP>

          <CARD_GROUP schema={{ type: "CARD_GROUP" }} label="Payment">
            <div className="grid grid-cols-2 gap-4">
              <DISPLAY_NUMBER name="subtotal" label="Subtotal" value={149.99} />
              <DISPLAY_NUMBER name="shipping" label="Shipping" value={9.99} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DISPLAY_NUMBER name="tax" label="Tax" value={12.8} />
              <DISPLAY_NUMBER name="total" label="Total" value={172.78} />
            </div>
            <DISPLAY_BADGE
              name="payment_status"
              label="Payment Status"
              value="completed"
            />
          </CARD_GROUP>
        </div>
      </PAGE>
    </div>
  ),
};

export const ProductCard: Story = {
  render: () => (
    <div className="p-6 max-w-md">
      <CARD_GROUP schema={{ type: "CARD_GROUP" }} label="MacBook Pro 16">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <DISPLAY_BADGE name="availability" value="active" />
            <DISPLAY_NUMBER name="price" label="Price" value={2499} />
          </div>
          <DISPLAY_LONGTEXT
            name="description"
            label="Description"
            value="The most powerful MacBook Pro ever is here. With the blazing-fast M3 Pro or M3 Max chip, up to 22 hours of battery life, and a stunning Liquid Retina XDR display."
          />
          <DISPLAY_TAGS
            name="features"
            label="Key Features"
            value={["M3 Pro", "22hr Battery", "Liquid Retina XDR", "120Hz"]}
          />
          <DISPLAY_SELECT
            name="category"
            label="Category"
            value="laptops"
            options={[
              { value: "laptops", label: "Laptops" },
              { value: "desktops", label: "Desktops" },
              { value: "tablets", label: "Tablets" },
            ]}
          />
        </div>
      </CARD_GROUP>
    </div>
  ),
};
