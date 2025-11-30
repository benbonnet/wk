import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import axios from "axios";
import { ViewPage } from "../view-page";
import { UIProvider } from "../provider";

vi.mock("axios");
const mockedAxios = vi.mocked(axios);

const mockServices = {
  fetch: vi.fn(),
  navigate: vi.fn(),
  toast: vi.fn(),
  confirm: vi.fn(),
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <UIProvider services={mockServices}>{children}</UIProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("ViewPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <ViewPage namespace="workspaces" feature="contacts" view="index" />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("fetches view schema from correct endpoint", async () => {
    const mockSchema = {
      type: "VIEW",
      elements: [{ type: "PAGE", title: "Contacts" }],
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockSchema });

    render(
      <ViewPage namespace="workspaces" feature="contacts" view="index" />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "/api/v1/views/workspaces/contacts/index",
        expect.any(Object)
      );
    });
  });

  it("shows 'View not found' when schema is null", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: null });

    render(
      <ViewPage namespace="workspaces" feature="contacts" view="index" />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText("View not found")).toBeInTheDocument();
    });
  });
});
