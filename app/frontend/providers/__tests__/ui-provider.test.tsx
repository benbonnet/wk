import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AppUIProvider } from "../ui-provider";

// Mock axios
vi.mock("axios", () => ({
  default: vi.fn().mockResolvedValue({ data: {} }),
}));

describe("AppUIProvider", () => {
  it("renders children", () => {
    render(
      <MemoryRouter>
        <AppUIProvider>
          <div>Test Content</div>
        </AppUIProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("accepts translations prop", () => {
    const translations = { views: { test: "Test Translation" } };

    render(
      <MemoryRouter>
        <AppUIProvider translations={translations}>
          <div>With Translations</div>
        </AppUIProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText("With Translations")).toBeInTheDocument();
  });

  it("accepts locale prop", () => {
    render(
      <MemoryRouter>
        <AppUIProvider locale="fr">
          <div>French Locale</div>
        </AppUIProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText("French Locale")).toBeInTheDocument();
  });
});
