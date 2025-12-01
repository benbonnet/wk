import { UIProvider, DEFAULT_LOCALE } from "@ui/lib";
import type { UIServices } from "@ui/lib";
import { useNavigate } from "react-router";
import axios from "axios";

interface AppUIProviderProps {
  children: React.ReactNode;
  translations?: Record<string, unknown>;
  locale?: string;
}

export function AppUIProvider({
  children,
  translations,
  locale = DEFAULT_LOCALE,
}: AppUIProviderProps) {
  const navigate = useNavigate();

  const services: UIServices = {
    fetch: async (url, options) => {
      const response = await axios({
        url,
        method: options?.method || "GET",
        data: options?.data,
      });
      return response.data;
    },
    navigate: (path) => navigate(path),
    toast: (message) => {
      // TODO: Integrate with sonner or other toast library
      console.log(`Toast: ${message}`);
    },
    confirm: async (message) => {
      return window.confirm(message);
    },
  };

  return (
    <UIProvider
      services={services}
      translations={translations as never}
      locale={locale}
    >
      {children}
    </UIProvider>
  );
}
