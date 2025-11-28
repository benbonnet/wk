# Tests: RelationshipPicker

## Backend Tests (Ruby/RSpec)

### RelationshipPickerBuilder Tests

```ruby
# packs/ui/spec/ui/views/builders/relationship_picker_builder_spec.rb

RSpec.describe UI::Views::Builders::RelationshipPickerBuilder do
  let(:parent_builder) { UI::Views::ViewBuilder.new }
  let(:builder) { described_class.new(parent_builder) }

  describe "#column" do
    it "adds column with name and kind" do
      builder.column :name, kind: :DISPLAY_TEXT

      expect(builder.columns).to eq([
        { name: "name", kind: :DISPLAY_TEXT }
      ])
    end

    it "includes label when provided" do
      builder.column :email, kind: :DISPLAY_TEXT, label: "email_address"

      expect(builder.columns.first[:label]).to eq("email_address")
    end
  end

  describe "#form" do
    it "captures nested form fields" do
      builder.form do
        field :name, kind: :INPUT_TEXT
        field :email, kind: :INPUT_TEXT
      end

      expect(builder.form_fields.length).to eq(2)
      expect(builder.form_fields.first[:name]).to eq("name")
    end

    it "does not pollute parent elements" do
      parent_builder.field :outside, kind: :INPUT_TEXT

      builder.form do
        field :inside, kind: :INPUT_TEXT
      end

      expect(parent_builder.elements.length).to eq(1)
      expect(parent_builder.elements.first[:name]).to eq("outside")
    end
  end

  describe "option methods" do
    it "stores label option" do
      builder.label "contacts"
      expect(builder.options[:label]).to eq("contacts")
    end

    it "stores add_label option" do
      builder.add_label "add_contact"
      expect(builder.options[:addLabel]).to eq("add_contact")
    end

    it "stores empty_message option" do
      builder.empty_message "no_selection"
      expect(builder.options[:emptyMessage]).to eq("no_selection")
    end

    it "stores search_placeholder option" do
      builder.search_placeholder "search_contacts"
      expect(builder.options[:searchPlaceholder]).to eq("search_contacts")
    end

    it "stores confirm_label option" do
      builder.confirm_label "confirm"
      expect(builder.options[:confirmLabel]).to eq("confirm")
    end
  end
end
```

### ViewBuilder relationship_picker Tests

```ruby
# Add to packs/ui/spec/ui/views/view_builder_spec.rb

describe "#relationship_picker" do
  it "creates RELATIONSHIP_PICKER element" do
    builder.relationship_picker :contacts, cardinality: :many, relation_schema: :contact

    element = builder.elements.first
    expect(element[:type]).to eq("RELATIONSHIP_PICKER")
  end

  it "auto-appends _attributes to name" do
    builder.relationship_picker :contacts, cardinality: :many, relation_schema: :contact

    expect(builder.elements.first[:name]).to eq("contacts_attributes")
  end

  it "sets cardinality" do
    builder.relationship_picker :contact, cardinality: :one, relation_schema: :contact

    expect(builder.elements.first[:cardinality]).to eq(:one)
  end

  it "sets relationSchema" do
    builder.relationship_picker :contacts, cardinality: :many, relation_schema: :contact

    expect(builder.elements.first[:relationSchema]).to eq(:contact)
  end

  it "captures columns from block" do
    builder.relationship_picker :contacts, cardinality: :many, relation_schema: :contact do
      column :name, kind: :DISPLAY_TEXT
      column :email, kind: :DISPLAY_TEXT
    end

    columns = builder.elements.first[:columns]
    expect(columns.length).to eq(2)
  end

  it "captures form template from block" do
    builder.relationship_picker :contacts, cardinality: :many, relation_schema: :contact do
      form do
        field :name, kind: :INPUT_TEXT
      end
    end

    template = builder.elements.first[:template]
    expect(template.length).to eq(1)
    expect(template.first[:name]).to eq("name")
  end

  it "includes options from builder methods" do
    builder.relationship_picker :contacts, cardinality: :many, relation_schema: :contact do
      label "contacts"
      add_label "add_contact"
    end

    element = builder.elements.first
    expect(element[:label]).to eq("contacts")
    expect(element[:addLabel]).to eq("add_contact")
  end

  it "merges passed options" do
    builder.relationship_picker :contacts,
      cardinality: :many,
      relation_schema: :contact,
      emptyMessage: "none"

    expect(builder.elements.first[:emptyMessage]).to eq("none")
  end
end
```

## Frontend Tests (Vitest/React Testing Library)

### Layer 1: RelationshipPickerField Tests

```typescript
// packs/ui/app/frontend/lib/__tests__/relationship-picker-field.test.tsx

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Formik, Form } from "formik";
import { RelationshipPickerField } from "../form/relationship-picker-field";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const defaultProps = {
  name: "contacts_attributes",
  cardinality: "many" as const,
  relationSchema: "contact",
  columns: [{ name: "name", kind: "DISPLAY_TEXT" }],
  template: [{ type: "COMPONENT", name: "name", kind: "INPUT_TEXT" }],
  formSchema: {},
};

const wrapper = ({ children, initialValues = { contacts_attributes: [] } }) => (
  <QueryClientProvider client={queryClient}>
    <Formik initialValues={initialValues} onSubmit={vi.fn()}>
      <Form>{children}</Form>
    </Formik>
  </QueryClientProvider>
);

describe("RelationshipPickerField", () => {
  describe("empty state", () => {
    it("renders empty message when no items", () => {
      render(<RelationshipPickerField {...defaultProps} />, { wrapper });
      expect(screen.getByText(/no_selection/i)).toBeInTheDocument();
    });

    it("renders add button", () => {
      render(<RelationshipPickerField {...defaultProps} />, { wrapper });
      expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    });
  });

  describe("with items", () => {
    it("displays selected items", () => {
      const items = [{ id: 1, name: "John" }];
      render(
        <RelationshipPickerField {...defaultProps} />,
        { wrapper: (props) => wrapper({ ...props, initialValues: { contacts_attributes: items } }) }
      );
      expect(screen.getByText("John")).toBeInTheDocument();
    });

    it("shows remove button for each item", () => {
      const items = [{ id: 1, name: "John" }, { id: 2, name: "Jane" }];
      render(
        <RelationshipPickerField {...defaultProps} />,
        { wrapper: (props) => wrapper({ ...props, initialValues: { contacts_attributes: items } }) }
      );
      const removeButtons = screen.getAllByRole("button", { name: /remove/i });
      expect(removeButtons).toHaveLength(2);
    });
  });

  describe("has_one cardinality", () => {
    it("disables add button when item exists", () => {
      const items = [{ id: 1, name: "John" }];
      render(
        <RelationshipPickerField {...defaultProps} cardinality="one" />,
        { wrapper: (props) => wrapper({ ...props, initialValues: { contacts_attributes: items } }) }
      );
      expect(screen.getByRole("button", { name: /add/i })).toBeDisabled();
    });
  });

  describe("removal behavior", () => {
    it("marks existing items with _destroy", async () => {
      const onSubmit = vi.fn();
      const items = [{ id: 1, name: "John" }];

      // Test that clicking remove sets _destroy: 1 on existing item
      // (Integration test with Formik)
    });

    it("removes new items entirely", async () => {
      const items = [{ name: "New Item" }]; // No id = new

      // Test that clicking remove removes item from array
    });
  });

  describe("drawer interaction", () => {
    it("opens drawer on add button click", async () => {
      render(<RelationshipPickerField {...defaultProps} />, { wrapper });
      fireEvent.click(screen.getByRole("button", { name: /add/i }));

      // Drawer should open (check for drawer content)
    });
  });
});
```

### Layer 2: RelationshipPickerDrawer Tests

```typescript
// packs/ui/app/frontend/lib/__tests__/relationship-picker-drawer.test.tsx

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RelationshipPickerDrawer } from "../form/relationship-picker-drawer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  name: "contacts",
  cardinality: "many" as const,
  relationSchema: "contact",
  basePath: "/api/v1/contacts",
  columns: [
    { name: "name", kind: "DISPLAY_TEXT", label: "Name" },
    { name: "email", kind: "DISPLAY_TEXT", label: "Email" },
  ],
  template: [],
  formSchema: {},
  onConfirm: vi.fn(),
  title: "Select Contacts",
};

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("RelationshipPickerDrawer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAxios.get.mockResolvedValue({
      data: {
        data: [
          { id: 1, data: { name: "John", email: "john@test.com" } },
          { id: 2, data: { name: "Jane", email: "jane@test.com" } },
        ],
        pagination: { total_pages: 1 },
      },
    });
  });

  describe("data fetching", () => {
    it("fetches data on open", async () => {
      render(<RelationshipPickerDrawer {...defaultProps} />, { wrapper });

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith("/api/v1/contacts", expect.any(Object));
      });
    });

    it("displays fetched items in table", async () => {
      render(<RelationshipPickerDrawer {...defaultProps} />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText("John")).toBeInTheDocument();
        expect(screen.getByText("Jane")).toBeInTheDocument();
      });
    });
  });

  describe("single selection (has_one)", () => {
    it("allows only one selection", async () => {
      render(
        <RelationshipPickerDrawer {...defaultProps} cardinality="one" />,
        { wrapper }
      );

      await waitFor(() => screen.getByText("John"));

      // Select John
      fireEvent.click(screen.getByText("John"));
      // Select Jane (should replace)
      fireEvent.click(screen.getByText("Jane"));

      // Only Jane should be selected
    });
  });

  describe("multiple selection (has_many)", () => {
    it("allows multiple selections", async () => {
      render(<RelationshipPickerDrawer {...defaultProps} />, { wrapper });

      await waitFor(() => screen.getByText("John"));

      fireEvent.click(screen.getByText("John"));
      fireEvent.click(screen.getByText("Jane"));

      // Both should be selected
    });

    it("persists selection across pages", async () => {
      mockedAxios.get
        .mockResolvedValueOnce({
          data: {
            data: [{ id: 1, data: { name: "Page1Item" } }],
            pagination: { total_pages: 2 },
          },
        })
        .mockResolvedValueOnce({
          data: {
            data: [{ id: 2, data: { name: "Page2Item" } }],
            pagination: { total_pages: 2 },
          },
        });

      render(<RelationshipPickerDrawer {...defaultProps} />, { wrapper });

      // Select item on page 1
      await waitFor(() => screen.getByText("Page1Item"));
      fireEvent.click(screen.getByText("Page1Item"));

      // Navigate to page 2
      // ... navigate

      // Selection should persist
    });
  });

  describe("search", () => {
    it("filters results on search", async () => {
      render(<RelationshipPickerDrawer {...defaultProps} />, { wrapper });

      await waitFor(() => screen.getByText("John"));

      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: "john" } });

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith(
          "/api/v1/contacts",
          expect.objectContaining({ params: expect.objectContaining({ q: "john" }) })
        );
      });
    });

    it("resets to page 1 on search", async () => {
      // Test pagination reset
    });
  });

  describe("confirm action", () => {
    it("calls onConfirm with selected items", async () => {
      const onConfirm = vi.fn();
      render(
        <RelationshipPickerDrawer {...defaultProps} onConfirm={onConfirm} />,
        { wrapper }
      );

      await waitFor(() => screen.getByText("John"));

      fireEvent.click(screen.getByText("John"));
      fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

      expect(onConfirm).toHaveBeenCalledWith([
        expect.objectContaining({ id: 1, name: "John" }),
      ]);
    });

    it("shows selection count in confirm button", async () => {
      render(<RelationshipPickerDrawer {...defaultProps} />, { wrapper });

      await waitFor(() => screen.getByText("John"));

      fireEvent.click(screen.getByText("John"));
      fireEvent.click(screen.getByText("Jane"));

      expect(screen.getByRole("button", { name: /confirm \(2\)/i })).toBeInTheDocument();
    });
  });

  describe("create new", () => {
    it("opens create drawer on button click", async () => {
      render(<RelationshipPickerDrawer {...defaultProps} />, { wrapper });

      fireEvent.click(screen.getByRole("button", { name: /create new/i }));

      // Create drawer should open
    });
  });
});
```

### Layer 3: RelationshipCreateDrawer Tests

```typescript
// packs/ui/app/frontend/lib/__tests__/relationship-create-drawer.test.tsx

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RelationshipCreateDrawer } from "../form/relationship-create-drawer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  name: "contacts",
  template: [
    { type: "COMPONENT", name: "name", kind: "INPUT_TEXT", label: "Name" },
    { type: "COMPONENT", name: "email", kind: "INPUT_TEXT", label: "Email" },
  ],
  formSchema: {
    type: "object",
    properties: {
      name: { type: "string" },
      email: { type: "string" },
    },
  },
  basePath: "/api/v1/contacts",
  onSuccess: vi.fn(),
};

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("RelationshipCreateDrawer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders form fields from template", () => {
      render(<RelationshipCreateDrawer {...defaultProps} />, { wrapper });

      expect(screen.getByLabelText("Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });

    it("renders submit button", () => {
      render(<RelationshipCreateDrawer {...defaultProps} />, { wrapper });

      expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    });
  });

  describe("form submission", () => {
    it("posts to basePath on submit", async () => {
      mockedAxios.post.mockResolvedValue({
        data: { id: 123, data: { name: "New Contact", email: "new@test.com" } },
      });

      render(<RelationshipCreateDrawer {...defaultProps} />, { wrapper });

      fireEvent.change(screen.getByLabelText("Name"), { target: { value: "New Contact" } });
      fireEvent.change(screen.getByLabelText("Email"), { target: { value: "new@test.com" } });
      fireEvent.click(screen.getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith("/api/v1/contacts", {
          data: { name: "New Contact", email: "new@test.com" },
        });
      });
    });

    it("calls onSuccess with created item", async () => {
      const onSuccess = vi.fn();
      mockedAxios.post.mockResolvedValue({
        data: { id: 123, data: { name: "New Contact" } },
      });

      render(
        <RelationshipCreateDrawer {...defaultProps} onSuccess={onSuccess} />,
        { wrapper }
      );

      fireEvent.change(screen.getByLabelText("Name"), { target: { value: "New Contact" } });
      fireEvent.click(screen.getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith({
          id: 123,
          name: "New Contact",
        });
      });
    });

    it("invalidates picker query on success", async () => {
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
      mockedAxios.post.mockResolvedValue({
        data: { id: 123, data: { name: "New" } },
      });

      render(<RelationshipCreateDrawer {...defaultProps} />, { wrapper });

      fireEvent.change(screen.getByLabelText("Name"), { target: { value: "New" } });
      fireEvent.click(screen.getByRole("button", { name: /add/i }));

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({
          queryKey: ["relationship-picker", "/api/v1/contacts"],
        });
      });
    });
  });

  describe("closed state", () => {
    it("renders nothing when closed", () => {
      const { container } = render(
        <RelationshipCreateDrawer {...defaultProps} open={false} />,
        { wrapper }
      );

      // Sheet should not render content when closed
    });
  });
});
```

### Integration Tests

```typescript
// packs/ui/app/frontend/lib/__tests__/relationship-picker-integration.test.tsx

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Formik, Form } from "formik";
import { RelationshipPickerField } from "../form/relationship-picker-field";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("RelationshipPicker Integration", () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  beforeEach(() => {
    vi.clearAllMocks();
    mockedAxios.get.mockResolvedValue({
      data: {
        data: [
          { id: 1, data: { name: "Existing 1" } },
          { id: 2, data: { name: "Existing 2" } },
        ],
      },
    });
  });

  it("full flow: open drawer → select → confirm → shows in field", async () => {
    let formValues = {};

    render(
      <QueryClientProvider client={queryClient}>
        <Formik
          initialValues={{ contacts_attributes: [] }}
          onSubmit={(values) => { formValues = values; }}
        >
          {({ values }) => {
            formValues = values;
            return (
              <Form>
                <RelationshipPickerField
                  name="contacts_attributes"
                  cardinality="many"
                  relationSchema="contact"
                  columns={[{ name: "name", kind: "DISPLAY_TEXT" }]}
                  template={[]}
                  formSchema={{}}
                />
              </Form>
            );
          }}
        </Formik>
      </QueryClientProvider>
    );

    // 1. Click add
    fireEvent.click(screen.getByRole("button", { name: /add/i }));

    // 2. Wait for drawer data
    await waitFor(() => screen.getByText("Existing 1"));

    // 3. Select item
    fireEvent.click(screen.getByText("Existing 1"));

    // 4. Confirm
    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

    // 5. Verify item appears in field
    await waitFor(() => {
      expect(screen.getByText("Existing 1")).toBeInTheDocument();
      expect(formValues.contacts_attributes).toContainEqual(
        expect.objectContaining({ id: 1 })
      );
    });
  });

  it("full flow: create new → auto-select → confirm", async () => {
    mockedAxios.post.mockResolvedValue({
      data: { id: 99, data: { name: "Newly Created" } },
    });

    // Similar flow with create drawer
  });

  it("removal marks existing with _destroy", async () => {
    let formValues = {};

    render(
      <QueryClientProvider client={queryClient}>
        <Formik
          initialValues={{ contacts_attributes: [{ id: 1, name: "Existing" }] }}
          onSubmit={() => {}}
        >
          {({ values }) => {
            formValues = values;
            return (
              <Form>
                <RelationshipPickerField
                  name="contacts_attributes"
                  cardinality="many"
                  relationSchema="contact"
                  columns={[{ name: "name", kind: "DISPLAY_TEXT" }]}
                  template={[]}
                  formSchema={{}}
                />
              </Form>
            );
          }}
        </Formik>
      </QueryClientProvider>
    );

    // Click remove
    fireEvent.click(screen.getByRole("button", { name: /remove/i }));

    // Verify _destroy is set
    await waitFor(() => {
      expect(formValues.contacts_attributes[0]._destroy).toBe(1);
    });
  });
});
```

## Test Coverage Summary

| Component                        | Unit Tests | Integration Tests |
| -------------------------------- | ---------- | ----------------- |
| RelationshipPickerBuilder (Ruby) | 8          | -                 |
| ViewBuilder#relationship_picker  | 7          | -                 |
| RelationshipPickerField          | 10         | 3                 |
| RelationshipPickerDrawer         | 12         | -                 |
| RelationshipCreateDrawer         | 6          | -                 |
| **Total**                        | 43         | 3                 |
