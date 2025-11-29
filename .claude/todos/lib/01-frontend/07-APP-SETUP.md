# Phase 7: App Integration

## Goal

Wire up UIProvider in the application with all adapters and services.

## Files to Create/Modify

### 1. app/frontend/providers/ui-provider.tsx

```tsx
import { UIProvider } from "@ui";
import type {
  ComponentRegistry,
  InputRegistry,
  DisplayRegistry,
  UIServices,
} from "@ui/registry";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "sonner";

// Import all adapters
import * as components from "@/adapters";

// Build registries from adapters
const componentRegistry: ComponentRegistry = {
  VIEW: components.VIEW,
  PAGE: components.PAGE,
  DRAWER: components.DRAWER,
  FORM: components.FORM,
  TABLE: components.TABLE,
  SHOW: components.SHOW,
  ACTIONS: components.ACTIONS,
  GROUP: components.GROUP,
  CARD_GROUP: components.CARD_GROUP,
  MULTISTEP: components.MULTISTEP,
  STEP: components.STEP,
  FORM_ARRAY: components.FORM_ARRAY,
  DISPLAY_ARRAY: components.DISPLAY_ARRAY,
  ALERT: components.ALERT,
  LINK: components.LINK,
  BUTTON: components.BUTTON,
  DROPDOWN: components.DROPDOWN,
  OPTION: components.OPTION,
  SEARCH: components.SEARCH,
  SUBMIT: components.SUBMIT,
  COMPONENT: components.COMPONENT,
  RELATIONSHIP_PICKER: components.RELATIONSHIP_PICKER,
};

const inputRegistry: InputRegistry = {
  INPUT_TEXT: components.INPUT_TEXT,
  INPUT_TEXTAREA: components.INPUT_TEXTAREA,
  INPUT_SELECT: components.INPUT_SELECT,
  INPUT_CHECKBOX: components.INPUT_CHECKBOX,
  INPUT_CHECKBOXES: components.INPUT_CHECKBOXES,
  INPUT_RADIOS: components.INPUT_RADIOS,
  INPUT_DATE: components.INPUT_DATE,
  INPUT_DATETIME: components.INPUT_DATETIME,
  INPUT_TAGS: components.INPUT_TAGS,
  INPUT_AI_RICH_TEXT: components.INPUT_AI_RICH_TEXT,
};

const displayRegistry: DisplayRegistry = {
  DISPLAY_TEXT: components.DISPLAY_TEXT,
  DISPLAY_LONGTEXT: components.DISPLAY_LONGTEXT,
  DISPLAY_NUMBER: components.DISPLAY_NUMBER,
  DISPLAY_DATE: components.DISPLAY_DATE,
  DISPLAY_DATETIME: components.DISPLAY_DATETIME,
  DISPLAY_BADGE: components.DISPLAY_BADGE,
  DISPLAY_TAGS: components.DISPLAY_TAGS,
  DISPLAY_BOOLEAN: components.DISPLAY_BOOLEAN,
  DISPLAY_SELECT: components.DISPLAY_SELECT,
};

interface AppUIProviderProps {
  children: React.ReactNode;
  translations?: Record<string, any>;
  locale?: string;
}

export function AppUIProvider({
  children,
  translations,
  locale = "en",
}: AppUIProviderProps) {
  const navigate = useNavigate();

  const services: UIServices = {
    fetch: async (url, options) => {
      const response = await axios(url, options);
      return new Response(JSON.stringify(response.data), {
        status: response.status,
        headers: response.headers as HeadersInit,
      });
    },
    navigate: (path) => navigate(path),
    toast: (message, type) => {
      if (type === "success") {
        toast.success(message);
      } else {
        toast.error(message);
      }
    },
    confirm: async (message) => {
      return window.confirm(message);
    },
  };

  return (
    <UIProvider
      components={componentRegistry}
      inputs={inputRegistry}
      displays={displayRegistry}
      services={services}
      translations={translations}
      locale={locale}
    >
      {children}
    </UIProvider>
  );
}
```

### 2. Update app/frontend/app.tsx

```tsx
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppUIProvider } from "@/providers/ui-provider";
import { Toaster } from "@ui-components/sonner";
import { Routes } from "@/routes";

const queryClient = new QueryClient();

export function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppUIProvider>
          <Routes />
          <Toaster />
        </AppUIProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
```

### 3. Example page using DynamicRenderer

```tsx
// app/frontend/pages/contacts/index.tsx
import { useQuery } from "@tanstack/react-query";
import { DynamicRenderer } from "@ui";
import axios from "axios";

export function ContactsPage() {
  // Fetch view schema from backend
  const { data: viewSchema } = useQuery({
    queryKey: ["view", "workspaces", "contacts", "index"],
    queryFn: async () => {
      const response = await axios.get(
        "/api/v1/views/workspaces/contacts/index",
      );
      return response.data;
    },
  });

  if (!viewSchema) return <div>Loading...</div>;

  return <DynamicRenderer schema={viewSchema} />;
}
```

## Verification

```bash
npm run dev
# Navigate to a page using DynamicRenderer
```
