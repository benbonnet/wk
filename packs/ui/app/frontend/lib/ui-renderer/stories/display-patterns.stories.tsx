import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Page,
  CardGroup,
  TextDisplay,
  LongtextDisplay,
  NumberDisplay,
  DateDisplay,
  DatetimeDisplay,
  BadgeDisplay,
  TagsDisplay,
  BooleanDisplay,
  SelectDisplay,
} from "@ui/adapters";

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
            <TextDisplay name="text" label="Text" data={{ text: "Hello World" }} />
            <LongtextDisplay
              name="longtext"
              label="Long Text"
              data={{ longtext: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." }}
            />
            <NumberDisplay name="number" label="Number" data={{ number: 1234567 }} />
          </CardGroup>

          <CardGroup label="Date & Time">
            <DateDisplay name="date" label="Date" data={{ date: "2025-01-15" }} />
            <DatetimeDisplay
              name="datetime"
              label="Date & Time"
              data={{ datetime: "2025-01-15T14:30:00Z" }}
            />
          </CardGroup>

          <CardGroup label="Status & Tags">
            <BadgeDisplay name="status" label="Status" data={{ status: "active" }} />
            <TagsDisplay
              name="tags"
              label="Tags"
              data={{ tags: ["React", "TypeScript", "Tailwind"] }}
            />
            <BooleanDisplay name="verified" label="Email Verified" data={{ verified: true }} />
            <SelectDisplay
              name="country"
              label="Country"
              data={{ country: "us" }}
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
              <TextDisplay name="first_name" label="First Name" data={{ first_name: "John" }} />
              <TextDisplay name="last_name" label="Last Name" data={{ last_name: "Doe" }} />
            </div>
            <TextDisplay
              name="email"
              label="Email Address"
              data={{ email: "john.doe@example.com" }}
            />
            <TextDisplay name="phone" label="Phone" data={{ phone: "+1 (555) 123-4567" }} />
          </CardGroup>

          <CardGroup label="Account Details">
            <div className="grid grid-cols-2 gap-4">
              <BadgeDisplay name="status" label="Account Status" data={{ status: "active" }} />
              <BooleanDisplay
                name="verified"
                label="Email Verified"
                data={{ verified: true }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DateDisplay
                name="created_at"
                label="Member Since"
                data={{ created_at: "2023-06-15" }}
              />
              <DatetimeDisplay
                name="last_login"
                label="Last Login"
                data={{ last_login: "2025-01-14T09:30:00Z" }}
              />
            </div>
          </CardGroup>

          <CardGroup label="Skills & Expertise">
            <TagsDisplay
              name="skills"
              label="Skills"
              data={{ skills: [
                "JavaScript",
                "React",
                "Node.js",
                "TypeScript",
                "PostgreSQL",
              ] }}
            />
            <SelectDisplay
              name="experience_level"
              label="Experience Level"
              data={{ experience_level: "senior" }}
              options={[
                { value: "junior", label: "Junior (0-2 years)" },
                { value: "mid", label: "Mid-Level (2-5 years)" },
                { value: "senior", label: "Senior (5+ years)" },
              ]}
            />
          </CardGroup>

          <CardGroup label="About">
            <LongtextDisplay
              name="bio"
              label="Biography"
              data={{ bio: "Senior software engineer with over 10 years of experience building web applications. Passionate about clean code, user experience, and continuous learning. Currently focused on React and TypeScript development with a strong background in full-stack development." }}
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
              <TextDisplay name="order_id" label="Order ID" data={{ order_id: "#12345" }} />
              <BadgeDisplay name="status" label="Status" data={{ status: "processing" }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DatetimeDisplay
                name="order_date"
                label="Order Date"
                data={{ order_date: "2025-01-10T14:22:00Z" }}
              />
              <DateDisplay
                name="delivery_date"
                label="Expected Delivery"
                data={{ delivery_date: "2025-01-17" }}
              />
            </div>
          </CardGroup>

          <CardGroup label="Customer">
            <TextDisplay
              name="customer_name"
              label="Name"
              data={{ customer_name: "Jane Smith" }}
            />
            <TextDisplay
              name="customer_email"
              label="Email"
              data={{ customer_email: "jane.smith@email.com" }}
            />
            <LongtextDisplay
              name="shipping_address"
              label="Shipping Address"
              data={{ shipping_address: "456 Oak Avenue, Apt 7B\nNew York, NY 10001\nUnited States" }}
            />
          </CardGroup>

          <CardGroup label="Payment">
            <div className="grid grid-cols-2 gap-4">
              <NumberDisplay name="subtotal" label="Subtotal" data={{ subtotal: 149.99 }} />
              <NumberDisplay name="shipping" label="Shipping" data={{ shipping: 9.99 }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <NumberDisplay name="tax" label="Tax" data={{ tax: 12.8 }} />
              <NumberDisplay name="total" label="Total" data={{ total: 172.78 }} />
            </div>
            <BadgeDisplay
              name="payment_status"
              label="Payment Status"
              data={{ payment_status: "completed" }}
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
            <BadgeDisplay name="availability" data={{ availability: "active" }} />
            <NumberDisplay name="price" label="Price" data={{ price: 2499 }} />
          </div>
          <LongtextDisplay
            name="description"
            label="Description"
            data={{ description: "The most powerful MacBook Pro ever is here. With the blazing-fast M3 Pro or M3 Max chip, up to 22 hours of battery life, and a stunning Liquid Retina XDR display." }}
          />
          <TagsDisplay
            name="features"
            label="Key Features"
            data={{ features: ["M3 Pro", "22hr Battery", "Liquid Retina XDR", "120Hz"] }}
          />
          <SelectDisplay
            name="category"
            label="Category"
            data={{ category: "laptops" }}
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
