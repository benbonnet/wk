import { UIProvider } from "@ui";
import type {
  ComponentRegistry,
  InputRegistry,
  DisplayRegistry,
  UIServices,
} from "@ui/registry";
import { useNavigate } from "react-router";
import axios from "axios";

// Import all adapters
import * as adapters from "@ui/../adapters";

// Build registries from adapters
const componentRegistry: ComponentRegistry = {
  VIEW: adapters.VIEW,
  PAGE: adapters.PAGE,
  DRAWER: adapters.DRAWER,
  FORM: adapters.FORM,
  TABLE: adapters.TABLE,
  SHOW: adapters.SHOW,
  ACTIONS: adapters.ACTIONS,
  GROUP: adapters.GROUP,
  CARD_GROUP: adapters.CARD_GROUP,
  MULTISTEP: adapters.MULTISTEP,
  STEP: adapters.STEP,
  FORM_ARRAY: adapters.FORM_ARRAY,
  DISPLAY_ARRAY: adapters.DISPLAY_ARRAY,
  ALERT: adapters.ALERT,
  LINK: adapters.LINK,
  BUTTON: adapters.BUTTON,
  DROPDOWN: adapters.DROPDOWN,
  OPTION: adapters.OPTION,
  SEARCH: adapters.SEARCH,
  SUBMIT: adapters.SUBMIT,
  COMPONENT: adapters.COMPONENT,
  RELATIONSHIP_PICKER: adapters.RELATIONSHIP_PICKER,
};

const inputRegistry: InputRegistry = {
  INPUT_TEXT: adapters.INPUT_TEXT,
  INPUT_TEXTAREA: adapters.INPUT_TEXTAREA,
  INPUT_SELECT: adapters.INPUT_SELECT,
  INPUT_CHECKBOX: adapters.INPUT_CHECKBOX,
  INPUT_CHECKBOXES: adapters.INPUT_CHECKBOXES,
  INPUT_RADIOS: adapters.INPUT_RADIOS,
  INPUT_DATE: adapters.INPUT_DATE,
  INPUT_DATETIME: adapters.INPUT_DATETIME,
  INPUT_TAGS: adapters.INPUT_TAGS,
  INPUT_AI_RICH_TEXT: adapters.INPUT_AI_RICH_TEXT,
};

const displayRegistry: DisplayRegistry = {
  DISPLAY_TEXT: adapters.DISPLAY_TEXT,
  DISPLAY_LONGTEXT: adapters.DISPLAY_LONGTEXT,
  DISPLAY_NUMBER: adapters.DISPLAY_NUMBER,
  DISPLAY_DATE: adapters.DISPLAY_DATE,
  DISPLAY_DATETIME: adapters.DISPLAY_DATETIME,
  DISPLAY_BADGE: adapters.DISPLAY_BADGE,
  DISPLAY_TAGS: adapters.DISPLAY_TAGS,
  DISPLAY_BOOLEAN: adapters.DISPLAY_BOOLEAN,
  DISPLAY_SELECT: adapters.DISPLAY_SELECT,
};

interface AppUIProviderProps {
  children: React.ReactNode;
  translations?: Record<string, unknown>;
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
      // TODO: Integrate with sonner or other toast library
      console.log(`[${type}] ${message}`);
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
      translations={translations as never}
      locale={locale}
    >
      {children}
    </UIProvider>
  );
}
