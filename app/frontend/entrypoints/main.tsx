import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Layout from "../views/layout";
import { AppUIProvider } from "../providers/ui-provider";
import { useRoutes } from "@ui/hooks/use-routes";
import { ViewPage } from "@ui/lib/ui-renderer/view-page";
import ActivitiesIndex from "../../../packs/activities_service/app/frontend/views/index";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

function AppRoutes() {
  const { data: routes, isLoading } = useRoutes();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ActivitiesIndex />} />
        {routes?.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ViewPage
                namespace={route.namespace}
                feature={route.feature}
                view={route.view}
              />
            }
          />
        ))}
      </Route>
    </Routes>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/app">
        <AppUIProvider>
          <AppRoutes />
        </AppUIProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
