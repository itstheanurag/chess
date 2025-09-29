import React from "react";
import {
  Settings,
  LogOut,
  Activity,
  Clock,
  Gamepad2,
  Plus,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import AuthUser from "../auth/User";
import { useAuthStore, useUIStore } from "@/stores";

interface SidebarProps {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isDrawerOpen, toggleDrawer }) => {
  const { logout } = useAuthStore();
  const { activeSection, setActiveSection, collapsed, toggleCollapse } =
    useUIStore();

  const menuItems = [
    { id: "dashboard", icon: Activity, label: "Dashboard" },
    { id: "chess", icon: Plus, label: "Create Game" },
    { id: "activity", icon: Clock, label: "Activity" },
    { id: "leaderboard", icon: Trophy, label: "Leaderboard" },
    { id: "puzzles", icon: Target, label: "Puzzles" },
    { id: "friends", icon: Users, label: "Friends" },
  ];

  return (
    <>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={toggleDrawer} />
      )}

      <div
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          bg-white shadow-xl transition-all duration-300 ease-in-out
          ${collapsed ? "lg:w-20" : "lg:w-80"}
          ${
            isDrawerOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        <div className=" hidden md:flex items-center justify-between p-3 border-b border-neutral-200 lg:justify-start">
          {!collapsed && (
            <div className="">
              <AuthUser />
            </div>
          )}

          {/* Collapse toggle */}
          <button
            onClick={toggleCollapse}
            className={`${
              collapsed ? "" : "ml-auto"
            } p-3 rounded hover:bg-neutral-100 hidden lg:block`}
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="p-2 md:p-0">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveSection(item.id);
                        toggleDrawer(); // close drawer after selection
                      }}
                      className={`
                        flex items-center justify-center lg:justify-start
                        w-full p-3 lg:px-4 rounded-lg transition-colors
                        ${
                          isActive
                            ? "bg-neutral-100 text-neutral-900"
                            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                        }
                      `}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isActive ? "text-neutral-900" : "text-neutral-500"
                        }`}
                      />
                      {!collapsed && (
                        <span className="ml-3 hidden lg:inline font-medium">
                          {item.label}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 flex flex-col space-y-2">
          <button className="w-full flex items-center justify-center lg:justify-start space-x-3 px-4 rounded-lg text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors">
            <Settings className="h-5 w-5 text-neutral-400" />
            {!collapsed && <span className="font-medium">Settings</span>}
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center lg:justify-start space-x-3 px-4 py-3 rounded-lg text-neutral-600 hover:bg-neutral-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-5 w-5 text-neutral-400" />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
