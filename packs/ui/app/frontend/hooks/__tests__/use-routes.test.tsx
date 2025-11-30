import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { useRoutes } from "../use-routes";

vi.mock("axios");
const mockedAxios = vi.mocked(axios);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches routes from /api/v1/routes", async () => {
    const mockRoutes = [
      {
        path: "/contacts",
        namespace: "workspaces",
        feature: "contacts",
        view: "index",
      },
      {
        path: "/contacts/:id",
        namespace: "workspaces",
        feature: "contacts",
        view: "show",
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: { routes: mockRoutes } });

    const { result } = renderHook(() => useRoutes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.get).toHaveBeenCalledWith("/api/v1/routes");
    expect(result.current.data).toEqual(mockRoutes);
  });

  it("returns empty array when no routes", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { routes: [] } });

    const { result } = renderHook(() => useRoutes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });
});
