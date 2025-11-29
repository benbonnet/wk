import { ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@ui/lib/provider";
import { TooltipProvider } from "@ui/components/ui/tooltip";
import type {
  ComponentRegistry,
  InputRegistry,
  DisplayRegistry,
  UIServices,
} from "@ui/lib/registry";
import * as LayoutAdapters from "../layouts";
import * as PrimitiveAdapters from "../primitives";
import * as InputAdapters from "../inputs";
import * as DisplayAdapters from "../displays";
import { DrawerContext } from "../layouts/view";

// Create mock services
export const mockServices: UIServices = {
  fetch: vi.fn().mockResolvedValue(new Response()),
  navigate: vi.fn(),
  toast: vi.fn(),
  confirm: vi.fn().mockResolvedValue(true),
};

// Build component registry from adapters
export const mockComponents: ComponentRegistry = {
  VIEW: LayoutAdapters.VIEW,
  PAGE: LayoutAdapters.PAGE,
  DRAWER: LayoutAdapters.DRAWER,
  FORM: LayoutAdapters.FORM,
  TABLE: LayoutAdapters.TABLE,
  SHOW: LayoutAdapters.SHOW,
  ACTIONS: LayoutAdapters.ACTIONS,
  GROUP: LayoutAdapters.GROUP,
  CARD_GROUP: LayoutAdapters.CARD_GROUP,
  MULTISTEP: LayoutAdapters.MULTISTEP,
  STEP: LayoutAdapters.STEP,
  FORM_ARRAY: LayoutAdapters.FORM_ARRAY,
  DISPLAY_ARRAY: LayoutAdapters.DISPLAY_ARRAY,
  ALERT: LayoutAdapters.ALERT,
  BUTTON: PrimitiveAdapters.BUTTON,
  LINK: PrimitiveAdapters.LINK,
  DROPDOWN: PrimitiveAdapters.DROPDOWN,
  OPTION: PrimitiveAdapters.OPTION,
  SEARCH: PrimitiveAdapters.SEARCH,
  SUBMIT: PrimitiveAdapters.SUBMIT,
  COMPONENT: PrimitiveAdapters.COMPONENT,
  RELATIONSHIP_PICKER: PrimitiveAdapters.RELATIONSHIP_PICKER,
};

export const mockInputs: InputRegistry = {
  INPUT_TEXT: InputAdapters.INPUT_TEXT,
  INPUT_TEXTAREA: InputAdapters.INPUT_TEXTAREA,
  INPUT_SELECT: InputAdapters.INPUT_SELECT,
  INPUT_CHECKBOX: InputAdapters.INPUT_CHECKBOX,
  INPUT_CHECKBOXES: InputAdapters.INPUT_CHECKBOXES,
  INPUT_RADIOS: InputAdapters.INPUT_RADIOS,
  INPUT_DATE: InputAdapters.INPUT_DATE,
  INPUT_DATETIME: InputAdapters.INPUT_DATETIME,
  INPUT_TAGS: InputAdapters.INPUT_TAGS,
  INPUT_AI_RICH_TEXT: InputAdapters.INPUT_AI_RICH_TEXT,
};

export const mockDisplays: DisplayRegistry = {
  DISPLAY_TEXT: DisplayAdapters.DISPLAY_TEXT,
  DISPLAY_LONGTEXT: DisplayAdapters.DISPLAY_LONGTEXT,
  DISPLAY_NUMBER: DisplayAdapters.DISPLAY_NUMBER,
  DISPLAY_DATE: DisplayAdapters.DISPLAY_DATE,
  DISPLAY_DATETIME: DisplayAdapters.DISPLAY_DATETIME,
  DISPLAY_BADGE: DisplayAdapters.DISPLAY_BADGE,
  DISPLAY_TAGS: DisplayAdapters.DISPLAY_TAGS,
  DISPLAY_BOOLEAN: DisplayAdapters.DISPLAY_BOOLEAN,
  DISPLAY_SELECT: DisplayAdapters.DISPLAY_SELECT,
};

export const mockTranslations = {
  schemas: {},
  views: {},
  common: {},
};

interface WrapperProps {
  children: ReactNode;
}

// Mock drawer context value
const mockDrawerContext = {
  openDrawer: vi.fn(),
  closeDrawer: vi.fn(),
  drawerData: null,
};

export function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return function Wrapper({ children }: WrapperProps) {
    return (
      <QueryClientProvider client={queryClient}>
        <UIProvider
          components={mockComponents}
          inputs={mockInputs}
          displays={mockDisplays}
          services={mockServices}
          translations={mockTranslations}
          locale="en"
        >
          <DrawerContext.Provider value={mockDrawerContext}>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </DrawerContext.Provider>
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

// Reset mocks before each test
export function resetMocks() {
  vi.clearAllMocks();
}
