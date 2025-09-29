import React, { useState } from "react";
import ChessDashboard from "./Dashboard";
import { useUIStore } from "@/stores";
import Sidebar from "./SideBar";
import { Menu } from "lucide-react";
import CreateGameModal from "./Games/CreateGame";
import ChessGamesPage from "./Games/ChessGamePage";

const DashboardLayout = () => {
  const { activeSection, collapsed } = useUIStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <ChessDashboard />;
      case "chess":
        return <ChessGamesPage />;
      case "Game":
        return <ChessGamesPage />;
      default:
        return <div>Coming soon...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <Sidebar isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

      <div
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-80"
        } md:ml-0`}
      >
        <div className="sticky top-0 z-10 w-full bg-white border-b border-neutral-200 p-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleDrawer}
              className="lg:hidden rounded-md hover:bg-neutral-100"
            >
              <Menu className="h-6 w-6 text-neutral-700" />
            </button>

            <div className="font-semibold text-neutral-900 capitalize p-3">
              {activeSection}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">{renderContent()}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
