import ChessDashboard from "./Dashboard";
import CreateGame from "./CreateGame";
import { useUIStore } from "@/stores";
import Sidebar from "./SideBar";

const DashboardLayout = () => {
  const { activeSection, collapsed } = useUIStore();

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <ChessDashboard />;
      case "create":
        return <CreateGame />;
      default:
        return <div>Coming soon...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <Sidebar />

      <div
        className={`flex-1 transition-all duration-300 p-4 lg:p-6 ${
          collapsed ? "lg:ml-20" : "lg:ml-80"
        }`}
      >
        <div className="bg-white shadow-sm border-b border-neutral-200 p-4 lg:p-6 flex items-center justify-between mb-4 border-rounded">
          <h2 className="text-xl font-semibold text-neutral-900 capitalize">
            {activeSection}
          </h2>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default DashboardLayout;
