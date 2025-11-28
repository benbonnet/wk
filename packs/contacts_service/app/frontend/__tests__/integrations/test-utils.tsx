import { ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { UIProvider } from "@ui/provider";
import { TooltipProvider } from "@ui-components/ui/tooltip";
import type { UIServices } from "@ui/registry";
import * as LayoutAdapters from "@ui/adapters/layouts";
import * as PrimitiveAdapters from "@ui/adapters/primitives";
import * as InputAdapters from "@ui/adapters/inputs";
import * as DisplayAdapters from "@ui/adapters/displays";
import { DrawerContext } from "@ui/adapters/layouts/view";
import viewSchema from "../mocks/views/contacts_index.json";
import mockData from "../mocks/data.json";
import type { UISchema } from "@ui/types";

// Mock services
export const mockServices: UIServices = {
  fetch: vi.fn().mockResolvedValue(new Response()),
  navigate: vi.fn(),
  toast: vi.fn(),
  confirm: vi.fn().mockResolvedValue(true),
};

// Component registries
export const mockComponents = {
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

export const mockInputs = {
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

export const mockDisplays = {
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

// View schema exports
export const schema = viewSchema as unknown as UISchema;
export const pageSchema = schema.elements?.[0] as UISchema;
const groupSchema = pageSchema?.elements?.find(
  (el) => el.type === "GROUP",
) as UISchema;
export const tableSchema = groupSchema?.elements?.find(
  (el) => el.type === "TABLE",
) as UISchema;

// Data exports
export const data = (mockData as { items: unknown[] }).items;

// Helper functions
export const getApiRegistry = () =>
  schema.api as Record<string, { method: string; path: string }>;
export const getDrawersRegistry = () => schema.drawers || {};
export const getBasePath = () => schema.url as string;
export const getTranslations = () => schema.translations || {};

// Mock drawer context
const mockDrawerContext = {
  openDrawer: vi.fn(),
  closeDrawer: vi.fn(),
  drawerData: null,
};

interface WrapperProps {
  children: ReactNode;
}

export function createWrapper(locale = "en") {
  const translations = getTranslations()[locale] || {};

  return function Wrapper({ children }: WrapperProps) {
    return (
      <UIProvider
        components={mockComponents}
        inputs={mockInputs}
        displays={mockDisplays}
        services={mockServices}
        translations={{
          views: translations,
          schemas: {},
          common: {},
        }}
        locale={locale}
      >
        <DrawerContext.Provider value={mockDrawerContext}>
          <TooltipProvider>{children}</TooltipProvider>
        </DrawerContext.Provider>
      </UIProvider>
    );
  };
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & { locale?: string },
) {
  const { locale = "en", ...renderOptions } = options || {};
  return render(ui, { wrapper: createWrapper(locale), ...renderOptions });
}

export function resetMocks() {
  vi.clearAllMocks();
}
