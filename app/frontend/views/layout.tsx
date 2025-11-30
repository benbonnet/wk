import { Outlet } from "react-router";
import { GalleryVerticalEnd, SquareTerminal, User } from "lucide-react";

import { useAuth } from "../hooks/use-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarInset,
  SidebarRail,
} from "@ui/components/sidebar";
import {
  WorkspaceSwitcher,
  NavMain,
  NavUser,
  SidebarCta,
  type WorkspaceOption,
  type MenuOption,
  type CtaCardConfig,
} from "@ui/app-components/layout";

// Static data - will be dynamic later
const dropdownOptions: WorkspaceOption[] = [
  {
    name: "Acme Inc",
    logo: GalleryVerticalEnd,
    plan: "Enterprise",
  },
];

const menuOptions: MenuOption[] = [
  {
    title: "Applications",
    url: "#",
    icon: SquareTerminal,
    isActive: true,
    items: [{ title: "RIB Checks", url: "/app/rib-checks" }],
  },
];

const ctaCard: CtaCardConfig = {
  title: "Invite Members",
  description: "Invite your team to collaborate on this workspace.",
  buttonText: "Invite",
  onAction: () => {
    // TODO: Open invite modal
  },
};

export default function Layout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  const footerUser = {
    name: user?.name || user?.login || "User",
    email: user?.email || "",
    avatar: user?.avatar,
  };

  const userActions = [
    {
      label: "Edit Profile",
      icon: User,
      onClick: () => {
        // TODO: Navigate to profile
      },
    },
  ];

  const handleLogout = () => {
    window.location.href = "/logout";
  };

  const handleAddWorkspace = () => {
    // TODO: Open add workspace modal
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <WorkspaceSwitcher
            workspaces={dropdownOptions}
            onAddWorkspace={handleAddWorkspace}
          />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={menuOptions} label="Applications" />
          <div className="mt-auto p-4">
            <SidebarCta config={ctaCard} />
          </div>
        </SidebarContent>
        <SidebarFooter>
          <NavUser
            user={footerUser}
            actions={userActions}
            onLogout={handleLogout}
          />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <main className="flex-1">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
