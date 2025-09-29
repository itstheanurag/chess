import React, { useState } from "react";
import ChessDashboard from "./Dashboard";
import { useUIStore } from "@/stores";
import Sidebar from "./SideBar";
import { Menu } from "lucide-react";
import CreateGameModal from "./Games/CreatGameModal";

const DashboardLayout = () => {
  const { activeSection, collapsed } = useUIStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <ChessDashboard />;
      case "create":
        return <CreateGameModal />;
      default:
        return <div>Coming soon...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <Sidebar isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

      <div
        className={`flex-1 transition-all duration-300 p-2 md:px-4 md:pb-4 md:pt-0 ${
          collapsed ? "lg:ml-20" : "lg:ml-80"
        } md:ml-0`}
      >
        <div className="sticky top-0 z-30 bg-white/50 dark:bg-neutral-900/60 backdrop-blur-2xl shadow-sm border-neutral-200 p-6 border-b rounded-lg  flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleDrawer}
              className="lg:hidden p-2 rounded-md hover:bg-neutral-100"
            >
              <Menu className="h-6 w-6 text-neutral-700" />
            </button>

            <h2 className="text-xl font-semibold text-neutral-900 capitalize">
              {activeSection}
            </h2>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default DashboardLayout;
