import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Layout from "@/views/layout";
import WorkspacesIndex from "@/views/workspaces/index";
import WorkspacesShow from "@/views/workspaces/show";
import OperationsIndex from "@/views/operations/index";
import OperationsShow from "@/views/operations/show";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retry for auth failures
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<WorkspacesIndex />} />
            <Route path="/workspaces/:slug" element={<WorkspacesShow />}>
              <Route path="operations" element={<OperationsIndex />} />
              <Route path="operations/:id" element={<OperationsShow />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
