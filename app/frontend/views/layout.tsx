import { Outlet } from "react-router";
import { useAuth } from "@/hooks/use-auth";

export default function Layout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <span className="font-semibold">{user?.name || user?.login}</span>
          <a
            href="/logout"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Logout
          </a>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
