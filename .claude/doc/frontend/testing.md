# Frontend Testing

## STRICT RULES

### 1. NO MOCKING (except HTTP)

**Mocking anything other than HTTP/axios calls is FORBIDDEN.**

- **NEVER** mock React components
- **NEVER** mock hooks
- **NEVER** mock internal modules
- **NEVER** mock context providers (use real ones)
- **ONLY** mock HTTP responses (axios, fetch, MSW)

**Integration tests:** Zero mocks allowed except HTTP responses.

**Unit tests:** HTTP mocks only. If you need to mock a component, your test is wrong.

```typescript
// FORBIDDEN - Never do this
vi.mock("../components/Button", () => ({ Button: () => <div>Mock</div> }));
vi.mock("../hooks/useData", () => ({ useData: () => ({ data: [] }) }));

// ALLOWED - HTTP mocks only
mockServices.fetch.mockResolvedValueOnce(new Response(JSON.stringify({ items: [] })));
```

### 2. NO document.querySelector - EVER

**NEVER use DOM selectors. Use Testing Library queries exclusively.**

```typescript
// FORBIDDEN - Never do this
document.querySelector(".my-class");
document.getElementById("my-id");
container.querySelector("button");

// REQUIRED - Always use Testing Library
screen.getByRole("button");
screen.getByText("Submit");
screen.getByLabelText("Email");
screen.getByTestId("submit-btn"); // Last resort only
```

**Priority order for queries:**

1. `getByRole` - buttons, textboxes, checkboxes, etc.
2. `getByLabelText` - form inputs
3. `getByText` - visible text
4. `getByPlaceholderText` - inputs with placeholders
5. `getByTestId` - absolute last resort

### 3. NO WARNINGS = TEST COMPLETE

**A test is NOT finished if it produces warnings.**

- React warnings must be fixed
- Console errors must be addressed
- act() warnings must be resolved
- Deprecation warnings must be handled

```bash
# Test output must be clean
✓ renders correctly (15ms)
✓ submits form (23ms)

# NOT acceptable - warnings present
✓ renders correctly (15ms)
  Warning: An update to Component inside a test was not wrapped in act(...)
✓ submits form (23ms)
  Warning: Each child in a list should have a unique "key" prop
```

**Fix the code or the test. Warnings are bugs.**

### 4. VITEST CONFIG IS FROZEN

**NEVER modify `vitest.config.ts` or `vitest.setup.ts`.**

- **NEVER** change path aliases
- **NEVER** add new aliases
- **NEVER** modify test configuration
- **NEVER** change setup files

If tests fail due to imports, fix the imports in your code to use existing aliases. The config is correct.

```typescript
// If your import doesn't work, use existing aliases:
import { Button } from "@ui/components/button"; // Correct
import { Button } from "../../components/button"; // Also fine

// NEVER add new aliases to vitest.config.ts to "fix" imports
```

---

## Quick Reference

```bash
yarn test                           # Watch mode
yarn test --run                     # Single run
yarn test packs/ui                  # Specific directory
yarn test path/to/file.test.tsx    # Specific file
yarn test --project=unit           # Unit tests only
yarn test --project=storybook      # Storybook tests only
```

---

## Test Structure

```
packs/{pack}/app/frontend/
  __tests__/
    integrations/           # Full integration tests
      phase-01-resolver.test.ts
      phase-02-displays.test.tsx
      ...
      test-utils.tsx        # Pack-specific test utilities
    mocks/                  # Generated mock data
      schemas.json
      features.json
      relationships.json
      views/
        {feature}_{view}.json

packs/ui/app/frontend/
  adapters/__tests__/       # Adapter unit tests
    inputs.test.tsx
    displays.test.tsx
    layouts.test.tsx
    primitives.test.tsx
    test-utils.tsx
  lib/ui-renderer/__tests__/ # Renderer unit tests
    renderer.test.tsx
    resolver.test.ts
    provider.test.tsx
```

---

## Test Utilities

### Standard Test Wrapper

All UI tests need providers. Use `renderWithProviders`:

```typescript
// test-utils.tsx
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/lib/ui-renderer/provider";
import { TooltipProvider } from "@ui/components/tooltip";
import type { UIServices } from "@ui/lib/ui-renderer/registry";

export const mockServices: UIServices = {
  fetch: vi.fn().mockResolvedValue(new Response()),
  navigate: vi.fn(),
  toast: vi.fn(),
  confirm: vi.fn().mockResolvedValue(true),
};

export function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <UIProvider services={mockServices} locale="en">
          <TooltipProvider>{children}</TooltipProvider>
        </UIProvider>
      </QueryClientProvider>
    );
  };
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: createWrapper(), ...options });
}

export function resetMocks() {
  vi.clearAllMocks();
}
```

### Usage

```typescript
import { renderWithProviders, resetMocks, mockServices } from "./test-utils";

describe("MyComponent", () => {
  beforeEach(() => {
    resetMocks();
  });

  it("renders correctly", () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("calls navigate on click", async () => {
    renderWithProviders(<MyComponent />);
    await userEvent.click(screen.getByRole("button"));
    expect(mockServices.navigate).toHaveBeenCalledWith("/path");
  });
});
```

---

## Testing Adapters

### Input Adapters

Inputs require `Form` context:

```typescript
const InputWrapper = ({ children }: { children: React.ReactNode }) => (
  <View>
    <Form>{children}</Form>
  </View>
);

describe("TextInput", () => {
  it("renders with label", () => {
    renderWithProviders(
      <InputWrapper>
        <TextInput name="email" label="Email Address" />
      </InputWrapper>
    );
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
  });

  it("updates value when typing", async () => {
    renderWithProviders(
      <InputWrapper>
        <TextInput name="email" />
      </InputWrapper>
    );

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "test@example.com");
    expect(input).toHaveValue("test@example.com");
  });
});
```

### Display Adapters

Displays read from `data` prop or `ShowContext`:

```typescript
import { ShowContext } from "@ui/adapters";
import { DynamicRenderer } from "@ui/lib/ui-renderer/renderer";

function TestWrapper({ children, showData = {} }) {
  return (
    <UIProvider services={mockServices} locale="en">
      <ShowContext.Provider value={{ data: showData }}>
        {children}
      </ShowContext.Provider>
    </UIProvider>
  );
}

describe("DISPLAY_TEXT", () => {
  it("renders string value", () => {
    render(
      <TestWrapper>
        <DynamicRenderer
          schema={{ type: "DISPLAY_TEXT", name: "name" }}
          data={{ name: "John Doe" }}
        />
      </TestWrapper>
    );
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders empty state for null", () => {
    render(
      <TestWrapper>
        <DynamicRenderer
          schema={{ type: "DISPLAY_TEXT", name: "name" }}
          data={{ name: null }}
        />
      </TestWrapper>
    );
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
```

---

## Integration Tests (Phases)

Integration tests in `__tests__/integrations/` follow a phased approach:

| Phase | File                                   | Tests                  |
| ----- | -------------------------------------- | ---------------------- |
| 01    | `phase-01-resolver.test.ts`            | Schema type resolution |
| 02    | `phase-02-displays.test.tsx`           | All display adapters   |
| 03    | `phase-03-inputs.test.tsx`             | All input adapters     |
| 04    | `phase-04-primitives.test.tsx`         | Button, Link, Dropdown |
| 05    | `phase-05-layouts.test.tsx`            | Group, CardGroup, Page |
| 06    | `phase-06-renderer.test.tsx`           | DynamicRenderer        |
| 07    | `phase-07-page.test.tsx`               | Page layout            |
| 08    | `phase-08-table.test.tsx`              | Table adapter          |
| 09    | `phase-09-form.test.tsx`               | Form submission        |
| 10    | `phase-10-view.test.tsx`               | View + Drawers         |
| 11    | `phase-11-api.test.tsx`                | API integration        |
| 12    | `phase-12-fullpage.test.tsx`           | Full page render       |
| 13    | `phase-13-relationshippicker.test.tsx` | Relationship picker    |
| 14    | `phase-14-formarray.test.tsx`          | Form arrays            |
| 15    | `phase-15-displayarray.test.tsx`       | Display arrays         |
| 16    | `phase-16-multistep.test.tsx`          | Multi-step forms       |

---

## Mock Data Generation

### Generate Mocks

```bash
rake core:export_mocks
```

**Output:** `packs/{pack}/app/frontend/__tests__/mocks/`

### Mock Files

| File                          | Source                          | Content                |
| ----------------------------- | ------------------------------- | ---------------------- |
| `schemas.json`                | `Core::Schema::Registry`        | Schema definitions     |
| `relationships.json`          | `Core::Relationships::Registry` | Relationship configs   |
| `features.json`               | `Core::Features::Registry`      | Feature + tool configs |
| `views/{feature}_{view}.json` | `view_class.view_config`        | View UI schemas        |

### Using Mocks

```typescript
import contactsSchema from "../mocks/schemas.json";
import indexView from "../mocks/views/contacts_index.json";

describe("Contacts Index", () => {
  it("renders from mock schema", () => {
    renderWithProviders(
      <DynamicRenderer schema={indexView} data={mockData} />
    );
  });
});
```

### When to Regenerate

Run `rake core:export_mocks` after changing:

- Schema definitions (`*_schema.rb`)
- View definitions (`views/*.rb`)
- Tool definitions (`tools/*.rb`)
- Relationships

---

## Vitest Configuration

### Setup File (`vitest.setup.ts`)

```typescript
import "@testing-library/jest-dom";

global.fetch = vi.fn();

// Mock matchMedia for useIsMobile hook
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver for Radix UI
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

// Mock pointer methods for Radix UI
Element.prototype.hasPointerCapture = vi.fn().mockReturnValue(false);
Element.prototype.setPointerCapture = vi.fn();
Element.prototype.releasePointerCapture = vi.fn();
Element.prototype.scrollIntoView = vi.fn();
```

### Test Projects

```typescript
// vitest.config.ts
test: {
  projects: [
    {
      test: {
        name: "unit",
        environment: "jsdom",
        include: ["packs/**/*.test.{ts,tsx}", "app/frontend/**/*.test.{ts,tsx}"],
      },
    },
    {
      test: {
        name: "storybook",
        browser: { enabled: true, headless: true },
      },
    },
  ],
}
```

---

## Common Patterns

### Testing User Interactions

```typescript
import userEvent from "@testing-library/user-event";

it("submits form", async () => {
  const user = userEvent.setup();
  renderWithProviders(<MyForm />);

  await user.type(screen.getByLabelText("Name"), "John");
  await user.click(screen.getByRole("button", { name: "Submit" }));

  expect(mockServices.fetch).toHaveBeenCalled();
});
```

### Testing Async Operations

```typescript
import { waitFor } from "@testing-library/react";

it("loads data", async () => {
  mockServices.fetch.mockResolvedValueOnce(
    new Response(JSON.stringify({ items: [{ id: 1 }] }))
  );

  renderWithProviders(<DataList />);

  await waitFor(() => {
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });
});
```

### Testing Select Components (Radix)

```typescript
it("selects option", async () => {
  const user = userEvent.setup();
  renderWithProviders(<Select options={options} />);

  await user.click(screen.getByRole("combobox"));
  // Radix renders multiple elements for accessibility
  expect(screen.getAllByText("Option A").length).toBeGreaterThan(0);
});
```

### Skipping Tests

**ALMOST NEVER ACCEPTABLE.**

Skipping tests is an extreme last resort. If you're considering skipping a test:

1. Fix the test instead
2. Fix the code instead
3. Ask for help
4. Still don't skip it

If you absolutely must (you shouldn't), append `.skip` to filename:

```
phase-09-form.test.tsx.skip
```

**This requires justification and should be temporary. Skipped tests are tech debt.**

---

## Debugging

### Run Single Test

```bash
yarn test --run path/to/file.test.tsx
```

### Debug Mode

```bash
yarn test --reporter=verbose
```

### Watch Specific Files

```bash
yarn test packs/ui/app/frontend/adapters
```
