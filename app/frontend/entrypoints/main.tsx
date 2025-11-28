import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Layout from "@/views/layout";
import { AppUIProvider } from "@/providers/ui-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppUIProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<div>Home</div>} />
            </Route>
          </Routes>
        </AppUIProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
