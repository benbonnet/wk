import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ActivitiesIndex from "../index";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("ActivitiesIndex", () => {
  it("renders loading state initially", () => {
    render(<ActivitiesIndex />, { wrapper: createWrapper() });

    expect(screen.getByText(/loading activities/i)).toBeInTheDocument();
  });

  it("renders the title", () => {
    render(<ActivitiesIndex />, { wrapper: createWrapper() });

    expect(screen.getByText("Recent Activities")).toBeInTheDocument();
  });
});
