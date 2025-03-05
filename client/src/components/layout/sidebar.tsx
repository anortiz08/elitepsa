import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, Book, LogOut, UserCircle, Moon, Sun } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/hooks/use-theme";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { theme, setTheme } = useTheme();

  const customerLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/knowledge", label: "Knowledge Base", icon: Book },
    { href: "/profile", label: "Profile", icon: UserCircle },
  ];

  const agentLinks = [
    { href: "/agent", label: "Dashboard", icon: LayoutDashboard },
    { href: "/agent/knowledge", label: "Knowledge Base", icon: Book },
    { href: "/profile", label: "Profile", icon: UserCircle },
  ];

  const links = user?.isAgent ? agentLinks : customerLinks;

  return (
    <div className="flex flex-col h-full border-r bg-sidebar">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.profilePhotoUrl} alt={user?.displayName} />
            <AvatarFallback>{user?.displayName?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">
              {user?.isAgent ? "Agent Portal" : "Support Portal"}
            </h2>
            <p className="text-sm text-sidebar-foreground/60">{user?.displayName}</p>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={location === link.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
      <div className="p-3 mt-auto space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="mr-2 h-4 w-4" />
          ) : (
            <Moon className="mr-2 h-4 w-4" />
          )}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}