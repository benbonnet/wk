import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Layout from "../layout";
import { AppUIProvider } from "../../providers/ui-provider";

const mockAxios = new MockAdapter(axios);

const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "/avatars/john.jpg",
  login: "johndoe",
};

const renderLayout = () => {
  return render(
    <MemoryRouter>
      <AppUIProvider>
        <Layout />
      </AppUIProvider>
    </MemoryRouter>
  );
};

describe("Layout", () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("loading state", () => {
    it("shows loading indicator when auth is loading", () => {
      // Don't resolve the request yet
      mockAxios.onGet("/api/v1/account").reply(() => new Promise(() => {}));

      renderLayout();

      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    });
  });

  describe("sidebar structure", () => {
    beforeEach(() => {
      mockAxios.onGet("/api/v1/account").reply(200, { user: mockUser });
    });

    it("renders sidebar with header, content, and footer", async () => {
      renderLayout();

      await waitFor(() => {
        expect(screen.getByRole("navigation")).toBeInTheDocument();
      });
      expect(screen.getByRole("main")).toBeInTheDocument();
    });
  });

  describe("workspace switcher", () => {
    beforeEach(() => {
      mockAxios.onGet("/api/v1/account").reply(200, { user: mockUser });
    });

    it("renders current workspace name and plan", async () => {
      renderLayout();

      await waitFor(() => {
        expect(screen.getByText("Acme Inc")).toBeInTheDocument();
      });
      expect(screen.getByText("Enterprise")).toBeInTheDocument();
    });

    it("opens dropdown and shows workspaces list", async () => {
      const user = userEvent.setup();
      renderLayout();

      await waitFor(() => {
        expect(screen.getByText("Acme Inc")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Acme Inc"));

      expect(screen.getByText("Workspaces")).toBeInTheDocument();
    });

    it("shows add workspace option in dropdown", async () => {
      const user = userEvent.setup();
      renderLayout();

      await waitFor(() => {
        expect(screen.getByText("Acme Inc")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Acme Inc"));

      expect(screen.getByText("Add workspace")).toBeInTheDocument();
    });
  });

  describe("navigation menu", () => {
    beforeEach(() => {
      mockAxios.onGet("/api/v1/account").reply(200, { user: mockUser });
    });

    it("renders menu group label", async () => {
      renderLayout();

      await waitFor(() => {
        expect(screen.getByRole("navigation")).toBeInTheDocument();
      });

      const sidebar = screen.getByRole("navigation");
      expect(within(sidebar).getByText("Applications")).toBeInTheDocument();
    });

    it("renders menu items with correct labels", async () => {
      renderLayout();

      await waitFor(() => {
        expect(screen.getByRole("navigation")).toBeInTheDocument();
      });

      const sidebar = screen.getByRole("navigation");
      expect(within(sidebar).getByText("RIB Checks")).toBeInTheDocument();
    });

    it("renders menu item links with correct URLs", async () => {
      renderLayout();

      await waitFor(() => {
        expect(screen.getByRole("navigation")).toBeInTheDocument();
      });

      const link = screen.getByRole("link", { name: /RIB Checks/i });
      expect(link).toHaveAttribute("href", "/app/rib-checks");
    });

    it("expands collapsible menu by default when isActive", async () => {
      renderLayout();

      await waitFor(() => {
        expect(screen.getByRole("navigation")).toBeInTheDocument();
      });

      // RIB Checks should be visible (parent is isActive: true)
      expect(screen.getByText("RIB Checks")).toBeVisible();
    });
  });

  describe("CTA card", () => {
    beforeEach(() => {
      mockAxios.onGet("/api/v1/account").reply(200, { user: mockUser });
    });

    it("renders CTA title and description", async () => {
      renderLayout();

      await waitFor(() => {
        expect(screen.getByText("Invite Members")).toBeInTheDocument();
      });
      expect(
        screen.getByText("Invite your team to collaborate on this workspace.")
      ).toBeInTheDocument();
    });

    it("renders CTA button with correct label", async () => {
      renderLayout();

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Invite" })
        ).toBeInTheDocument();
      });
    });
  });

  describe("user footer", () => {
    beforeEach(() => {
      mockAxios.onGet("/api/v1/account").reply(200, { user: mockUser });
    });

    it("renders user name and email", async () => {
      renderLayout();

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    it("renders user avatar", async () => {
      renderLayout();

      await waitFor(() => {
        expect(screen.getByRole("img", { name: "John Doe" })).toBeInTheDocument();
      });

      const avatar = screen.getByRole("img", { name: "John Doe" });
      expect(avatar).toHaveAttribute("src", "/avatars/john.jpg");
    });

    it("renders initials when no avatar", async () => {
      mockAxios.reset();
      mockAxios.onGet("/api/v1/account").reply(200, {
        user: { ...mockUser, avatar: undefined },
      });

      renderLayout();

      await waitFor(() => {
        expect(screen.getByText("JD")).toBeInTheDocument();
      });
    });

    it("falls back to login when no name", async () => {
      mockAxios.reset();
      mockAxios.onGet("/api/v1/account").reply(200, {
        user: { ...mockUser, name: undefined },
      });

      renderLayout();

      await waitFor(() => {
        expect(screen.getByText("johndoe")).toBeInTheDocument();
      });
    });

    it("opens user dropdown on click", async () => {
      const user = userEvent.setup();
      renderLayout();

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      await user.click(screen.getByText("John Doe"));

      expect(screen.getByText("Edit Profile")).toBeInTheDocument();
      expect(screen.getByText("Log out")).toBeInTheDocument();
    });

    it("shows user actions in dropdown", async () => {
      const user = userEvent.setup();
      renderLayout();

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      await user.click(screen.getByText("John Doe"));

      expect(screen.getByText("Edit Profile")).toBeInTheDocument();
    });

    it("redirects to /logout when logout clicked", async () => {
      const user = userEvent.setup();
      const originalLocation = window.location;
      // @ts-expect-error - mocking window.location
      delete window.location;
      window.location = { href: "" } as Location;

      renderLayout();

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      await user.click(screen.getByText("John Doe"));
      await user.click(screen.getByText("Log out"));

      expect(window.location.href).toBe("/logout");

      window.location = originalLocation;
    });
  });

  describe("main content", () => {
    beforeEach(() => {
      mockAxios.onGet("/api/v1/account").reply(200, { user: mockUser });
    });

    it("renders main content area", async () => {
      renderLayout();

      await waitFor(() => {
        expect(screen.getByRole("main")).toBeInTheDocument();
      });
    });
  });
});
