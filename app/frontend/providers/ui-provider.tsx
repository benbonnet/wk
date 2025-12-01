import { useState, useCallback } from "react";
import { UIProvider, DEFAULT_LOCALE } from "@ui/lib";
import type { UIServices, ConfirmOptions } from "@ui/lib";
import { useNavigate } from "react-router";
import axios from "axios";
import { ConfirmDialog } from "@ui/components/confirm-dialog";

interface ConfirmState {
  isOpen: boolean;
  options: ConfirmOptions | null;
  resolve: ((value: boolean) => void) | null;
}

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
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    options: null,
    resolve: null,
  });

  const showConfirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setConfirmState({
          isOpen: true,
          options,
          resolve,
        });
      });
    },
    []
  );

  const handleConfirmResponse = useCallback(
    (confirmed: boolean) => {
      if (confirmState.resolve) {
        confirmState.resolve(confirmed);
      }
      setConfirmState({
        isOpen: false,
        options: null,
        resolve: null,
      });
    },
    [confirmState]
  );

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
      console.log(`Toast: ${message}`);
    },
    confirm: showConfirm,
  };

  return (
    <UIProvider
      services={services}
      translations={translations as never}
      locale={locale}
    >
      {children}
      {confirmState.options && (
        <ConfirmDialog
          open={confirmState.isOpen}
          title={confirmState.options.title || "Confirm"}
          description={confirmState.options.description}
          variant={confirmState.options.variant}
          cancelLabel={confirmState.options.cancelLabel || "Cancel"}
          confirmLabel={confirmState.options.confirmLabel || "Confirm"}
          onConfirm={() => handleConfirmResponse(true)}
          onCancel={() => handleConfirmResponse(false)}
        />
      )}
    </UIProvider>
  );
}
