import type { Meta, StoryObj } from "@storybook/react-vite";
import { Page, CardGroup, DisplayAdapter } from "@ui/adapters";

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
      <Page
        title="Display Components"
        description="All available display field types"
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <CardGroup label="Text Displays">
            <DisplayAdapter type="DISPLAY_TEXT" name="text" label="Text" value="Hello World" />
            <DisplayAdapter
              type="DISPLAY_LONGTEXT"
              name="longtext"
              label="Long Text"
              value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            />
            <DisplayAdapter type="DISPLAY_NUMBER" name="number" label="Number" value={1234567} />
          </CardGroup>

          <CardGroup label="Date & Time">
            <DisplayAdapter type="DISPLAY_DATE" name="date" label="Date" value="2025-01-15" />
            <DisplayAdapter
              type="DISPLAY_DATETIME"
              name="datetime"
              label="Date & Time"
              value="2025-01-15T14:30:00Z"
            />
          </CardGroup>

          <CardGroup label="Status & Tags">
            <DisplayAdapter type="DISPLAY_BADGE" name="status" label="Status" value="active" />
            <DisplayAdapter
              type="DISPLAY_TAGS"
              name="tags"
              label="Tags"
              value={["React", "TypeScript", "Tailwind"]}
            />
            <DisplayAdapter type="DISPLAY_BOOLEAN" name="verified" label="Email Verified" value={true} />
            <DisplayAdapter
              type="DISPLAY_SELECT"
              name="country"
              label="Country"
              value="us"
              options={[
                { value: "us", label: "United States" },
                { value: "uk", label: "United Kingdom" },
                { value: "ca", label: "Canada" },
              ]}
            />
          </CardGroup>
        </div>
      </Page>
    </div>
  ),
};

export const UserProfile: Story = {
  render: () => (
    <div className="min-h-screen bg-slate-50 p-6">
      <Page
        title="User Profile"
        description="View user information"
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <CardGroup label="Personal Information">
            <div className="grid grid-cols-2 gap-4">
              <DisplayAdapter type="DISPLAY_TEXT" name="first_name" label="First Name" value="John" />
              <DisplayAdapter type="DISPLAY_TEXT" name="last_name" label="Last Name" value="Doe" />
            </div>
            <DisplayAdapter
              type="DISPLAY_TEXT"
              name="email"
              label="Email Address"
              value="john.doe@example.com"
            />
            <DisplayAdapter type="DISPLAY_TEXT" name="phone" label="Phone" value="+1 (555) 123-4567" />
          </CardGroup>

          <CardGroup label="Account Details">
            <div className="grid grid-cols-2 gap-4">
              <DisplayAdapter type="DISPLAY_BADGE" name="status" label="Account Status" value="active" />
              <DisplayAdapter
                type="DISPLAY_BOOLEAN"
                name="verified"
                label="Email Verified"
                value={true}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DisplayAdapter
                type="DISPLAY_DATE"
                name="created_at"
                label="Member Since"
                value="2023-06-15"
              />
              <DisplayAdapter
                type="DISPLAY_DATETIME"
                name="last_login"
                label="Last Login"
                value="2025-01-14T09:30:00Z"
              />
            </div>
          </CardGroup>

          <CardGroup label="Skills & Expertise">
            <DisplayAdapter
              type="DISPLAY_TAGS"
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
            <DisplayAdapter
              type="DISPLAY_SELECT"
              name="experience_level"
              label="Experience Level"
              value="senior"
              options={[
                { value: "junior", label: "Junior (0-2 years)" },
                { value: "mid", label: "Mid-Level (2-5 years)" },
                { value: "senior", label: "Senior (5+ years)" },
              ]}
            />
          </CardGroup>

          <CardGroup label="About">
            <DisplayAdapter
              type="DISPLAY_LONGTEXT"
              name="bio"
              label="Biography"
              value="Senior software engineer with over 10 years of experience building web applications. Passionate about clean code, user experience, and continuous learning. Currently focused on React and TypeScript development with a strong background in full-stack development."
            />
          </CardGroup>
        </div>
      </Page>
    </div>
  ),
};

export const OrderDetails: Story = {
  render: () => (
    <div className="min-h-screen bg-slate-50 p-6">
      <Page
        title="Order #12345"
        description="Order details and status"
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <CardGroup label="Order Information">
            <div className="grid grid-cols-2 gap-4">
              <DisplayAdapter type="DISPLAY_TEXT" name="order_id" label="Order ID" value="#12345" />
              <DisplayAdapter type="DISPLAY_BADGE" name="status" label="Status" value="processing" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DisplayAdapter
                type="DISPLAY_DATETIME"
                name="order_date"
                label="Order Date"
                value="2025-01-10T14:22:00Z"
              />
              <DisplayAdapter
                type="DISPLAY_DATE"
                name="delivery_date"
                label="Expected Delivery"
                value="2025-01-17"
              />
            </div>
          </CardGroup>

          <CardGroup label="Customer">
            <DisplayAdapter
              type="DISPLAY_TEXT"
              name="customer_name"
              label="Name"
              value="Jane Smith"
            />
            <DisplayAdapter
              type="DISPLAY_TEXT"
              name="customer_email"
              label="Email"
              value="jane.smith@email.com"
            />
            <DisplayAdapter
              type="DISPLAY_LONGTEXT"
              name="shipping_address"
              label="Shipping Address"
              value={"456 Oak Avenue, Apt 7B\nNew York, NY 10001\nUnited States"}
            />
          </CardGroup>

          <CardGroup label="Payment">
            <div className="grid grid-cols-2 gap-4">
              <DisplayAdapter type="DISPLAY_NUMBER" name="subtotal" label="Subtotal" value={149.99} />
              <DisplayAdapter type="DISPLAY_NUMBER" name="shipping" label="Shipping" value={9.99} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DisplayAdapter type="DISPLAY_NUMBER" name="tax" label="Tax" value={12.8} />
              <DisplayAdapter type="DISPLAY_NUMBER" name="total" label="Total" value={172.78} />
            </div>
            <DisplayAdapter
              type="DISPLAY_BADGE"
              name="payment_status"
              label="Payment Status"
              value="completed"
            />
          </CardGroup>
        </div>
      </Page>
    </div>
  ),
};

export const ProductCard: Story = {
  render: () => (
    <div className="p-6 max-w-md">
      <CardGroup label="MacBook Pro 16">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <DisplayAdapter type="DISPLAY_BADGE" name="availability" value="active" />
            <DisplayAdapter type="DISPLAY_NUMBER" name="price" label="Price" value={2499} />
          </div>
          <DisplayAdapter
            type="DISPLAY_LONGTEXT"
            name="description"
            label="Description"
            value="The most powerful MacBook Pro ever is here. With the blazing-fast M3 Pro or M3 Max chip, up to 22 hours of battery life, and a stunning Liquid Retina XDR display."
          />
          <DisplayAdapter
            type="DISPLAY_TAGS"
            name="features"
            label="Key Features"
            value={["M3 Pro", "22hr Battery", "Liquid Retina XDR", "120Hz"]}
          />
          <DisplayAdapter
            type="DISPLAY_SELECT"
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
      </CardGroup>
    </div>
  ),
};
