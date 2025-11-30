# Storybook Stories Implementation

## Component Signatures

### Displays (`DisplayProps`)

```ts
interface DisplayProps {
  name: string;
  label?: string;
  value?: unknown;
  options?: Option[];
}
```

No `schema`. Direct props only.

### Inputs (`InputProps`)

```ts
interface InputProps {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  options?: Option[];
  rows?: number;
  disabled?: boolean;
  value?: unknown;
  onChange?: (value: unknown) => void;
  error?: string;
}
```

No `schema`. Direct props only.

### Layouts & Primitives

Take `schema` for `className`, `subtitle`, `elements`, etc.

---

## Storybook Menu Structure

```
storybook/
├── Displays
│   ├── Text
│   ├── Longtext
│   ├── Number
│   ├── Date
│   ├── Datetime
│   ├── Badge
│   ├── Tags
│   ├── Boolean
│   └── Select
├── Inputs
│   ├── Text
│   ├── Textarea
│   ├── Select
│   ├── Checkbox
│   ├── Checkboxes
│   ├── Radios
│   ├── Date
│   ├── Datetime
│   ├── Tags
│   └── RichText
├── Primitives
│   ├── Button
│   ├── Link
│   ├── Search
│   ├── Submit
│   └── Dropdown
├── Layouts
│   ├── Group
│   ├── CardGroup
│   ├── Actions
│   ├── Alert
│   ├── Page
│   ├── Drawer
│   ├── Form
│   ├── FormArray
│   ├── Multistep
│   ├── Step
│   └── Table
├── Complex
│   └── RelationshipPicker
└── Compositions
    ├── FormPatterns
    ├── DisplayPatterns
    └── CRUDPage
```

---

## Setup

### .storybook/main.ts

```ts
import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import path from "path";

const config: StorybookConfig = {
  stories: ["../packs/ui/app/frontend/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@ui": path.resolve(__dirname, "../packs/ui/app/frontend/lib"),
          "@ui-components": path.resolve(
            __dirname,
            "../packs/ui/app/frontend/components"
          ),
        },
      },
    });
  },
};

export default config;
```

### .storybook/preview.ts

```ts
import type { Preview } from "@storybook/react";
import "../packs/ui/app/frontend/styles.css";
import { initialize, mswLoader } from "msw-storybook-addon";

initialize();

const preview: Preview = {
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#0a0a0a" },
      ],
    },
  },
  loaders: [mswLoader],
};

export default preview;
```

---

## Display Stories

Location: `packs/ui/app/frontend/adapters/displays/`

### text.stories.tsx

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DISPLAY_TEXT } from "./text-display";

const meta: Meta<typeof DISPLAY_TEXT> = {
  title: "Displays/Text",
  component: DISPLAY_TEXT,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DISPLAY_TEXT>;

export const Default: Story = {
  args: {
    name: "name",
    value: "Hello World",
  },
};

export const WithNumber: Story = {
  args: {
    name: "count",
    value: 12345,
  },
};

export const Empty: Story = {
  args: {
    name: "name",
    value: null,
  },
};
```

### badge.stories.tsx

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DISPLAY_BADGE } from "./badge-display";

const meta: Meta<typeof DISPLAY_BADGE> = {
  title: "Displays/Badge",
  component: DISPLAY_BADGE,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DISPLAY_BADGE>;

export const Active: Story = {
  args: {
    name: "status",
    value: "active",
  },
};

export const Pending: Story = {
  args: {
    name: "status",
    value: "pending",
  },
};

export const Failed: Story = {
  args: {
    name: "status",
    value: "failed",
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex gap-2">
      <DISPLAY_BADGE name="s1" value="active" />
      <DISPLAY_BADGE name="s2" value="pending" />
      <DISPLAY_BADGE name="s3" value="failed" />
      <DISPLAY_BADGE name="s4" value="completed" />
    </div>
  ),
};
```

### tags.stories.tsx

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DISPLAY_TAGS } from "./tags-display";

const meta: Meta<typeof DISPLAY_TAGS> = {
  title: "Displays/Tags",
  component: DISPLAY_TAGS,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DISPLAY_TAGS>;

export const Default: Story = {
  args: {
    name: "tags",
    value: ["react", "typescript", "tailwind"],
  },
};

export const Empty: Story = {
  args: {
    name: "tags",
    value: [],
  },
};
```

---

## Input Stories

Location: `packs/ui/app/frontend/adapters/inputs/`

### text-input.stories.tsx

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { INPUT_TEXT } from "./text-input";

const meta: Meta<typeof INPUT_TEXT> = {
  title: "Inputs/Text",
  component: INPUT_TEXT,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof INPUT_TEXT>;

export const Default: Story = {
  args: {
    name: "name",
  },
};

export const WithLabel: Story = {
  args: {
    name: "email",
    label: "Email Address",
  },
};

export const WithPlaceholder: Story = {
  args: {
    name: "search",
    label: "Search",
    placeholder: "Type to search...",
  },
};

export const WithError: Story = {
  args: {
    name: "email",
    label: "Email",
    error: "This email is already taken",
  },
};

export const Disabled: Story = {
  args: {
    name: "readonly",
    label: "Read Only",
    value: "Cannot edit",
    disabled: true,
  },
};
```

### select.stories.tsx

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { INPUT_SELECT } from "./select";

const meta: Meta<typeof INPUT_SELECT> = {
  title: "Inputs/Select",
  component: INPUT_SELECT,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof INPUT_SELECT>;

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

export const Default: Story = {
  args: {
    name: "status",
    label: "Status",
    options: statusOptions,
  },
};

export const WithPlaceholder: Story = {
  args: {
    name: "status",
    label: "Status",
    placeholder: "Select a status...",
    options: statusOptions,
  },
};
```

---

## Layout Stories

Location: `packs/ui/app/frontend/adapters/layouts/`

### alert.stories.tsx

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ALERT } from "./alert";

const meta: Meta<typeof ALERT> = {
  title: "Layouts/Alert",
  component: ALERT,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ALERT>;

export const Default: Story = {
  args: {
    schema: { type: "ALERT" },
    label: "This is an informational message.",
  },
};

export const Success: Story = {
  args: {
    schema: { type: "ALERT" },
    label: "Your changes have been saved.",
    color: "green",
  },
};

export const AllColors: Story = {
  render: () => (
    <div className="space-y-4">
      <ALERT schema={{ type: "ALERT" }} label="Default message" />
      <ALERT schema={{ type: "ALERT" }} label="Success" color="green" />
      <ALERT schema={{ type: "ALERT" }} label="Warning" color="yellow" />
      <ALERT schema={{ type: "ALERT" }} label="Error" color="red" />
      <ALERT schema={{ type: "ALERT" }} label="Info" color="blue" />
    </div>
  ),
};
```

---

## Composition Stories

Location: `packs/ui/app/frontend/lib/stories/`

### form-patterns.stories.tsx

Full schema-driven stories using `DynamicRenderer`:

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DynamicRenderer } from "../renderer";
import type { UISchema } from "../types";

const meta: Meta<typeof DynamicRenderer> = {
  title: "Compositions/Form Patterns",
  component: DynamicRenderer,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof DynamicRenderer>;

const inputKindsSchema: UISchema = {
  type: "VIEW",
  elements: [
    {
      type: "PAGE",
      title: "Form Input Types",
      elements: [
        {
          type: "FORM",
          className: "max-w-2xl mx-auto p-6",
          elements: [
            {
              type: "GROUP",
              label: "Text Inputs",
              elements: [
                { type: "COMPONENT", name: "text", kind: "INPUT_TEXT", label: "Text" },
                { type: "COMPONENT", name: "textarea", kind: "INPUT_TEXTAREA", label: "Textarea", rows: 4 },
              ],
            },
            {
              type: "GROUP",
              label: "Selection Inputs",
              elements: [
                {
                  type: "COMPONENT",
                  name: "select",
                  kind: "INPUT_SELECT",
                  label: "Select",
                  options: [
                    { label: "Option A", value: "a" },
                    { label: "Option B", value: "b" },
                  ],
                },
                { type: "COMPONENT", name: "checkbox", kind: "INPUT_CHECKBOX", label: "Checkbox" },
                {
                  type: "COMPONENT",
                  name: "radios",
                  kind: "INPUT_RADIOS",
                  label: "Radios",
                  options: [
                    { label: "Option A", value: "a" },
                    { label: "Option B", value: "b" },
                  ],
                },
              ],
            },
            {
              type: "GROUP",
              label: "Other Inputs",
              elements: [
                { type: "COMPONENT", name: "date", kind: "INPUT_DATE", label: "Date" },
                { type: "COMPONENT", name: "datetime", kind: "INPUT_DATETIME", label: "DateTime" },
                { type: "COMPONENT", name: "tags", kind: "INPUT_TAGS", label: "Tags" },
              ],
            },
            { type: "SUBMIT", label: "Submit" },
          ],
        },
      ],
    },
  ],
};

export const InputKinds: Story = {
  render: () => (
    <div className="min-h-screen bg-slate-50">
      <DynamicRenderer schema={inputKindsSchema} />
    </div>
  ),
};

const multistepSchema: UISchema = {
  type: "VIEW",
  elements: [
    {
      type: "PAGE",
      title: "Multi-step Form",
      elements: [
        {
          type: "FORM",
          className: "max-w-xl mx-auto p-6",
          elements: [
            {
              type: "MULTISTEP",
              elements: [
                {
                  type: "STEP",
                  label: "Personal",
                  elements: [
                    { type: "COMPONENT", name: "first_name", kind: "INPUT_TEXT", label: "First Name" },
                    { type: "COMPONENT", name: "last_name", kind: "INPUT_TEXT", label: "Last Name" },
                  ],
                },
                {
                  type: "STEP",
                  label: "Account",
                  elements: [
                    { type: "COMPONENT", name: "username", kind: "INPUT_TEXT", label: "Username" },
                    { type: "COMPONENT", name: "password", kind: "INPUT_TEXT", label: "Password" },
                  ],
                },
                {
                  type: "STEP",
                  label: "Review",
                  elements: [
                    { type: "ALERT", label: "Review your information.", color: "blue" },
                  ],
                },
              ],
            },
            { type: "SUBMIT", label: "Create Account" },
          ],
        },
      ],
    },
  ],
};

export const Multistep: Story = {
  render: () => (
    <div className="min-h-screen bg-slate-50">
      <DynamicRenderer schema={multistepSchema} />
    </div>
  ),
};

const formArraySchema: UISchema = {
  type: "VIEW",
  elements: [
    {
      type: "PAGE",
      title: "Relationships Demo",
      elements: [
        {
          type: "FORM",
          className: "max-w-2xl mx-auto p-6",
          elements: [
            {
              type: "GROUP",
              label: "Contact",
              elements: [
                { type: "COMPONENT", name: "first_name", kind: "INPUT_TEXT", label: "First Name" },
                { type: "COMPONENT", name: "last_name", kind: "INPUT_TEXT", label: "Last Name" },
              ],
            },
            {
              type: "FORM_ARRAY",
              name: "addresses_attributes",
              label: "Addresses",
              addLabel: "Add Address",
              removeLabel: "Remove",
              template: [
                { type: "COMPONENT", name: "street", kind: "INPUT_TEXT", label: "Street" },
                { type: "COMPONENT", name: "city", kind: "INPUT_TEXT", label: "City" },
              ],
            },
            { type: "SUBMIT", label: "Save" },
          ],
        },
      ],
    },
  ],
};

export const FormArray: Story = {
  render: () => (
    <div className="min-h-screen bg-slate-50">
      <DynamicRenderer schema={formArraySchema} />
    </div>
  ),
};
```

### crud-page.stories.tsx

Full CRUD page with MSW mocks:

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import { DynamicRenderer } from "../renderer";
import type { UISchema } from "../types";

const meta: Meta<typeof DynamicRenderer> = {
  title: "Compositions/CRUD Page",
  component: DynamicRenderer,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof DynamicRenderer>;

const mockData = [
  { id: 1, data: { first_name: "John", last_name: "Doe", email: "john@example.com" } },
  { id: 2, data: { first_name: "Jane", last_name: "Smith", email: "jane@example.com" } },
];

const schema: UISchema = {
  type: "VIEW",
  drawers: {
    new_drawer: {
      title: "New Contact",
      elements: [
        {
          type: "FORM",
          action: "create",
          elements: [
            { type: "COMPONENT", name: "first_name", kind: "INPUT_TEXT", label: "First Name" },
            { type: "COMPONENT", name: "last_name", kind: "INPUT_TEXT", label: "Last Name" },
            { type: "COMPONENT", name: "email", kind: "INPUT_TEXT", label: "Email" },
            { type: "SUBMIT", label: "Save" },
          ],
        },
      ],
    },
    view_drawer: {
      title: "View Contact",
      elements: [
        {
          type: "SHOW",
          elements: [
            { type: "COMPONENT", name: "first_name", kind: "DISPLAY_TEXT", label: "First Name" },
            { type: "COMPONENT", name: "last_name", kind: "DISPLAY_TEXT", label: "Last Name" },
            { type: "COMPONENT", name: "email", kind: "DISPLAY_TEXT", label: "Email" },
          ],
        },
      ],
    },
  },
  elements: [
    {
      type: "PAGE",
      title: "Contacts",
      description: "Manage your contacts",
      actions: [
        { type: "LINK", label: "New Contact", opens: "new_drawer", variant: "primary" },
      ],
      elements: [
        {
          type: "TABLE",
          searchable: true,
          selectable: true,
          columns: [
            { type: "COMPONENT", name: "first_name", kind: "DISPLAY_TEXT", label: "First Name", sortable: true },
            { type: "COMPONENT", name: "last_name", kind: "DISPLAY_TEXT", label: "Last Name", sortable: true },
            { type: "COMPONENT", name: "email", kind: "DISPLAY_TEXT", label: "Email" },
          ],
          rowClick: { opens: "view_drawer" },
          rowActions: {
            icon: "ellipsis",
            elements: [
              { type: "LINK", label: "Edit", opens: "edit_drawer", icon: "pencil" },
              { type: "LINK", label: "Delete", api: "destroy", confirm: "Delete?", icon: "trash" },
            ],
          },
        },
      ],
    },
  ],
};

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/contacts", () => {
          return HttpResponse.json({
            data: mockData,
            pagination: { current_page: 1, total_pages: 1, total_count: mockData.length },
          });
        }),
        http.post("/api/v1/contacts", async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json({ id: 3, data: body });
        }),
        http.delete("/api/v1/contacts/:id", () => {
          return HttpResponse.json({ success: true });
        }),
      ],
    },
  },
  render: () => (
    <div className="min-h-screen bg-slate-50">
      <DynamicRenderer schema={schema} />
    </div>
  ),
};
```

---

## Checklist

### Setup

- [ ] `npx storybook@latest init --type react`
- [ ] `npm install msw msw-storybook-addon`
- [ ] Configure `.storybook/main.ts`
- [ ] Configure `.storybook/preview.ts`

### Display Stories (9)

- [ ] text.stories.tsx
- [ ] longtext.stories.tsx
- [ ] number.stories.tsx
- [ ] date.stories.tsx
- [ ] datetime.stories.tsx
- [ ] badge.stories.tsx
- [ ] tags.stories.tsx
- [ ] boolean.stories.tsx
- [ ] select.stories.tsx

### Input Stories (10)

- [ ] text-input.stories.tsx
- [ ] textarea.stories.tsx
- [ ] select.stories.tsx
- [ ] checkbox.stories.tsx
- [ ] checkboxes.stories.tsx
- [ ] radios.stories.tsx
- [ ] date-input.stories.tsx
- [ ] datetime-input.stories.tsx
- [ ] tags-input.stories.tsx
- [ ] rich-text-input.stories.tsx

### Layout Stories (11)

- [ ] group.stories.tsx
- [ ] card-group.stories.tsx
- [ ] actions.stories.tsx
- [ ] alert.stories.tsx
- [ ] page.stories.tsx
- [ ] drawer.stories.tsx
- [ ] form.stories.tsx
- [ ] form-array.stories.tsx
- [ ] multistep.stories.tsx
- [ ] step.stories.tsx
- [ ] table.stories.tsx

### Primitive Stories (5)

- [ ] button.stories.tsx
- [ ] link.stories.tsx
- [ ] search.stories.tsx
- [ ] submit.stories.tsx
- [ ] dropdown.stories.tsx

### Complex Stories (1)

- [ ] relationship-picker.stories.tsx

### Composition Stories (3)

- [ ] form-patterns.stories.tsx
- [ ] display-patterns.stories.tsx
- [ ] crud-page.stories.tsx
