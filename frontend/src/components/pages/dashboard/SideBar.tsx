import React from "react";
import {
  LogOut,
  Activity,
  Clock,
  Plus,
  Target,
  Trophy,
  Users,
  User,
  PanelLeft,
} from "lucide-react";
import AuthUser from "../auth/User";
import { useAuthStore, useUIStore } from "@/stores";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "@/components/ui/Logo";

interface SidebarProps {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
}

const menuItems = [
  { id: "dashboard", icon: Activity, label: "Dashboard", path: "/dashboard" },
  {
    id: "chess",
    icon: Plus,
    label: "Create Game",
    path: "/dashboard/create-game",
  },
  {
    id: "activity",
    icon: Clock,
    label: "Activity",
    path: "/dashboard/activity",
  },
  {
    id: "leaderboard",
    icon: Trophy,
    label: "Leaderboard",
    path: "/dashboard/leaderboard",
  },
  { id: "puzzles", icon: Target, label: "Puzzles", path: "/dashboard/puzzles" },
  { id: "friends", icon: Users, label: "Friends", path: "/dashboard/friends" },
];

const Sidebar: React.FC<SidebarProps> = ({ isDrawerOpen, toggleDrawer }) => {
  const { logout } = useAuthStore();
  const { collapsed, toggleCollapse } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={toggleDrawer}
        />
      )}

      <div
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          bg-background/80 backdrop-blur-xl border-r border-border/40
          transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${collapsed ? "lg:w-20" : "lg:w-80"}
          ${
            isDrawerOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="h-16 flex items-center px-6 border-b border-border/40">
          <div className="flex items-center justify-between w-full overflow-hidden">
            {/* Logo — hidden when collapsed */}
            <div className={`${collapsed ? "hidden" : "block"} flex-shrink-0`}>
              <Logo className="w-8 h-8 relative z-10" />
            </div>

            {/* Collapse Button */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:block p-2 rounded-xl hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              <PanelLeft className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* User Profile (Collapsible) */}
        {!collapsed && (
          <div className="p-4">
            <div
              onClick={() => {
                navigate("/dashboard/profile");
                if (window.innerWidth < 1024) toggleDrawer();
              }}
              className="p-3 rounded-2xl bg-secondary/30 border border-border/50 cursor-pointer hover:bg-secondary/50 transition-colors"
            >
              <AuthUser />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav>
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        navigate(item.path);
                        if (window.innerWidth < 1024) toggleDrawer();
                      }}
                      className={`
                        flex items-center w-full p-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                        ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        }
                        ${collapsed ? "justify-center" : "justify-start"}
                      `}
                    >
                      <Icon
                        className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${
                          isActive ? "scale-110" : "group-hover:scale-110"
                        }`}
                      />
                      {!collapsed && (
                        <span className="ml-3 font-medium truncate">
                          {item.label}
                        </span>
                      )}

                      {/* Active Indicator for Collapsed Mode */}
                      {collapsed && isActive && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border/40 flex flex-col gap-2">
          <button
            onClick={logout}
            className={`
              flex items-center p-3 rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors
              ${collapsed ? "justify-center" : "w-full justify-start"}
            `}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
